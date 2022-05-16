<template>
	<div class="home">
		<!-- Test Section -->
		<button @click="test1">Update Rows</button>
		<a @click="printPreview()" id="printModalOpenBtn" href="#" :title="$t('print.print-preview')">{{$t('print.print-preview')}}</a>
		|
		<a @click="templateBuilder()" href="#" :title="$t('template-builder.name')">{{ $t('template-builder.name') }}</a>

		<Print ref="print" :dataSets="dataSets" :bindingObject="bindingObject" :variables="variables" :configuration="configs">
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
				dataSets: {
					center: {
						key: 'center',
						title: 'شناور',
						columns: [
							{
								title: 'column 1',
								key: 'center',
								options: {
									styles: {
										width: '70px',
									},
								},
							},
							{
								title: 'column 2',
								key: 'account',
								options: {
									styles: {
										width: '50px',
									}
								},
								columns: [
									{
										title: 'column child 1',
										key: 'ccenter',
										options: {
											styles: {
												width: '70px',
											},
										}
									},
									{
										title: 'column child 2',
										key: 'caccount',
										options: {
											styles: {
												width: '50px',
											}
										}
									},
									{
										title: 'column child 3',
										key: 'cdate',
										options: {
											styles: {
												width: '50px',
											}
										}
									},
									{
										title: 'column child 4',
										key: 'cbalance',
										options: {
											styles: {
												width: '50px',
											}
										}
									},
									{
										title: 'column child 5',
										key: 'ctype',
										options: {
											styles: {
												width: '50px',
											}
										}
									},
								]
							},
							{
								title: 'column 3',
								key: 'date',
								options: {
									styles: {
										width: '50px',
									},
								}
							},
							{
								title: 'column 4',
								key: 'balance',
								options: {
									styles: {
										width: '40px',
									},
								}
							},
							{
								title: 'column 5',
								key: 'type',
								options: {
									styles: {
										width: '90px',
									},
								}
							},
						],
						rows: []
					},
					account: {
						key: 'account',
						title: 'حساب',
						columns: [
							{
								title: 'column 1',
								key: 'center',
								options: {
									styles: {
										width: '70px',
									},
								}
							},
							{
								title: 'column 2',
								key: 'account',
								options: {
									styles: {
										width: '50px',
									}
								}
							},
							{
								title: 'column 4',
								key: 'balance',
								options: {
									styles: {
										width: '40px',
									},
								}
							},
							{
								title: 'column 5',
								key: 'type',
								options: {
									styles: {
										width: '90px',
									},
								}
							},
						],
						rows: [],
					}
				},
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
			test1() {
				this.dataSets['center'].rows = this.rows
			},
			templateBuilder() {
				this.$refs.print.templateBuilder(this.printOptions, (json) => {
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
