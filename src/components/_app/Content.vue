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

  // Desktop last
  @media (min-width: 768px) {
    & { --layout-padding: var(--desktop-page-vertical-padding) var(--desktop-page-horizontal-padding); }
  }

  --layout-max-width: var(--large-screen-max-width);

  html[data-layout="wide"] & {
    --layout-max-width: var(--wide-large-screen-max-width);
  }
}


.app-content {
  padding: var(--layout-padding);
  margin: 0 auto;

  @media (min-width: 768px) {
    & { max-width: var(--layout-max-width); }
  }
}
</style>