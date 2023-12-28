<template>
  <div class="notification-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'notification-item-wrapper'
}
</script>

<style lang="scss">
.notification-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
}
</style>