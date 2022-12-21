/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */
import { createConfig } from "@1password/jest-docusaurus/config";
import type { Config } from "@jest/types";
import { resolve } from "path";

const prepareProjectConfig = async () => {
  const docusaurusConfig = await createConfig({
    siteDir: resolve(__dirname, "./website"),
  });

  return (project: string): Config.InitialOptions => {
    const pckg = require(`./packages/${project}/package.json`);

    return {
      displayName: pckg.name,
      testMatch: [`<rootDir>/packages/${project}/**/*.test.[jt]s?(x)`],
      setupFilesAfterEnv: [`${__dirname}/jest.setup.ts`],
      testEnvironment: "jsdom",
      transform: {
        "^.+\\.[t|j]sx?$": "ts-jest",
      },
      moduleNameMapper: {
        "^.+\\.(jpg|jpeg|png|svg)$": "<rootDir>/fileMock.js",
        "^.+\\.(css|scss)$": "identity-obj-proxy",
        ...docusaurusConfig.moduleNameMapper,
      },
      globals: {
        "ts-jest": {
          isolatedModules: true,
        },
      },
      transformIgnorePatterns: [".yarn/__virtual__/(?!@docusaurus.*)"],
    };
  };
};

export default async (): Promise<Config.InitialOptions> => {
  const createProjectConfig = await prepareProjectConfig();

  return {
    projects: [
      createProjectConfig("jest-docusaurus"),
      createProjectConfig("docusaurus-plugin-stored-data"),
    ],
  };
};
