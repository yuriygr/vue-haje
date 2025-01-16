<template>
  <div class="app-tabbar" 
    @contextmenu="$event.preventDefault()"
    @dragstart="$event.preventDefault()"
    @drop="$event.preventDefault()"
  >
    <div class="app-tabbar__layout">
      <tabbar class="app-tabbar__tabbar">
        <tabbar-item :to="{ name: 'feed' }" :title="$t('header.nav.feed')">
          <icon name="home-line" size="20" />
        </tabbar-item>
      
        <tabbar-item :to="{ name: 'search' }" :title="$t('header.nav.search')" :preActive="$route.meta.section == 'search'">
          <icon name="search-line" size="20" />
        </tabbar-item>

        <tabbar-item @click="openComposeModal" :title="$t('header.nav.compose')">
          <icon name="edit-line" size="20" />
        </tabbar-item>

        <tabbar-item :to="{ name: 'notifications' }" :title="$t('header.nav.notifications')" :badge="hasNewNotifications">
          <icon name="bell-line" size="20" />
        </tabbar-item>

        <template v-if="session_data.is_auth">
          <tabbar-item :to="{ name: 'menu' }" :title="$t('header.nav.menu')" :preActive="$route.meta.section == 'menu'">
            <icon name="menu-line" size="20" />
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
import { defineAsyncComponent } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { Tabbar, TabbarItem, Icon } from '@vue-norma/ui'

let ComposeModal = defineAsyncComponent(() => import("@/components/modals/Compose.vue"))

export default {
  name: 'app-tabbar',
  components: { Tabbar, TabbarItem, Icon },
  data() {
    return {}
  },
  computed: {
    ...mapGetters('auth', [ 'isAuth', 'hasNewNotifications' ]),
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
}

.app-tabbar {
  --tabbar--background: var(--x-body--background);

  html[data-theme="black"] & {
    --tabbar--background: var(--x-body--background);
  }
}

.app-tabbar {
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

    margin-right: auto;
    margin-left: auto;
    max-width: var(--large-screen-max-width);
    padding-right: var(--layout-tabbar-padding);
    padding-left: var(--layout-tabbar-padding);
  }

  @include on-mobile-device {
    position: fixed;
    bottom: 0;
  }

  @include on-desktop-device {
    position: sticky;
    top: 0;
  }

  &--loading {
    opacity: 0.6;
  }
}
</style>