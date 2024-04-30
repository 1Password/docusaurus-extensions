import { Plugin, RouteConfig } from "@docusaurus/types";
import {
  createContentActions,
  createMissingPropertyResult,
  createResult,
} from "./utils";

export const toAddRoutes = async (
  plugin: Plugin,
  ...routeConfigs: RouteConfig[]
): Promise<jest.CustomMatcherResult> => {
  const actions = createContentActions();

  let content = null;
  if (Object.hasOwn(plugin, "loadContent")) {
    content = await plugin.loadContent!();
  }

  if (!Object.hasOwn(plugin, "contentLoaded")) {
    return createMissingPropertyResult("contentLoaded");
  }

  await plugin.contentLoaded!({
    content: content!,
    actions,
  });

  for (const routeConfig of routeConfigs) {
    expect(actions.addRoute).toHaveBeenCalledWith(routeConfig);
  }

  return createResult(true);
};
