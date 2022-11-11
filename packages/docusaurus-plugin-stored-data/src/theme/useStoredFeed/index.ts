import useStoredData from "@theme/useStoredData";
import { XMLParser } from "fast-xml-parser";

const useStoredFeed = <T = Record<string, any>>(id: string): Promise<T> => {
  const parser = new XMLParser();
  const data = useStoredData<string>(id);
  let xml = parser.parse(data);

  try {
    const { channel } = xml.rss;
    if (!channel) {
      throw new Error("Channel data not found");
    }
    xml = channel;
  } catch {
    // most rss feeds will be structured like the above, but
    // if it's a non-standard feed don't try to drill down
  }

  return xml;
};

export default useStoredFeed;
