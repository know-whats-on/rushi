import type { PresentationSessionState } from "../../lib/presentationRemote";
import type { StudioDocument } from "../../types/documents";

export interface RemoteSessionSnapshot {
  code: string;
  querySessionId: string;
  fallbackSessionId: string;
  remoteClientId: string;
  joinCode: string;
  joinSessionId: string;
  slideSearch: string;
  isPasswordAuthorized: boolean;
  documentRecord: StudioDocument | null;
  sessionState: PresentationSessionState | null;
}
