import { expect, it, describe } from 'vitest'
import * as methods from '~/plugins/element-utilities'

import { useBindingObjectStore } from '~/stores/binding-object'

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