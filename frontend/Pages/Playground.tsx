import { useEffect } from "react";
import { useParams } from "react-router-dom";

//@ts-ignore:disable-next-line
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { BrowserComponent } from "../Components/BrowserComponent";
import { EditorComponent } from "../Components/EditorComponent";
import { FolderStructureComponent } from "../Components/FolderStructureComponent";
import { ShellComponent } from "../Components/ShellComponent";
import folderStructureStore from "../Store/folderStructureStore";
import websocketStore from "../Store/websocketStore";
import activeTabStore from "../Store/activeTabStore";
import portStore from "../Store/portStore";
import { EditorTabsComponent } from "../Components/EditorTabsComponent";
import { FolderModal } from "../Components/FolderModal";
import { FileModal } from "../Components/FileModal";
import createFileOrFolderStore from "../Store/createFileOrFolderStore";

export const Playground = () => {
  const { playgroundId } = useParams();
  const setFolderStructure = folderStructureStore(
    (state) => state.setFolderStructure
  );
  const setWs = websocketStore((state) => state.setWs);
  const setActiveTab = activeTabStore((state) => state.setActiveTab);
  const setPort = portStore((state) => state.setPort);
  const setPath = createFileOrFolderStore((state) => state.setPath);
  const setIsFile = createFileOrFolderStore((state) => state.setIsFile);

  // All side-effects (fetching, websockets) go in here.
  useEffect(() => {
    // Only proceed if we have a valid playgroundId from the URL.
    if (playgroundId) {
      // 1. Fetch the initial folder structure.
      setFolderStructure(playgroundId);

      // 2. Establish the WebSocket connection.
      const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3000";
      const ws = new WebSocket(`${wsUrl}/ws-editor/?playgroundId=${playgroundId}`);

      ws.onopen = () => {
        setWs(ws); // Save the websocket connection to the global store
        ws.onmessage = (msg) => {
          const data = JSON.parse(msg.data);
          switch (data.type) {
            case "readFile":
              const payload = data.payload.data;
              const path = data.payload.path;
              setActiveTab(path, undefined, payload);
              break;
            case "registerPort":
              const port = data.payload.port;
              setPort(port);
              break;
            case "validateFolderStructure":
              // Re-fetch the folder structure if the backend detects a change
              setFolderStructure(playgroundId);
              setPath(null);
              setIsFile(-1);
              break;
          }
        };
      };
      
      // 3. Define a cleanup function.
      // This runs when the component is unmounted, preventing memory leaks.
      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
        setWs(null); // Clear the websocket from the global store
      };
    }
  }, [playgroundId]); // The dependency array ensures this code only runs when playgroundId changes.

  return (
    <>
      <FolderModal />
      <FileModal />
      <div style={{ display: "flex" }}>
        <div
          className="folder-structure-parent"
          style={{
            paddingRight: "10px",
            paddingTop: "0.2vh",
            minWidth: "250px",
            maxWidth: "25%",
            height: "99.8vh",
            backgroundColor: "#22212c",
            fontFamily: "Roboto, sans-serif",
            overflow: "auto",
          }}
        >
          <FolderStructureComponent />
        </div>
        <div style={{ height: "100vh", width: "100vw" }}>
          <Allotment>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#282a36",
                width: "100%",
                height: "100%",
              }}
            >
              <div style={{ borderBottom: "1px solid #bd93f9" }}>
                <EditorTabsComponent />
                <EditorComponent />
              </div>
              <ShellComponent />
            </div>
            <BrowserComponent />
          </Allotment>
        </div>
      </div>
    </>
  );
};
