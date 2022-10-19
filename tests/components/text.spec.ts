import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextElement from '~/components/TemplateBuilder.vue'

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
  })


  it('Renders', () => {

    
  })