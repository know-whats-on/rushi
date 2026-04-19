import { useSearchParams } from "react-router-dom";
import type { RemoteSessionSnapshot } from "../lib/remoteSession";
import { normalizePresentationCode } from "../../lib/presentationRemote";
import PresentationRemotePage from "../../pages/PresentationRemotePage";
import RemoteHubPage from "./RemoteHubPage";

type RemoteHomePageProps = {
  remoteSessionSnapshot?: RemoteSessionSnapshot | null;
  onRemoteSessionSnapshotChange?: (snapshot: RemoteSessionSnapshot | null) => void;
};

const RemoteHomePage = ({
  remoteSessionSnapshot = null,
  onRemoteSessionSnapshotChange,
}: RemoteHomePageProps) => {
  const [searchParams] = useSearchParams();
  const hasQueryTarget = Boolean(
    normalizePresentationCode(searchParams.get("code") || "")
  );

  if (!hasQueryTarget) {
    return <RemoteHubPage />;
  }

  return (
    <PresentationRemotePage
      remoteSessionSnapshot={remoteSessionSnapshot}
      onRemoteSessionSnapshotChange={onRemoteSessionSnapshotChange}
    />
  );
};

export default RemoteHomePage;
