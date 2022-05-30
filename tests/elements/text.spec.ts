import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextElement from '~/components/elements/TextElement.vue'

describe('TextElement', () => {

  const options = {
    id: 'test-id',
    configs: {
      text: 'test-text'
    }
  }

  const wrapper = mount(TextElement, {
    props: {
      options: options
    },
    data() {
      return {
        locals: {
          classType: 'textelement'
        }
      }
    },
  })

  const element = wrapper.find(`[data-testid="${options.id}"]`)

  it('Renders', () => {

    // element existsance
    expect(element.exists())

    // checks element;s classes
    expect(element.classes()).toContain('textelement')
    expect(element.classes()).toContain('content-wrapper')
    expect(element.classes()).toContain('element')

    // checks element's id
    expect(element.attributes('id')).toBe(options.id)

    // checks element's initial text
    expect(element.get('[class="content"]').text()).toBe(options.configs.text)

    // element has resizers
    expect(element.get(`[query="textelement-${options.id}"]`)).exist
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

  it('Settings Works', async () => {

    await wrapper.setData({
      settings: {
        configs: {
          text: 'a'
        }
      }
    })

    expect(element.get('[class="content"]').text()).toBe('a')
  })
})