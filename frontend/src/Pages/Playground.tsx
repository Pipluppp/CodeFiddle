import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { IDELayout } from "../Components/layout/IDELayout";
import { Island } from "../Components/ui/Island";
import { FolderStructureComponent } from "../Components/FolderStructureComponent";
import { EditorComponent } from "../Components/EditorComponent";
import { EditorTabsComponent } from "../Components/EditorTabsComponent";
import { ShellComponent } from "../Components/ShellComponent";
import { BrowserComponent } from "../Components/BrowserComponent";
import { SetupOverlay, SetupOverlayStep } from "../Components/SetupOverlay";

import folderStructureStore from "../Store/folderStructureStore";
import websocketStore from "../Store/websocketStore";
import activeTabStore from "../Store/activeTabStore";
import portStore from "../Store/portStore";
import createFileOrFolderStore from "../Store/createFileOrFolderStore";
import { buildApiUrl } from "../utils/api";
import { PlaygroundMetadata } from "../types/types";

export const Playground = () => {
  const { playgroundId } = useParams();
  const navigate = useNavigate();
  
  // Stores
  const setFolderStructure = folderStructureStore((state) => state.setFolderStructure);
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
  ]);

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
      <IDELayout
        /* 1. Header */
        /* 2. Sidebar */
        sidebar={
          <div className="flex flex-col h-full w-full bg-jb-panel rounded-[var(--radius-panel)] overflow-hidden border border-jb-border shadow-sm">
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 px-4 h-12 border-b border-jb-border shrink-0 bg-jb-panel">
              <button 
                onClick={() => navigate('/')}
                className="group flex items-center justify-center p-1 -ml-2 rounded-md hover:bg-jb-panel-hover text-jb-text-muted hover:text-jb-text transition-colors"
                title="Go Back"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-jb-text tracking-wide">Codebox</span>
                {playgroundMeta?.templateId && (
                  <>
                    <span className="text-jb-text-muted">/</span>
                    <span className="text-sm font-medium text-jb-text-muted capitalize">
                      {playgroundMeta.templateId}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 min-h-0 relative flex flex-col">
              <FolderStructureComponent />
            </div>
          </div>
        }

        /* 3. Editor */
        editor={
          <div className="flex flex-col h-full w-full bg-jb-panel overflow-hidden rounded-[var(--radius-panel)] border border-jb-border shadow-sm">
            <EditorTabsComponent />
            <div className="flex-1 relative bg-jb-dark">
              <EditorComponent />
            </div>
          </div>
        }

        /* 4. Terminal */
        terminal={
          <Island title="Terminal">
            <div className="h-full w-full bg-[#17191A] p-2"> {/* Manual dark bg for xterm */}
              <ShellComponent onShellReady={() => setShellReady(true)} />
            </div>
          </Island>
        }

        /* 5. Preview */
        preview={
          <div className="h-full w-full bg-white rounded-[var(--radius-panel)] overflow-hidden border border-jb-border shadow-sm">
             <BrowserComponent />
          </div>
        }
      />
      
      <SetupOverlay
        visible={showOverlay}
        title="Preparing your playground"
        subtitle={overlaySubtitle}
        hint={overlayHint}
        steps={setupSteps}
      />
    </>
  );
};
