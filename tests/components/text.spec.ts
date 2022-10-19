import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateBuilder from '~/components/TemplateBuilder.vue'

const options = {
  header: {
    isHeaderRepeatable: true,
    height: 1,
    headerElements: [],
    styles: {},
  },
  beforeBody: {
    height: 1,
    beforeBodyElements: [],
    styles: {},
  },
  body: {
    bodyElements: [],
    styles: {},
  },
  afterBody: {
    height: 1,
    afterBodyElements: [],
    styles: {},
  },
  footer: {
    isFooterRepeatable: true,
    height: 1,
    footerElements: [],
    styles: {},
  },
  defaultHeightOfPaper: 11.7, // Standard Height of the chosen paper in inch
  defaultWidthOfPaper: 8.26, // Standard Width of the chosen paper in inch
  totalHeightOfAPaper: 10.4, // Useable height for body tag
  designName: '',
  orientation: 'portrait',
  pageSize: 'a4',
  pageDirections: 'rtl',
  dataSets: {},
  pageBorder: '',
}

const wrapper = mount(TemplateBuilder, {
  props: {
    options: options
  },
})

describe('TemplateBuilder Methods', () => {

  var vm = wrapper.vm

  it('convert2Pixels', () => {

    expect(vm.convert2Pixels(22)).toBe(2112)
    expect(vm.convert2Pixels(0.5)).toBe(48)
    expect(vm.convert2Pixels(NaN)).toBe(0)

  })

  it('convert2Inches', () => {

    expect(vm.convert2Inches(2112)).toBe(22)
    expect(vm.convert2Inches(48)).toBe(0.5)
    expect(vm.convert2Inches(NaN)).toBe(0)

  })

})