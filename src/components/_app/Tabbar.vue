<template>
  <div class="app-tabbar" 
    @contextmenu="$event.preventDefault()"
    @dragstart="$event.preventDefault()"
    @drop="$event.preventDefault()"
  >
    <div class="app-tabbar__layout">
      <tabbar class="app-tabbar__tabbar">
        <tabbar-item :to="{ name: 'feed' }" :title="$t('header.nav.home')">
          <icon name="home-line" size="20" />
        </tabbar-item>
      
        <tabbar-item :to="{ name: 'search' }" :title="$t('header.nav.search')">
          <icon name="search-line" size="20" />
        </tabbar-item>

        <tabbar-item @click="openComposeModal" :title="$t('header.nav.compose')">
          <icon name="edit-line" size="20" />
        </tabbar-item>

        <tabbar-item :to="{ name: 'notifications' }" :title="$t('header.nav.notifications')" :badge="session_data.notifications_count > 0">
          <icon name="bell-line" size="20" />
        </tabbar-item>

        <template v-if="session_data.is_auth">
          <tabbar-item :to="{ name: 'user', params: { username: session_data.user.username  } }" :title="$t('header.nav.profile')">
            <icon name="user-line" size="20" />
          </tabbar-item>
        </template>

        <template v-else>
          <tabbar-item :to="{ name: 'auth' }" :title="$t('header.nav.auth')">
            <icon name="login-line" size="20" />
          </tabbar-item>
        </template>

      </tabbar>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Tabbar, TabbarItem, Icon } from '@vue-norma/ui'

import ComposeModal from '@/components/modals/Compose'

export default {
  name: 'app-tabbar',
  components: { Tabbar, TabbarItem, Icon },
  data() {
    return {}
  },
  computed: {
    ...mapGetters('auth', [ 'isAuth' ]),
    ...mapState('auth', {
      'session_data': state => state.data
    })
  },
  methods: {
    openComposeModal() {
      if (!this.isAuth) {
        this.$router.push({ name: 'auth' })
        return
      }
      this.$modals.show(ComposeModal)
    }
  }
}
</script>

<style lang="scss">
.app-tabbar {
  --tabbar-item-count: 5;

  background: var(--tabbar--background);
  height: var(--tabbar--height);
  z-index: 500;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  &__layout {
    display: flex;
    justify-content: space-between;
    width: 100vw;

    padding-right: var(--mobile-page-horizontal-padding);
    padding-left: var(--mobile-page-horizontal-padding);

    @media (min-width: 768px) {
      & {
        margin-right: auto;
        margin-left: auto;

        max-width: var(--large-screen-max-width);
        padding-right: var(--desktop-page-horizontal-padding);
        padding-left: var(--desktop-page-horizontal-padding);
      }
    }
  }

  @media (max-width: 768px) {
    & { 
      position: fixed;
      bottom: 0;
    }
  }

  @media (min-width: 768px) {
    & { 
      position: sticky;
      top: 0;
    }
  }

  &--loading {
    opacity: 0.6;
  }
}
</style>