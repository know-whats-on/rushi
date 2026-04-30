import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import docsIndexHandler from "../api/rushi-personal-documents/index.js";
import projectAccessHandler from "../api/rushi-personal-client/projects/[code]/access.js";
import projectActionsHandler from "../api/rushi-personal-client/projects/[code]/actions.js";
import projectActivityHandler from "../api/rushi-personal-client/projects/[code]/activity.js";
import projectHandler from "../api/rushi-personal-client/projects/[code]/index.js";
import projectMessagesHandler from "../api/rushi-personal-client/projects/[code]/messages.js";
import projectParticipantHandler from "../api/rushi-personal-client/projects/[code]/participant.js";
import projectUnlockHandler from "../api/rushi-personal-client/projects/[code]/unlock.js";
import presentationRemoteAccessHandler from "../api/rushi-personal-presentation/remote-access.js";
import rheemCredentialClaimHandler from "../api/rushi-personal-credentials/claim.js";
import rheemCredentialHandler from "../api/rushi-personal-credentials/[code].js";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(rootDir, "dist-ios");
const port = Number.parseInt(process.env.STUDIO_APP_SIM_PORT || "3100", 10);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const routeDefinitions = [
  {
    pattern: /^\/api\/rushi-personal-documents\/?$/,
    handler: docsIndexHandler,
    params: [],
  },
  {
    pattern: /^\/api\/rushi-personal-client\/projects\/([^/]+)\/access\/?$/,
    handler: projectAccessHandler,
    params: ["code"],
  },
  {
    pattern: /^\/api\/rushi-personal-client\/projects\/([^/]+)\/activity\/?$/,
    handler: projectActivityHandler,
    params: ["code"],
  },
  {
    pattern: /^\/api\/rushi-personal-client\/projects\/([^/]+)\/unlock\/?$/,
    handler: projectUnlockHandler,
    params: ["code"],
  },
  {
    pattern: /^\/api\/rushi-personal-client\/projects\/([^/]+)\/participant\/?$/,
    handler: projectParticipantHandler,
    params: ["code"],
  },
  {
    pattern: /^\/api\/rushi-personal-client\/projects\/([^/]+)\/messages\/?$/,
    handler: projectMessagesHandler,
    params: ["code"],
  },
  {
    pattern: /^\/api\/rushi-personal-client\/projects\/([^/]+)\/actions\/?$/,
    handler: projectActionsHandler,
    params: ["code"],
  },
  {
    pattern: /^\/api\/rushi-personal-client\/projects\/([^/]+)\/?$/,
    handler: projectHandler,
    params: ["code"],
  },
  {
    pattern: /^\/api\/rushi-personal-presentation\/remote-access\/?$/,
    handler: presentationRemoteAccessHandler,
    params: [],
  },
  {
    pattern: /^\/api\/rushi-personal-credentials\/claim\/?$/,
    handler: rheemCredentialClaimHandler,
    params: [],
  },
  {
    pattern: /^\/api\/rushi-personal-credentials\/([^/]+)\/?$/,
    handler: rheemCredentialHandler,
    params: ["code"],
  },
];

const buildQueryObject = (url, params) => {
  const query = {};

  for (const [key, value] of url.searchParams.entries()) {
    if (key in query) {
      query[key] = Array.isArray(query[key])
        ? [...query[key], value]
        : [query[key], value];
    } else {
      query[key] = value;
    }
  }

  Object.entries(params).forEach(([key, value]) => {
    query[key] = value;
  });

  return query;
};

const decorateResponse = (res) => {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };

  res.json = (payload) => {
    if (!res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }

    res.end(JSON.stringify(payload));
    return res;
  };

  return res;
};

const resolveRoute = (pathname) => {
  for (const route of routeDefinitions) {
    const match = pathname.match(route.pattern);

    if (!match) {
      continue;
    }

    const params = route.params.reduce((current, key, index) => {
      current[key] = decodeURIComponent(match[index + 1] || "");
      return current;
    }, {});

    return {
      handler: route.handler,
      params,
    };
  }

  return null;
};

const sendFile = (res, filePath) => {
  const extension = extname(filePath);
  const contentType = mimeTypes[extension] || "application/octet-stream";

  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  createReadStream(filePath).pipe(res);
};

const sendNotFound = (res, message) => {
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ message }));
};

if (!existsSync(distDir)) {
  throw new Error(
    `Missing ${distDir}. Run "npm run build:ios-web" before starting the simulator server.`
  );
}

await mkdir(distDir, { recursive: true });
await readFile(join(distDir, "index.html"), "utf8");

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const matchedRoute = resolveRoute(requestUrl.pathname);

  if (matchedRoute) {
    req.query = buildQueryObject(requestUrl, matchedRoute.params);
    decorateResponse(res);

    try {
      await matchedRoute.handler(req, res);
    } catch (error) {
      console.error("Studio app API error", error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(
          JSON.stringify({
            message:
              error instanceof Error
                ? error.message
                : "Unexpected simulator server error.",
          })
        );
      }
    }
    return;
  }

  const requestedPath =
    requestUrl.pathname === "/" ? "/index.html" : decodeURIComponent(requestUrl.pathname);
  const candidatePath = resolve(distDir, `.${requestedPath}`);

  if (!candidatePath.startsWith(distDir)) {
    sendNotFound(res, "Not found.");
    return;
  }

  if (existsSync(candidatePath) && statSync(candidatePath).isFile()) {
    sendFile(res, candidatePath);
    return;
  }

  sendFile(res, join(distDir, "index.html"));
});

server.listen(port, () => {
  console.log(`Studio app simulator server running at http://localhost:${port}`);
});
