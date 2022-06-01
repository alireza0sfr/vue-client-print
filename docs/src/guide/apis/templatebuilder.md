# Template Builder

Template Builder method will trigger Template Builder modal to popup

```ts
function templateBuilder(printOptions: object, callback: function);
```

## Print Options

```ts
printOptions: object = {
  header: {
    isHeaderRepeatable: boolean, // detemines whether header repeats on every print page | defualt: true
    height: number, // header height in inches | defualt: 1
    headerElements: object[], // array of header elements | defualt: []
  },
  beforeBody: {
    height: number, // before body height in inches | defualt: 1
    beforeBodyElements: object[], // array of before body elements | defualt: []
  },
  body: {
    bodyElements: object[], // array of body elements | defualt: []
  },
  afterBody: {
    height: number, // after body height in inches | defualt: 1
    afterBodyElements: object[], // array of after body elements | defualt: []
  },
  footer: {
    isFooterRepeatable: boolean, // detemines whether footer repeats on every print page | defualt: true
    height: number, // footer height in inches | defualt: 1
    footerElements: object[] // array of footer elements | defualt: [],
  },
  defaultHeightOfPaper: number, // Height of the defualt paper in inches
  defaultWidthOfPaper: number, // Height of the defualt paper in inches
  designName: string, // Name of the design
  orientation: string, // orientation of the print | defualt: 'portrait'  | values: 'portrait' | 'landscape'
  pageSize: string, // size of the print page | defualt: 'a4'  | values: 'letter' | 'a3' | 'a4' | 'a5'
  pageDirections: string, // direction of the print page | defualt: 'rtl'  | values: 'rtl' | 'ltr'
  pageBorder: string, // border of the print page | defualt: ''  | values: css notation for border
},
```

## callback

Callback method gets triggered after Template Builder modal is saved and returns template for further use.
