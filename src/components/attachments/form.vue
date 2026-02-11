<template>
  <div class="attachments-form">
    <div class="thumb-grid" v-if="images.length > 0">
      <div  v-for="(file, index) in images" :key="file.id" :class="[ 'thumb' ]">
        <div :class="[ 'thumb__preview' , `thumb__preview--status-${file.status}` ]">
          <video
            v-if="(file.file && file.file.type == 'video/mp4') || (file.payload && file.payload.type == 'mp4')"
            :src="file.file && file.preview"
            :poster="file.payload && file.preview"
            :width="100"
            :height="100"
            alt="Preview"
            @dragstart.prevent
          />
          <img
            v-else
            :src="file.preview"
            :width="100"
            :height="100"
            alt="Preview"
            @dragstart.prevent
          />
        </div>
        <div class="thumb__cancel" @click.stop.prevent="file.status === 'uploading' ? cancelUpload(index) : removeFile(index)">
          <icon name="ui-close" size="16" />
        </div>
      </div>
    </div>

    <input
      ref="input"
      type="file"
      multiple
      hidden
      :accept="allowedFormats"
      @change="handleFileSelect"
      :disabled="remainingSlots === 0"
    >
  </div>
</template>

<script>
import axios from 'axios'
import { Icon } from '@vue-norma/ui'

export default {
  name: 'attachments-form',
  emits: ['update:modelValue','update:loading', 'limit-reached', 'duplicate-detected'],
  components: { Icon },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    allowedFormats: {
      type: Array
    },
    maxFiles: {
      type: Number,
      default: 5,
      validator: value => value > 0
    },
    checkDuplicates: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      images: [],
      localUniqueId: 0
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        // Обновление существующих файлов при изменении modelValue
        const currentSuccess = this.images.filter(img => img.status === 'success');
        const newSuccess = newVal.filter(file => 
          !currentSuccess.some(img => img.uuid === file.uuid)
        )
        
        newSuccess.forEach(file => {
          this.images.push(this.createExistingFileObject(file))
        })
      },
      deep: true,
      immediate: true
    },
    uploadedFiles: {
      handler(newVal) {
        this.$emit('update:modelValue', newVal)
      },
      deep: true
    }
  },
  computed: {
    uploadedFiles() {
      return this.images
        .filter(img => img.status === 'success')
        .map(img => img.payload)
    },
    remainingSlots() {
      return Math.max(0, this.maxFiles - this.images.length)
    },
  },
  methods: {
    attachFiles() {
      if (this.remainingSlots > 0) {
        this.$refs.input.value = ''
        this.$refs.input.click()
      }
    },

    // Генерация уникальных ID
    generateUniqueId() {
      return this.localUniqueId++
    },
    // Удаляем превью (если оно blob)
    revokePreview(image) {
      if (image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview)
      }
    },
    // Создаем объект существующего файла
    createExistingFileObject(file) {
      return {
        id: this.generateUniqueId(),
        file: null,
        preview: `https://leonardo.osnova.io/${file.uuid}/-/scale_crop/300x/`,
        status: 'success',
        payload: file,
        uuid: file.uuid,
        progress: 100,
        controller: null
      }
    },
    // Создаем объект файла
    createFileObject(file) {
      return {
        id: this.generateUniqueId(),
        file,
        preview: URL.createObjectURL(file),
        status: 'uploading',
        payload: null,
        uuid: null,
        progress: 0,
        controller: new AbortController()
      }
    },

    // Паралельно загружаем файлы
    async handleFileSelect(event) {
      const files = Array.from(event.target.files || event.dataTransfer.files)
      if (!files.length) return

      const uploadPromises = this.filterFiles(files)
        .map(file => this.createFileObject(file))
        .map(object => this.uploadFile(object))

      await Promise.all(uploadPromises)
    },

    async uploadFile(object) {
      this.images.push(object)

      const formData = new FormData()
      formData.append('file', object.file)

      return await this.$api.upload('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: object.controller.signal,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          this.updateImageProgress(object.id, progress)
        }
      })
      .then(result => {
        this.updateImageStatus(object.id, 'success', result.payload)
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          this.$alerts.danger({ text: this.$t(`alerts.${error.status}`) })
          this.updateImageStatus(object.id, 'error')
        }
      })
    },

    filterFiles(files) {
      return files
        .slice(0, this.remainingSlots) // Ограничение по количеству
        .filter(file => {
          // Проверка формата
          if (!this.allowedFormats.includes(file.type)) {
            return false
          }
          
          // Проверка на дубликаты
          if (this.checkDuplicates && this.isDuplicate(file)) {
            this.$emit('duplicate-detected', file)
            return false
          }
          
          return true
        })
    },

    isDuplicate(file) {
      return this.images.some(img => {
        if (img.payload && img.payload.uuid) {
          return img.payload.name === file.name &&
            img.payload.size === file.size &&
            img.payload.type === file.type
        }
        return img.file.name === file.name &&
          img.file.size === file.size &&
          img.file.type === file.type
      })
    },

    updateImageProgress(id, progress) {
      const index = this.images.findIndex(img => img.id === id)
      if (index !== -1) {
        this.images[index].progress = progress
      }
    },

    updateImageStatus(id, status, payload = null) {
      const index = this.images.findIndex(img => img.id === id)
      if (index !== -1) {
        this.images[index].status = status
        if (payload != null) {
          this.images[index].preview = `https://leonardo.osnova.io/${payload.uuid}/-/scale_crop/300x/`
          this.images[index].payload = payload
          this.images[index].uuid = payload.uuid
        }
      }
    },

    // Отменяем загрузку файла
    cancelUpload(index) {
      const image = this.images[index]
      image.controller.abort()
      this.removeFileById(image.id)
    },

    // Удаляем файл
    removeFile(index) {
      this.removeFileById(this.images[index].id)
    },

    // Удаление по ID
    removeFileById(id) {
      const index = this.images.findIndex(img => img.id === id)
      if (index === -1) return
      
      const image = this.images[index]
      this.revokePreview(image)
      this.images.splice(index, 1)
    },

    // Сбрасываем
    reset() {
      this.images.forEach(this.revokePreview)
      this.images = []
    },
  },
  beforeUnmount() {
    this.images.forEach(image => {
      this.revokePreview(image)
      if (image.controller) {
        image.controller.abort()
      }
    })
  }
}
</script>

