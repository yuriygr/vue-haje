<template>
  <div class="login-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'login-item-wrapper'
}
</script>

<style lang="scss">
.login-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: .5rem;
}
</style>