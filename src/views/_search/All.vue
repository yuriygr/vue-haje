<template>
  <template v-if="!emptyData">
    <group v-if="data.users.length > 0">
      <n-header>{{ $t('search.section.users') }}</n-header>

      <users-list>
        <user-item-wrapper v-for="item in data.users" :key="`user-short-${item.user_id}`" v-memo="[item.user_id]">
          <user-item :data="item" />
        </user-item-wrapper>
      </users-list>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="formatLink('users')">{{ $t('action.show_more') }}</n-button>
    </group>

    <group v-if="data.entries.length > 0">
      <n-header>{{ $t('search.section.entries') }}</n-header>

      <entries-list>
        <entry-item-wrapper v-for="item in data.entries" :key="`entry-${item.uuid}`">
          <entry-item :data="item" type="short" />
        </entry-item-wrapper>
      </entries-list>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="formatLink('entries')">{{ $t('action.show_more') }}</n-button>
    </group>

    <group v-if="data.tags.length > 0">
      <n-header>{{ $t('search.section.tags') }}</n-header>

      <tags-list>
        <tag-item-wrapper v-for="item in data.tags" :key="`tag-item-${item.tag_id}`" v-memo="[item.tag_id]">
          <tag-item :data="item" />
        </tag-item-wrapper>
      </tags-list>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="formatLink('tags')">{{ $t('action.show_more') }}</n-button>
    </group>

    <group v-if="data.comments.length > 0">
      <n-header>{{ $t('search.section.comments') }}</n-header>

      <div class="comments-list">
        <comment-item-wrapper v-for="item in data.comments" :key="`comment-${item.comment_id}`">
          <comment-item :data="item" replyButton="link" />
        </comment-item-wrapper>
      </div>

      <spacer height="20" />

      <n-button component="router-link"  mode="secondary" active-class="" exact-active-class="" :to="formatLink('comments')">{{ $t('action.show_more') }}</n-button>
    </group>

  </template>

  <template v-if="emptyData">
    <template v-if="loading">
      <group>
        <n-header><skeleton :width="80" :height="12" /></n-header>
        <users-list>
          <user-item-wrapper v-for="index in 5" :key="`user-skeleton-${index}`">
            <user-item />
          </user-item-wrapper>
        </users-list>
      </group>
      <group>
        <n-header><skeleton :width="91" :height="12" /></n-header>
        <entries-list>
          <entry-item-wrapper v-for="index in 5" :key="`entry-skeleton-${index}`">
            <entry-item />
          </entry-item-wrapper>
        </entries-list>
      </group>
      <group>
        <n-header><skeleton :width="30" :height="12" /></n-header>
        <tags-list>
          <tag-item-wrapper v-for="index in 5" :key="`tag-skeleton-${index}`">
            <tag-item />
          </tag-item-wrapper>
        </tags-list>
      </group>
      <group>
        <n-header><skeleton :width="60" :height="12" /></n-header>
        <div class="comments-list">
          <comment-item-wrapper v-for="index in 5" :key="`item-${index}`">
            <comment-item />
          </comment-item-wrapper>
        </div>
      </group>
    </template>
    <placeholder v-else-if="error"
      :icon="$t($filters.humanizeError(error).icon)"
      :header="$t($filters.humanizeError(error).title)"
      :text="$t($filters.humanizeError(error).description)"
    />
    <placeholder v-else
      :icon="$t('search.empty.icon')"
      :header="$t('search.empty.title')"
      :text="$t('search.empty.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  NHeader,
  Placeholder, Separator, Spacer,
  Group, NButton
} from '@vue-norma/ui'

import { UsersList, UserItem, UserItemWrapper } from '@/components/user'
import { EntriesList, EntryItem, EntryItemWrapper } from '@/components/entry'
import { CommentItem, CommentItemWrapper } from '@/components/comment'
import { TagsList, TagItem, TagItemWrapper } from '@/components/tag'

export default {
  name: 'search-all',
  components: {
    NHeader,
    Placeholder, Separator, Spacer,
    Group, NButton,
    UsersList, UserItem, UserItemWrapper,
    EntriesList, EntryItem, EntryItemWrapper,
    CommentItem, CommentItemWrapper,
    TagsList, TagItem, TagItemWrapper
  },
  computed: {
    ...mapState('search/all', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('search/all', [ 'emptyData', 'emptyQuery', 'searching' ])
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('search.title.all')
      }
    }
  },
  methods: {
    formatLink(tab = false) {
      let query = Object.assign({}, this.$route.query),
          q = query.q
  
      return { name: `search-${tab}`, query: { q }}
    },
  },
  async mounted() {
    await this.$store.dispatch('search/all/setFilters', {
      query: this.$route.query.q
    })
    await this.$store.dispatch('search/all/fetch')
  },
  beforeUnmount() {
    this.$store.dispatch('search/all/clear')
  },
  watch: {
    async '$route.query.q'(to) {
      await this.$store.dispatch('search/all/setFilters', { query: to })
      await this.$store.dispatch('search/all/fetch')
    }
  }
}
</script>