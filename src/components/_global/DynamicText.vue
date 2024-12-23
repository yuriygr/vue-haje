<template>
  <div v-if="content" v-html="formated" />
</template>

<script>
export default {
  name: 'dynamic-text',
  emits: ['onToggle'],
  props: {
    content: {
      type: [ Boolean, String ],
      default: false
   }
  },
  computed: {
    formated() {
      return this.$filters.contentFormat(content)
    }
  },
  methods: {
    truncate(maxLetters = 100, useWordBoundary = false) {
      const LongstringHelper = str => {
  const sliceBoundary = str => str.substr(0, str.lastIndexOf(" "));
  const truncate = (n, useWordBoundary) => 
        str.length <= n ? str : `${ useWordBoundary 
          ? sliceBoundary(str.slice(0, n - 1))
          : str.slice(0, n - 1)}&hellip;`;
  return { full: str,  truncate };
}; 
    }
  }
}
</script>