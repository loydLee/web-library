# vue3.x

## 多个 v-model

3.x 支持同一组件上绑定多个 v-model,每个 v-model 将同步到不同的 prop，而不需要在组建中添加额外的选项

```html
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```

```js
app.component("user-name", {
  props: {
    firstName: String,
    lastName: String,
  },
  emits: ["update:firstName", "update:lastName"],
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `,
});
```
