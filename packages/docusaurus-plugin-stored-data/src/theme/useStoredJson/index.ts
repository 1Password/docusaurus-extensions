import useStoredData from "@theme/useStoredData";

const useStoredJson = <T = Record<string, any>>(id: string): T => {
  const data = useStoredData<string>(id);
  return JSON.parse(data);
};

export default useStoredJson;
