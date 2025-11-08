import { useEffect } from "react";
import { useParams } from "react-router-dom";

//@ts-ignore:disable-next-line
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import "../assets/playground.css";
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
  const setPortError = portStore((state) => state.setError);
  const setPath = createFileOrFolderStore((state) => state.setPath);
  const setIsFile = createFileOrFolderStore((state) => state.setIsFile);

  // All side-effects (fetching, websockets) go in here.
  useEffect(() => {
    // Only proceed if we have a valid playgroundId from the URL.
    if (playgroundId) {
      setPort(null);
      setPortError(null);

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
              setPortError(null);
              break;
            case "devServerError":
              const message = data.payload.message;
              setPort(null);
              setPortError(message);
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
        setPort(null);
        setPortError(null);
      };
    }
  }, [playgroundId]); // The dependency array ensures this code only runs when playgroundId changes.

  return (
    <>
      <FolderModal />
      <FileModal />
      <div className="playground-background">
        <Allotment
          className="playground-stage"
          defaultSizes={[23, 52, 25]}
          minSize={180}
        >
          <div className="stage-slot stage-slot--sidebar">
            <div className="island island--sidebar">
              <div className="island-header">
                <span>Project Files</span>
              </div>
              <div className="island-body sidebar-scroll">
                <FolderStructureComponent />
              </div>
            </div>
          </div>
          <div className="stage-slot stage-slot--editor">
            <Allotment
              vertical
              defaultSizes={[70, 30]}
              minSize={160}
            >
              <div className="stage-subslot stage-subslot--editor">
                <div className="island editor-island">
                  <EditorTabsComponent />
                  <div className="editor-main">
                    <div className="editor-body">
                      <div className="editor-surface">
                        <EditorComponent />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="stage-subslot stage-subslot--utility">
                <div className="island utility-island">
                  <div className="island-header island-header--compact">
                    <span>Console</span>
                  </div>
                  <div className="island-body utility-body">
                    <ShellComponent />
                  </div>
                </div>
              </div>
            </Allotment>
          </div>
          <div className="stage-slot stage-slot--preview">
            <div className="island preview-island">
              <BrowserComponent />
            </div>
          </div>
        </Allotment>
      </div>
    </>
  );
};
