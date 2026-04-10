import "./styles/RotateDevicePrompt.css";

interface RotateDevicePromptProps {
  visible: boolean;
  onDismiss: () => void;
}

const RotateDevicePrompt = ({
  visible,
  onDismiss,
}: RotateDevicePromptProps) => {
  return (
    <div
      className={`rotate-prompt${visible ? " rotate-prompt-active" : ""}`}
      aria-hidden={!visible}
    >
      <div className="rotate-prompt-card">
        <div className="rotate-icon-shell" aria-hidden="true">
          <div className="rotate-wave rotate-wave-1"></div>
          <div className="rotate-wave rotate-wave-2"></div>
          <div className="rotate-phone">
            <div className="rotate-phone-screen"></div>
          </div>
        </div>
        <p>
          Landscape is recommended for the full desktop-style view. You can
          continue in portrait too.
        </p>
        <button type="button" className="rotate-prompt-button" onClick={onDismiss}>
          Continue in portrait
        </button>
      </div>
    </div>
  );
};

export default RotateDevicePrompt;
