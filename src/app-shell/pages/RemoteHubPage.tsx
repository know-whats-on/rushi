import { useNavigate } from "react-router-dom";
import { appShellPresentationRemoteTargets } from "../lib/presentationRemoteTargets";

const RemoteHubPage = () => {
  const navigate = useNavigate();

  return (
    <section className="studio-app-page studio-app-page--workspace">
      <section className="studio-app-panel">
        <div className="studio-app-panel-heading">
          <div>
            <p className="studio-app-eyebrow">Reliable Remote</p>
            <h3>Open the deck you need right away.</h3>
          </div>
          <span className="studio-app-status">Phone fallback</span>
        </div>

        <p className="studio-app-overview-copy">
          Use the direct in-app remote when you want the most reliable control path on
          iPhone. The Home and Lock Screen remote widgets now open this same direct
          controller instead of trying to run slide commands from the widget itself.
        </p>

        <div className="studio-app-document-stack">
          {appShellPresentationRemoteTargets.map((target) => (
            <section key={target.storageKey} className="studio-app-remote-widget-status">
              <div className="studio-app-panel-heading">
                <div>
                  <p className="studio-app-eyebrow">{target.displayName}</p>
                  <h3>
                    {target.code} / {target.sessionId}
                  </h3>
                </div>
                <span className="studio-app-status">Direct remote</span>
              </div>

              <p className="studio-app-overview-copy">
                Open the synced remote for {target.displayName} without picking the deck
                again.
              </p>

              <div className="studio-app-sheet-actions">
                <button
                  type="button"
                  className="studio-app-button"
                  onClick={() => {
                    void navigate(target.routePath);
                  }}
                >
                  Open {target.displayName} Remote
                </button>
              </div>
            </section>
          ))}
        </div>
      </section>
    </section>
  );
};

export default RemoteHubPage;
