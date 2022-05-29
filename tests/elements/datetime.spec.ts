import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DateTime from '~/components/elements/DateTime.vue'

// @ts-ignore
import mixins from '../../src/plugins/mixins.ts'

var date = new Date()
var dd = String(date.getDate()).padStart(2, "0")
var mm = String(date.getMonth() + 1).padStart(2, "0") //January is 0!
var yyyy = date.getFullYear()

var dateNow = yyyy + "/" + dd + "/" + mm
var timeNow = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

var dateNowGregorian = new Date().toLocaleDateString("fa-IR")
var timeNowPersianDigits = mixins.methods.toPersianDigits(timeNow)

describe('DateTime Gregorian', () => {

  const options = {
    id: 'test-id',
    configs: {
      persianDate: false
    }
  }

  const wrapper = mount(DateTime, {
    props: {
      options: options
    },
    data() {
      return {
        locals: {
          classType: 'datetime'
        }
      }
    },
  })

  const element = wrapper.find(`[data-testid="${options.id}"]`)

  it('Renders', () => {

    // element existsance
    expect(element.exists())

    // checks element;s classes
    expect(element.classes()).toContain('datetime')
    expect(element.classes()).toContain('content-wrapper')
    expect(element.classes()).toContain('element')

    // checks element's id
    expect(element.attributes('id')).toBe(options.id)

    var defaultVal = dateNow + ' ' + timeNow

    // checks element's initial text
    expect(element.get('[class="content"]').text()).toBe(defaultVal)

    // element has resizers
    expect(element.get(`[query="datetime-${options.id}"]`)).exist
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

    // display time only
    await wrapper.setData({
      settings: {
        configs: {
          hasDate: false,
          hasTime: true,
        }
      }
    })

    expect(element.get('[class="content"]').text()).toBe(timeNow)

    // display date only
    await wrapper.setData({
      settings: {
        configs: {
          hasTime: false,
          hasDate: true
        }
      }
    })

    expect(element.get('[class="content"]').text()).toBe(dateNow)

  })
})

describe('DateTime Solar Hijri', () => {

  const options = {
    id: 'test-id',
    configs: {
      persianDate: true
    }
  }

  const wrapper = mount(DateTime, {
    props: {
      options: options
    },
    data() {
      return {
        locals: {
          classType: 'datetime'
        }
      }
    },
  })

  const element = wrapper.find(`[data-testid="${options.id}"]`)

  it('Settings Works', async () => {

    // display both
    expect(element.get('[class="content"]').text()).toBe(dateNowGregorian + ' ' + timeNowPersianDigits)

    // display time only
    await wrapper.setData({
      settings: {
        configs: {
          hasDate: false,
          hasTime: true,
        }
      }
    })

    expect(element.get('[class="content"]').text()).toBe(timeNowPersianDigits)

    // display date only
    await wrapper.setData({
      settings: {
        configs: {
          hasTime: false,
          hasDate: true
        }
      }
    })

    expect(element.get('[class="content"]').text()).toBe(dateNowGregorian)

  })

})