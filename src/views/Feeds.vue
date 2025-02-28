<template>
  <div class="search-form">
    <div class="search-form__field">
      <text-field
        icon="search-line"
        size="m"
        :modelValue="query"
        :placeholder="$t('search.search-field.placeholder')"

        @keyup.enter="changeInput($event.target.value)"
      />
    </div>
    <div class="search-form__filter">
      <n-button icon_before="add-line" mode="tertiary" size="l" @click="openCreateModal" :title="$t('action.create')" />
    </div>
  </div>

  <spacer height="15" />

  <feeds-list v-if="(!loading && !error) || data.length > 0">
    <feed-item-wrapper v-for="item in data" :key="`feed-${item.feed_id}`">
      <feed-item :data="item" type="short" />
    </feed-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </feeds-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.feeds_not_created.icon')"
      :header="$t('errors.feeds_not_created.title')"
      :text="$t('errors.feeds_not_created.description')"
    />
  </template>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { NButton, Separator, Spacer, Placeholder, PlaceholderLoading } from '@vue-norma/ui'

let FeedCreateModal = defineAsyncComponent(() => import("@/components/modals/_feed/Create.vue"))

import { FeedsList, FeedItem, FeedItemWrapper } from '@/components/feed'

export default {
  name: 'feeds',
  components: {
    NButton, Separator, Spacer, Placeholder, PlaceholderLoading,
    FeedsList, FeedItem, FeedItemWrapper
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('feeds.title')
      }
    }
  },
  computed: {
    ...mapState('feeds', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('feeds', [ 'hasMoreItems' ]),
    query() {
      return this.$route.query.q
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    openCreateModal() {
      this.$modals.show(FeedCreateModal, {
        data: this.$route.meta.key
      })
    },
    changeInput(query) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, q: query } })
    },
    loadMore() {
      this.$store.dispatch('feeds/more')
    }
  },
  async mounted() {
    await this.$store.dispatch('feeds/setFilters', {
      query: this.$route.query.q, offset: undefined
    })
    this.$store.dispatch('feeds/fetch')
  },
  unmounted() {
    this.$store.dispatch('feeds/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('feeds/setFilters', { query: to, offset: undefined })
      this.$store.dispatch('feeds/fetch')
    }
  }
}
</script>

<style lang="scss">
.search-form {
  display: flex;
  justify-content: space-between;

  &__field {
    display: flex;
    width: 100%;
  }

  &__filter {
    display: flex;
    margin-left: 5px;
  }
}
</style>