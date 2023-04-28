import { defineConfig } from 'vitepress'

const BaseGuidePath = '/guide/'
const BaseURL = '/vue-client-print/'

export default defineConfig({
  base: BaseURL,
  title: "VCP - Vue Client Print",
  description: "Frontend printing dynamic data made easy!",
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: BaseGuidePath, },
      { text: 'Props', link: '/props/' },
      { text: 'API', link: '/apis/' },
      { text: 'Interfaces', link: '/interfaces/' },
      // { text: 'Playground', link: '/playground/' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-present Alireza Safari'
    },
    sidebar: [
      {
        text: 'Getting Started',
        link: BaseGuidePath,
        collapsed: true,
        items: [
          { text: 'Installation', link: `${BaseGuidePath}getting-started/installation` },
          { text: 'Usage', link: `${BaseGuidePath}getting-started/usage` }
        ]
      },
      {
        text: 'Internal Methods',
        link: `${BaseGuidePath}internal-methods/introduction`,
        collapsed: true,
        items: [
          { text: 'Template Builder', link: `${BaseGuidePath}internal-methods/templatebuilder` },
          { text: 'Print Preview', link: `${BaseGuidePath}internal-methods/printpreview` }
        ]
      },
      {
        text: 'Elements',
        link: `${BaseGuidePath}elements/introduction`,
        collapsed: true,
        items: [
          { text: 'Text', link: `${BaseGuidePath}elements/text` },
          { text: 'Datetime', link: `${BaseGuidePath}elements/datetime` },
          { text: 'Page Counter', link: `${BaseGuidePath}elements/pagecounter` },
          { text: 'Image', link: `${BaseGuidePath}elements/image` },
          { text: 'Binding Object', link: `${BaseGuidePath}elements/bindingobject` },
          { text: 'Text Pattern', link: `${BaseGuidePath}elements/textpattern` },
          { text: 'Dateset', link: `${BaseGuidePath}elements/dataset` },
        ]
      },
      {
        text: 'Variables',
        link: `${BaseGuidePath}/variables/introduction`,
      },
      {
        text: 'Tabs & Sections',
        collapsed: true,
        items: [
          { text: 'Tabs', link: `${BaseGuidePath}tabs/tabs` },
          { text: 'Sections', link: `${BaseGuidePath}tabs/sections` },
        ]
      },
      {
        text: 'Slots & Events',
        collapsed: true,
        items: [
          { text: 'Slots', link: `${BaseGuidePath}slots/slots` },
          { text: 'Events', link: `${BaseGuidePath}slots/events` },
        ]
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/alireza0sfr/vue-client-print' }
    ]
  }
})
