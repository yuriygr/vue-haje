<template>
  <div :class="[ 'notification-item' ]">
    <div class="notification-item__content">

      <div class="notification-item__label" v-if="`${data.actor_type}.${data.type}` == 'user.subscriptions'">
        <i18n-t :keypath="`notifications.${data.actor_type}.${data.type}`">
          <router-link :to="{ name: 'user', params: { username: payload.user.username } }">{{ payload.user.name }}</router-link>
        </i18n-t>
      </div>

      <div class="notification-item__label" v-if="`${data.actor_type}.${data.type}` == 'user.mentions'">
        <i18n-t :keypath="`notifications.${data.actor_type}.${data.type}`">
          <router-link :to="{ name: 'user', params: { username: payload.user.username } }">{{ payload.user.name }}</router-link>
        </i18n-t>
      </div>

      <meta-info class="notification-item__meta" :items="metaItems" />
    </div>
    <buttons-group :withGap="true" class="notification-item__actions">
      <n-button icon_before="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
    </buttons-group>
  </div>
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
      return JSON.parse(this.data.payload)
    },
    optionsItems() {
      return [
        {
          label: `${this.data.actor_type}.${this.data.type}`,
          disabled: true
        },
        {
          icon: 'ui-eye-off',
          label: this.$t('notifications.action.hide'),
          action: this.hideNotify
        },
        {
          icon: 'ui-notification-off',
          label: this.$t('notifications.action.dont'),
          action: this.dontNotify
        }
      ]
    },
    metaItems() {
      let _result = []
      _result.push({ label: this.$filters.timeAgo(this.data.date_added, this.$i18n.locale) })
      return _result
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
    hideNotify() {
      alert("@TODO")
    },
    dontNotify() {
      alert("@TODO")
    }
  }
}
</script>

<style lang="scss">
.notification-item {
  --notification-item__name--color: var(--x-body--color);
  --notification-item__name--color-hover: var(--x-body--color);
  --notification-item__username--color: #666;
  --notification-item__username--color-hover: var(--x-body--color);
  
  html[data-theme="black"] & {
    --notification-item__name--color: var(--x-body--color);
    --notification-item__name--color-hover: var(--x-body--color);
    --notification-item__username--color: var(--x-color-white--shade40, #999);
    --notification-item__username--color-hover: var(--x-body--color);
  }
}

$avatar-size: 38px;

.notification-item {
  display: flex;
  align-items: center;
  position: relative;

  &__avatar {
    background: #00000019;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    width: $avatar-size;
    height: $avatar-size;
    margin-right: .75rem;
    flex-shrink: 0;
    
    @media(hover: hover) {
      &:hover { color: inherit; text-decoration: none; }
    }

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    flex: 1;
  }

  &__label {
    color: var(--notification-item__name--color, #111);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
    margin-bottom: .25rem;
  }

  &__actions {
    margin-left: auto;
  }
}
</style>