# jest-docusaurus

[Jest](https://jestjs.io/) helpers for developing with Docusaurus

## Usage

These instructions assume you already have Jest configured in your project.

Start by installing the dependency:

- Yarn: `yarn add @1password/jest-docusaurus`
- NPM: `npm i @1password/jest-docusaurus`

If you're using TypeScript you will want to reference the package's types:

```ts
// types.d.ts

/// <reference types="@1password/jest-docusaurus" />
```

From here there are a few things this package offers:

### Extending configuration

Developing plugins and components for Docusaurus often involves importing from a variety of module aliases, such as `@theme`, `@site`, and `@docusaurus`. To avoid needing to mock these you can use this package to tell Jest how to find them.

To do this you'll need to modify the default export in your `jest.config` file from an object to an async function (if it isn't already one), and then call `createConfig` provided by the package. If your Jest config and Docusaurus site exist in different locations, you can specify the Docusaurus site directory using the `siteDir` option. Using the result of this call, spread or assign its `moduleNameMapper` property to your existing config property of the same name.

Here's an example, using TypeScript and [ts-jest](https://kulshekhar.github.io/ts-jest/):

```ts
// jest.config.ts

import { createConfig } from "@1password/jest-docusaurus/config";
import type { Config } from "@jest/types";
import { resolve } from "path";

export default async (): Promise<Config.InitialOptions> => {
  const docusaurusConfig = await createConfig({
    // Our Docusaurus site is in its own location
    siteDir: resolve(__dirname, "./website"),
  });

  return {
    testMatch: [`<rootDir>/**/*.test.[jt]s?(x)`],
    transform: {
      "^.+\\.[t|j]sx?$": "ts-jest",
    },
    moduleNameMapper: {
      "^.+\\.(jpg|jpeg|png|svg)$": "<rootDir>/fileMock.js",
      // Add Docusaurus mapped modules to our existing map
      ...docusaurusConfig.moduleNameMapper,
    },
    // Allow ts-jest to transform Docusaurus files
    transformIgnorePatterns: [
      // Yarn v1 or NPM:
      ".yarn/__virtual__/(?!@docusaurus.*)",
      // Yarn PnP
      "node_modules/(?!@docusaurus/.*)",
    ],
  };
};
```

In the future this config helper may be used to extend Jest in other ways, but for now it's largely just for mapping modules.

More about aliases in Docusaurus:

- [Client architecture - Theme aliases](https://docusaurus.io/docs/advanced/client#theme-aliases)
- [MDX and React - Importing components](https://docusaurus.io/docs/markdown-features/react#importing-components)
- [TypeScript support](https://docusaurus.io/docs/typescript-support)

### Plugin matchers

When working on a Docusaurus plugin there are [several methods](https://docusaurus.io/docs/api/plugin-methods) one can use to extend the functionality of the plugin. To help test that these methods are being correctly invoked and return expected results, this package introduces several custom [matchers](https://jestjs.io/docs/using-matchers).

Start by adding the matchers to your Jest setup file:

```js
// jest.setup.js

import "@1password/jest-docusaurus/matchers";
```

Now you can use any of the following matchers with expectation objects:

| Matcher | Description |
| --- | --- |
| `toLoadClientModules` | Calls `getClientModules` and expects the provided value(s) to be substrings to exist in the returned array of strings. |
| `toHaveThemePaths` | Calls `getThemePath` and optionally `getTypeScriptThemePath` and expects the provided value(s) to be a substring of the returned value. |
| `toSetGlobalData` | Calls `contentLoaded` and expects that the `setGlobalData` action provided to it was called with the provided value. Note: this also calls the `loadContent` method if it exists and provides its value to `contentLoaded`. |
| `toCreateData` | Calls `contentLoaded` and expects that the `createData` action provided to it was called with the provided values. Note: this also calls the `loadContent` method if it exists and provides its result to `contentLoaded`. |
| `toAddRoutes` | Calls `contentLoaded` and expects that the `addRoute` action provided to it was called with each of the provided values. Note: this also calls the `loadContent` method if it exists and provides its result to `contentLoaded`. |

Check out the [types](./src/types.d.ts) to see arguments for each matcher. More matchers will be added in the future.

Each of the above matchers depends on the `expect` call to receive an instance of a plugin. To make this easier this package provides a utility for creating an instance of your plugin. Here's how this might look in practice:

```ts
// my-plugin.test.ts

import { loadPlugin } from "@1password/jest-docusaurus/plugin";
import myPlugin from ".";

describe("my-docusaurus-plugin", () => {
  it("loads correct theme paths", async () => {
    const plugin = await loadPlugin(myPlugin, {
      someOption: "foo",
    });
    expect(plugin).toHaveThemePaths("dist/theme");
  });
});
```

Bonus: not only does `loadPlugin` return all the properties of your instantiated plugin, it also returns a new `document` property, which is an HTML element containing all the rendered tags returned from `injectHtmlTags`. You can use it to assert the presence of your custom HTML tags. For example:

```ts
// my-plugin.test.ts

import { loadPlugin } from "@1password/jest-docusaurus/plugin";
import myPlugin from ".";

describe("my-docusaurus-plugin", () => {
  it("injects the custom html element", async () => {
    const plugin = await loadPlugin(myPlugin, {
      someOption: "foo",
    });
    expect(plugin.document.querySelector(".custom-element")).not.toBeNull();
  });
});
```

## License

MIT
