<template>
  <div v-if="content" @click="handleClicks" v-mark-text>{{ content }}</div>
</template>

<script>
export default {
  name: 'dynamic-text',
  props: {
    content: {
      type: [ Boolean, String ],
      default: false
   }
  },
  methods: {
    handleClicks(e) {
      if (e.target.nodeName === 'A') {
        e.preventDefault()

        // Manually navigate to the route
        this.$router.push(e.target.href)
      }
    }
  }
}
</script>