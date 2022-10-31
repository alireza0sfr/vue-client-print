// elements
import TextElement from '~/components/elements/TextElement.vue'
import Variable from '~/components/elements/Variable.vue'
import DateTime from '~/components/elements/DateTime.vue'
import BindingObject from '~/components/elements/BindingObject.vue'
import PageCounter from '~/components/elements/PageCounter.vue'
import ImageElement from '~/components/elements/ImageElement.vue'
import TextPattern from '~/components/elements/TextPattern.vue'
import DataSet from '~/components/elements/DataSet/DataSet.vue'
import Repeator from '~/components/elements/Repeator.vue'
import Column from '~/components/elements/DataSet/Column.vue'
import Row from '~/components/elements/DataSet/Row.vue'

// general
import Print from '~/components/Print.vue'
import TemplateBuilder from '~/components/TemplateBuilder.vue'
import Resizers from '~/components/elements/Resizers.vue'
import SectionTag from '~/components/SectionTag.vue'
import Toggler from '~/components/Toggler.vue'

import { ElementTypes } from '~/enums/element'

export default function componentRegisterer(App: any): void {

  // elements
  App.component(ElementTypes.TEXTELEMENT, TextElement)
  App.component(ElementTypes.VARIABLE, Variable)
  App.component(ElementTypes.DATETIME, DateTime)
  App.component(ElementTypes.BINDINGOBJECT, BindingObject)
  App.component(ElementTypes.PAGECOUNTER, PageCounter)
  App.component(ElementTypes.IMAGEELEMENT, ImageElement)
  App.component(ElementTypes.TEXTPATTERN, TextPattern)
  App.component(ElementTypes.REPEATOR, Repeator)
  App.component(ElementTypes.DATASET, DataSet)
  App.component(ElementTypes.COLUMN, Column)
  App.component(ElementTypes.ROW, Row)

  // general
  App.component('Print', Print)
  App.component('TemplateBuilder', TemplateBuilder)
  App.component('Resizers', Resizers)
  App.component('SectionTag', SectionTag)
  App.component('Toggler', Toggler)
}