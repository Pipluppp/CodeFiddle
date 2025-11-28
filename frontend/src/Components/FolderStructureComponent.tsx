import { useState, useEffect, useRef } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  FileJson, 
  FileCode, 
  FolderPlus, 
  FilePlus
} from 'lucide-react';
import { cn } from "../lib/utils";

import folderStructureStore from "../Store/folderStructureStore";
import websocketStore from "../Store/websocketStore";
import availableTabsStore from "../Store/availableTabsStore";
import activeTabStore from "../Store/activeTabStore";
import createFileOrFolderStore from "../Store/createFileOrFolderStore";
import { ContextMenu, ContextMenuItem } from "./ui/ContextMenu";
import { FolderStructure } from "../types/types";

// --- File Node Sub-Component ---
const getIcon = (name: string, isFolder: boolean, isOpen: boolean) => {
  if (isFolder) return isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />;
  if (name.endsWith('.json')) return <FileJson size={14} className="text-yellow-500" />;
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return <FileCode size={14} className="text-blue-400" />;
  if (name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode size={14} className="text-yellow-300" />;
  if (name.endsWith('.css')) return <FileCode size={14} className="text-sky-300" />;
  if (name.endsWith('.html')) return <FileCode size={14} className="text-orange-400" />;
  return <File size={14} className="text-gray-400" />;
};

interface FileNodeProps {
  data: FolderStructure;
  depth: number;
  ws: WebSocket | null;
  activeTab: string | null;
  addOrUpdateAvailableTabs: (path: string) => void;
  onContextMenu: (e: React.MouseEvent, path: string, type: 'file' | 'folder') => void;
}

const FileNode = ({ data, depth, ws, activeTab, addOrUpdateAvailableTabs, onContextMenu }: FileNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = !!data.children;
  const isActive = data.path === activeTab;

  // Store access for inline creation
  const creatingPath = createFileOrFolderStore((state) => state.path);
  const isCreatingFile = createFileOrFolderStore((state) => state.isFile); // 1=File, 0=Folder, -1=None
  const setPath = createFileOrFolderStore((state) => state.setPath);
  const setIsFile = createFileOrFolderStore((state) => state.setIsFile);

  const isCreatingHere = creatingPath === data.path;
  const [newItemName, setNewItemName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-expand and focus when creating
  useEffect(() => {
    if (isCreatingHere) {
      setIsOpen(true);
      setNewItemName("");
      // Small timeout to ensure render before focus
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCreatingHere]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      addOrUpdateAvailableTabs(data.path);
      ws?.send(JSON.stringify({
        type: "readFile",
        payload: { path: data.path, data: null }
      }));
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, data.path, isFolder ? 'folder' : 'file');
  };

  const handleCreateSubmit = () => {
    if (!newItemName.trim()) {
      cancelCreation();
      return;
    }

    const type = isCreatingFile === 1 ? "createFile" : "createFolder";
    const fullPath = `${data.path}/${newItemName}`;

    ws?.send(JSON.stringify({
      type,
      payload: { path: fullPath, data: null }
    }));

    cancelCreation();
  };

  const cancelCreation = () => {
    setPath(null);
    setIsFile(-1);
    setNewItemName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateSubmit();
    } else if (e.key === 'Escape') {
      cancelCreation();
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          "flex items-center py-1 pr-2 cursor-pointer select-none text-sm transition-colors border-l-2 border-transparent",
          isActive 
            ? "bg-jb-accent-soft text-jb-text border-l-jb-accent" 
            : "hover:bg-jb-panel-hover",
          !isFolder && !isActive && "hover:text-jb-accent"
        )}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        <span className="mr-1.5 opacity-70 shrink-0">
          {getIcon(data.name, isFolder, isOpen)}
        </span>
        <span className={cn("truncate font-mono text-[13px]", isFolder ? "text-jb-text" : isActive ? "text-jb-text" : "text-jb-text-muted")}>
          {data.name}
        </span>
      </div>
      
      {isFolder && isOpen && (
        <div>
          {/* Inline Creation Input */}
          {isCreatingHere && (
            <div 
              className="flex items-center py-1 pr-2 border-l-2 border-transparent"
              style={{ paddingLeft: `${(depth + 1) * 12 + 12}px` }}
            >
               <span className="mr-1.5 opacity-70 shrink-0">
                  {isCreatingFile === 1 
                    ? <File size={14} className="text-gray-400" /> 
                    : <ChevronRight size={14} />
                  }
               </span>
               <input
                  ref={inputRef}
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={cancelCreation}
                  className="bg-[#3c3f41] text-jb-text text-[13px] font-mono border border-jb-accent rounded-sm px-1 py-0.5 w-full focus:outline-none h-6"
                  placeholder={isCreatingFile === 1 ? "File name..." : "Folder name..."}
               />
            </div>
          )}

          {data.children && data.children.map((child) => (
            <FileNode 
              key={child.path} 
              data={child} 
              depth={depth + 1}
              ws={ws}
              activeTab={activeTab}
              addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const FolderStructureComponent = () => {
  const folderStructure = folderStructureStore((state) => state.folderStructure);
  const ws = websocketStore((state) => state.ws);
  const addOrUpdateAvailableTabs = availableTabsStore((state) => state.addOrUpdateAvailableTabs);
  const activeTab = activeTabStore((state) => state.activeTab); 
  
  // Actions
  const setPath = createFileOrFolderStore((state) => state.setPath);
  const setIsFile = createFileOrFolderStore((state) => state.setIsFile);

  // State for the unified context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string; type: 'file' | 'folder' } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, path: string, type: 'file' | 'folder') => {
    // Only show context menu for folders (since files have no options now)
    if (type === 'folder') {
      setContextMenu({ x: e.clientX, y: e.clientY, path, type });
    }
  };

  const handleAction = (action: string) => {
    if (!contextMenu) return;
    const { path } = contextMenu;

    switch (action) {
      case 'create_file':
        setPath(path);
        setIsFile(1); // 1 = File
        break;
      case 'create_folder':
        setPath(path);
        setIsFile(0); // 0 = Folder
        break;
    }
    setContextMenu(null);
  };

  // Generate menu items based on selection type
  const getMenuItems = (): ContextMenuItem[] => {
    if (!contextMenu) return [];

    if (contextMenu.type === 'folder') {
      return [
        { label: "New File", icon: <FilePlus size={14} />, onClick: () => handleAction('create_file') },
        { separator: true, label: "", onClick: () => {} },
        { label: "New Folder", icon: <FolderPlus size={14} />, onClick: () => handleAction('create_folder') },
      ];
    } else {
      return [];
    }
  };

  if (!folderStructure) return <div className="p-4 text-xs text-jb-text-muted">Loading...</div>;

  return (
    <div className="h-full overflow-y-auto pb-4" onContextMenu={(e) => e.preventDefault()}>
      
      {/* Root Container click to deselect or handle background context menu if needed */}
      <div className="min-h-full">
        {folderStructure.children ? (
          folderStructure.children.map(child => (
            <FileNode 
              key={child.path} 
              data={child} 
              depth={0} 
              ws={ws}
              activeTab={activeTab?.path ?? null} 
              addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
              onContextMenu={handleContextMenu}
            />
          ))
        ) : (
           <div className="p-4 text-xs text-jb-text-muted">Empty Project</div>
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getMenuItems()}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};


