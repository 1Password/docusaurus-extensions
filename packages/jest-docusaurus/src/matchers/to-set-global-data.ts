import { Plugin } from "@docusaurus/types";
import {
  createContentActions,
  createMissingPropertyResult,
  createResult,
} from "./utils";

export const toSetGlobalData = async (
  plugin: Plugin,
  data: any,
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
    allContent: {},
    actions,
  });

  expect(actions.setGlobalData).toHaveBeenCalledWith(data);

  return createResult(true);
};
