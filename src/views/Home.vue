<template>
  <div class="home">

    <!-- Test Section -->
    
    <i @click="printPreview()" id="printModalOpenBtn" type="button" class="fas fa-2x fa-eye"></i>
    <i @click="templateBuilder()" class="fas fa-2x fa-cog"></i>

    <div></div>
    <Print ref="print" :options="printOptions" :bindingObject="bindingObject">
      <template v-slot:printData>
        <table>
          <thead>
            <tr>
              <th>ستون۱</th>
              <th>ستون۲</th>
              <th>ستون۳</th>
              <th>ستون۴</th>
              <th>ستون۵</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="index in 50" :key="index">
              <td>{{index}}</td>
              <td>{{index}}</td>
              <td>{{index}}</td>
              <td>{{index}}</td>
              <td>{{index}}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </Print>
  </div>
</template>

<script>
import Print from "../components/Print.vue";
export default {
  name: "Home",
  components: {
    Print,
  },
  data() {
    return {
      printOptions: {},
      bindingObject: {
        code: 646464,
        date: "2021/5/6",
      },
    };
  },
  methods: {
    templateBuilder() {
      this.$refs.print.templateBuilder({}, (json) => {
        this.printOptions = json;
      });
    },
    printPreview() {
      this.$refs.print.printPreview();
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
