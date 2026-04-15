<template>
  <div :class="elClass" v-if="hasAttachments">
    <div class="images-list" v-if="files">
      <picture v-for="item in files" :key="`file-${item.file.uuid}`">
        <video v-if="item.file.type == 'mp4'"
          :poster="`https://leonardo2.osnova.io/${item.file.uuid}/-/scale_crop/640x/`"
          :src="`https://leonardo2.osnova.io/${item.file.uuid}/-/format/mp4/`"
          :width="item.file.width"
          :height="item.file.height"
          controls="true"
          loop="true"
          playsinline
          preload="auto"
        />
        <img v-else
          :data-src="`https://leonardo2.osnova.io/${item.file.uuid}/-/scale_crop/640x/`"
          :src="`https://leonardo2.osnova.io/${item.file.uuid}/-/scale_crop/640x/`"
          :width="item.file.width"
          :height="item.file.height"
          @click="viewImage(item.file)"
        >
      </picture>
    </div>

    <template v-for="link in links">
      <template v-if="link.link.domain == 'youtube.com'">
        <YouTubePreview :data="link.link" />
      </template>
      <template v-else>
        <link-item-wrapper>
          <link-item :data="link.link" />
        </link-item-wrapper>
      </template>
    </template>

  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { LinkItem, LinkItemWrapper } from '@/components/links'
import YouTubePreview from '@/components/embed/YouTube.vue'

let ImageViewer = defineAsyncComponent(() => import("@/modals/ImageViewer.vue"))

export default {
  name: 'attachments',
  components: {
    YouTubePreview,
    LinkItem, LinkItemWrapper
  },
  props: {
    files: {
      type: [ Array, Object, Boolean ],
      default: false
    },
    links: {
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
      return this.files || this.links
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