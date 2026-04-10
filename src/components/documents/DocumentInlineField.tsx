import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

interface DocumentInlineFieldProps<TTag extends ElementType> {
  as?: TTag;
  className?: string;
  displayValue: string;
  editValue?: string;
  editable?: boolean;
  inputMode?: ComponentPropsWithoutRef<"input">["inputMode"];
  inputType?: ComponentPropsWithoutRef<"input">["type"];
  multiline?: boolean;
  onCommit?: (value: string) => void;
  placeholder?: string;
}

const normalizeCommittedValue = (value: string, multiline: boolean) =>
  multiline
    ? value.replace(/\r/g, "").trim()
    : value.replace(/\s+/g, " ").trim();

const DocumentInlineField = <TTag extends ElementType = "span">({
  as,
  className = "",
  displayValue,
  editValue,
  editable = false,
  inputMode,
  inputType = "text",
  multiline = false,
  onCommit,
  placeholder = "Click to edit",
}: DocumentInlineFieldProps<TTag>) => {
  const Tag = (as || "span") as ElementType;
  const [active, setActive] = useState(false);
  const [draftValue, setDraftValue] = useState(editValue ?? displayValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const value = editValue ?? displayValue;

  useEffect(() => {
    if (!active) {
      setDraftValue(value);
    }
  }, [active, value]);

  useEffect(() => {
    if (!active || !inputRef.current) {
      return;
    }

    inputRef.current.focus();
    if ("select" in inputRef.current) {
      inputRef.current.select();
    }
  }, [active]);

  const commitValue = () => {
    const normalizedValue = normalizeCommittedValue(draftValue, multiline);
    setDraftValue(normalizedValue);
    setActive(false);
    onCommit?.(normalizedValue);
  };

  const displayText = displayValue || placeholder;
  const baseClassName = `document-inline-field${editable ? " is-editable" : ""}${
    !displayValue ? " is-empty" : ""
  }${className ? ` ${className}` : ""}`;

  if (!editable || !onCommit) {
    return <Tag className={baseClassName}>{displayText}</Tag>;
  }

  if (active) {
    return multiline ? (
      <textarea
        ref={inputRef as RefObject<HTMLTextAreaElement>}
        className={`document-inline-field-input document-inline-field-input--multiline${
          className ? ` ${className}` : ""
        }`}
        rows={Math.max(2, draftValue.split("\n").length || 2)}
        value={draftValue}
        onBlur={commitValue}
        onChange={(event) => setDraftValue(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            commitValue();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            setDraftValue(value);
            setActive(false);
          }
        }}
      />
    ) : (
      <input
        ref={inputRef as RefObject<HTMLInputElement>}
        className={`document-inline-field-input${className ? ` ${className}` : ""}`}
        type={inputType}
        inputMode={inputMode}
        value={draftValue}
        onBlur={commitValue}
        onChange={(event) => setDraftValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitValue();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            setDraftValue(value);
            setActive(false);
          }
        }}
      />
    );
  }

  return (
    <Tag
      className={baseClassName}
      onClick={() => setActive(true)}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive(true);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {displayText}
    </Tag>
  );
};

export default DocumentInlineField;
