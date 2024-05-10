<template>
  <div class="navigation">
    <template v-for="(section, index) in sections" :key="`section-${index}`">
      <navigation-section>
        <navigation-title v-if="section.label && false">{{ section.label }}</navigation-title>
        <template v-for="(item, jndex) in section.items" :key="`section-${index}-item-${jndex}`">
          <navigation-item :icon="item.icon" :to="item.to" :disabled="item.disabled">
            {{ item.label }}
          </navigation-item>
        </template>
      </navigation-section>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NavigationSection, NavigationItem, NavigationTitle } from '@vue-norma/ui'

export default {
  name: 'settngs-menu',
  components: {
    NavigationSection, NavigationItem, NavigationTitle
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('settings.title')
      }
    }
  },
  computed: {
    ...mapGetters('auth', [ 'isAuth' ]),
    sections() {
      let base = [
        {
          icon: 'user-edit-line',
          label: this.$t('settings.item.profile'),
          to: { name: 'settings-profile' },
          disabled: !this.isAuth
        },
       {
          icon: 'feeds-line',
          label: this.$t('settings.item.feed'),
          to: { name: 'settings-feed' },
          disabled: !this.isAuth || true
        },
        {
          icon: 'bell-line',
          label: this.$t('settings.item.notifications'),
          to: { name: 'settings-notifications' },
          disabled: !this.isAuth
        },
        {
          icon: 'link-line',
          label: this.$t('settings.item.connections'),
          to: { name: 'settings-connections' },
          disabled: !this.isAuth || true
        },
        {
          icon: 'palette-line',
          label: this.$t('settings.item.appearance'),
          to: { name: 'settings-appearance' }
        }
      ]

      let secure = [
        {
          icon: 'user-lock-line',
          label: this.$t('settings.item.account'),
          to: { name: 'settings-account' },
          disabled: !this.isAuth
        },
        {
          icon: 'password-line',
          label: this.$t('settings.item.password'),
          to: { name: 'settings-password' },
          disabled: !this.isAuth
        },
        {
          icon: 'history-line',
          label: this.$t('settings.item.login-activity'),
          to: { name: 'settings-login-activity' },
          disabled: !this.isAuth
        }
      ]

      let danger = [
        {
          icon: 'gdpr-line',
          label: this.$t('settings.item.gdpr'),
          to: { name: 'settings-gdpr' },
          disabled: !this.isAuth || true
        },
        {
          icon: 'delete-bin-line',
          label: this.$t('settings.item.delete-account'),
          to: { name: 'settings-delete-account' },
          disabled: !this.isAuth
        }
      ]

      return [
        { label: this.$t('settings.section.base'), items: base },
        { label: this.$t('settings.section.secure'), items: secure },
        { label: this.$t('settings.section.danger'), items: danger }
      ]
    }
  }
}
</script>

<style lang="scss">

</style>