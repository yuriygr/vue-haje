<template>
  <div v-if="data" class="video-card" @click="openVideo" @click.middle.exact="openVideo" :title="data.title">
    <div class="video-card__cover"
      :style="{ aspectRatio: thumbnailSize.aspectRatio }"
    >
      <img
        :src="thumbnailUrl"
        :alt="data.title"
        loading="lazy"
        @error="onError"
      />
    </div>
    <div class="video-card__play-button">
      <svg version="1.1" viewBox="0 0 68 48" width="68" height="48">
        <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getYouTubeID } from '@/app/services/utilities'

const props = defineProps({
  data: {
    type: [ Object, Boolean ],
    default: () => ({})
  },
  quality: {
    type: String,
    default: 'mqdefault' // hqdefault, mqdefault, maxresdefault
  }
})

// Computed

const videoId = computed(() =>
  getYouTubeID(props.data?.url)
)

const thumbnailUrl = computed(() =>
  videoId.value
    ? `https://img.youtube.com/vi/${videoId.value}/${props.quality}.jpg`
    : null
)

const thumbnailSize = computed(() => {
  const sizes = {
    'default':      { width: 120,  height: 90,  aspectRatio: '4 / 3'  },
    'mqdefault':    { width: 320,  height: 180, aspectRatio: '16 / 9' },
    'hqdefault':    { width: 480,  height: 360, aspectRatio: '4 / 3' },
    'sddefault':    { width: 640,  height: 480, aspectRatio: '4 / 3' },
    'maxresdefault':{ width: 1280, height: 720, aspectRatio: '16 / 9' },
  }

  return sizes[props.quality] ?? sizes['hqdefault']
})

// Methods

const openVideo = () => {
  window.open(props.data.url, '_blank')
}

const onError = (e) => {
  e.target.src = `https://yt-thumb.deno.dev/${videoId.value}.jpg`
}

</script>

<style lang="scss">
.video-card {
  --video-card--background: rgba(0, 0, 0, 0.09);
  
  html[data-theme="black"] & {
    --video-card--background: rgba(255, 255, 255, 0.05);
  }
}

.video-card {
  $parent: &;

  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  align-items: center;
  justify-items: center;
  overflow: hidden;
  cursor: pointer;
  border-radius: 12px;

  &__play-button {
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    grid-row: 1;
    grid-column: 1;
    z-index: 502;
    
    svg path:nth-child(1) {
      fill: #212121;
      fill-opacity: .8;
    }

    @media(hover: hover) {
      #{$parent}:hover > & {
        svg path:nth-child(1) {
          fill: red;
          fill-opacity: 1;
        }
      }
    }
  }

  &__cover {
    background-color: var(--video-card--background);
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    grid-row: 1;
    grid-column: 1;
    pointer-events: none;
    z-index: 500;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}

</style>