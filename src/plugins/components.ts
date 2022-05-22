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
import TemplateBuilder from '~/components/TemplateBuilder.vue'
import Resizers from '~/components/elements/Resizers.vue'
import SectionTag from '~/components/SectionTag.vue'

export default function componentRegisterer(App: any): void {

  // elements
  App.component('textelement', TextElement)
  App.component('variable', Variable)
  App.component('datetime', DateTime)
  App.component('bindingobject', BindingObject)
  App.component('pagecounter', PageCounter)
  App.component('imageelement', ImageElement)
  App.component('textpattern', TextPattern)
  App.component('repeator', Repeator)
  App.component('dataset', DataSet)
  App.component('Column', Column)
  App.component('Row', Row)

  // general
  App.component('TemplateBuilder', TemplateBuilder)
  App.component('Resizers', Resizers)
  App.component('SectionTag', SectionTag)
}