<template>
  <form class="form-group" method="post" enctype="multipart/form-data" @submit.prevent="$emit('send', $event)" :disabled="loading">
    <slot />
  </form>
</template>

<script>
export default {
  name: 'form-group',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">

</style>