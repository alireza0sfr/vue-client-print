import { expect, it, describe } from 'vitest'
import * as methods from '~/plugins/element-utilities'
import { defaultSettings, datasets, bindingObject, repeatorElement, REPEATORID } from '../utils'

import { useBindingObjectStore } from '~/stores/binding-object'
import { useDataSetStore } from '~/stores/dataset'

import { getDisplaySetModes } from '~/enums/general'

import { IElement } from '@/interfaces/elements'

var bindingObjectElement: IElement = {
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

var dataSetElement: IElement = {
  type: 'dataset',
  options: {
    grandParent: "TemplateBuilder",
    id: "80zo4",
    isChild: false,
    configs: {
      dataSets: datasets,
      selectedDataSet: "testDataset"
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

describe('computeBindingObject', () => {

  // settings initial value for store
  const store = useBindingObjectStore()
  store.updateBindingObject(bindingObject)

  it('Seprate Element', () => {

    expect(methods.computeBindingObject(bindingObjectElement)).toStrictEqual(bindingObject)

  })

  it('Child Element', () => {

    var childElement = { ...bindingObjectElement }
    childElement.options.isChild = true
    childElement.options.repeatorId = REPEATORID

    var result = {
      ...bindingObject,
      'test_dataset-column_2': []
    }

    expect(methods.computeBindingObject(childElement, defaultSettings)).toStrictEqual(result)
  })
})

describe('computeDataSets', () => {

  // settings initial value for store
  const store = useDataSetStore()
  store.updateDataSets(datasets)

  it('Seprate Element', () => {

    expect(methods.computeDatasets(dataSetElement)).toStrictEqual(datasets)

  })

  it('Child Element', () => {

    var childElement = { ...dataSetElement }
    childElement.options.isChild = true
    childElement.options.repeatorId = REPEATORID

    var result = {
      ...datasets,
      'test_dataset-column': {
        options: {
          id: 'i2y14',
          configs: {
            title: 'test_dataset-column',
            key: 'column',
            rows: [],
            columns: [
              {
                columns: [],
                title: 'child column',
                key: 'childColumn',
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

    var methodResult: any = methods.computeDatasets(childElement, defaultSettings)

    // syncing generated id's with each other to ignore id's in test
    methodResult['test_dataset-column'].options.id = result['test_dataset-column'].options.id
    methodResult['test_dataset-column'].options.configs.columns[0].options.id = result['test_dataset-column'].options.configs.columns[0].options.id

    expect(methodResult).toStrictEqual(result)
  })
})

describe('Get Display Set', () => {

  var selectedElement = { ...dataSetElement }
  selectedElement.options.repeatorId = REPEATORID


  it('Template Builder Mode', () => expect(methods.getDisplaySet(selectedElement, defaultSettings, getDisplaySetModes.TEMPLATEBUILDER)).toStrictEqual(datasets['testDataset']))

  it('Repeator Mode', () => expect(methods.getDisplaySet(selectedElement, repeatorElement.options, getDisplaySetModes.REPEATOR)).toStrictEqual(datasets['testDataset']))

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