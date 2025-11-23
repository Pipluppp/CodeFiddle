import { EditorButtonComponentProps } from "../Types/types";

export const EditorButtonComponent = ({
  path,
  isActive,
  onActivate,
  onClose,
}: EditorButtonComponentProps) => {
  const handleClick = () => {
    if (isActive) {
      return;
    }
    onActivate(path);
  };

  const handleClose = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onClose(path, isActive);
  };

  const classNames = ["editor-tab"];

  if (isActive) {
    classNames.push("is-active");
  }

  return (
    <div className={classNames.join(" ")} title={path} role="tab">
      <button
        type="button"
        className="editor-tab__trigger"
        disabled={isActive}
        onClick={handleClick}
      >
        {path.replace(/\\/g, "/").split("/").pop()}
      </button>
      <button
        type="button"
        className="editor-tab__close"
        aria-label={`Close ${path}`}
        onClick={handleClose}
      >
        ×
      </button>
    </div>
  );
};
