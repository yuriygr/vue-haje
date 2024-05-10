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
.comment-item-wrapper {
  --comment-item__divider-color: #f1f3f5;
  
  html[data-theme="black"] & {
    --comment-item__divider-color: #242424;
  }
}

.comment-item-wrapper:not(:last-child) {
  border-bottom: 1px solid var(--comment-item__divider-color);
  position: relative;
  margin-bottom: .5rem;
  padding-bottom: .5rem;
}
</style>