// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

const config = {
  title: 'Tactiki',
  tagline: 'CPIT499 Development Documentation',
  favicon: 'img/favicon.svg',

  url: 'https://lina-m3.github.io',
  baseUrl: '/tactiki-docs/',

  organizationName: 'Lina-M3',
  projectName: 'tactiki-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'TACTIKI',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/Lina-M3/tactiki-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Tactiki · CPIT499 Graduation Project · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
  },
};

export default config;
