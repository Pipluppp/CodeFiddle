import { useState } from "react";
import { ChevronRight, ChevronDown, File, FileJson, FileCode } from 'lucide-react';
import { cn } from "../lib/utils";

import folderStructureStore from "../Store/folderStructureStore";
import websocketStore from "../Store/websocketStore";
import availableTabsStore from "../Store/availableTabsStore";
import activeTabStore from "../Store/activeTabStore";
import createFileOrFolderStore from "../Store/createFileOrFolderStore";
import { ContextForFiles } from "./ContextForFiles";
import { ContextForFolders } from "./ContextForFolders";
import { FolderStructure } from "../Types/types";

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
  setContextMenu: (data: { x: number; y: number; path: string; type: 'file' | 'folder' }) => void;
}

const FileNode = ({ data, depth, ws, activeTab, addOrUpdateAvailableTabs, setContextMenu }: FileNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = !!data.children;
  const isActive = data.path === activeTab;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      // Open File
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
    setContextMenu({ 
      x: e.clientX, 
      y: e.clientY, 
      path: data.path, 
      type: isFolder ? 'folder' : 'file' 
    });
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
      
      {isFolder && isOpen && data.children && (
        <div>
          {data.children.map((child) => (
            <FileNode 
              key={child.path} 
              data={child} 
              depth={depth + 1}
              ws={ws}
              activeTab={activeTab}
              addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
              setContextMenu={setContextMenu}
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
  const activeTab = activeTabStore((state) => state.activeTab); // Get active tab object
  const setPath = createFileOrFolderStore((state) => state.setPath);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string; type: 'file' | 'folder' } | null>(null);

  if (!folderStructure) return <div className="p-4 text-xs text-jb-text-muted">Loading...</div>;

  return (
    <div className="h-full overflow-y-auto pb-4" onClick={() => setContextMenu(null)}>
      {contextMenu && contextMenu.type === 'file' && (
        <ContextForFiles 
          x={contextMenu.x} 
          y={contextMenu.y} 
          setOpen={() => setContextMenu(null)} 
          path={contextMenu.path} 
        />
      )}
      {contextMenu && contextMenu.type === 'folder' && (
        <ContextForFolders 
          x={contextMenu.x} 
          y={contextMenu.y} 
          setOpen={() => setContextMenu(null)} 
          path={contextMenu.path} 
        />
      )}
      
      {/* Render Root Children directly to avoid showing the root folder container if undesired, or render root */}
      {folderStructure.children ? (
        folderStructure.children.map(child => (
          <FileNode 
            key={child.path} 
            data={child} 
            depth={0} 
            ws={ws}
            activeTab={activeTab?.path ?? null} // Pass path string
            addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
            setContextMenu={(ctx) => {
              setPath(ctx.path); // Update global store for modals
              setContextMenu(ctx);
            }}
          />
        ))
      ) : (
         <div className="p-4 text-xs text-jb-text-muted">Empty Project</div>
      )}
    </div>
  );
};
