<template>
  <div class="home">
    <div>
    </div>
    <Print :options="{}">
      <template v-slot:printData>
        <table>
          <thead>
            <tr>
              <th>
                ستون۱
              </th>
              <th>
                ستون۲
              </th>
              <th>
                ستون۳
              </th>
              <th>
                ستون۴
              </th>
              <th>
                ستون۵
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="index in 50" :key="index">
              <td>
                {{index}}
              </td>
              <td>
                {{index}}
              </td>
              <td>
                {{index}}
              </td>
              <td>
                {{index}}
              </td>
              <td>
                {{index}}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </Print>
  </div>
</template>

<script>
import Print from '../components/Print.vue'
export default {
  name: 'Home',
  components: {
    Print
  }
}
</script>
<style scoped>
  table td, table th {
    border: 1px solid black;
  }
  table {
    width: 100%;
  }
</style>
