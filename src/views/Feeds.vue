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

  <feeds-list v-if="data.length > 0 || loading">
    <template v-if="data.length > 0">
      <feed-item-wrapper v-for="item in data" :key="`feed-${item.feed_id}`" v-memo="[item.feed_id]">
        <feed-item :data="item" type="short" />
      </feed-item-wrapper>

      <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />
      <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
    </template>
  
    <template v-else-if="loading">
      <feed-item-wrapper v-for="index in 5" :key="`item-${index}`">
        <feed-item />
      </feed-item-wrapper>
    </template>
  </feeds-list>

  <placeholder v-else-if="error"
    :icon="$t($filters.humanizeError(error).icon)"
    :header="$t($filters.humanizeError(error).title)"
    :text="$t($filters.humanizeError(error).description)"
  />
  <placeholder v-else
    :icon="$t('feeds.empty.icon')"
    :header="$t('feeds.empty.title')"
    :text="$t('feeds.empty.description')"
  />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { NButton, Separator, Spacer, Placeholder, LoadmoreTrigger } from '@vue-norma/ui'

import { useFeedsStore } from '@/app/components/stores/modules/feeds'
import { FeedsList, FeedItem, FeedItemWrapper } from '@/components/feed'

let FeedCreateModal = defineAsyncComponent(() => import("@/modals/_feed/Create.vue"))

export default {
  name: 'feeds',
  components: {
    NButton, Separator, Spacer, Placeholder, LoadmoreTrigger,
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
  created() {
    this.store = useFeedsStore()
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    hasMoreItems() { return this.store.hasMoreItems },
    query()        { return this.$route.query.q ?? '' },
  },
  methods: {
    openCreateModal() {
      this.$modals.show(FeedCreateModal)
    },
    changeInput(value) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, q: value } })
    },
    loadMore() {
      this.store.more()
    }
  },
  async mounted() {
    await this.store.setFilters({ query: this.query, offset: undefined })
    await this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    async '$route.query.q'(to) {
      await this.store.setFilters({ query: to, offset: undefined })
      await this.store.fetch()
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