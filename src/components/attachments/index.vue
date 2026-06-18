<template>
  <div :class="elClass" v-if="hasAttachments" :style="{ '--max-img-height': '550px' }">
    <div class="images-list" v-if="mediaImages.length">
      <div v-for="item in mediaImages" :key="item.file.uuid"
        :class="['image-wrapper', {
          'image-wrapper--tall': item.isTall,
          'image-wrapper--spoiler': item.isSpoilerActive
        }]"
        :style="item.aspectRatio ? { aspectRatio: item.aspectRatio } : {}"
        @click="handleImageClick(item)"
      >
        <div
          v-if="item.isTall || item.isSpoilerActive"
          class="image-wrapper__backdrop"
          :style="{ backgroundImage: `url(${cdnUrl(item.file.uuid, 'scale_crop/10x')})` }"
        />
        <img :src="cdnUrl(item.file.uuid)" :width="item.file.width" :height="item.file.height">
      </div>
    </div>

    <div class="videos-list" v-if="mediaVideos.length">
      <video v-for="item in mediaVideos" :key="item.file.uuid"
        :poster="cdnUrl(item.file.uuid, 'scale_crop/640x')"
        :src="cdnUrl(item.file.uuid, 'format/mp4')"
        :width="item.file.width"
        :height="item.file.height"
        controls loop playsinline preload="auto" muted="muted"
      />
    </div>

    <template v-for="link in links">
      <template v-if="link.link.domain == 'youtube.com'">
        <YouTubePreview :data="link.link" />
      </template>
      <template v-else>
        <link-item :data="link.link" />
      </template>
    </template>

  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { LinkItem } from '@/components/links'
import YouTubePreview from '@/components/embed/YouTube.vue'
import { useModals } from '@vue-norma/ui'

let ImageViewer = defineAsyncComponent(() => import("@/modals/ImageViewer.vue"))
const MAX_HEIGHT = 550

export default {
  name: 'attachments',
  components: {
    YouTubePreview,
    LinkItem
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
  setup() {
    const modals = useModals()
    return { modals }
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

    processedFiles() {
      return (this.files || []).map(item => ({
        ...item,
        isVideo: item.file.type === 'mp4',
        revealed: this.revealedSpoilers.has(item.file.uuid),
        isSpoilerActive: item.is_spoiler && !this.revealedSpoilers.has(item.file.uuid),
        isTall: this.isTall(item.file),
        aspectRatio: item.file.width && item.file.height 
          ? item.file.width / item.file.height 
          : null
      }))
    },

    mediaImages() {
      return this.processedFiles.filter(item => !item.isVideo)
    },
    
    mediaVideos() {
      return this.processedFiles.filter(item => item.isVideo)
    },

    elClass() {
      return [
        'attachments',
        'attachments--mode-' + this.mode
      ]
    },
  },
  methods: {
    cdnUrl(uuid, params = 'scale_crop/640x') {
      return `https://leonardo3.osnova.io/${uuid}/-/${params}/`
    },
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
      this.modals.show(ImageViewer, {
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

  &--mode-compact {
    .images-list,
    .videos-list {
      max-width: 300px;
    }
  }

  .images-list,
  .videos-list {
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

  .image-wrapper {
    background-color: var(--attachment--background);
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    width: 100%;

    &:after {
      content: "";
      pointer-events: none;
      border-radius: inherit;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .07);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 90;
    }

    &:not(:last-child) {
      margin-bottom: .75rem;
    }

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
        z-index: 100;
      }
    }

    &__backdrop {
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
      position: absolute; // меняем
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
    }

    &--tall {
      aspect-ratio: unset; // сбрасываем
      height: var(--max-img-height);

      img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

}
</style>