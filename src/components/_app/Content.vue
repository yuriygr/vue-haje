<template>
  <div :class="[ 'app-content' ]">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app-content'
}
</script>

<style lang="scss">
.app-content {
  // Mobile first
  --layout-padding: var(--mobile-page-vertical-padding) var(--mobile-page-horizontal-padding) calc(var(--tabbar--height) + var(--mobile-page-vertical-padding));

  // Desctop last
  @media (min-width: 768px) {
    & { --layout-padding: var(--desktop-page-vertical-padding) var(--desktop-page-horizontal-padding); }
  }
}


.app-content {
  padding: var(--layout-padding);
  margin: 0 auto;

  @media (min-width: 768px) {
    & { max-width: var(--large-screen-max-width); }
  }
}
</style>