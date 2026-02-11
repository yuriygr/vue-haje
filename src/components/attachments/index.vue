<template>
  <div :class="elClass" v-if="hasAttachments">
    <div class="images-list" v-if="files">
      <picture v-for="item in files" :key="`file-${item.file.uuid}`">
        <video v-if="item.file.type == 'mp4'"
          :poster="`https://leonardo.osnova.io/${item.file.uuid}/-/scale_crop/640x/`"
          :src="`https://leonardo.osnova.io/${item.file.uuid}/-/format/mp4/`"
          :width="item.file.width"
          :height="item.file.height"
          controls="true"
          loop="true"
          playsinline
          preload="auto"
        />
        <img v-else
          :data-src="`https://leonardo.osnova.io/${item.file.uuid}/-/scale_crop/640x/`"
          :src="`https://leonardo.osnova.io/${item.file.uuid}/-/scale_crop/640x/`"
          :width="item.file.width"
          :height="item.file.height"
          @click="viewImage(item.file)"
        >
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
import { defineAsyncComponent } from 'vue'
import { LinksList,LinkItem,LinkItemWrapper } from '@/components/links'

let ImageViewer = defineAsyncComponent(() => import("@/modals/ImageViewer.vue"))

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
  },
  methods: {
    viewImage(data) {
      this.$modals.show(ImageViewer, {
        images: [data]
      })
    }
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

    &:not(:last-child) {
      margin-bottom: .75rem;
    }

    img, video {
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