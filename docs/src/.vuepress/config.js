const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'VCP - Vue Client Print',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  // base: '/<vue-client-print>/',
  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'Props',
        link: '/props/'
      },
      {
        text: 'API',
        link: '/apis/'
      },
      // {
      //   text: 'Playground',
      //   link: '/playground/'
      // },
      {
        text: 'GitHub',
        link: 'https://github.com/alireza0sfr/vue-client-print'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Getting Started',
          collapsable: false,
          children: [
            '',
            'getting-started/installation',
            'getting-started/usage'
          ]
        },
        {
          title: 'Internal Methods',
          collapsable: false,
          children: [
            'internal-methods/introduction',
            'internal-methods/templatebuilder',
            'internal-methods/printpreview',
          ]
        },
        {
          title: 'Elements',
          collapsable: true,
          children: [
            'elements/introduction',
            'elements/text',
            'elements/datetime',
            'elements/pagecounter',
            'elements/image',
            'elements/bindingobject',
            'elements/textpattern',
            'elements/dataset',
            'elements/repeator',
          ]
        },
        {
          title: 'Variables',
          collapsable: false,
          children: [
            'variables/introduction',
          ]
        },
        {
          title: 'Tabs & Sections',
          collapsable: false,
          children: [
            'tabs/tabs',
            'tabs/sections',
          ]
        },
        {
          title: 'Slot & Events',
          collapsable: false,
          children: [
            'slots/slots',
            'slots/events'
          ]
        },
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
