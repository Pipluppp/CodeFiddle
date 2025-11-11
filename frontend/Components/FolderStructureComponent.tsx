import { useState } from "react";

import { ContextForFiles } from "./ContextForFiles";
import { ContextForFolders } from "./ContextForFolders";

import folderStructureStore from "../Store/folderStructureStore";
import websocketStore from "../Store/websocketStore";
import availableTabsStore from "../Store/availableTabsStore";

import Collapse from "../assets/collapse.png";
import Expand from "../assets/expand.png";

import { AiFillFile } from "react-icons/ai";
import { IconPack } from "../assets/IconPack";

import { TreeProps, VisibleState } from "../Types/types";

const Tree = ({
  data,
  ws,
  addOrUpdateAvailableTabs,
  setX,
  setY,
  setContextForFileOpen,
  setContextForFolderOpen,
  setPath,
  depth,
}: TreeProps) => {
  const [visible, setVisible] = useState<VisibleState>({});

  const nodeKey = data.path || data.name;

  const toggleVisibility = (key: string) => {
    setVisible({ ...visible, [key]: !visible[key] });
  };

  const handleDoubleClick = (path: string) => {
    const readFileRequest = {
      type: "readFile",
      payload: {
        path: path,
        data: null,
      },
    };
    addOrUpdateAvailableTabs(path);
    ws.send(JSON.stringify(readFileRequest));
  };

  const handleContextForFolders = (
    e: React.MouseEvent<HTMLButtonElement>,
    path: string
  ) => {
    e.preventDefault();
    setContextForFolderOpen(true);
    setX(e.clientX);
    setY(e.clientY);
    setPath(path);
  };

  const handleContextForFiles = (
    e: React.MouseEvent<HTMLParagraphElement>,
    path: string
  ) => {
    e.preventDefault();
    setContextForFileOpen(true);
    setX(e.clientX);
    setY(e.clientY);
    setPath(path);
  };

  return (
    <div className="folder-tree">
      {data.children ? (
        <button
          onContextMenu={(e) => handleContextForFolders(e, data.path)}
          onClick={() => toggleVisibility(nodeKey)}
          className={`folder-tree__folderButton ${
            visible[nodeKey] ? "is-open" : ""
          }`}
          style={{ paddingLeft: `${depth * 18 + 8}px` }}
        >
          <img
            src={visible[nodeKey] ? Collapse : Expand}
            height="10px"
            width="10px"
          />
          &nbsp;
          {data.name}
        </button>
      ) : (
        <div
          className="folder-tree__fileRow"
          style={{ paddingLeft: `${depth * 18 + 32}px` }}
        >
          {IconPack.hasOwnProperty(data.name.split(".").pop()!) ? (
            IconPack[data.name.split(".").pop()!]
          ) : (
            <AiFillFile
              className="folder-tree__fileIcon"
              color="currentColor"
              display="block"
            />
          )}
          <p
            onContextMenu={(e) => handleContextForFiles(e, data.path)}
            onDoubleClick={() => handleDoubleClick(data.path)}
          >
            {data.name}
          </p>
        </div>
      )}
      {visible[nodeKey] &&
        data.children &&
        data.children.map((child) => (
          <Tree
            key={child.path}
            data={child}
            ws={ws}
            addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
            setX={setX}
            setY={setY}
            setContextForFileOpen={setContextForFileOpen}
            setContextForFolderOpen={setContextForFolderOpen}
            setPath={setPath}
            depth={depth + 1}
          />
        ))}
    </div>
  );
};

export const FolderStructureComponent = () => {
  const folderStructure = folderStructureStore(
    (state) => state.folderStructure
  );
  const addOrUpdateAvailableTabs = availableTabsStore(
    (state) => state.addOrUpdateAvailableTabs
  );

  const [x, setX] = useState<number | null>(null);
  const [y, setY] = useState<number | null>(null);
  const [contextForFolderOpen, setContextForFolderOpen] = useState(false);
  const [contextForFileOpen, setContextForFileOpen] = useState(false);
  const [path, setPath] = useState<string>("");

  const ws = websocketStore((state) => state.ws);

  return (
    <>
      {contextForFileOpen && x && y && (
        <ContextForFiles
          x={x}
          y={y}
          setOpen={setContextForFileOpen}
          path={path}
        />
      )}
      {contextForFolderOpen && x && y && (
        <ContextForFolders
          x={x}
          y={y}
          setOpen={setContextForFolderOpen}
          path={path}
        />
      )}
      {folderStructure && (
        folderStructure.children?.map((child) => (
          <Tree
            key={child.path}
            data={child}
            ws={ws!}
            addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
            setX={setX}
            setY={setY}
            setContextForFileOpen={setContextForFileOpen}
            setContextForFolderOpen={setContextForFolderOpen}
            setPath={setPath}
            depth={0}
          />
        ))
      )}
    </>
  );
};
