import { ensureMethod, sendJson } from "../../_shared.js";
import {
  listGuestLecturerSubmissions,
  requireGuestLecturerAdminAccess,
} from "../_lib.js";

export default async function handler(req, res) {
  if (!ensureMethod(req, res, ["GET"])) {
    return;
  }

  try {
    await requireGuestLecturerAdminAccess(req);
    const submissions = await listGuestLecturerSubmissions();

    sendJson(
      res,
      200,
      {
        submissions,
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
          : "Unable to load guest lecturer submissions right now.",
    });
  }
}
