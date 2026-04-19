import { ensureMethod, sendJson } from "../../../_shared.js";
import { getProjectAccessSession } from "../../_lib.js";

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
        accessible: false,
        message: "Project code is required.",
      });
      return;
    }

    sendJson(res, 200, await getProjectAccessSession(req, code));
  } catch (error) {
    sendJson(res, 500, {
      accessible: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to verify project access right now.",
    });
  }
}
