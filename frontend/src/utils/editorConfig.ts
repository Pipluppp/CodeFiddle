
export const detectLanguage = (path: string | undefined): string | undefined => {
  if (!path) {
    return undefined;
  }

  const normalized = path.toLowerCase();

  if (normalized.endsWith(".tsx") || normalized.endsWith(".ts")) {
    return "typescript";
  }

  if (
    normalized.endsWith(".jsx") ||
    normalized.endsWith(".js") ||
    normalized.endsWith(".cjs") ||
    normalized.endsWith(".mjs")
  ) {
    return "javascript";
  }

  if (normalized.endsWith(".json")) {
    return "json";
  }

  if (normalized.endsWith(".css")) {
    return "css";
  }

  if (normalized.endsWith(".scss")) {
    return "scss";
  }

  if (normalized.endsWith(".html") || normalized.endsWith(".htm")) {
    return "html";
  }

  if (normalized.endsWith(".vue")) {
    return "vue";
  }

  if (normalized.endsWith(".svelte")) {
    return "svelte";
  }

  if (normalized.endsWith(".md") || normalized.endsWith(".markdown")) {
    return "markdown";
  }

  if (normalized.endsWith(".yaml") || normalized.endsWith(".yml")) {
    return "yaml";
  }

  if (normalized.endsWith(".py")) {
    return "python";
  }

  if (normalized.endsWith(".rb")) {
    return "ruby";
  }

  if (normalized.endsWith(".go")) {
    return "go";
  }

  if (normalized.endsWith(".rs")) {
    return "rust";
  }

  if (normalized.endsWith(".java")) {
    return "java";
  }

  return undefined;
};

export const islandTheme = {
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
    "editor.background": "#17191A",
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
    "editorGutter.background": "#17191A",
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
