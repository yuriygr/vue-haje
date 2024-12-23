<template>
  <div class="link-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'link-item-wrapper'
}
</script>

<style lang="scss">
.link-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: .5rem;
  padding-bottom: .5rem;
}
</style>