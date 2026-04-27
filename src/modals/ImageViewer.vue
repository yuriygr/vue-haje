<template>
  <div class="image-viewer" @click.self="closeModal">
    <button class="close-btn" @click="closeModal">×</button>

    <div class="image-container">
      <div v-if="showGalleryIndicator" class="gallery-indicator">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <button v-if="showNavigation" class="nav-btn prev" :disabled="currentIndex <= 0" @click.stop="prevImage">❮</button>

      <div
        class="image-wrapper"
        @click.self="closeModal"
        @wheel.prevent="onWheel"
        @touchstart.passive="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <img
          ref="image"
          :src="`https://leonardo2.osnova.io/${currentImage.uuid}/`"
          :style="imgStyle"
          draggable="false"
          @click="toggleZoom"
          @touchend="onTouchTap"
          @load="handleImageLoad"
        />
      </div>

      <button v-if="showNavigation" class="nav-btn next" :disabled="currentIndex >= images.length - 1" @click.stop="nextImage">❯</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'image-viewer-modal',

  props: {
    images: {
      type: Array,
      default: () => []
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      currentIndex: this.initialIndex,
      isZoomed: false,
      maxZoom: 2,
      translateX: 0,
      translateY: 0,

      // pinch
      lastPinchDistance: null,
      pinchStartZoom: 1,
      currentPinchZoom: 1,
      didPinch: false,
    }
  },

  computed: {
    currentImage() {
      return this.images[this.currentIndex]
    },
    showNavigation() {
      return this.images.length > 1
    },
    showGalleryIndicator() {
      return this.images.length > 1 && !this.isZoomed
    },
    currentZoom() {
      return this.isZoomed ? this.maxZoom : 1
    },
    imgStyle() {
      return {
        transform: `translate(${this.translateX}px, ${this.translateY}px) scale(${this.currentZoom})`,
        cursor: this.isZoomed ? 'zoom-out' : 'zoom-in'
      }
    }
  },

  mounted() {
    document.addEventListener('keyup', this.handleKeyPress)
  },

  beforeUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress)
  },

  methods: {
    closeModal() {
      this.$modals.close()
    },

    nextImage() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++
        this.resetState()
      }
    },

    prevImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.resetState()
      }
    },

    resetState() {
      this.isZoomed = false
      this.translateX = 0
      this.translateY = 0
      this.currentPinchZoom = 1
      this.didPinch = false
    },
    handleImageLoad() {
      const img = this.$refs.image
      if (!img) return

      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // максимальный зум чтобы не вылезти за экран
      const maxZoomByWidth = screenWidth / img.clientWidth
      const maxZoomByHeight = screenHeight / img.clientHeight

      // минимум 1 (не уменьшать), максимум — влезть в экран
      this.maxZoom = Math.max(Math.min(maxZoomByWidth, maxZoomByHeight), 1.1)
    },
    toggleZoom() {
      this.isZoomed = !this.isZoomed
      if (!this.isZoomed) {
        this.translateX = 0
        this.translateY = 0
      }
    },

    // --- Колесо мыши — панорамирование ---
    onWheel(e) {
      if (!this.isZoomed) return
      this.translateX -= e.deltaX
      this.translateY -= e.deltaY
      this.clampTranslate()
    },

    clampTranslate() {
      const img = this.$refs.image
      if (!img) return
      const maxX = (img.clientWidth * (this.currentZoom - 1)) / 2
      const maxY = (img.clientHeight * (this.currentZoom - 1)) / 2
      this.translateX = Math.max(-maxX, Math.min(maxX, this.translateX))
      this.translateY = Math.max(-maxY, Math.min(maxY, this.translateY))
    },

    // --- Touch tap (зум) ---
    onTouchTap(e) {
      if (e.touches.length === 0 && !this.didPinch) {
        e.preventDefault()
        this.toggleZoom()
      }
    },

    // --- Pinch ---
    onTouchStart(e) {
      if (e.touches.length === 2) {
        this.lastPinchDistance = this.getPinchDistance(e.touches)
        this.pinchStartZoom = this.currentZoom
        this.didPinch = true
      }
    },

    onTouchMove(e) {
      if (e.touches.length === 2 && this.lastPinchDistance) {
        const dist = this.getPinchDistance(e.touches)
        const ratio = dist / this.lastPinchDistance
        this.currentPinchZoom = Math.min(Math.max(this.pinchStartZoom * ratio, 1), this.maxZoom)
        this.isZoomed = this.currentPinchZoom > 1
      }
    },

    onTouchEnd(e) {
      if (e.touches.length < 2 && this.lastPinchDistance) {
        // snap к ближайшему состоянию
        if (this.currentPinchZoom < 1.3) {
          this.isZoomed = false
          this.translateX = 0
          this.translateY = 0
        } else {
          this.isZoomed = true
        }
        this.lastPinchDistance = null
      }

      if (e.touches.length === 0) {
        setTimeout(() => { this.didPinch = false }, 300)
      }
    },

    getPinchDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    },

    handleKeyPress(e) {
      if (e.key === 'ArrowLeft') this.prevImage()
      if (e.key === 'ArrowRight') this.nextImage()
      if (e.key === 'Escape') this.closeModal()
    }
  }
}
</script>

<style scoped>
.image-viewer {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
}

.image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
}

img {
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  display: block;
  transform-origin: center center;
  will-change: transform;
}

.close-btn {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 2rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.close-btn:hover { opacity: 1; }

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.nav-btn:hover { opacity: 1; }
.nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }
.prev { left: 1rem; }
.next { right: 1rem; }

.gallery-indicator {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  z-index: 1001;
}
</style>