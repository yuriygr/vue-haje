<template>
  <div :class="elClass" v-if="hasAttachments">
    <div class="images-list" v-if="files">
      <picture v-for="item in files" :key="`file-${item.file.uuid}`">
        <img :data-src="`https://leonardo.osnova.io/${item.file.uuid}`" :src="`https://leonardo.osnova.io/${item.file.uuid}`">
      </picture>
    </div>

    <links-list v-if="link">
      <link-item-wrapper>
        <link-item :data="link" />
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
    files: {
      type: [ Array, Object, Boolean ],
      default: false
    },
    link: {
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
    hasAttachments() {
      return this.files || this.link
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