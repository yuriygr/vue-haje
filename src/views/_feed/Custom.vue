<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <feed-item-wrapper :key="`feed-${data.feed_id}`">
      <feed-item :data="data" type="short" />
    </feed-item-wrapper>

    <separator />

    <router-view :key="$route.fullPath" />
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
  </template>
</template>

<script>
import { mapState } from 'vuex'
import { Placeholder, PlaceholderLoading, Separator, MetaInfo } from '@vue-norma/ui'

import { FeedItem, FeedItemWrapper } from '@/components/feed'

export default {
  name: 'feed-custom',
  props: {
    uuid: {
      type: [ Boolean, String ],
      default: false
    }
  },
  components: {
    Placeholder, PlaceholderLoading, Separator, MetaInfo,
    FeedItem, FeedItemWrapper
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feed.title'),
      },
    }
  },
  computed: {
    ...mapState('feed/custom', [ 'data', 'loading', 'error' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {

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
        this.meta.title = this.$t(this.humanizeError.title)
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

  html[data-theme='black'] & {
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