<template>
  <div :class="[ 'app-content' ]">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
.app-content {
  max-width: var(--large-screen-max-width); 
  padding: var(--layout-content-padding);
  margin: 0 auto;
}
</style>