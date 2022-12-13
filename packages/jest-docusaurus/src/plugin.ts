import { loadContext } from "@docusaurus/core/lib/server";
import { loadHtmlTags } from "@docusaurus/core/lib/server/htmlTags";
import type { LoadContext, Plugin } from "@docusaurus/types";
import path from "path";

export type LoadedPlugin<TContent> = Plugin<TContent> & {
  document: HTMLHtmlElement;
  mockDataPath: string;
};

const createPluginDocument = (plugin: Plugin<any>) => {
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

export const loadPlugin = async <
  TOptions = Record<string, any>,
  TContent = null,
>(
  plugin: (context: LoadContext, options: TOptions) => Plugin<TContent>,
  options?: TOptions,
): Promise<LoadedPlugin<TContent>> => {
  const siteDir = path.join(__dirname, "__fixtures__", "site");
  const context = await loadContext({ siteDir });
  const loadedPlugin = plugin(context, (options || {}) as TOptions);
  return {
    ...loadedPlugin,
    document: createPluginDocument(loadedPlugin),
    mockDataPath: "/path/to/data",
  };
};
