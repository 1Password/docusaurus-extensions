import { loadHtmlTags } from "@docusaurus/core/lib/server/htmlTags";
import { loadContext } from "@docusaurus/core/lib/server/site";
import type { LoadContext, LoadedPlugin, Plugin } from "@docusaurus/types";
import path from "path";

export type LoadedPluginWithData<TContent> = Plugin<TContent> & {
  document: HTMLHtmlElement;
  mockDataPath: string;
};

const createPluginDocument = (plugin: Plugin<any>) => {
  const htmlTags = loadHtmlTags([plugin] as LoadedPlugin[]);
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

export const loadPlugin = async <
  TOptions = Record<string, any>,
  TContent = null,
>(
  plugin: (context: LoadContext, options: TOptions) => Plugin<TContent>,
  options?: TOptions,
): Promise<LoadedPluginWithData<TContent>> => {
  const siteDir = path.join(__dirname, "__fixtures__", "site");
  const context = await loadContext({ siteDir });
  const loadedPlugin = plugin(context, (options || {}) as TOptions);
  return {
    ...loadedPlugin,
    document: createPluginDocument(loadedPlugin),
    mockDataPath: "/path/to/data",
  };
};
