<template>
	<Print ref="print" :bindingObject="printBindingObject" :variables="printVariables">
		<template v-slot:printData>
			<!--<div v-html="printDataHtml"></div>-->
			<table style="width: 100%" class="table-test">
				<thead>
					<tr>
						<th style="border:1px solid #444; padding: 5px; background-color:#ccc">ردیف</th>
						<th style="border:1px solid #444; padding: 5px; background-color:#ccc">حساب</th>
						<th style="border:1px solid #444; padding: 5px; background-color:#ccc">شناور ۱</th>
						<th style="border:1px solid #444; padding: 5px; background-color:#ccc">شناور ۲</th>
						<th style="border:1px solid #444; padding: 5px; background-color:#ccc">شناور ۳</th>
						<th style="border:1px solid #444; padding: 5px; background-color:#ccc">شرح</th>
						<th style="border:1px solid #444; padding: 5px; background-color:#ccc">بدهکار</th>
						<th style="border:1px solid #444; padding: 5px; background-color:#ccc">بستانکار</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td style="border:1px solid #444; padding: 5px;">۱</td>
						<td style="border:1px solid #444; padding: 5px;">صندوق ریالی</td>
						<td style="border:1px solid #444; padding: 5px;">رحمان محمدی</td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;">شرح سند ردیف ‍۱</td>
						<td style="border:1px solid #444; padding: 5px;">۱۵,۰۰۰,۰۰۰</td>
						<td style="border:1px solid #444; padding: 5px;">۰</td>
					</tr>
					<tr>
						<td style="border:1px solid #444; padding: 5px;">۱</td>
						<td style="border:1px solid #444; padding: 5px;">بانک</td>
						<td style="border:1px solid #444; padding: 5px;">رحمان محمدی</td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;">شرح سند ردیف ‍۲</td>
						<td style="border:1px solid #444; padding: 5px;">۰</td>
						<td style="border:1px solid #444; padding: 5px;">۱۵,۰۰۰,۰۰۰</td>
					</tr>
					<tr>
						<td style="border:1px solid #444; padding: 5px;">۱</td>
						<td style="border:1px solid #444; padding: 5px;">بانک</td>
						<td style="border:1px solid #444; padding: 5px;">رحمان محمدی</td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;">شرح سند ردیف ‍۲</td>
						<td style="border:1px solid #444; padding: 5px;">۰</td>
						<td style="border:1px solid #444; padding: 5px;">۱۵,۰۰۰,۰۰۰</td>
					</tr>
					<tr>
						<td style="border:1px solid #444; padding: 5px;">۱</td>
						<td style="border:1px solid #444; padding: 5px;">بانک</td>
						<td style="border:1px solid #444; padding: 5px;">رحمان محمدی</td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;">شرح سند ردیف ‍۲</td>
						<td style="border:1px solid #444; padding: 5px;">۰</td>
						<td style="border:1px solid #444; padding: 5px;">۱۵,۰۰۰,۰۰۰</td>
					</tr>
					<tr>
						<td style="border:1px solid #444; padding: 5px;">۱</td>
						<td style="border:1px solid #444; padding: 5px;">بانک</td>
						<td style="border:1px solid #444; padding: 5px;">رحمان محمدی</td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;"></td>
						<td style="border:1px solid #444; padding: 5px;">شرح سند ردیف ‍۲</td>
						<td style="border:1px solid #444; padding: 5px;">۰</td>
						<td style="border:1px solid #444; padding: 5px;">۱۵,۰۰۰,۰۰۰</td>
					</tr>
				</tbody>

			</table>
		</template>
	</Print>
</template>

<script>
	import Print from '~/components/Print.vue'
	export default {
		components: {
			Print
		}
	}
</script>

<style>
</style>