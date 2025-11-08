import { ContextForFilesProps } from "../Types/types";

export const ContextForFiles = ({
  setOpen,
  x,
  y,
  path,
}: ContextForFilesProps) => {
  void path;
  return (
    <div
      onMouseLeave={() => {
        setOpen(false);
      }}
      className="context-menu"
      style={{
        left: x,
        top: y,
      }}
    >
      <button
        // onClick={deleteFile}
        className="context-menu__item"
      >
        Delete File
      </button>
      <button
        className="context-menu__item"
      >
        Rename File
      </button>
    </div>
  );
};
