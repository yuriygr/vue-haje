<template>
  <template v-if="data">
    <div :class="[ 'notification-item', `notification-item--type-${data.type}` ]">
      <router-link :to="link" :class="[ 'notification-item__icon']" active-class="" exact-active-class="">
        <span v-if="data.is_readed" class="notification-item__badge"></span>
        <icon :name="noticeIcon" size="18" />
      </router-link>
      <router-link :to="link" class="notification-item__content" active-class="" exact-active-class="">
        <div class="notification-item__label" v-if="data.type == 'subscription'">
          <i18n-t :keypath="`notifications.type.${data.type}`">
            <router-link :to="senderLink">{{ data.sender_name }}</router-link>
          </i18n-t>
        </div>

        <div class="notification-item__label" v-if="data.type == 'mention'">
          <i18n-t :keypath="`notifications.type.${data.type}`">
            <router-link :to="senderLink">{{ data.sender_name }}</router-link>
            <template v-if="data.comment_id">{{ $t('notifications.const.comment[1]') }}</template>
            <template v-else>{{ $t('notifications.const.entry[1]') }}</template>
          </i18n-t>
        </div>

        <div class="notification-item__label" v-if="data.type == 'reply'">
          <i18n-t :keypath="`notifications.type.${data.type}`">
            <router-link :to="senderLink">{{ data.sender_name }}</router-link>
          </i18n-t>
        </div>

        <div class="notification-item__label" v-if="data.type == 'comment'">
          <i18n-t :keypath="`notifications.type.${data.type}`">
            <router-link :to="senderLink">{{ data.sender_name }}</router-link>
          </i18n-t>
        </div>

        <div class="notification-item__label" v-if="data.type == 'new_post'">
          <i18n-t :keypath="`notifications.type.${data.type}`">
            <router-link :to="senderLink">{{ data.sender_name }}</router-link>
          </i18n-t>
        </div>

        <meta-info class="notification-item__meta" :items="metaItems" />
      </router-link>
      <buttons-group :withGap="true" class="notification-item__actions">
        <n-button icon_before="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
      </buttons-group>
    </div>
  </template>
  <template v-else>
    <div :class="[ 'notification-item' ]">
      <div :class="[ 'notification-item__icon']"></div>

      <div class="notification-item__content">
        <div class="notification-item__label">
          <skeleton :width="240" :height="9" />
        </div>
        <skeleton :width="55" :height="8" />
      </div>

      <buttons-group :withGap="true" class="notification-item__actions">
        <n-button icon_before="ui-more" mode="tertiary" disabled="true" :title="$t('action.options')" />
      </buttons-group>
    </div>
  </template>
</template>

<script>
import { Icon, NButton, ButtonsGroup, MetaInfo } from '@vue-norma/ui'

export default {
  name: 'notification-item',
  components: {
    Icon, NButton, ButtonsGroup, MetaInfo
  },
  props: {
    data: false,
  },
  data() {
    return {

    }
  },
  computed: {
    payload() {
      return false
      return JSON.parse(this.data.payload)
    },

    link() {
      switch (this.data.type) {
        case 'subscription':
          return this.senderLink
        case 'mention':
          if (this.data.comment_id)
            return this.commentLink
          else 
            return this.entryLink

        case 'reply':
          return this.commentLink

        case 'comment':
          return this.commentLink

        case 'new_post':
          return this.entryLink
      }
    },

    noticeIcon() {
      switch (this.data.type) {
        case 'subscription':
          return 'user-follow-line'
        case 'mention':
          return 'at-line'
        case 'reply':
          return 'reply-line'
        case 'comment':
          return 'comments-line'
        case 'new_post':
          return ''
      }
    },
    optionsItems() {
      return [
        {
          icon: 'ui-check-double',
          label: this.$t('notifications.action.read'),
          action: this.readNotify
        },
        {
          icon: 'ui-eye-off',
          label: this.$t('notifications.action.hide'),
          action: this.hideNotify
        }
      ]
    },
    metaItems() {
      let _result = []
      _result.push({ label: this.formatedDate })
      return _result
    },
    senderLink() {
      return { name: 'user', params: { username: this.data.sender_username } }
    },
    entryLink() {
      return { name: 'entry', params: { uuid: this.data.entry_uuid } }
    },
    commentLink() {
      return { name: 'entry', params: { uuid: this.data.entry_uuid }, query: { comment: this.data.comment_id } }
    },
    formatedDate() {
      return this.$filters.timeAgo(this.data.meta.date_added, this.$i18n.locale)
    }
  },
  methods: {
    toggleOptions(e) {
      let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
      this.$popover.open({
        items: this.optionsItems,
        target: target,
        align: 'right'
      })
    },
    readNotify() {
      this.$api.post(`my/notifications/${this.data.notify_id}/read`)
      .then(_ => {
        this.$alerts.success({ text: 'Уведомление прочитано' })
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => this.$popover.close())
    },
    hideNotify() {
      this.$api.post(`my/notifications/${this.data.notify_id}/hide`)
      .then(_ => {
        this.$alerts.success({ text: 'Уведомление скрыто' })
      })
      .catch(error => {
        this.$alerts.danger({ text: error.status })
      })
      .then(_ => this.$popover.close())
    }
  }
}
</script>

<style lang="scss">
.notification-item {
  --notification-item__icon--background: #fafafa;
  --notification-item__name--color: #212529;
  --notification-item__label--color: #666;
  --notification-item__badge--color: #e03131;
  --notification-item__badge--border: var(--x-background);
  
  html[data-theme="black"] & {
    --notification-item__icon--background: #171717;
    --notification-item__name--color: var(--x-body--color);
    --notification-item__label--color: #919190;
    --notification-item__badge--color: #e03131;
    --notification-item__badge--border: var(--x-background);
  }
}

.notification-item {
  --notification-item__icon--size: 40px;

  &--type-mention {
    --notification-item__icon--color: var(--x-color-pink--shade30);
  }

  &--type-subscription {
    --notification-item__icon--color: var(--x-color-success--shade10);
  }

  &--type-reply,
  &--type-comment {
    --notification-item__icon--color: var(--x-color-action--shade30);
  }
}

.notification-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  
  &__badge {
    position: absolute;
    right: -2px;
    top: -2px;
    background-color: var(--notification-item__badge--color);
    border-radius: 50%;
    border: 3px solid var(--notification-item__badge--border);
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
    height: 12px;
    width: 12px;
    user-select: none;
  }

  &__icon {
    background: var(--notification-item__icon--background);
    color: var(--notification-item__icon--color);
    margin-right: .75rem;
    padding: 11px;
    width: var(--notification-item__icon--size);
    height: var(--notification-item__icon--size);
    position: relative;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg { display: block; fill: currentColor; }
  }

  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: flex-start;
    flex: 1;

    color: var(--notification-item__label--color);

    @media(hover: hover) {
      &:hover { text-decoration: none; color: var(--notification-item__label--color);; }
    }
  }

  &__label {
    color: var(--notification-item__label--color);
    font-size: 1.4rem;
    font-weight: 400;
    line-height: calc(1.4 * 1em);
    margin-bottom: .25rem;

    a {
      color: var(--notification-item__name--color);

      @media(hover: hover) {
        &:hover { text-decoration: underline; color: var(--notification-item__name--color); }
      }
    }
  }

  &__actions {
    margin-left: auto;
  }
}
</style>