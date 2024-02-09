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
  position: relative;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>