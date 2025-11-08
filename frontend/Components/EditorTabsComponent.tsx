import { EditorButtonComponent } from "./EditorButtonComponent";

import availableTabsStore from "../Store/availableTabsStore";

export const EditorTabsComponent = () => {
  const availableTabs = availableTabsStore((state) => state.availableTabs);
  const entries = Object.entries(availableTabs);

  return (
    <div className="editor-tabs-bar">
      {entries.length > 0 ? (
        entries.map(([path, isActive]) => (
          <EditorButtonComponent
            path={path}
            isActive={isActive}
            key={path}
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
