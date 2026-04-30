import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error local API handlers are plain JS serverless modules
import rheemCredentialClaimHandler from "./api/rushi-personal-credentials/claim.js";
// @ts-expect-error local API handlers are plain JS serverless modules
import rheemCredentialHandler from "./api/rushi-personal-credentials/[code].js";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

const parseEnvFile = (filePath: string) => {
  if (!existsSync(filePath)) {
    return;
  }

  const contents = readFileSync(filePath, "utf8");

  contents.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const equalsIndex = trimmedLine.indexOf("=");
    if (equalsIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, equalsIndex).trim();
    if (!key || process.env[key]) {
      return;
    }

    let value = trimmedLine.slice(equalsIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
};

const decorateResponse = (res: import("node:http").ServerResponse) => {
  const response = res as import("node:http").ServerResponse & {
    status: (statusCode: number) => typeof response;
    json: (payload: unknown) => typeof response;
  };

  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };

  response.json = (payload) => {
    if (!response.getHeader("Content-Type")) {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
    }

    response.end(JSON.stringify(payload));
    return response;
  };

  return response;
};

const rheemCredentialApiPlugin = () => ({
  name: "rheem-credential-api-dev",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use(async (req, res, next) => {
      const requestUrl = new URL(req.url || "/", "http://localhost");
      const pathname = requestUrl.pathname;

      if (pathname === "/api/rushi-personal-credentials/claim") {
        (req as typeof req & { query: Record<string, string> }).query = {};
        decorateResponse(res);

        try {
          await rheemCredentialClaimHandler(req, res);
        } catch (error) {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(
              JSON.stringify({
                message:
                  error instanceof Error
                    ? error.message
                    : "Unexpected local API error.",
              })
            );
          }
        }
        return;
      }

      const credentialMatch = pathname.match(
        /^\/api\/rushi-personal-credentials\/([^/]+)\/?$/
      );

      if (credentialMatch) {
        (req as typeof req & { query: Record<string, string> }).query = {
          code: decodeURIComponent(credentialMatch[1] || ""),
        };
        decorateResponse(res);

        try {
          await rheemCredentialHandler(req, res);
        } catch (error) {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(
              JSON.stringify({
                message:
                  error instanceof Error
                    ? error.message
                    : "Unexpected local API error.",
              })
            );
          }
        }
        return;
      }

      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, rootDir, "");

  Object.entries(viteEnv).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });

  parseEnvFile(resolve(rootDir, ".env.local"));
  parseEnvFile(resolve(rootDir, ".vercel/.env.preview.local"));
  parseEnvFile(resolve(rootDir, ".vercel/.env.production.local"));

  return {
    plugins: [react(), rheemCredentialApiPlugin()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(rootDir, "index.html"),
          appShell: resolve(rootDir, "app-shell.html"),
        },
      },
    },
    server: {
      host: true,
      port: 5173,
    },
    preview: {
      host: true,
      port: 4173,
    },
  };
});
