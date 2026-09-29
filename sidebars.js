/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Backend Foundation',
      items: ['project-setup', 'project-structure', 'database-models'],
    },
    {
      type: 'category',
      label: 'Authentication',
      items: ['authentication'],
    },
    {
      type: 'category',
      label: 'Development Record',
      items: ['errors-fixes', 'progress-log'],
    },
  ],
};

export default sidebars;
