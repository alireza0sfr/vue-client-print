// import { classType } from '@/interfaces/elements'

export const DEFAULTID = 'test1'

// export const seprateElementGenerator = (type: classType, parent: string = 'body') => {
//   return {
//     type: type,
//     options: {
//       id: DEFAULTID,
//       parent: parent,
//       grandParent: "TemplateBuilder",
//       styles: {
//         top: "84px",
//         left: "454px",
//         whiteSpace: "pre",
//         width: "150px",
//         direction: "rtl",
//         height: "30px"
//       },
//       configs: {
//         persianNumbers: false,
//         field: ""
//       },
//       isChild: false
//     }
//   }
// }

export const datasets = {
  testDataset: {
    options: {
      id: "xttnu",
      configs: {
        columns: [
          {
            columns: [
              {
                columns: [],
                title: "child column",
                key: "childColumn",
                isActive: true,
                hasResizer: true,
                type: "column",
                options: {
                  id: "ktsc3",
                  styles: {
                    width: "70px"
                  }
                }
              }
            ],
            title: "column",
            key: "column",
            isActive: true,
            hasResizer: true,
            type: "column",
            options: {
              id: "ktscd",
              styles: {
                width: "70px"
              }
            }
          },
          {
            columns: [],
            title: "column 2",
            key: "column_2",
            isActive: true,
            hasResizer: true,
            type: "column",
            options: {
              id: "ktsc3",
              styles: {
                width: "70px"
              }
            }
          }
        ],
        rows: [],
        title: "test dataset",
        key: "test_dataset"
      }
    }
  }
}

export var defaultSettings = {
  body: {
    elements: [
      {
        type: "repeator",
        options: {
          id: "ymrl7",
          parent: "body",
          grandParent: "TemplateBuilder",
          styles: {
            top: "289px",
            left: "135px",
            width: "600px",
            height: "139px"
          },
          configs: {
            selectedDataSet: "testDataset",
            dataSets: datasets,
            appendedElements: {
              testDataset: [
                {
                  type: "bindingobject",
                  options: {
                    id: "xdfg3",
                    parent: "body",
                    grandParent: "TemplateBuilder",
                    styles: {
                      top: "54px",
                      left: "328px",
                      whiteSpace: "pre",
                      width: "150px",
                      direction: "rtl"
                    },
                    configs: {
                      persianNumbers: false,
                      field: ""
                    },
                    isChild: true,
                    repeatorId: "ymrl7"
                  }
                }
              ]
            }
          }
        }
      }
    ]
  }
}

export const bindingObject = {
  name: 'test'
}