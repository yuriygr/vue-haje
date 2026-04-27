<template>
  <div class="help-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'help-item-wrapper'
}
</script>

<style lang="scss">
.help-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: .5rem;
  padding-bottom: .5rem;
}
</style>