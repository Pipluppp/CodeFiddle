import { useEffect, useRef } from "react";

import { CodeiumEditor } from "@codeium/react-code-editor";

import activeTabStore from "../Store/activeTabStore";
import websocketStore from "../Store/websocketStore";

const islandTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "808080" },
    { token: "keyword", foreground: "cc7832" },
    { token: "identifier", foreground: "cccccc" },
    { token: "string", foreground: "6a8759" },
    { token: "number", foreground: "6897bb" },
    { token: "delimiter", foreground: "cccccc" },
    { token: "type", foreground: "a9b7c6" },
    { token: "entity.name.function", foreground: "ffc66d" },
    { token: "entity.name.type", foreground: "a9b7c6" },
  ] as { token: string; foreground: string }[],
  colors: {
    "editor.background": "#2b2b2b",
    "editor.foreground": "#cccccc",
    "editorCursor.foreground": "#3574f0",
    "editorLineNumber.foreground": "#5a5a5a",
    "editorLineNumber.activeForeground": "#e0e0e0",
    "editor.selectionBackground": "#2142836e",
    "editor.inactiveSelectionBackground": "#21428333",
    "editor.selectionHighlightBackground": "#3574f026",
    "editor.wordHighlightBackground": "#3574f012",
    "editor.wordHighlightStrongBackground": "#3574f028",
    "editor.lineHighlightBackground": "#323233",
    "editorIndentGuide.background": "#3a3a3a",
    "editorIndentGuide.activeBackground": "#4a4a4a",
    "editorGutter.background": "#2b2b2b",
    "editorWidget.background": "#2f2f2f",
    "editorSuggestWidget.background": "#2f2f2f",
    "editorSuggestWidget.foreground": "#cccccc",
    "editorSuggestWidget.selectedBackground": "#373739",
    "editorSuggestWidget.highlightForeground": "#3574f0",
    "scrollbarSlider.activeBackground": "#3574f080",
    "scrollbarSlider.background": "#3a3a3a80",
    "scrollbarSlider.hoverBackground": "#4a4a4a99",
    "focusBorder": "#3574f0",
  } as Record<string, string>,
};

export const EditorComponent = () => {
  const activeTab = activeTabStore((state) => state.activeTab);
  const ws = websocketStore((state) => state.ws);

  const pendingWrite = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pendingWrite.current !== null) {
        clearTimeout(pendingWrite.current);
      }
    };
  }, []);

  const handleChange = (value: string | undefined) => {
    if (!activeTab?.path) {
      return;
    }

    if (pendingWrite.current !== null) {
      clearTimeout(pendingWrite.current);
    }

    pendingWrite.current = window.setTimeout(() => {
      const writeFile = {
        type: "writeFile",
        payload: {
          data: value ?? "",
          path: activeTab.path,
        },
      };
      ws?.send(JSON.stringify(writeFile));
    }, 2000);
  };

  return (
    <CodeiumEditor
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("islands", islandTheme);
      }}
      theme="islands"
      saveViewState={true}
      height="100%"
      width="100%"
      path={activeTab ? activeTab.path : ""}
      defaultLanguage={undefined}
      value={
        activeTab ? activeTab.value ?? "" : "Open a file to start editing"
      }
      onChange={handleChange}
      options={{
        readOnly: activeTab ? false : true,
        fontSize: 13,
        fontFamily: "JetBrains Mono, 'Droid Sans Mono', monospace",
        minimap: { enabled: false },
        smoothScrolling: true,
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          useShadows: false,
        },
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        automaticLayout: true,
        lineNumbersMinChars: 3,
        renderLineHighlight: "line",
        glyphMargin: false,
        wordWrap: "off",
      }}
    />
  );
};
