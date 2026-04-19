import { ensureMethod, readJsonBody, sendJson } from "../_shared.js";
import {
  createGuestLecturerSubmission,
  requireGuestLecturerAccess,
} from "./_lib.js";

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  try {
    await requireGuestLecturerAccess(req);
    const body = await readJsonBody(req);
    const submission = await createGuestLecturerSubmission({
      name: body?.name,
      email: body?.email,
      linkedinUrl: body?.linkedinUrl,
      topicPreference: body?.topicPreference,
      selectedWeeks: body?.selectedWeeks,
    });

    sendJson(
      res,
      200,
      {
        submission,
      },
      {
        "Cache-Control": "no-store",
      }
    );
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    sendJson(res, statusCode, {
      message:
        error instanceof Error
          ? error.message
          : "Unable to save this guest lecturer EOI right now.",
    });
  }
}
