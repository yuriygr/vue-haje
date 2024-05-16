<template>
  <template v-if="(!loading && !error) && Object.keys(data).length > 0">
    <div class="community-header">
      <div class="community-header__content">
        <div class="community-header__title">{{ data.title }}</div>
        <div class="community-header__description">{{ data.description }}</div>
      </div>
      <meta-info class="community-header__meta" :items="metaItems" />
    </div>

    <separator />

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </template>

  <template v-if="Object.keys(data).length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.community_not_found.icon')"
      :header="$t('errors.community_not_found.title')"
      :text="$t('errors.community_not_found.description')"
    />
  </template>
</template>

<script>
import { mapState } from 'vuex'
import { Placeholder, PlaceholderLoading, Separator, MetaInfo } from '@vue-norma/ui'

export default {
  name: 'community',
  props: {
    slug: {
      type: [ Boolean, String ],
      defalult: false
    }
  },
  components: { Placeholder, PlaceholderLoading, Separator, MetaInfo },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('community.title'),
      },
    }
  },
  computed: {
    ...mapState('community', [ 'data', 'loading', 'error' ]),
    metaItems() {
      let _result = []

      this.data.state.is_official && _result.push({ label: this.$t('community.meta.official') })
      _result.push({ label: this.$tc('community.meta.subscribers', this.data.counters.subscribers) })

      return _result
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {

  },
  mounted() {
    this.$store.dispatch('community/fetch', this.slug)
  },
  unmounted() {
    this.$store.dispatch('community/clear')
  },
  watch: {
    'data'(to) {
      if (to)
        this.meta.title = `${to.title}`
    },
    '$route.params.slug'(to, from) {
      if (to != from) {
        this.$store.dispatch('community/fetch', to)
      }
    }
  }
}
</script>

<style lang="scss">
.community-header {

}

.community-header {
  &__content {
    display: flex;
    flex-direction: column;

    margin-bottom: 1rem;
  }

  &__title {
    white-space: pre-line;
    word-wrap: break-word;
    word-break: break-word;
    font-size: 2.4rem;
    font-weight: var(--x-font-weight--bold);
    line-height: calc(1.5 * 1em);
  }

  &__description {
    white-space: pre-line;
    word-wrap: break-word;
    word-break: break-word;
    font-size: 1.5rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
  }
}
</style>