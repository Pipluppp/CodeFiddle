import { EditorButtonComponent } from "./EditorButtonComponent";

import availableTabsStore from "../Store/availableTabsStore";
import websocketStore from "../Store/websocketStore";
import activeTabStore from "../Store/activeTabStore";

export const EditorTabsComponent = () => {
  const availableTabs = availableTabsStore((state) => state.availableTabs);
  const addOrUpdateAvailableTabs = availableTabsStore(
    (state) => state.addOrUpdateAvailableTabs
  );
  const removeTab = availableTabsStore((state) => state.removeTab);
  const ws = websocketStore((state) => state.ws);
  const clearActiveTab = activeTabStore((state) => state.clearActiveTab);
  const entries = Object.entries(availableTabs);

  const activateTab = (path: string) => {
    const message = {
      type: "readFile",
      payload: {
        data: null,
        path,
      },
    };
    ws?.send(JSON.stringify(message));
    addOrUpdateAvailableTabs(path);
  };

  const closeTab = (path: string, wasActive: boolean) => {
    const nextActivePath = removeTab(path);

    if (!wasActive) {
      return;
    }

    if (!nextActivePath) {
      clearActiveTab();
      return;
    }

    const message = {
      type: "readFile",
      payload: {
        data: null,
        path: nextActivePath,
      },
    };
    ws?.send(JSON.stringify(message));
  };

  return (
    <div className="editor-tabs-bar">
      {entries.length > 0 ? (
        entries.map(([path, isActive]) => (
          <EditorButtonComponent
            path={path}
            isActive={isActive}
            key={path}
            onActivate={activateTab}
            onClose={closeTab}
          />
        ))
      ) : (
        <span className="editor-tabs-bar-empty">
          Open a file from the tree to start editing
        </span>
      )}
    </div>
  );
};
