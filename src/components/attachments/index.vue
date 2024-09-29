<template>
  <div :class="elClass" v-if="data">
    <picture v-for="item in data" :key="`file-${item.file.uuid}`">
      <img :data-src="`https://leonardo.osnova.io/${item.file.uuid}`" :src="`https://leonardo.osnova.io/${item.file.uuid}`">
    </picture>
  </div>
</template>

<script>
export default {
  name: 'attachments',
  props: {
    data: {
      type: [ Array, Object, Boolean ],
      default: false
    },
    mode: {
      type: String,
      default: 'compact',
      validator(value) {
        return ['compact', 'full'].includes(value)
      }
    }
  },
  computed: {
    elClass() {
      return [
        'attachments',
        'attachments--mode-' + this.mode
      ]
    },
  }
}
</script>

<style lang="scss">
.attachments {

  picture {
    display: block;
    overflow: hidden;
    border-radius: 12px;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &--mode-compact {
    picture {
      max-width: 250px;
    }
  }
}
</style>