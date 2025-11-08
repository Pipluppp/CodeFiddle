import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { Row, Input } from "antd";
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
  const inputRef = useRef(null);

  const handleRefresh = () => {
    if (browser.current) browser.current.src = browser.current.src;
  };

  useEffect(() => {
    //@ts-ignore:disable-next-line
    if (port && inputRef.current) inputRef.current.input.style.color = "white";
  }, [port]);

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

  if (error) {
    return (
      <Row
        style={{
          height: "97vh",
          width: "100%",
          backgroundColor: "#22212c",
          color: "#ff5555",
          fontFamily: "Ubuntu Mono, monospace",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div>
          <h3 style={{ color: "#ff5555" }}>Preview failed to start</h3>
          <p style={{ color: "#f8f8f2" }}>{error}</p>
          <p style={{ color: "#f1fa8c" }}>
            Check the terminal output for details or retry creating the playground.
          </p>
        </div>
      </Row>
    );
  }

  if (!port) {
    return (
      <Row
        style={{
          height: "97vh",
          width: "100%",
          backgroundColor: "#22212c",
          color: "#f8f8f2",
          fontFamily: "Ubuntu Mono, monospace",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div>
          <h3 style={{ color: "#8be9fd" }}>Starting your preview...</h3>
          <p>
            Installing dependencies and booting the Vite dev server inside the
            container. This might take a minute on the first run.
          </p>
        </div>
      </Row>
    );
  }

  return (
    <Row style={{ backgroundColor: "#22212c" }}>
      <Input
        ref={inputRef}
        bordered={false}
        prefix={<ReloadOutlined onClick={handleRefresh} />}
        defaultValue={`http://${containerHost}:${port}`}
        style={{
          width: "100%",
          backgroundColor: "#282a36",
          color: "white",
          height: "30px",
          fontFamily: "Ubuntu Mono, monospace",
        }}
      />
      <iframe
        frameBorder={0}
        ref={browser}
        src={`http://${containerHost}:${port}`}
        style={{ width: "100%", height: "97vh" }}
      />
    </Row>
  );
};
