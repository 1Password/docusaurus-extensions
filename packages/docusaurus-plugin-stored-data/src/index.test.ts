import {
  LoadedPluginWithData,
  loadPlugin,
} from "@1password/jest-docusaurus/src/plugin";
import { IncomingMessage } from "http";
import https from "https";
import pluginStoredData from ".";

jest.mock("https", () => ({
  ...jest.requireActual("https"),
  request: (
    _: Parameters<typeof https.request>[0],
    callback: (res: IncomingMessage) => void,
  ) =>
    callback({
      // @ts-expect-error FIXME
      on: (event, listener) => {
        // eslint-disable-next-line default-case
        switch (event) {
          case "data":
            (listener as (chunk: any) => void)(Buffer.from("test", "utf8"));
            break;
          case "end":
            (listener as () => void)();
            break;
        }
      },
      statusCode: 200,
      statusMessage: "API Success",
    }),
  on: jest.fn(),
  end: jest.fn(),
}));

describe("docusaurus-plugin-statuspage", () => {
  let plugin: LoadedPluginWithData<Record<string, any>>;

  beforeEach(async () => {
    plugin = await loadPlugin(pluginStoredData, {
      data: {
        foo: "https://example.com/feed.xml",
        lorem: "https://example.com/feed.xml",
      },
    });
  });

  it("loads data for each object key-pair", async () => {
    jest.spyOn(https, "request");
    const data = await plugin.loadContent!();
    expect(https.request).toHaveBeenCalledTimes(2);
    expect(data).toEqual({
      foo: "test",
      lorem: "test",
    });
  });

  it("sets the fetched data as global data", () => {
    const data = { foo: "bar", lorem: "ipsum" };
    jest.spyOn(plugin, "loadContent").mockResolvedValue(data);
    expect(plugin).toSetGlobalData({ data });
  });

  it("loads correct theme paths", () => {
    expect(plugin).toHaveThemePaths("dist/theme", "src/theme");
  });
});
