<template>
  <buttons-group v-if="reactions">
    <template v-for="(count, reaction) in reactions.items">
      <n-button :icon_before="`reaction-${reaction}`" size="s" @click="react(reaction)" :mode="reactions.current == reaction ? 'secondary' : 'tertiary'">
        {{ count }}
      </n-button>
    </template>
  </buttons-group>
</template>

<script>
import { ButtonsGroup, NButton } from '@vue-norma/ui'

export default {
  name: 'Reactions',
  emits: [ 'react' ],
  components: { ButtonsGroup, NButton },
  props: {
    reactions: {
      type: Object,
      default: []
    }
  },
  data() {
    return {}
  },
  methods: {
    react(react) {
      this.$emit('react', react)
    },
    removeReaction() {

    },
  }
}
</script>
