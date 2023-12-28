<template>
  <div :class="[ 'notification-item' ]">
    <div class="notification-item__content">
      <div class="notification-item__label">{{ $t(`notifications.${data.actor_type}.${data.type}`, payload) }}</div>
      <div class="notification-item__time">{{ $filters.timeAgo(data.date_added, $i18n.locale) }}</div>
    </div>
    <buttons-group :withGap="true" class="notification-item__actions">
        <icon-button name="ui-more" mode="tertiary" @click.exact="toggleOptions" ref="options" :title="$t('action.options')" />
    </buttons-group>
  </div>
</template>

<script>
import { Icon, IconButton, ButtonsGroup } from '@vue-norma/ui'

export default {
  name: 'notification-item',
  components: {
    Icon, IconButton, ButtonsGroup
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
  --notification-item__name--color: #111;
  --notification-item__name--color-hover: #111;
  --notification-item__username--color: #666;
  --notification-item__username--color-hover: #111;
  
  html[data-theme="black"] & {
    --notification-item__name--color: #fffcea;
    --notification-item__name--color-hover: #fffcea;
    --notification-item__username--color: #999;
    --notification-item__username--color-hover: #fffcea;
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
    font-size: 1.3rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
  }

  &__time {
    color: var(--notification-item__username--color, #999);
    font-size: 1.3rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
  }

  &__actions {
    margin-left: auto;
  }
}
</style>