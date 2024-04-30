import { loadClientModules } from "@docusaurus/core/lib/server/clientModules";
import { LoadedPlugin, Plugin } from "@docusaurus/types";
import { createMissingPropertyResult, createResult } from "./utils";

export const toLoadClientModules = (
  plugin: Plugin,
  ...expectedModules: string[]
): jest.CustomMatcherResult => {
  if (!Object.hasOwn(plugin, "getClientModules")) {
    return createMissingPropertyResult("getClientModules");
  }

  const modules = loadClientModules([plugin] as LoadedPlugin[]);
  const remaining = expectedModules.filter(
    (e) => !modules.some((m) => new RegExp(`${e}$`).test(m)),
  );

  return createResult(
    remaining.length === 0,
    "Plugin did not load the following client modules:",
    ...remaining.map((m) => `- ${m}`),
    "",
    "Received the following client modules:",
    ...modules.map((m) => `- ${m}`),
  );
};
