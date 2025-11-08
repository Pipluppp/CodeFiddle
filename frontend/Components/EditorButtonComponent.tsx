import websocketStore from "../Store/websocketStore";
import availableTabsStore from "../Store/availableTabsStore";

import { EditorButtonComponentProps } from "../Types/types";

export const EditorButtonComponent = ({
  path,
  isActive,
}: EditorButtonComponentProps) => {
  const ws = websocketStore((state) => state.ws);
  const addOrUpdateAvailableTabs = availableTabsStore(
    (state) => state.addOrUpdateAvailableTabs
  );

  const handleClick = () => {
    const message = {
      type: "readFile",
      payload: {
        data: null,
        path: path,
      },
    };
    ws?.send(JSON.stringify(message));
    addOrUpdateAvailableTabs(path);
  };

  const classNames = ["editor-tab"];

  if (isActive) {
    classNames.push("is-active");
  }

  return (
    <button
      type="button"
      className={classNames.join(" ")}
      disabled={isActive}
      onClick={handleClick}
      title={path}
    >
      {path.replace(/\\/g, "/").split("/").pop()}
    </button>
  );
};
