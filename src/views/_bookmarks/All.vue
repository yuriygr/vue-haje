<template>
  <template v-if="(data.entries.length + data.users.length) > 0">
    <group v-if="data.users.length > 0">
      <n-header>{{ $t('bookmarks.section.users') }}</n-header>

      <users-list>
        <user-item-wrapper v-for="item in data.users" :key="`user-short-${item.user_id}`">
          <user-item :data="item" />
        </user-item-wrapper>
      </users-list>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="{ name: 'boookmarks-users' }">{{ $t('action.show_more') }}</n-button>
    </group>

    <group v-if="data.entries.length > 0">
      <n-header>{{ $t('bookmarks.section.entries') }}</n-header>

      <entries-list>
        <entry-item-wrapper v-for="item in data.entries" :key="`entry-${item.uuid}`">
          <entry-item :data="item" type="short" />
        </entry-item-wrapper>
      </entries-list>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="{ name: 'boookmarks-entries' }">{{ $t('action.show_more') }}</n-button>
    </group>
  </template>

  <template v-if="(data.entries.length + data.users.length) == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_bookmarks.icon')"
      :header="$t('errors.empty_bookmarks.title')"
      :text="$t('errors.empty_bookmarks.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  NHeader,
  Placeholder, PlaceholderLoading, Separator, Spacer,
  Group, NButton
} from '@vue-norma/ui'

import { UsersList, UserItem, UserItemWrapper } from '@/components/user'
import { EntriesList, EntryItem, EntryItemWrapper } from '@/components/entry'

export default {
  name: 'bookmarks-all',
  components: {
    NHeader,
    Placeholder, PlaceholderLoading, Separator, Spacer,
    Group, NButton,
    UsersList, UserItem, UserItemWrapper,
    EntriesList, EntryItem, EntryItemWrapper
  },
  computed: {
    ...mapState('bookmarks/all', [ 'data', 'loading', 'error' ]),
    ...mapGetters('bookmarks/all', [ 'emptyQuery', 'bookmarksing' ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  data() {
    return { }
  },
  methods: {
    formatLink(tab = false) {
      return { name: `bookmarks-${tab}`}
    },
  },
  mounted() {
    this.$store.dispatch('bookmarks/all/fetch')
  },
  unmounted() {
    this.$store.dispatch('bookmarks/all/clear')
  },
  watch: {}
}
</script>

<style>

</style>