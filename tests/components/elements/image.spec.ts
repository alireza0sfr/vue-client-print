import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageElement from '~/components/elements/ImageElement.vue'
// @ts-ignore
import DefaultLogo from '../../src/assets/images/logo.png'

describe('ImageElement', () => {

  const options = {
    id: 'test-id',
    configs: {
      imageSrc: DefaultLogo
    }
  }

  const wrapper = mount(ImageElement, {
    props: {
      options: options
    },
    data() {
      return {
        locals: {
          classType: 'imageelement'
        }
      }
    },
  })

  const element = wrapper.find(`[data-testid="${options.id}"]`)

  it('Renders', () => {

    // element existsance
    expect(element.exists())

    // checks element;s classes
    expect(element.classes()).toContain('imageelement')
    expect(element.classes()).toContain('element')

    // checks element's id
    expect(element.attributes('id')).toBe(options.id)

    // check element's intial value
    expect(element.get(`[src="${DefaultLogo}"]`)).exist

    // element has resizers
    expect(element.get(`[query="imageelement-${options.id}"]`)).exist
  })

  it('Styles Works', async () => {

    await wrapper.setData({
      settings: {
        styles: {
          textAlign: 'left',
          alignItems: 'bottom',
          color: 'blue',
          backgroundColor: 'red',
          fontSize: '20px',
          fontWeight: 'bold',
          border: '1px solid black',
          direction: 'ltr'
        }
      }
    })

    expect(element.attributes('style')).toBe('text-align: left; align-items: bottom; color: blue; background-color: red; font-size: 20px; font-weight: bold; border: 1px solid black; direction: ltr;')
  })
})