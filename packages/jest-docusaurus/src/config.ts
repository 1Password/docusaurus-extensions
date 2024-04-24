import { loadSite } from "@docusaurus/core/lib/server/site";
import { createBaseConfig } from "@docusaurus/core/lib/webpack/base";
import { applyConfigureWebpack } from "@docusaurus/core/lib/webpack/utils";
import type { Props } from "@docusaurus/types";
import type { Config } from "@jest/types";

export const createConfig = async ({
  siteDir = process.cwd(),
}: {
  siteDir?: string;
} = {}): Promise<Config.InitialOptions> => {
  const { props } = await loadSite({
    siteDir,
  });

  // Load up the Docusaurus client Webpack config,
  // so we can extract its aliases
  let webpackConfig = await createBaseConfig(props);

  // Allow plugins to make any final tweaks to the config
  for (const plugin of (props.plugins as Props["plugins"]).filter(
    (plugin) => "configureWebpack" in plugin,
  )) {
    webpackConfig = applyConfigureWebpack(
      plugin.configureWebpack!.bind(plugin),
      webpackConfig,
      false,
      props.siteConfig.webpack?.jsLoader,
      plugin.content,
    );
  }

  const aliases: Record<string, string | string[]> = {};

  for (let [key, value] of Object.entries(
    webpackConfig.resolve!.alias as Record<string, string | string[]>,
  )) {
    // Need to expand some of these as wildcards
    if (["@site", "@generated"].includes(key)) {
      key = `${key}/(.*)`;
      value = `${value as string}/$1`;
    }

    aliases[`^${key}$`] = value;
  }

  return {
    moduleNameMapper: aliases,
  };
};
