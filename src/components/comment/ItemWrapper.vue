<template>
  <div class="comment-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'comment-item-wrapper'
}
</script>

<style lang="scss">
.comment-item-wrapper:not(:last-child) {
  border-bottom: 1px solid var(--x-divider-color);
  position: relative;
  margin-bottom: .5rem;
  padding-bottom: .5rem;
}
</style>