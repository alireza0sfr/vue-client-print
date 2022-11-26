<template>
	<div class="Demo">
		<!-- Test Section -->
		<a @click="printPreview()" id="printModalOpenBtn" href="#" :title="_$t('print.print-preview')">{{_$t('print.print-preview')}}</a>
		|
		<a @click="templateBuilder()" href="#" :title="_$t('template-builder.name')">{{ _$t('template-builder.name') }}</a>

		<VCP ref="vcp" :options="printOptions" :dataSets="dataSets" :bindingObject="bindingObject" :variables="variables" :configurations="configs">
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
		</VCP>
	</div>
</template>

<script>
	import VCP from '~/components/VueClientPrint.vue'
	export default {
		name: "DemoHome",
		components: {
			VCP,
		},
		data() {
			return {
				dataSets: {
					center: {
						key: 'center',
						title: 'شناور',
						columns: [
							{
								title: 'center',
								key: 'center',
								styles: {
									width: '70px',
								},
							},
							{
								title: 'account',
								key: 'account',
								styles: {
									width: '50px',
								},
								columns: [
									{
										title: 'column child 1',
										key: 'center',
										styles: {
											width: '70px',
										},
									},
									{
										title: 'column child 2',
										key: 'account',
										styles: {
											width: '50px',
										}
									},
									{
										title: 'column child 3',
										key: 'date',
										styles: {
											width: '50px',
										}
									},
									{
										title: 'column child 4',
										key: 'balance',
										styles: {
											width: '50px',
										}
									},
									{
										title: 'column child 5',
										key: 'type',
										styles: {
											width: '50px',
										}
									},
								]
							},
							{
								title: 'date',
								key: 'date',
								styles: {
									width: '50px',
								},
							},
							{
								title: 'balance',
								key: 'balance',
								styles: {
									width: '40px',
								},
							},
							{
								title: 'type',
								key: 'type',
								styles: {
									width: '90px',
								},
							},
						],
						rows: [
							{
								center: 'center 1',
								account: [
									{
										center: 'child center',
										account: 'child account',
										date: 'child date',
										balance: 'child balance',
										type: 'child type',
									},
									{
										center: 'child center',
										account: 'child account',
										date: 'child date',
										balance: 'child balance',
										type: 'child type',
									},
									{
										center: 'child center',
										account: 'child account',
										date: 'child date',
										balance: 'child balance',
										type: 'child type',
									}
								],
								date: 'date 1',
								balance: 'balance 1',
								type: 'type 1',
							},
							{
								center: 'center 2',
								account: [
									{
										center: 'child center 2',
										account: 'child account 2',
										date: 'child date 2',
										balance: 'child balance 2',
										type: 'child type 2',
									}
								],
								date: 'date 2',
								balance: 'حسابهای دریافتنی نجاری بانکهای ارزی بانک سامان',
								type: 'type 2',
							},
							{
								center: 'center 3',
								account: [
									{
										center: 'child center 3',
										account: 'child account 3',
										date: 'child date 3',
										balance: 'child balance 3',
										type: 'child type 4',
									}
								],
								date: 'date 3',
								balance: 'balance 3',
								type: 'type 3',
							},
							{
								center: 'center 4',
								account: [
									{
										center: 'child center 4',
										account: 'child account 4',
										date: 'child date 4',
										balance: 'child balance 4',
										type: 'child type 4',
									}
								],
								date: 'date 4',
								balance: 'balance 4',
								type: 'type 4',
							},
							{
								center: 'center 5',
								account: [
									{
										center: 'child center 5',
										account: 'child account 5',
										date: 'child date 5',
										balance: 'child balance 5',
										type: 'child type 5',
									}
								],
								date: 'date 5',
								balance: 'balance 5',
								type: 'type 5',
							},
							{
								center: 'center 6',
								account: [
									{
										center: 'child center 6',
										account: 'child account 6',
										date: 'child date 6',
										balance: 'child balance 6',
										type: 'child type 6',
									}
								],
							}
						],
					},
					account: {
						key: 'account',
						title: 'حساب',
						columns: [
							{
								title: 'center',
								key: 'center',
								styles: {
									width: '70px',
								},
							},
							{
								title: 'account',
								key: 'account',
								styles: {
									width: '50px',
								}
							},
							{
								title: 'balance',
								key: 'balance',
								styles: {
									width: '40px',
								},
							},
							{
								title: 'type',
								key: 'type',
								styles: {
									width: '90px',
								},
							},
						],
						rows: [
							{
								center: 'center 1',
								account: 'account 1',
								date: 'date 1',
								balance: 'balance 1',
								type: 'type 1',
							},
						],
					}
				},
				printOptions: {},
				bindingObject: {
					name: 'nikan',
					date: "2021/5/6",
				},
				variables: [],
				configs: {
					language: 'en'
				}
			}
		},
		methods: {
			templateBuilder() {
				this.$refs.vcp.displayTemplateBuilder((json) => {
					this.printOptions = json
				})
			},
			printPreview() {
				this.$refs.vcp.displayPrintPreview()
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
