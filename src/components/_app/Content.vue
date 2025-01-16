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
 // --layout-max-width: var(--large-screen-max-width);

 // html[data-layout="wide"] & {
 //   --layout-max-width: var(--wide-large-screen-max-width);
 // }
}


.app-content {
  max-width: var(--large-screen-max-width); 
  padding: var(--layout-content-padding);
  margin: 0 auto;

  // @media (min-width: 768px) {
  //   & { }
  // }
}
</style>