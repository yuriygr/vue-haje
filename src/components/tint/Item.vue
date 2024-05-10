<template>
  <div :class="elClass" @click="onClick">
    {{ data.code }}
  </div>
</template>

<script>
export default {
  name: 'tint-item',
  components: { },
  props: {
    data: false,
    selected: false
  },
  emits: [ 'click' ],
  data() {
    return { }
  },
  computed: {
    elClass() {
      return [
        'tint-item',
        'tint-item--code-' + this.data.code,
        'tint-item--type-' + this.data.type,
        {
          'tint-item--selected': this.selected
        }
      ]
    }
  },
  methods: {
    onClick(e) {
      this.$emit('click', this.data)
    } 
  }
}
</script>

<style lang="scss">
.tint-item {
  background: var(--tint-color);
  position: relative;
  border: 2px solid #999;

  &--selected {
    border-color: #fff;
  }

  &--code-rgb { --tint-color: rgb }
  &--code-yolo { --tint-color: yolo }
  &--code-gold { --tint-color: gold }
  &--code-red { --tint-color: red }
  &--code-orange { --tint-color: orange }
  &--code-yellow { --tint-color: yellow }
  &--code-lime { --tint-color: lime }
  &--code-green { --tint-color: green }
  &--code-teal { --tint-color: teal }
  &--code-cyan { --tint-color: cyan }
  &--code-blue { --tint-color: blue }
  &--code-violet { --tint-color: violet }
  &--code-pink { --tint-color: pink }
  &--code-indigo { --tint-color: indigo }
  &--code-grape { --tint-color: grape }
  &--code-gray { --tint-color: gray }
}
</style>