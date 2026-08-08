<template>
  <div :class="[ 'app-layout' ]">
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'app-layout' })
</script>