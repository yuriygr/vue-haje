<template>
  <group v-if="data.users.length > 0 || loading">
    <n-header>{{ $t('search.section.users') }}</n-header>

    <items-list type="users" :has-data="data.users.length > 0" :loading="loading">
      <user-item v-for="item in data.users" :key="`user-short-${item.user_id}`" v-memo="[item.user_id]" :data="item" />

      <template #skeleton>
        <user-item v-for="index in 5" :key="`item-${index}`" />
      </template>
    </items-list>

    <spacer height="20" />

    <n-button component="router-link"  mode="secondary" :disabled="loading" active-class="" exact-active-class="" :to="formatLink('users')">{{ $t('action.show_more') }}</n-button>
  </group>

  <group v-if="data.entries.length > 0 || loading">
    <n-header>{{ $t('search.section.entries') }}</n-header>

    <items-list type="entries" :has-data="data.entries.length > 0" :loading="loading">
      <entry-item v-for="item in data.entries" :key="`entry-${item.uuid}`" v-memo="[item.uuid]" :data="item" type="short" />

      <template #skeleton>
        <entry-item v-for="index in 5" :key="`item-${index}`" />
      </template>
    </items-list>

    <spacer height="20" />

    <n-button component="router-link"  mode="secondary" :disabled="loading" active-class="" exact-active-class="" :to="formatLink('entries')">{{ $t('action.show_more') }}</n-button>
  </group>

  <group v-if="data.tags.length > 0 || loading">
    <n-header>{{ $t('search.section.tags') }}</n-header>

    <items-list type="tags" :has-data="data.tags.length > 0" :loading="loading">
      <tag-item v-for="item in data.tags" :key="`tag-${item.tag_id}`" v-memo="[item.tag_id]" :data="item" />

      <template #skeleton>
        <tag-item v-for="index in 5" :key="`item-${index}`" />
      </template>
    </items-list>

    <spacer height="20" />

    <n-button component="router-link"  mode="secondary" :disabled="loading" active-class="" exact-active-class="" :to="formatLink('tags')">{{ $t('action.show_more') }}</n-button>
  </group>

  <group v-if="data.comments.length > 0 || loading">
    <n-header>{{ $t('search.section.comments') }}</n-header>

    <items-list type="comments" :has-data="data.comments.length > 0" :loading="loading">
      <comment-item v-for="item in data.comments" :key="`comment-${item.comment_id}`" v-memo="[item.comment_id]" :data="item" replyButton="link" />

      <template #skeleton>
        <comment-item v-for="index in 5" :key="`item-${index}`" />
      </template>
    </items-list>
    
    <spacer height="20" />

    <n-button component="router-link"  mode="secondary" :disabled="loading" active-class="" exact-active-class="" :to="formatLink('comments')">{{ $t('action.show_more') }}</n-button>
  </group>

  <placeholder v-if="error"
    :icon="humanizeError(error).icon"
    :header="humanizeError(error).title"
    :text="humanizeError(error).description"
  />
  <placeholder v-else-if="emptyData && !loading"
    :icon="$t('search.empty.icon')"
    :header="$t('search.empty.title')"
    :text="$t('search.empty.description')"
  />
</template>

<script>
import { NHeader, Placeholder, Separator, Spacer, Group, NButton } from '@vue-norma/ui'

import { EntryItem } from '@/components/entry'
import { CommentItem } from '@/components/comment'
import { UserItem } from '@/components/user'
import { TagItem } from '@/components/tag'

import { useSearchAllStore } from '@/app/store/modules/search'
import { useHumanizeError } from '@/app/composables/useHumanizeError'

export default {
  name: 'search-all',
  components: {
    NHeader,
    Placeholder, Separator, Spacer,
    Group, NButton,
    UserItem,
    EntryItem,
    CommentItem,
    TagItem
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('search.title.all')
      }
    }
  },
  setup() {
    const store = useSearchAllStore()
    const humanizeError = useHumanizeError()
    return { store, humanizeError }
  },
  computed: {
    data()         { return this.store.data },
    filters()      { return this.store.filters },
    loading()      { return this.store.loading },
    error()        { return this.store.error },
    
    emptyData()    {
      return (
        this.data.entries.length + this.data.users.length + this.data.comments.length + this.data.tags.length + this.data.feeds.length
      ) == 0
    },
  },
  methods: {
    formatLink(tab = false) {
      let query = Object.assign({}, this.$route.query),
          q = query.q
  
      return { name: `search-${tab}`, query: { q }}
    },
  },
  mounted() {
    this.store.setFilters({
      query: this.$route.query.q
    })
    this.store.fetch()
  },
  beforeUnmount() {
    this.store.clear()
  },
  watch: {
    async '$route.query.q'(to) {
      this.store.setFilters({
        query: to
      })
      this.store.fetch()
    }
  }
}
</script>