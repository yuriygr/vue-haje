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

    <div v-if="hasFilters" class="search-form__filter">
      <n-button icon_before="bars-filter-line" @click="openFilterModal" :badge="filterBadge" size="l" mode="tertiary" :title="$t('search.filter')" />
    </div>
  </div>
  
  <spacer height="15" />

  <tabs>
    <template v-for="item in tabs" :key="`search-tab-${item.key}`">
      <tabs-item :to="item.to" :selected="item.active" :disabled="item.disabled">{{ item.label }}</tabs-item>
    </template>
  </tabs>

  <spacer height="30" />

  <router-view />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { NButton, Tabs, TabsItem, Separator, Spacer } from '@vue-norma/ui'

let SearchFilterModal = defineAsyncComponent(() => import("@/components/modals/SearchFilter.vue"))

export default {
  name: 'search',
  components: {
    NButton, Tabs, TabsItem, Separator, Spacer
  },
  data() {
    return { }
  },
  computed: {
    query() {
      return this.$route.query.q
    },
    filterBadge() {
      return true
    },
    hasFilters() {
      let key = this.$route.meta.key
      return this.$store.getters[`search/${key}/hasFilters`]
    },
    tabs() {
      return [
        {
          key: 'all',
          to: this.formatLink(),
          label: this.$t('search.tabs.all'),
          active: this.$route.meta.key == `all` 
        },
        {
          key: 'users',
          to: this.formatLink('users'),
          label: this.$t('search.tabs.users'),
          active: this.$route.meta.key == `users`
        },
        {
          key: 'entries',
          to: this.formatLink('entries'),
          label: this.$t('search.tabs.entries'),
          active: this.$route.meta.key == `entries`
        },
        {
          key: 'comments',
          to: this.formatLink('comments'),
          label: this.$t('search.tabs.comments'),
          active: this.$route.meta.key == `comments`
        },
        {
          key: 'tags',
          to: this.formatLink('tags'),
          label: this.$t('search.tabs.tags'),
          active: this.$route.meta.key == `tags`
        }
      ]
    },
    availableKeys() {
      return this.tabs.flatMap(el => el.key)
    }
  },
  methods: {
    openFilterModal() {
      this.$modals.show(SearchFilterModal, {
        data: this.$route.meta.key
      })
    },
    formatLink(tab = false) {
      let query = Object.assign({}, this.$route.query),
          q = query.q

      if (tab) {
        return { name: `search-${tab}`, query: { q }}
      } else {
        return { name: `search`, query: { q }}
      }
    },
    changeInput(query) {
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, q: query } })
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