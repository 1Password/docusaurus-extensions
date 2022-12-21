// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const { resolve } = require("path");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Docusaurus Extensions",
  tagline: "Plugin testing grounds",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "1password",
  projectName: "docusaurus-plugins",

  plugins: [
    [
      "@1password/docusaurus-plugin-stored-data",
      /** @type {import('@1password/docusaurus-plugin-stored-data').Options} */
      ({
        data: {
          "op-dev-blog":
            "https://blog.1password.com/categories/developers/index.xml",
          "arboard-get-image":
            "https://raw.githubusercontent.com/1Password/arboard/master/examples/get_image.rs",
          "op-repos": resolve(__dirname, "static", "repos.json"),
        },
      }),
    ],
  ],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-RV65G9RMHG",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Docusaurus Extensions",
        logo: {
          alt: "Docusaurus Extensions Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            href: "https://1password.statuspage.io",
            className: "statuspage-mount",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} 1Password. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["rust"],
      },
    }),
};

module.exports = config;
