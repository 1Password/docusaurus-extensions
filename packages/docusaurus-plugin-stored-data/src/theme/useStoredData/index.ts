import { usePluginData } from "@docusaurus/useGlobalData";

const useStoredData = <T>(id: string): T => {
  const pluginData = usePluginData("docusaurus-plugin-stored-data") as Record<
    string,
    any
  >;
  return pluginData.data[id];
};

export default useStoredData;
