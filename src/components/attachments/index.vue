<template>
  <div :class="elClass" v-if="hasAttachments">
    <div class="images-list" v-if="files" :style="{ '--max-img-height': '550px' }">
      <figure v-for="item in files" :key="`file-${item.file.uuid}`">
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

        <div v-else
          :class="['img-wrapper', {
            'img-wrapper--tall': isTall(item.file),
            'img-wrapper--spoiler': item.is_spoiler && !isSpoilerRevealed(item.file.uuid)
          }]"
          @click="handleImageClick(item)"
        >
          <div
            class="img-blur-bg"
            :style="{ backgroundImage: `url(https://leonardo2.osnova.io/${item.file.uuid}/-/scale_crop/10x/)` }"
          />
          <img
            :src="`https://leonardo2.osnova.io/${item.file.uuid}/-/scale_crop/640x/`"
            :width="item.file.width"
            :height="item.file.height"
          >
        </div>
      
      </figure>
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
const MAX_HEIGHT = 550

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
  data() {
    return {
      revealedSpoilers: new Set()
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
    revealSpoiler(uuid) {
      this.revealedSpoilers = new Set([...this.revealedSpoilers, uuid])
    },
    isSpoilerRevealed(uuid) {
      return this.revealedSpoilers.has(uuid)
    },

    isTall(file) {
      if (!file.width || !file.height) return false
      const aspectRatio = file.height / file.width
      if (aspectRatio < 1.2) return false 
      const renderedHeight = aspectRatio * 640
      return renderedHeight > MAX_HEIGHT
    },

    handleImageClick(item) {
      if (item.is_spoiler && !this.isSpoilerRevealed(item.file.uuid)) {
        this.revealSpoiler(item.file.uuid)
        return
      }
      this.viewImage(item.file)
    },


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
  --attachment__undercover--background: #ffffff4f;
  --attachment--background: rgba(0, 0, 0, 0.09);

  html[data-theme="black"] & {
    --attachment__undercover--background: #0000004f;
    --attachment--background: rgba(255, 255, 255, 0.05);
  }
}

.attachments {
  & > * + * {
    margin-top: .75rem;
  }

  figure {
    display: block;
    overflow: hidden;
    border-radius: 12px;
    margin: 0;

    &:not(:last-child) {
      margin-bottom: .75rem;
    }

    img, video {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .img-wrapper {
    background-color: var(--attachment--background);
    position: relative;
    overflow: hidden;
    border-radius: 12px;

    &--spoiler {
      img, video { visibility: hidden; }
      
      &:after {
        content: "SPOILER";
        position: absolute;
        inset: 0;
        background: var(--attachment--background);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.05em;
        border-radius: inherit;
      }
    }

    .img-blur-bg {
      position: absolute;
      inset: 0;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--attachment__undercover--background);
      }
    }

    img {
      position: relative;
      z-index: 1;
      width: 100%;
      height: auto;
      display: block;
    }

    &--tall {
      max-height: var(--max-img-height);

      img {
        width: auto;
        max-width: 100%;
        max-height: var(--max-img-height);
        height: 100%;
        object-fit: contain;
        margin: 0 auto;
      }
    }
  }

  &--mode-compact {
    figure {
      max-width: 300px;
    }
  }
}
</style>