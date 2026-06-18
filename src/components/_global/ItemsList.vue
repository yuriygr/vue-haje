<template>
  <div v-if="hasData || loading" class="items-list" :class="`items-list--${type}`">
    <template v-if="hasData">
      <slot />

      <template v-if="hasMore">
        <loadmore-trigger @intersected="$emit('more')" />
        <n-button mode="secondary" @click.exact="$emit('more')" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
      </template>
    </template>

    <template v-else-if="loading">
      <slot name="skeleton" />
    </template>
  </div>
</template>

<script>
export default { name: 'items-list' }
</script>

<script setup>
import { NButton, LoadmoreTrigger } from '@vue-norma/ui'

const props = defineProps({
  type:    { type: String,  default: 'default' },
  loading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  hasData: { type: Boolean, default: false },
})

defineEmits(['more'])
</script>

<style lang="scss">
.items-list {
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    position: relative;
    margin-bottom: var(--m-size, 1.5rem);
  }

  &--entries        { --m-size: 4.0rem; }
  &--users          { --m-size: 1.5rem; }
  &--badges         { --m-size: 3.0rem; }
  &--feeds          { --m-size: 2.0rem; }
  &--notifications  { --m-size: 2.5rem; }
  &--helps          { --m-size: 1.5rem; align-items: flex-start; }
  &--tags           { --m-size: 1.0rem; align-items: flex-start; }
  &--tickets        { --m-size: 1.5rem; align-items: flex-start; }
  &--logins         { --m-size: 1.0rem; align-items: flex-start; }
}
</style>