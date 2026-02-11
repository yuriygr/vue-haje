<template>
  <transition name="fade">
    <div v-if="isVisible" class="image-viewer" @click.self="close">
      <div class="image-container">
        <button class="close-btn" @click="close">×</button>
        
        <!-- Навигация по галерее -->
        <button v-if="showNavigation" 
                class="nav-btn prev" 
                @click.stop="prevImage"
                :disabled="currentIndex <= 0">
          ❮
        </button>
        
        <div class="image-wrapper">
          <img 
            :src="currentImage" 
            :class="{ 'zoomed': isZoomed }" 
            @click="toggleZoom"
            ref="image"
            @load="handleImageLoad"
          />
          <div v-if="loading" class="loader"></div>
        </div>
        
        <button v-if="showNavigation" 
                class="nav-btn next" 
                @click.stop="nextImage"
                :disabled="currentIndex >= images.length - 1">
          ❯
        </button>
        
        <!-- Индикатор галереи -->
        <div v-if="showGalleryIndicator" class="gallery-indicator">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
        
        <!-- Подсказка по управлению -->
        <div class="controls-hint">
          <span v-if="isZoomed">Кликните для уменьшения</span>
          <span v-else-if="!isZoomed && canZoom">Кликните для увеличения</span>
          <span v-if="showNavigation">Используйте ← → для навигации</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'image-viewer-layer',
  data() {
    return {
      isVisible: false,
      images: [],
      currentIndex: 0,
      isZoomed: false,
      loading: false,
      canZoom: false
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex] || '';
    },
    showNavigation() {
      return this.images.length > 1;
    },
    showGalleryIndicator() {
      return this.images.length > 1 && !this.isZoomed;
    }
  },
  mounted() {
    this.$root.$on('show-image', this.open);
    document.addEventListener('keyup', this.handleKeyPress);
  },
  beforeDestroy() {
    this.$root.$off('show-image', this.open);
    document.removeEventListener('keyup', this.handleKeyPress);
  },
  methods: {
    open(payload) {
      // Обработка разных форматов вызова
      if (typeof payload === 'string') {
        this.images = [payload];
      } else if (Array.isArray(payload)) {
        this.images = payload;
      } else if (payload && payload.images) {
        this.images = payload.images;
        this.currentIndex = payload.index || 0;
      }
      
      this.isVisible = true;
      this.isZoomed = false;
      this.canZoom = false;
      document.body.classList.add('no-scroll');
    },
    
    close() {
      this.isVisible = false;
      this.images = [];
      this.currentIndex = 0;
      document.body.classList.remove('no-scroll');
    },
    
    toggleZoom() {
      if (!this.canZoom) return;
      this.isZoomed = !this.isZoomed;
    },
    
    nextImage() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
        this.resetImageState();
      }
    },
    
    prevImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
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
      
      // Проверяем, можно ли увеличить изображение
      const img = this.$refs.image;
      if (img.naturalWidth > img.clientWidth || img.naturalHeight > img.clientHeight) {
        this.canZoom = true;
      }
    },
    
    handleKeyPress(e) {
      if (!this.isVisible) return;
      
      switch(e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
        case ' ':
        case 'Spacebar':
          this.toggleZoom();
          break;
      }
    }
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
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
  transition: transform 0.3s ease;
  cursor: zoom-in;
  display: block;
}

img.zoomed {
  transform: scale(1);
  cursor: zoom-out;
  max-width: none;
  max-height: none;
}

.close-btn {
  position: absolute;
  top: -40px;
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

.controls-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  text-align: center;
  max-width: 80%;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>

<style>
/* Глобальный стиль для блокировки прокрутки */
.no-scroll {
  overflow: hidden;
}
</style>