import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { ReloadOutlined } from "@ant-design/icons";

import portStore from "../Store/portStore";
import shellSocketStore from "../Store/shellSocketStore";
import websocketStore from "../Store/websocketStore";

const containerHost = import.meta.env.VITE_CONTAINER_HOST || "localhost";

export const BrowserComponent: React.FC = () => {
  const { playgroundId } = useParams();

  const port = portStore((state) => state.port);
  const error = portStore((state) => state.error);
  const wsForShell = shellSocketStore((state) => state.wsForShell);
  const ws = websocketStore((state) => state.ws);

  const browser = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    if (!browser.current || !port) {
      return;
    }
    browser.current.src = browser.current.src;
  };

  useEffect(() => {
    if (!ws || !wsForShell || !playgroundId || port || error) {
      return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      type: "registerPort",
      payload: {
        data: playgroundId,
      },
    };

    ws.send(JSON.stringify(message));
  }, [playgroundId, ws, wsForShell, port, error]);

  const previewUrl = port ? `http://${containerHost}:${port}` : "";
  const addressDisplay = port
    ? previewUrl
    : error
    ? "Preview unavailable"
    : "Starting environment...";

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 p-4 text-center">
          <div className="max-w-md">
            <h3 className="font-bold mb-2">Preview failed to start</h3>
            <p className="text-sm mb-2">{error}</p>
            <p className="text-xs text-jb-text-muted">Check the console output for more details.</p>
          </div>
        </div>
      );
    }

    if (!port) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-jb-text-muted p-4 text-center">
          <div className="max-w-md">
            <h3 className="font-bold mb-2 text-jb-text">Starting your preview...</h3>
            <p className="text-sm">
              Installing dependencies and preparing the container. This can
              take a minute on the first run, especially for larger templates.
            </p>
          </div>
        </div>
      );
    }

    return (
      <iframe
        className="w-full h-full bg-white"
        frameBorder={0}
        ref={browser}
        src={previewUrl}
        title="Sandbox Preview"
      />
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-md overflow-hidden">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
            onClick={handleRefresh}
            aria-label="Reload preview"
            disabled={!port}
          >
            <ReloadOutlined />
          </button>
        </div>
        <div className="flex-1">
          <input
            className="w-full px-3 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-blue-400"
            value={addressDisplay}
            readOnly
            aria-label="Preview address"
            spellCheck={false}
          />
        </div>
      </div>
      
      {/* Browser Content */}
      <div className="flex-1 min-h-0 relative">
        {renderContent()}
      </div>
    </div>
  );
};
