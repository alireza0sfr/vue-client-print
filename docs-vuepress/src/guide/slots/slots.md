# Slots

Print Body can be rendered by a static html given in slot with name of 'printData'

```html
<Print ref="print" :dataSets="dataSets" :bindingObject="bindingObject" :variables="variables" :configurations="configs">
  <template v-slot:printData>
    <table>
      <thead>
        <tr>
          <th>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, eius?</th>
          <th>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, eius?</th>
          <th>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut, eius?</th>
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
```
