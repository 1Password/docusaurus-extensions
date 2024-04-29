import { loadContext } from "@docusaurus/core/lib/server";
import { loadHtmlTags } from "@docusaurus/core/lib/server/htmlTags";
import type { LoadContext, LoadedPlugin } from "@docusaurus/types";
import path from "path";

export type LoadedPluginWithData = LoadedPlugin & {
  document: HTMLHtmlElement;
  mockDataPath: string;
};

const createPluginDocument = (plugin: LoadedPlugin) => {
  const htmlTags = loadHtmlTags([plugin]);
  const container = document.createElement("html");
  container.innerHTML = `
    <head>
      ${htmlTags.headTags}
    </head>
    <body>
      ${htmlTags.preBodyTags}
      <p>Page content</p>
      ${htmlTags.postBodyTags}
    </body>
  `;
  return container;
};

export const loadPlugin = async <TOptions = Record<string, any>>(
  plugin: (context: LoadContext, options: TOptions) => LoadedPlugin,
  options?: TOptions,
): Promise<LoadedPluginWithData> => {
  const siteDir = path.join(__dirname, "__fixtures__", "site");
  const context = await loadContext({ siteDir });
  const loadedPlugin = plugin(context, (options || {}) as TOptions);
  return {
    ...loadedPlugin,
    document: createPluginDocument(loadedPlugin),
    mockDataPath: "/path/to/data",
  };
};
