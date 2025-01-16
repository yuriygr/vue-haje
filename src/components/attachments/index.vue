<template>
  <div :class="elClass" v-if="data.length > 0">
    <div class="images-list">
      <picture v-for="item in data" :key="`file-${item.file.uuid}`">
        <img :data-src="`https://leonardo.osnova.io/${item.file.uuid}`" :src="`https://leonardo.osnova.io/${item.file.uuid}`">
      </picture>
    </div>

    <links-list v-if="(data.length > 0) && false">
      <link-item-wrapper v-for="item in data" :key="`link-${item.file.uuid}`">
        <link-item :data="ex" />
      </link-item-wrapper>
    </links-list>
  </div>
</template>

<script>
import { LinksList,LinkItem,LinkItemWrapper } from '@/components/links'

export default {
  name: 'attachments',
  components: {
   LinksList,LinkItem,LinkItemWrapper
  },
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
    ex() {
      return {
        icon: 'external-line',
        label: 'МакSим - Дед Максим (AI Cover)',
        url: 'https://www.youtube.com/watch?v=03-DjYDTbJA'
      }
    },
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

  & > * + * {
    margin-top: .75rem;
  }

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