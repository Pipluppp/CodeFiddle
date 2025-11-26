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

  const previewUrl = port ? `https://${containerHost}:${port}` : "";
  const addressDisplay = port
    ? previewUrl
    : error
    ? "Preview unavailable"
    : "Starting environment...";

  const renderContent = () => {
    if (error) {
      return (
        <div className="preview-state preview-state--error">
          <div>
            <h3>Preview failed to start</h3>
            <p>{error}</p>
            <p>Check the console output for more details.</p>
          </div>
        </div>
      );
    }

    if (!port) {
      return (
        <div className="preview-state preview-state--pending">
          <div>
            <h3>Starting your preview...</h3>
            <p>
              Installing dependencies and preparing the container. This can
              take a minute on the first run, especially for larger templates.
            </p>
          </div>
        </div>
      );
    }

    return (
      <iframe
        className="preview-frame"
        frameBorder={0}
        ref={browser}
        src={previewUrl}
        title="Sandbox Preview"
      />
    );
  };

  return (
    <div className="preview-pane">
      <div className="preview-toolbar">
        <span className="preview-title">Preview</span>
        <div className="preview-controls">
          <button
            type="button"
            className="preview-reload"
            onClick={handleRefresh}
            aria-label="Reload preview"
            disabled={!port}
          >
            <ReloadOutlined />
          </button>
          <div className="preview-address">
            <input
              className="preview-address-input"
              value={addressDisplay}
              readOnly
              aria-label="Preview address"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
      <div className="preview-frame-wrapper">
        <div className="preview-frame-shell">{renderContent()}</div>
      </div>
    </div>
  );
};
