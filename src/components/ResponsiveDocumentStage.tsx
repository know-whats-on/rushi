import {
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;
const STAGE_GUTTER = 28;

interface ResponsiveDocumentStageProps extends PropsWithChildren {
  className?: string;
}

const ResponsiveDocumentStage = ({
  children,
  className = "",
}: ResponsiveDocumentStageProps) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) {
      return;
    }

    const measure = () => {
      const nextWidth = Math.max(0, node.clientWidth - STAGE_GUTTER * 2);
      if (!nextWidth) {
        setScale(1);
        return;
      }

      setScale(Math.min(1, nextWidth / SHEET_WIDTH));
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(node);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      className={`responsive-document-stage${className ? ` ${className}` : ""}`}
      ref={stageRef}
    >
      <div className="responsive-document-frame">
        <div
          className="responsive-document-scale"
          style={{
            width: `${SHEET_WIDTH * scale}px`,
            minHeight: `${SHEET_HEIGHT * scale}px`,
          }}
        >
          <div
            className="responsive-document-canvas"
            style={{
              width: `${SHEET_WIDTH}px`,
              height: `${SHEET_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDocumentStage;
