import { Plugin } from "@docusaurus/types";
import { createMissingPropertyResult, createResult } from "./utils";

export const toHaveThemePaths = (
  plugin: Plugin,
  themePath: string,
  tsThemePath?: string,
): jest.CustomMatcherResult => {
  if (!Object.hasOwn(plugin, "getThemePath")) {
    return createMissingPropertyResult("getThemePath");
  }

  const pluginThemePath = plugin.getThemePath!();
  if (!new RegExp(`${themePath}$`).test(pluginThemePath)) {
    return createResult(
      false,
      `Plugin did not have expected theme path: ${themePath}`,
      "",
      `Received theme path: ${pluginThemePath}`,
    );
  }

  if (tsThemePath) {
    if (!Object.hasOwn(plugin, "getTypeScriptThemePath")) {
      return createMissingPropertyResult("getTypeScriptThemePath");
    }

    const pluginTsThemePath = plugin.getTypeScriptThemePath!();
    if (!new RegExp(`${tsThemePath}$`).test(pluginTsThemePath)) {
      return createResult(
        false,
        `Plugin did not have expected TypeScript theme path: ${tsThemePath}`,
        "",
        `Received TypeScript theme path: ${pluginTsThemePath}`,
      );
    }
  }

  return {
    message: () => "",
    pass: true,
  };
};
