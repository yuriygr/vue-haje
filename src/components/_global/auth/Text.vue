<template>
  <div :class="elClass">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'form-text',
  props: {
    align: {
      type: [ String ],
      default: 'left'
    }
  },
  computed: {
    elClass() {
      return [
        'form-text',
        'form-text--align-' + this.align
      ]
    }
  }
}
</script>

<style lang="scss">
.form-text {
  color: #8b8b8b;
  font-size: 1.5rem;
  line-height: calc(1.25 * 1em);
  margin-bottom: 1.5rem;
  position: relative;

  &--align-center {
    text-align: center;
    font-size: 1.3rem;
  }

  &--align-right {
    text-align: right;
  }

  &--align-left {
    text-align: left;
  }

  &:last-of-type { margin-bottom: 0; }
}
</style>