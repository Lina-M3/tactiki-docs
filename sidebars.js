/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '1. Backend Foundation',
      collapsed: false,
      items: [
        'project-setup',
        'project-structure',
        'database-models',
      ],
    },
    {
      type: 'category',
      label: '2. Authentication',
      collapsed: false,
      items: [
        'authentication',
        'jwt-setup',
        'request-flow',
        'testing-swagger',
      ],
    },
    {
      type: 'category',
      label: '3. Teams & Players',
      collapsed: false,
      items: [
        'team-api',
        'player-api',
        'player-progress',
      ],
    },
    {
      type: 'category',
      label: '4. Quick Reference',
      collapsed: false,
      items: [
        'commands-cheatsheet',
        'errors-fixes',
      ],
    },
    {
      type: 'category',
      label: '5. Project Notebook',
      collapsed: false,
      items: [
        'docs-site',
        'progress-log',
        'defense-questions',
        'next-steps',
      ],
    },
  ],
};

export default sidebars;
