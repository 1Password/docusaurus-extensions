import { Plugin } from "@docusaurus/types";
import {
  createContentActions,
  createMissingPropertyResult,
  createResult,
} from "./utils";

export const toCreateData = async (
  plugin: Plugin,
  name: string,
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
    actions,
  });

  expect(actions.createData).toHaveBeenCalledWith(name, data);

  return createResult(true);
};
