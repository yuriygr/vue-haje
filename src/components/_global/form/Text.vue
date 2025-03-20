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
  color: #919190;
  font-size: 1.4rem;
  line-height: calc(1.4 * 1em);
  margin-bottom: 2rem;
  position: relative;

  &--align-center {
    text-align: center;
    font-size: 1.3rem;
    line-height: calc(1.3 * 1em);
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