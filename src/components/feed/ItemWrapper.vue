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
  position: relative;
  margin-bottom: 2rem;
}
</style>