<style lang="scss">
.thumb-grid {
  display: flex;
  flex-direction: row;

  .thumb + .thumb {
    margin-left: 2rem;
  }
}

.thumb {
  --thumb--background: #fafafa;
  --thumb__cancel--background: #212529;
  --thumb__cancel--background-hover: #343a40;
  --thumb__cancel--border-color: #ffffff;
  --thumb__cancel--color: #fff;
  --thumb__cancel--color-hover: #fff;

  html[data-theme="black"] & {
    --thumb--background: #171717;

    --thumb__cancel--background: #f2f2f0;
    --thumb__cancel--background-hover: #e5e5e3;
    --thumb__cancel--border-color: #111111;
    --thumb__cancel--color: #1d1d1d;
    --thumb__cancel--color-hover: #1d1d1d;
  }
}

.thumb {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100px;
  height: 100px;

  &__preview {
    background-color: var(--thumb--background);
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    aspect-ratio: 1;
    width: inherit;
    height: inherit;
    border-radius: 8px;

    &--status-error {
      img, video {
        filter: blur(5px) grayscale(1);
      }
      &:after {
        content: "";
        pointer-events: none;
        border-radius: inherit;
        box-shadow: inset 0 0 16px 3px rgb(255 0 0 / 27%);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    &--status-uploading {
      img, video {
        filter: blur(5px) grayscale(1);
      }
    }

    img, video {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: cover;
      user-select: none;
      pointer-events: none;
    }
  }

  &__cancel {
    --size: 26px;
    position: absolute;
    z-index: 1;
    top: calc(var(--size)* -.4);
    right: calc(var(--size)* -.4);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);
    background-color: var(--thumb__cancel--background);
    border: 3px solid var(--thumb__cancel--border-color);
    color: var(--thumb__cancel--color);
    border-radius: 50%;
    cursor: pointer;

    svg {
      fill: currentColor;
      flex-shrink: 0;
      display: block;
    }

    @media (hover: hover) {
      .button:hover {
        background: var(--thumb__cancel--background-hover);
        color: var(--thumb__cancel--color-hover);
      }
    }
  }
} 
</style>