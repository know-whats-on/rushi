import { ensureMethod, sendJson } from "../../../_shared.js";
import { getPublishedProjectByCode, requireProjectAccess } from "../../_lib.js";

const getCode = (req) => {
  const value = req.query?.code;
  return Array.isArray(value) ? value[0] : value;
};

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["GET"])) {
    return;
  }

  try {
    const code = getCode(req);

    if (!code) {
      sendJson(res, 400, {
        message: "Project code is required.",
      });
      return;
    }

    await requireProjectAccess(req, code);

    sendJson(res, 200, {
      document: await getPublishedProjectByCode(code),
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && "statusCode" in error && typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    sendJson(res, statusCode, {
      message:
        error instanceof Error
          ? error.message
          : "Unable to load this project right now.",
    });
  }
}
