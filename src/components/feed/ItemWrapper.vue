<template>
  <div class="feed-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'feed-item-wrapper'
}
</script>

<style lang="scss">
.feed-item-wrapper:not(:last-child) {
  //border-bottom: 1px solid var(--x-divider-color);
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}
</style>