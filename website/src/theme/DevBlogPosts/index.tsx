import useStoredFeed from "@theme/useStoredFeed";
import React from "react";

const DevBlogPosts = () => {
  const data = useStoredFeed<{
    item: {
      guid: string;
      title: string;
      link: string;
    }[];
  }>("op-dev-blog");

  return (
    <ul>
      {data.item.slice(0, 5).map((post) => (
        <li key={post.guid}>
          <a href={post.link}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default DevBlogPosts;
