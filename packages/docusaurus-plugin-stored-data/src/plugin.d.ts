/// <reference types="@docusaurus/module-type-aliases" />
/// <reference types="@1password/jest-docusaurus" />

declare module "@1password/docusaurus-plugin-stored-data" {
  import type { LoadContext, Plugin } from "@docusaurus/types";

  export type Options = {
    /**
     * Define key-value pairs, where the key is the ID you want to assign to the data,
     * and the value is a local path or external URL to retrieve the data from.
     */
    data: Record<string, string>;
  };

  export default function pluginStoredData(
    context: LoadContext,
    options: Options,
  ): Plugin<Record<string, any>>;
}

declare module "@theme/useStoredData" {
  /**
   * Retrieve stored data
   */
  const useStoredData: <T>(id: string) => T;
  export default useStoredData;
}

declare module "@theme/useStoredJson" {
  /**
   * Retrieve stored data as JSON
   */
  const useStoredJson: <T = Record<string, any>>(id: string) => T;
  export default useStoredJson;
}

declare module "@theme/useStoredFeed" {
  /**
   * Retrieve stored feed data, parsing the XML into JSON
   */
  const useStoredFeed: <T = Record<string, any>>(id: string) => T;
  export default useStoredFeed;
}
