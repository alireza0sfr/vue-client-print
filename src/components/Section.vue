<template>
	<div @click="(e) => $emit('clickedOnSection', section, e)" :style="[{height: height + 'in' }, styles]" :id="`${section}Template`" :class="[section, ' section']"
		@drop="(e) => $emit('droppedElement', section, e)" @dragenter.prevent @dragover.prevent>
		<component v-for="element in elements" :key="element.id" @drop="(e) => $emit('droppedElement', element.type, element, e)" @dragenter.prevent @dragover.prevent :is="element.type" :instance="element"
			@clickedOnElement="(child) => $emit('clickedOnElement', child ? child : element)" @finished-editing-element="$emit('finishedEditingElement', element, section)" />
		<SectionTag :active="active" :tag="section" />
	</div>
</template>

<script lang="ts">
	import { IElement } from '~/interfaces/elements'
	import { TemplateBuilderSections } from '~/enums/general'
	import { ElementParents } from '~/enums/element'
	import { defineComponent } from 'vue'
	export default defineComponent({
		emits: ['clickedOnSection', 'droppedElement', 'finishedEditingElement', 'clickedOnElement'],
		props: {
			elements: {
				type: Array as () => IElement[],
				required: true
			},
			section: {
				type: String as () => TemplateBuilderSections,
				required: true,
				validator(value: TemplateBuilderSections): boolean {
					var enumKeys = Object.values(TemplateBuilderSections)
					return enumKeys.includes(value)
				}
			},
			active: {
				type: Boolean,
				required: true
			},
			height: {
				type: Number,
			},
			styles: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				sectionParents: ElementParents,
			}
		},
	})
</script>

<style>
</style>