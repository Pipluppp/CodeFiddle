import createFileOrFolderStore from "../Store/createFileOrFolderStore";

import { ContextForFoldersProps } from "../Types/types";

export const ContextForFolders = ({
  setOpen,
  x,
  y,
  path,
}: ContextForFoldersProps) => {
  const setPath = createFileOrFolderStore((state) => state.setPath);
  const setIsFile = createFileOrFolderStore((state) => state.setIsFile);

  const createDirectory = () => {
    setPath(path);
    setIsFile(0);
  };

  const createFile = () => {
    setPath(path);
    setIsFile(1);
  };

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
        onClick={createDirectory}
        className="context-menu__item"
      >
        Create Folder
      </button>
      <button
        onClick={createFile}
        className="context-menu__item"
      >
        Create File
      </button>
      <button
        className="context-menu__item"
      >
        Delete Folder
      </button>
    </div>
  );
};
