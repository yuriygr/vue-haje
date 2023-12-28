<template>
  <div class="user-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'user-item-wrapper'
}
</script>

<style lang="scss">
.user-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: .75rem;
  padding-bottom: .75rem;
}
</style>