<template>
  <modal size="small">
    <div class="avatar-view">
      <img class="avatar-view__image" :src="avatarUrl" @click.exact="closeModal" />
    </div>
  </modal>
</template>

<script>
import { Modal } from '@vue-norma/ui'

export default {
  name: 'user-avatar-view-modal',
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
    return {
      size: 600
    }
  },
  computed: {
    avatarUrl() {
      return `https://www.gravatar.com/avatar/${this.data.avatar.hash}?s=${this.size}&d=identicon`
    }
  },
  methods: {
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss">
.avatar-view {
  display: flex;
  justify-content: center;
  align-items: center;

  &__image {
    margin: auto;
    display: block;
    user-select: none;
    outline: none;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>