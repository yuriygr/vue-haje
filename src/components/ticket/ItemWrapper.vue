<template>
  <div class="ticket-item-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ticket-item-wrapper'
}
</script>

<style lang="scss">
.ticket-item-wrapper:not(:last-child) {
  position: relative;
  margin-bottom: .5rem;
  padding-bottom: .5rem;
}
</style>