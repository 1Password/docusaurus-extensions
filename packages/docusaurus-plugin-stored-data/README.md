# docusaurus-plugin-stored-data

Load local or external data to be used in Docusaurus

## Usage

Start by installing the dependency:

- Yarn: `yarn add @1password/docusaurus-plugin-stored-data`
- NPM: `npm i @1password/docusaurus-plugin-stored-data`

Add the plugin to your `docusaurus.config.js` file's "plugins" option. If you're new to Docusaurus plugins, [click here to learn more](https://docusaurus.io/docs/using-plugins) about installing and configuring them.

These are the available plugin options:

```ts
type Options = {
  /**
   * Define key-value pairs, where the key is the ID you want to assign to the data,
   * and the value is a local path or external URL to retrieve the data from.
   */
  data: Record<string, string>;
};
```

Here's an example of how to set the plugin's options, loading both local and external data:

```js
// docusaurus.config.js
const { resolve } = require("path");

plugins: [
  [
    '@1password/docusaurus-plugin-stored-data',
    {
      data: {
        "blog-feed": "https://example.com/blog.xml",
        "rust-example": resolve(__dirname, "static", "example.rs"),
      }
    }
  ]
],
```

Now, when you start your dev server or build the site, the plugin will retrieve the contents of each location specified in the config and store it as plugin data. Access this data in your site using one of the plugin's hooks, which takes the ID and returns the data in various formats.

The following hooks are available:

- `@theme/useStoredData` - Returns the data unformatted
- `@theme/useStoredJson` - Returns the data parsed as JSON
- `@theme/useStoredFeed` - Returns the data parsed as RSS XML into JSON structure using [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser).

Here's an example of how you might use the plugin to retrieve and render blog posts from an RSS feed:

```jsx
// FeedItems.tsx

import useStoredFeed from "@theme/useStoredFeed";

const FeedItems = () => {
  const feedData = useStoredFeed("blog-feed");
  return (
    <ul>
      {feedData.item.map((item) => (
        <li key={item.guid}>{item.title}</li>
      ))}
    </ul>
  );
};
```

Or, if your data can be rendered without modification you can simply call a hook directly inside an MDX file:

```jsx
// example.mdx

import CodeBlock from "@theme/CodeBlock";
import useStoredData from "@theme/useStoredData";

<CodeBlock language="rust">{useStoredData("rust-example")}</CodeBlock>;
```

If you're using TypeScript you will need to reference the plugin's types:

```ts
// types.d.ts

/// <reference types="@1password/docusaurus-plugin-stored-data" />
```

## License

MIT
