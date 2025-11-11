import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { SetupOverlay, SetupOverlayStep } from "../Components/SetupOverlay";
import { PlaygroundMetadata } from "../Types/types";
import { buildApiUrl } from "../src/utils/api";

export const Playground = () => {
  const { playgroundId } = useParams();
  const navigate = useNavigate();
  const setFolderStructure = folderStructureStore(
    (state) => state.setFolderStructure
  );
  const setWs = websocketStore((state) => state.setWs);
  const setActiveTab = activeTabStore((state) => state.setActiveTab);
  const setPort = portStore((state) => state.setPort);
  const setPortError = portStore((state) => state.setError);
  const port = portStore((state) => state.port);
  const portError = portStore((state) => state.error);
  const setPath = createFileOrFolderStore((state) => state.setPath);
  const setIsFile = createFileOrFolderStore((state) => state.setIsFile);

  const [playgroundMeta, setPlaygroundMeta] = useState<PlaygroundMetadata | null>(null);
  const [shellReady, setShellReady] = useState(false);

  // All side-effects (fetching, websockets) go in here.
  useEffect(() => {
    // Only proceed if we have a valid playgroundId from the URL.
    if (playgroundId) {
      setShellReady(false);
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
  }, [
    playgroundId,
    setActiveTab,
    setFolderStructure,
    setIsFile,
    setPath,
    setPort,
    setPortError,
    setWs,
  ]); // The dependency array ensures this code only runs when playgroundId changes.

  useEffect(() => {
    if (!playgroundId) {
      return;
    }

    let cancelled = false;

    const loadMetadata = async () => {
      try {
        const response = await fetch(
          buildApiUrl(`/playgrounds/${playgroundId}/meta`)
        );
        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }
        const metadata: PlaygroundMetadata = await response.json();
        if (!cancelled) {
          setPlaygroundMeta(metadata);
        }
      } catch (error) {
        if (!cancelled) {
          setPlaygroundMeta(null);
        }
      }
    };

    loadMetadata();

    return () => {
      cancelled = true;
    };
  }, [playgroundId]);

  const shouldWaitForPreview = playgroundMeta?.hasPreview ?? true;
  const encounteredError = Boolean(portError);
  const workspaceReady = shouldWaitForPreview
    ? Boolean(port) || encounteredError
    : shellReady;
  const showOverlay = Boolean(playgroundId) && !workspaceReady;

  const setupSteps: SetupOverlayStep[] = useMemo(() => {
    const steps: SetupOverlayStep[] = [];

    steps.push({
      id: "provision",
      label: "Provisioning container",
      status: shellReady || workspaceReady ? "complete" : "active",
    });

    steps.push({
      id: "install",
      label: "Running npm install",
      status: workspaceReady ? "complete" : shellReady ? "active" : "pending",
    });

    if (shouldWaitForPreview) {
      steps.push({
        id: "start",
        label: "Starting dev server",
        status:
          workspaceReady || encounteredError
            ? "complete"
            : shellReady
            ? "active"
            : "pending",
      });
    } else {
      steps.push({
        id: "start",
        label: "Starting workspace",
        status: shellReady ? "complete" : "pending",
      });
    }

    steps.push({
      id: "ready",
      label: encounteredError ? "Encountered an issue" : "Launching workspace",
      status: workspaceReady ? "complete" : shellReady ? "active" : "pending",
    });

    return steps;
  }, [
    encounteredError,
    shellReady,
    shouldWaitForPreview,
    workspaceReady,
  ]);

  const overlaySubtitle = shouldWaitForPreview
    ? "Installing dependencies and starting the live preview server."
    : "Installing dependencies and preparing your runtime environment.";

  const overlayHint = encounteredError
    ? "Check the console output for details about the failure."
    : "This can take a minute on the first launch, especially for larger templates.";

  return (
    <>
      <FolderModal />
      <FileModal />
      <div className="playground-background">
        <div className="playground-topbar">
          <button
            type="button"
            className="playground-topbar__back"
            onClick={() => navigate("/")}
          >
            ← Back to templates
          </button>
          <span className="playground-topbar__label">
            {playgroundMeta?.title ?? "Preparing template"}
          </span>
        </div>
        <div className="playground-stage-wrapper">
          <Allotment className="playground-stage" defaultSizes={[23, 52, 25]}>
          <Allotment.Pane minSize={60}>
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
          </Allotment.Pane>
          <Allotment.Pane minSize={260}>
            <div className="stage-slot stage-slot--editor">
              <Allotment vertical defaultSizes={[70, 30]}>
                <Allotment.Pane minSize={220}>
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
                </Allotment.Pane>
                <Allotment.Pane minSize={140}>
                  <div className="stage-subslot stage-subslot--utility">
                    <div className="island utility-island">
                      <div className="island-header island-header--compact">
                        <span>Console</span>
                      </div>
                      <div className="island-body utility-body">
                        <ShellComponent onShellReady={() => setShellReady(true)} />
                      </div>
                    </div>
                  </div>
                </Allotment.Pane>
              </Allotment>
            </div>
          </Allotment.Pane>
          <Allotment.Pane minSize={200}>
            <div className="stage-slot stage-slot--preview">
              <div className="island preview-island">
                <BrowserComponent />
              </div>
            </div>
          </Allotment.Pane>
          </Allotment>
        </div>
        <SetupOverlay
          visible={showOverlay}
          title="Preparing your playground"
          subtitle={overlaySubtitle}
          hint={overlayHint}
          steps={setupSteps}
        />
      </div>
    </>
  );
};
