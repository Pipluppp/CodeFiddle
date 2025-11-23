import { X } from "lucide-react";
import { cn } from "../lib/utils";
import availableTabsStore from "../Store/availableTabsStore";
import activeTabStore from "../Store/activeTabStore";
import websocketStore from "../Store/websocketStore";

export const EditorTabsComponent = () => {
  const availableTabs = availableTabsStore((state) => state.availableTabs);
  const activeTab = activeTabStore((state) => state.activeTab);
  const addOrUpdateAvailableTabs = availableTabsStore((state) => state.addOrUpdateAvailableTabs);
  const removeTab = availableTabsStore((state) => state.removeTab);
  const ws = websocketStore((state) => state.ws);
  const clearActiveTab = activeTabStore((state) => state.clearActiveTab);

  const handleTabClick = (path: string) => {
    addOrUpdateAvailableTabs(path); // Sets as active in store
    ws?.send(JSON.stringify({ type: "readFile", payload: { path, data: null } }));
  };

  const handleClose = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const isActive = availableTabs[path];
    const nextActivePath = removeTab(path);

    if (isActive && nextActivePath) {
      // If we closed the active tab, open the next one
      ws?.send(JSON.stringify({ type: "readFile", payload: { path: nextActivePath, data: null } }));
    } else if (isActive) {
      clearActiveTab();
    }
  };

  const tabs = Object.entries(availableTabs);

  return (
    <div className="flex items-end bg-[#17191A] w-full overflow-x-auto no-scrollbar h-9 shrink-0 pt-1 px-2 gap-1">
      {tabs.length === 0 && (
        <div className="px-4 text-xs text-jb-text-muted italic self-center">No file open</div>
      )}
      {tabs.map(([path, isActive]) => {
        const fileName = path.split(/[/\\]/).pop();
        return (
          <div
            key={path}
            onClick={() => handleTabClick(path)}
            className={cn(
              "group flex items-center gap-2 px-3 h-8 min-w-fit cursor-pointer text-xs select-none transition-all rounded-t-md border-t border-x border-transparent",
              isActive 
                ? "bg-[#17191A] text-jb-text font-medium border-t-jb-accent border-x-[#17191A] relative z-10" 
                : "bg-[#212324] text-jb-text-muted hover:bg-[#262829] hover:text-jb-text border-t-transparent mb-0.5 h-[calc(100%-2px)]"
            )}
            style={{
               boxShadow: isActive ? "0 -1px 0 0 #17191A, -1px 0 0 0 #17191A, 1px 0 0 0 #17191A" : "none"
            }}
          >
            <span className="font-mono">{fileName}</span>
            <button
              onClick={(e) => handleClose(e, path)}
              className={cn(
                "opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-white/10 transition-all",
                isActive && "opacity-100"
              )}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
