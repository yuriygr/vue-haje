<template>
  <div class="image-viewer" @click.self="closeModal">
    <button class="close-btn" @click="closeModal">×</button>
    <div class="image-container">
      <!-- Индикатор галереи -->
      <div v-if="showGalleryIndicator" class="gallery-indicator">
        {{ index + 1 }} / {{ images.length }}
      </div>
      <!-- Навигация по галерее -->
      <button v-if="showNavigation" 
              class="nav-btn prev" 
              @click.stop="prevImage"
              :disabled="index <= 0">
        ❮
      </button>
      
      <div class="image-wrapper">
        <img 
          :src="`https://leonardo.osnova.io/` + currentImage.uuid" 
          :class="{ 'zoomed': isZoomed }" 
          @click="toggleZoom"
          ref="image"
          @load="handleImageLoad"
        />
      </div>
      
      <button v-if="showNavigation" 
          class="nav-btn next" 
          @click.stop="nextImage"
          :disabled="index >= images.length - 1">
        ❯
      </button>
  
    </div>
  </div>
</template>

<script>
export default {
  name: 'image-viewer-modal',
  props: {
    images: {
      type: [ Boolean, Array ],
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isZoomed: false,
      loading: false,
      canZoom: false
    };
  },
  computed: {
    currentImage() {
      return this.images[this.index] || '';
    },
    showNavigation() {
      return this.images.length > 1;
    },
    showGalleryIndicator() {
      return this.images.length > 1 && !this.isZoomed;
    }
  },
  mounted() {
    this.isZoomed = false;
    this.canZoom = false;
    document.addEventListener('keyup', this.handleKeyPress);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.handleKeyPress);
  },
  methods: {
    closeModal() {
      this.$modals.close()
    },

    toggleZoom() {
      if (!this.canZoom) return;
      this.isZoomed = !this.isZoomed;
    },
    
    nextImage() {
      if (this.index < this.images.length - 1) {
        this.index++;
        this.resetImageState();
      }
    },
    
    prevImage() {
      if (this.index > 0) {
        this.index--;
        this.resetImageState();
      }
    },
    
    resetImageState() {
      this.isZoomed = false;
      this.loading = true;
      this.canZoom = false;
    },
    
    handleImageLoad() {
      this.loading = false;
      
      const img = this.$refs.image;
      if (img.naturalWidth > img.clientWidth || img.naturalHeight > img.clientHeight) {
        this.canZoom = true;
      }
    },
    
    handleKeyPress(e) {
      switch(e.key) {
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    }
  }
};
</script>

<style scoped>
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
}

.image-container {
  position: relative;
  max-width: 95%;
  max-height: 95%;
  text-align: center;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
  max-height: 90vh;
}

img {
  max-width: 100%;
  max-height: 80vh;
  cursor: zoom-in;
  display: block;
}

img.zoomed {
  cursor: zoom-out;
  max-width: 100%;
  max-height: none;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  z-index: 1001;
}

.close-btn:hover {
  opacity: 1;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  opacity: 1;
}

.nav-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.prev {
  left: 15px;
}

.next {
  right: 15px;
}

.gallery-indicator {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 1rem;
}
</style>