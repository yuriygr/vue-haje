<template>
  <div :class="[ 'app-content' ]">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app-content'
}
</script>

<style lang="scss">
.app-content {
  max-width: var(--large-screen-max-width); 
  padding: var(--layout-content-padding);
  margin: 0 auto;
}
</style>