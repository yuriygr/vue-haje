<template>
  <div class="badge-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'badge-item-wrapper'
}
</script>

<style lang="scss">
.badge-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>