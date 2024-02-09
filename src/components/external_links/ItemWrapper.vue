<template>
  <div class="external-link-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'external-link-item-wrapper'
}
</script>

<style lang="scss">
.external-link-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: .5rem;
  padding-bottom: .5rem;
}
</style>