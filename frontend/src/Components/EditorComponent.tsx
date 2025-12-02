import { useEffect, useRef, useState } from "react";
import { CodeiumEditor } from "@codeium/react-code-editor";
import { FaEye, FaCode } from "react-icons/fa";

import activeTabStore from "../Store/activeTabStore";
import websocketStore from "../Store/websocketStore";
import availableTabsStore from "../Store/availableTabsStore";
import { registerPlaygroundLanguages } from "../utils/registerPlaygroundLanguages";
import { resolveRelativePath } from "../utils/pathUtils";
import { detectLanguage, islandTheme } from "../utils/editorConfig";
import MarkdownPreview from "./MarkdownPreview";



export const EditorComponent = () => {
  const activeTab = activeTabStore((state) => state.activeTab);
  const ws = websocketStore((state) => state.ws);
  const addOrUpdateAvailableTabs = availableTabsStore((state) => state.addOrUpdateAvailableTabs);

  const pendingWrite = useRef<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    return () => {
      if (pendingWrite.current !== null) {
        clearTimeout(pendingWrite.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeTab?.value !== undefined) {
      setContent(activeTab.value);
    }
  }, [activeTab?.value, activeTab?.path]);

  useEffect(() => {
    if (activeTab?.path) {
      const normalized = activeTab.path.toLowerCase();
      if (normalized.endsWith("readme.md")) {
        setShowPreview(true);
      } else {
        setShowPreview(false);
      }
    }
  }, [activeTab?.path]);

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

  const isMarkdown = activeTab?.path?.toLowerCase().endsWith(".md") || activeTab?.path?.toLowerCase().endsWith(".markdown");

  const handleInternalLinkClick = (href: string) => {
    if (activeTab?.path) {
      const resolvedPath = resolveRelativePath(activeTab.path, href);
      addOrUpdateAvailableTabs(resolvedPath);
      
      ws?.send(JSON.stringify({
        type: "readFile",
        payload: { path: resolvedPath }
      }));
    }
  };

  return (
    <div className="relative w-full h-full bg-[#17191A]">
      {isMarkdown && (
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="absolute top-3 right-6 z-10 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 bg-[#1e1f22]/80 hover:bg-[#2b2d31] hover:text-white border border-white/10 rounded-md backdrop-blur-sm transition-all shadow-sm"
          title={showPreview ? "Switch to Editor" : "Switch to Preview"}
        >
          {showPreview ? <><FaCode className="text-sm" /> Code</> : <><FaEye className="text-sm" /> Preview</>}
        </button>
      )}

      {showPreview && isMarkdown ? (
        <MarkdownPreview 
          content={content} 
          onInternalLinkClick={handleInternalLinkClick} 
        />
      ) : (
        <CodeiumEditor
          beforeMount={(monaco) => {
            registerPlaygroundLanguages(monaco);
            monaco.editor.defineTheme("islands", islandTheme);
          }}
          theme="islands"
          saveViewState={true}
          height="100%"
          width="100%"
          path={activeTab ? activeTab.path : ""}
          language={detectLanguage(activeTab?.path) ?? "plaintext"}
          value={content}
          onChange={(value) => {
            setContent(value || "");
            handleChange(value);
          }}
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
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
            quickSuggestionsDelay: 0,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnCommitCharacter: true,
            tabCompletion: "on",
            snippetSuggestions: "inline",
            wordBasedSuggestions: "allDocuments",
            inlineSuggest: {
              enabled: true,
            },
            suggest: {
              showMethods: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showEnums: true,
              showEnumMembers: true,
              showKeywords: true,
              showWords: true,
              showSnippets: true,
            },
          }}
        />
      )}
    </div>
  );
};
