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

  <placeholder
    :icon="$t('errors.todo.icon')"
    :header="$t('errors.todo.title')"
    :text="$t('errors.todo.description')"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { IconButton, Tabs, TabsItem, Separator, Spacer, Placeholder } from '@vue-norma/ui'

export default {
  name: 'communities',
  components: {
    IconButton, Tabs, TabsItem, Separator, Spacer, Placeholder
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
    ...mapState('notifications', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('notifications', [ 'hasMoreItems' ]),
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
      this.$store.dispatch('notifications/more')
    },
    deleteTabQuery() {
      let query = Object.assign({}, this.$route.query)
      delete query.tab
      this.$router.replace({ name: this.$route.name, query })
    },
  },
  async mounted() {
    await this.$store.dispatch('notifications/setFilters', {
      tab: this.availableKeys.includes(this.$route.query.tab)
            ? this.$route.query.tab
            : ( this.deleteTabQuery(), 'subscribed' ), offset: undefined
    })
    this.$store.dispatch('notifications/fetch')
  },
  unmounted() {
    this.$store.dispatch('notifications/clear')
  },
  watch: {
    async '$route.query.tab'(to) {
      await this.$store.dispatch('notifications/setFilters', {
        tab: this.availableKeys.includes(to) ? to : 'subscribed', offset: undefined
      })
      this.$store.dispatch('notifications/fetch')
    }
  }
}
</script>

<style lang="scss">

</style>