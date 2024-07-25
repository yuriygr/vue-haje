<template>
  <tabs>
    <template v-for="(item, index) in tabs" :key="`communities-tab-${item.key}-${index}`">
      <tabs-item :to="item.to" :selected="item.key == filters.tab" :disabled="item.disabled">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

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
  </div>
  
  <spacer height="15" />

  <communities-list v-if="(!loading && !error) || data.length > 0">
    <community-item-wrapper v-for="item in data" :key="`community-${item.community_id}`">
      <community-item :data="item" type="short" />
    </community-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </communities-list>

  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_communities.icon')"
      :header="$t('errors.empty_communities.title')"
      :text="$t('errors.empty_communities.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Tabs, TabsItem, Separator, Spacer, Placeholder } from '@vue-norma/ui'
import { CommunitiesList, CommunityItem, CommunityItemWrapper } from '@/components/community'

export default {
  name: 'communities',
  components: {
    Tabs, TabsItem, Separator, Spacer, Placeholder,
    CommunitiesList, CommunityItem, CommunityItemWrapper
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('communities.title')
      }
    }
  },
  computed: {
    ...mapState('communities', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('communities', [ 'hasMoreItems' ]),
    query() {
      return this.$route.query.q
    },
    tabs() {
      return [
        {
          key: 'subscribed',
          to: this.formatLink(),
          label: this.$t('communities.tabs.subscribed')
        },
        {
          key: 'manage',
          to: this.formatLink('manage'),
          label: this.$t('communities.tabs.manage')
        }
      ]
    },
    availableKeys() {
      return this.tabs.flatMap(el => el.key)
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    formatLink(tab = false) {
      if (tab) {
        return { name: this.$route.name, query: { tab }}
      } else {
        return { name: this.$route.name }
      }
    },
    changeInput(query) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, q: query } })
    },
    loadMore() {
      this.$store.dispatch('communities/more')
    },
    deleteTabQuery() {
      let query = Object.assign({}, this.$route.query)
      delete query.tab
      this.$router.replace({ name: this.$route.name, query })
    },
  },
  async mounted() {
    await this.$store.dispatch('communities/setFilters', {
      tab: this.availableKeys.includes(this.$route.query.tab)
            ? this.$route.query.tab
            : ( this.deleteTabQuery(), 'subscribed' ), offset: undefined
    })
    this.$store.dispatch('communities/fetch')
  },
  unmounted() {
    this.$store.dispatch('communities/clear')
  },
  watch: {
    async '$route.query.tab'(to) {
      await this.$store.dispatch('communities/setFilters', {
        tab: this.availableKeys.includes(to) ? to : 'subscribed', offset: undefined
      })
      this.$store.dispatch('communities/fetch')
    }
  }
}
</script>

<style lang="scss">

</style>