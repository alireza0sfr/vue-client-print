<template>
	<div class="home">
		<!-- Test Section -->

		<a @click="printPreview()" id="printModalOpenBtn" href="#" :title="$t('print.print-preview')">{{$t('print.print-preview')}}</a>
		|
		<a @click="templateBuilder()" href="#" :title="$t('template-builder.name')">{{ $t('template-builder.name') }}</a>

		<Print ref="print" :bindingObject="bindingObject" :variables="variables" :configuration="configs">
			<template v-slot:printData>
				<table>
					<thead>
						<tr>
							<th>
								Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut,
								eius?
							</th>
							<th>
								Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut,
								eius?
							</th>
							<th>
								Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut,
								eius?
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="index in 50" :key="index">
							<td>{{ index }}</td>
							<td>{{ index }}</td>
							<td>{{ index }}</td>
						</tr>
					</tbody>
				</table>
			</template>
		</Print>
	</div>
</template>

<script>
	import Print from '~/components/Print.vue'
	export default {
		name: "Home",
		components: {
			Print,
		},
		data() {
			return {
				printOptions: {},
				bindingObject: {
					name: 'nikan',
					date: "2021/5/6",
				},
				variables: [],
				configs: {}
			}
		},
		methods: {
			templateBuilder() {
				this.$refs.print.templateBuilder({}, (json) => {
					console.log('json', json)
					this.printOptions = json
				})
			},
			printPreview() {
				this.$refs.print.printPreview(this.printOptions)
			},
		},
	};
</script>
<style scoped>
	table td,
	table th {
		border: 1px solid black;
	}
	table {
		width: 100%;
	}
</style>
