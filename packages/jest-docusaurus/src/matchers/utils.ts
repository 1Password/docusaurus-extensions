import { PluginContentLoadedActions } from "@docusaurus/types";

export const createResult = (pass: boolean, ...messageStrings: string[]) => ({
  pass,
  message: () => messageStrings.join("\n"),
});

export const createMissingPropertyResult = (property: string) =>
  createResult(
    false,
    `Received value does not define the "${property}" method. Is it a plugin instance?`,
  );

export const createContentActions = (): PluginContentLoadedActions => ({
  createData: jest.fn().mockReturnValue("/path/to/data"),
  addRoute: jest.fn(),
  setGlobalData: jest.fn(),
});
