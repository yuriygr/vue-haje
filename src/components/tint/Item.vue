<template>
  <div :class="elClass" @click="onClick"></div>
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
  border: 2px solid var(--tint-color);
  border-radius: 8px;
  display: block;
  height: var(--item-size);
  width: var(--item-size);
  cursor: pointer;

  &--selected {
    box-shadow: inset var(--x-body--background) 0px 0px 0px 3px;
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
  &--code-grape { --tint-color: #421C52; }
  &--code-gray { --tint-color: gray }
}
</style>