import type { Options } from "@1password/docusaurus-plugin-stored-data";
import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";
import { lstat, readFile } from "fs/promises";
import https from "https";

const httpsPromise = (
  options: Parameters<typeof https.request>[0],
): Promise<{
  statusCode?: number;
  headers: NodeJS.Dict<string | string[]>;
  body: string;
}> =>
  new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let body = "";
      const { statusCode, headers } = response;

      response.on("data", (chunk) => {
        body += chunk.toString();
      });
      response.on("error", reject);
      response.on("end", () => {
        if (statusCode! >= 200 && statusCode! <= 299) {
          return resolve({
            statusCode,
            headers,
            body,
          });
        }

        return reject(
          new Error(
            `Request failed. Status: ${response.statusCode}, body: ${body}`,
          ),
        );
      });
    });

    request.on("error", reject);
    request.end();
  });

const getData = async (location: string): Promise<string> => {
  try {
    new URL(location); // will throw if invalid URL

    const response = await httpsPromise(location);
    return response.body;
  } catch (error) {
    // If it's just an invalid URL, let it fall through to check if it's a file
    if (
      !(error instanceof TypeError) ||
      !error.message.includes("Invalid URL")
    ) {
      throw error;
    }
  }

  try {
    const stat = await lstat(location);

    if (stat.isFile()) {
      return await readFile(location, "utf8");
    }

    throw new Error(`Location ${location} is not a file`);
  } catch (error) {
    if (!(error instanceof Error) || !error.message.startsWith("ENOENT")) {
      throw error;
    }
  }

  throw new Error(`Could not determine if ${location} is a URL or file`);
};

const pluginStoredData = (
  _: LoadContext,
  { data = {} }: Options,
): Plugin<Record<string, any>> => ({
  name: "docusaurus-plugin-stored-data",

  async loadContent() {
    const parsed = await Promise.all(
      Object.entries(data).map(async ([name, location]) => [
        name,
        await getData(location),
      ]),
    );

    return Object.fromEntries(parsed);
  },

  async contentLoaded({ content, actions: { setGlobalData } }) {
    setGlobalData({
      data: content,
    });
  },

  getThemePath() {
    return "../dist/theme";
  },

  getTypeScriptThemePath() {
    return "../src/theme";
  },
});

export default pluginStoredData;

const pluginOptionsSchema = Joi.object<Options>({
  data: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
});

export const validateOptions = ({
  validate,
  options,
}: OptionValidationContext<Partial<Options>, Options>): Options =>
  validate(pluginOptionsSchema, options);
