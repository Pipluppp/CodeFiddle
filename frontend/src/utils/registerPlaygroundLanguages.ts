import type * as Monaco from "monaco-editor";

import {
  conf as htmlConfiguration,
  language as htmlLanguage,
} from "monaco-editor/esm/vs/basic-languages/html/html.js";

let languagesRegistered = false;

const registerHtmlDerivedLanguage = (
  monaco: typeof Monaco,
  id: string,
  extensions: string[],
  aliases: string[]
) => {
  if (monaco.languages.getLanguages().some((lang) => lang.id === id)) {
    return;
  }

  monaco.languages.register({
    id,
    extensions,
    aliases,
    mimetypes: ["text/html"],
  });

  monaco.languages.setLanguageConfiguration(id, htmlConfiguration);
  monaco.languages.setMonarchTokensProvider(id, htmlLanguage);
};

export const registerPlaygroundLanguages = (monaco: typeof Monaco) => {
  if (languagesRegistered) {
    return;
  }

  registerHtmlDerivedLanguage(monaco, "vue", [".vue"], ["Vue", "vue"]);
  registerHtmlDerivedLanguage(monaco, "svelte", [".svelte"], ["Svelte", "svelte"]);

  languagesRegistered = true;
};
