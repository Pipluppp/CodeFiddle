import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

import shellSocketStore from "../Store/shellSocketStore";

interface ShellComponentProps {
  onShellReady?: () => void;
}

export const ShellComponent = ({ onShellReady }: ShellComponentProps) => {
  const setWs = shellSocketStore((state) => state.setWs);

  const terminal = useRef<HTMLDivElement | null>(null);

  const { playgroundId } = useParams();

  useEffect(() => {
    if (!playgroundId) {
      return;
    }

    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3000";
    const ws = new WebSocket(`${wsUrl}/shell/?playgroundId=${playgroundId}`);
    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      theme: {
        background: "#17191A",
        foreground: "#cccccc",
        cursor: "#3574f0",
        cursorAccent: "#1e1e1e",
        black: "#1e1e1e",
        red: "#f48771",
        green: "#62a462",
        yellow: "#cc7832",
        blue: "#3574f0",
        magenta: "#c792ea",
        cyan: "#6897bb",
        white: "#f5f5f5",
        brightBlack: "#2f2f2f",
        brightWhite: "#ffffff",
      },
      fontSize: 13,
      fontFamily: "JetBrains Mono, 'Droid Sans Mono', monospace",
      scrollback: 5000,
    });

    if (terminal.current) {
      term.open(terminal.current);
    }

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    const handleResize = () => {
      fitAddon.fit();
    };

    fitAddon.fit();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;

    if (terminal.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminal.current);
    }

    ws.onopen = () => {
      const attachAddon = new AttachAddon(ws);
      term.loadAddon(attachAddon);
      setWs(ws);
      onShellReady?.();
    };

    term.attachCustomKeyEventHandler((event) => {
      if (
        event.type === "keydown" &&
        event.ctrlKey &&
        event.shiftKey &&
        event.code === "KeyC"
      ) {
        const selection = term.getSelection();
        if (selection) {
          navigator.clipboard?.writeText(selection).catch(() => undefined);
          return false;
        }
      }
      return true;
    });

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      setWs(null);
      ws.close();
      term.dispose();
    };
  }, [playgroundId, setWs]);

  return <div ref={terminal} className="shell-terminal" id="terminal-container" />;
};
