import { ensureMethod, readJsonBody, sendJson } from "../../../_shared.js";
import {
  createProjectMessage,
  requireProjectAccess,
  requireProjectParticipant,
} from "../../_lib.js";

const getCode = (req) => {
  const value = req.query?.code;
  return Array.isArray(value) ? value[0] : value;
};

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const code = getCode(req);
    const body = await readJsonBody(req);

    if (!code) {
      sendJson(res, 400, {
        message: "Project code is required.",
      });
      return;
    }

    await requireProjectAccess(req, code);
    const participant = await requireProjectParticipant(req, code);
    const message = await createProjectMessage({
      code,
      participant,
      body: body?.body,
    });

    sendJson(res, 200, {
      message,
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
          : "Unable to send this message right now.",
    });
  }
}
