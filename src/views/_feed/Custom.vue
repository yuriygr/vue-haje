<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <feed-item :data="data" />

    <separator />

    <router-view :key="$route.fullPath" />
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="humanizeError(error).icon"
      :header="humanizeError(error).title"
      :text="humanizeError(error).description"
    />
  </template>
</template>

<script>
import { mapState } from 'vuex'
import { Placeholder, PlaceholderLoading, Separator } from '@vue-norma/ui'

import { FeedItem } from '@/components/feed'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'feed-custom',
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    Placeholder, PlaceholderLoading, Separator,
    FeedItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feed.title'),
      },
    }
  },
  setup() {
    const humanizeError = useHumanizeError()
    return { humanizeError }
  },
  computed: {
    ...mapState('feed/custom', [ 'data', 'loading', 'error' ])
  },
  mounted() {
    this.$store.dispatch('feed/custom/fetch', this.uuid)
  },
  beforeUnmount() {
    this.$store.dispatch('feed/custom/clear')
  },
  watch: {
    'data'(to) {
      if (to)
        this.meta.title = to.title
    },
    'error'(to) {
      if (to)
        this.meta.title = this.humanizeError(to).title
    },
    '$route.params.uuid'(to) {
      if (to) {
        this.$store.dispatch('feed/custom/fetch', to)
      }
    }
  }
}
</script>

<style lang="scss">
.tag-header {
  --tag-header__label-color: var(--x-body--color);
  --tag-header__hash-color: #868e96;

  html[data-theme="black"] & {
    --tag-header__label-color: var(--x-body--color);
    --tag-header__hash-color: var(--x-color-white--shade40, #999);
  }
}

.tag-header {
  &__content {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-bottom: 1rem;
  }

  &__hash {
    color: var(--tag-header__hash-color);
    font-size: 2.0rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.6 * 1em);
  }

  &__label {
    color: var(--tag-header__label-color);
    font-size: 2.3rem;
    font-weight: var(--x-font-weight--bold);
    line-height: calc(1.4 * 1em);
  }

  &__hash + &__label {
    margin-left: .5rem;
  }
}
</style>