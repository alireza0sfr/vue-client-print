import { expect, it, describe } from 'vitest'
import * as methods from '~/plugins/element-utilities'

import { useBindingObjectStore } from '~/stores/binding-object'
import { useDataSetStore } from '~/stores/dataset'

describe('computeBindingObject', () => {

  // settings initial value for store
  const store = useBindingObjectStore()
  store.updateBindingObject({
    name: 'test'
  })

  it('Seprate Element', () => {

    var seprateElement = {
      type: "bindingobject",
      options: {
        id: "06bg1",
        parent: "body",
        grandParent: "TemplateBuilder",
        styles: {
          top: "84px",
          left: "454px",
          whiteSpace: "pre",
          width: "150px",
          direction: "rtl",
          height: "30px"
        },
        configs: {
          persianNumbers: false,
          field: ""
        },
        isChild: false
      }
    }

    var result = {
      name: 'test'
    }

    expect(methods.computeBindingObject(seprateElement)).toStrictEqual(result)

  })

  it('Child Element', () => {

    var settings = {
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
                selectedDataSet: "document",
                dataSets: {
                  document: {
                    options: {
                      id: "lo1s1",
                      configs: {
                        title: "سند 134",
                        key: "document_134",
                        columns: [
                          {
                            columns: [],
                            title: "کد حساب",
                            key: "acocuntCode",
                            isActive: true,
                            hasResizer: true,
                            type: "column",
                            options: {
                              id: "4zp1x",
                              styles: {
                                width: "70px"
                              }
                            }
                          },
                        ]
                      }
                    }
                  }
                },
                appendedElements: {
                  document: [
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
    var childElement = {
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

    var result = {
      name: 'test',
      'document_134-acocuntCode': []
    }

    expect(methods.computeBindingObject(childElement, settings)).toStrictEqual(result)
  })
})

describe('computeDataSets', () => {

  const datasets = {
    document_rows: {
      options: {
        id: "xttnu",
        configs: {
          columns: [
            {
              columns: [
                {
                  columns: [],
                  title: "کد شناور",
                  key: "centerCode",
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
              title: "کد حساب",
              key: "acocuntCode",
              isActive: true,
              hasResizer: true,
              type: "column",
              options: {
                id: "ktscd",
                styles: {
                  width: "70px"
                }
              }
            }
          ],
          rows: [],
          title: "ردیف های سند",
          key: "document_137"
        }
      }
    }
  }

  // settings initial value for store
  const store = useDataSetStore()
  store.updateDataSets(datasets)

  it('Seprate Element', () => {

    var seprateElement = {
      type: 'dataset',
      options: {
        grandParent: "TemplateBuilder",
        id: "80zo4",
        isChild: false,
        class: "",
        configs: {
          dataSets: datasets,
          selectedDataSet: "document_rows"
        },
        styles: {
          height: "100px !important",
          top: "42px !important",
          left: "17px !important",
          width: "740px !important"
        },
        parent: "body"
      }
    }

    expect(methods.computeDatasets(seprateElement)).toStrictEqual(datasets)

  })

  it('Child Element', () => {

    var settings = {
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
                selectedDataSet: "document_rows",
                dataSets: datasets,
                appendedElements: {
                  document: [
                    {
                      type: "dataset",
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
    var childElement = {
      type: "dataset",
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

    var result = {
      document_rows: {
        options: {
          id: 'xttnu',
          configs: {
            rows: [],
            title: 'ردیف های سند',
            key: 'document_137',
            columns: [
              {
                title: "کد حساب",
                key: "acocuntCode",
                isActive: true,
                hasResizer: true,
                type: "column",
                options: {
                  id: "ktscd",
                  styles: {
                    width: "70px"
                  }
                },
                columns: [
                  {
                    columns: [],
                    title: "کد شناور",
                    key: "centerCode",
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
              }
            ],
          }
        }
      },
      'document_137-acocuntCode': {
        options: {
          id: 'i2y14',
          configs: {
            title: 'document_137-acocuntCode',
            key: 'acocuntCode',
            rows: [],
            columns: [
              {
                columns: [],
                title: 'کد شناور',
                key: 'centerCode',
                isActive: true,
                hasResizer: false,
                type: 'column',
                options: {
                  id: '3ebpi',
                  styles: {
                    width: '70px'
                  }
                }
              }
            ]
          }
        }
      }
    }

    var methodResult: any = methods.computeDatasets(childElement, settings)
    
    // syncing generated id's with each other to ignore id's in test
    methodResult['document_137-acocuntCode'].options.id = result['document_137-acocuntCode'].options.id
    methodResult['document_137-acocuntCode'].options.configs.columns[0].options.id = result['document_137-acocuntCode'].options.configs.columns[0].options.id
    
    expect(methodResult).toStrictEqual(result)
  })
})

describe('Other Methods', () => {

  it('initElementStyles', () => {

    var styles = {
      fontSize: '16px',
      'color': 'red',
      display: 'flex !important',
      flexDirection: 'row!important'
    }

    var result = {
      fontSize: '16px !important',
      'color': 'red !important',
      display: 'flex !important',
      flexDirection: 'row!important'
    }

    expect(methods.initElementStyles(styles)).toStrictEqual(result)
  })

})