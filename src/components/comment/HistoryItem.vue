<template>
  <div class="comment-history">
    <div class="comment-history__header">
      <user-item :data="data.user" :showSubscribeAction="false" mode="small" />
      <meta-info class="comment-history__meta" :items="metaItems" />
    </div>
    <div v-if="data.content" class="comment-history__content" v-html="$filters.contentFormat(data.content.text)" />
  </div>
</template>

<script>
import { MetaInfo } from '@vue-norma/ui'

import { UserItem } from '@/components/user'

export default {
  name: 'comment-history-item',
  components: {
    UserItem,
    MetaInfo
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  computed: {
    metaItems() {
      let _result = []

      _result.push({ label: this.formatedDate })

      return _result
    },
    formatedDate() {
      return this.$filters.timeAgo(this.data.content.date_added, this.$i18n.locale)
    }
  },
  methods: {
 
  }
}
</script>

<style lang="scss">
.comment-history {
  --comment-history__content--background: #f5f5f5;
  
  html[data-theme="black"] & {
    --comment-history__content--background: #181818;
  }
}

.comment-history {
  &__header {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  &__meta {
    margin-top: .5rem;
  }

  &__content {
    background: var(--comment-history__content--background);
    padding: 1rem 1rem;
    border-radius: 8px;
    font-size: 1.4rem;
    line-height: 1.4em;
    word-break: break-word;
  }
}
</style>