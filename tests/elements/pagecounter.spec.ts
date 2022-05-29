import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageCounter from '~/components/elements/PageCounter.vue'

describe('PageCounter Persian', () => {

  const options = {
    id: 'test-id'
  }

  const wrapper = mount(PageCounter, {
    props: {
      options: options
    },
    data() {
      return {
        locals: {
          classType: 'pagecounter'
        }
      }
    },
  })

  const element = wrapper.find(`[data-testid="${options.id}"]`)

  it('Renders', () => {

    // element existsance
    expect(element.exists())

    // checks element;s classes
    expect(element.classes()).toContain('pagecounter')
    expect(element.classes()).toContain('content-wrapper')
    expect(element.classes()).toContain('element')

    // checks element's id
    expect(element.attributes('id')).toBe(options.id)

    // checks element's initial text
    // expect(element.get('[class="content"]').text()).toBe(options.configs.text)

    // element has resizers
    expect(element.get(`[query="pagecounter-${options.id}"]`)).exist
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

    expect(element.get('[class="content"]').text()).toBe('صفحه ۱ از ۱')
    await wrapper.setData({
      settings: {
        configs: {
          completeForm: false
        }
      }
    })

    expect(element.get('[class="content"]').text()).toBe('۱')
  })
})

describe('PageCounter English', () => {

  const options = {
    id: 'test-id',
    configs: {
      persianNumbers: false,
    }
  }

  const wrapper = mount(PageCounter, {
    props: {
      options: options
    },
    data() {
      return {
        locals: {
          classType: 'pagecounter'
        }
      }
    },
  })

  const element = wrapper.find(`[data-testid="${options.id}"]`)

  it('Settings Works', async () => {

    expect(element.get('[class="content"]').text()).toBe('page 1 / 1')
    await wrapper.setData({
      settings: {
        configs: {
          completeForm: false
        }
      }
    })

    expect(element.get('[class="content"]').text()).toBe('1')
  })
})