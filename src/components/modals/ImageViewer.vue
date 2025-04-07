<template>
  <modal>
    <div class="image-viewer">
      <img class="image-viewer__image"
        :data-src="`https://leonardo.osnova.io/${data.uuid}`"
        :src="`https://leonardo.osnova.io/${data.uuid}`"
        :width="data.width"
        :height="data.height"
        @click.exact="closeModal"
      >
    </div>
  </modal>
</template>

<script>
import { Modal } from '@vue-norma/ui'

export default {
  name: 'image-viewer-modal',
  components: {
    Modal
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  data() {
    return { }
  },
  computed: { },
  methods: {
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss">
.image-viewer {
  display: flex;
  justify-content: center;
  align-items: center;

  &__image {
    margin: auto;
    display: block;
    user-select: none;
    outline: none;

    width: 100%;
    height: auto;
    display: block;
  }
}
</style>