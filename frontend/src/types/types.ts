import { Dispatch, ReactElement } from "react";

/**
 * Interfaces for the Zustand stores
 */

export interface CreateFileOrFolderStoreState {
  path: string | null;
  setPath: (path: string | null) => void;
  isFile: number;
  setIsFile: (isFile: number) => void;
}

export interface ActiveTabStoreState {
  activeTab: {
    path: string | undefined;
    extension: string | undefined;
    value: string;
  } | null;
  setActiveTab: (
    path: string,
    extension: string | undefined,
    value: string
  ) => void;
  clearActiveTab: () => void;
}

interface AvailableTabs {
  [key: string]: boolean;
}

export interface AvailableTabsStoreState {
  availableTabs: AvailableTabs;
  addOrUpdateAvailableTabs: (path: string) => void;
  removeTab: (path: string) => string | null;
  clearAvailableTabs: () => void;
}

export interface FolderStructure {
  path: string;
  name: string;
  children: FolderStructure[];
}

export interface FolderStructureStoreState {
  folderStructure: FolderStructure | null;
  setFolderStructure: (playgroundId: string) => void;
}

export interface PlaygroundMetadata {
  templateId: string | null;
  title: string | null;
  hasPreview: boolean;
}

export interface PortStoreState {
  port: number | null;
  error: string | null;
  setPort: (port: number | null) => void;
  setError: (message: string | null) => void;
}

export interface ShellSocketStoreState {
  wsForShell: WebSocket | null;
  setWs: (ws: WebSocket | null) => void;
}

export interface WebsocketStoreState {
  ws: WebSocket | null;
  setWs: (ws: WebSocket | null) => void;
}

/******************************************/

export interface PlaygroundTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  hasPreview: boolean;
}

/******************************************/

export interface IconPackInterface {
  [key: string]: ReactElement;
}

/**
 * Interfaces for Props
 */

export interface ContextForFilesProps {
  setOpen: (value: boolean) => void;
  x: number;
  y: number;
  path: string;
}

export interface ContextForFoldersProps {
  setOpen: (value: boolean) => void;
  x: number;
  y: number;
  path: string;
}

export interface EditorButtonComponentProps {
  path: string;
  isActive: boolean;
  onActivate: (path: string) => void;
  onClose: (path: string, wasActive: boolean) => void;
}

export interface TreeProps {
  data: FolderStructure;
  ws: WebSocket;
  addOrUpdateAvailableTabs: (path: string) => void;
  setX: Dispatch<number>;
  setY: Dispatch<number>;
  setContextForFileOpen: Dispatch<boolean>;
  setContextForFolderOpen: Dispatch<boolean>;
  setPath: Dispatch<string>;
  depth: number;
}

export interface VisibleState {
  [key: string]: boolean;
}
