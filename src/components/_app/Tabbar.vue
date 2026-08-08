<template>
  <div class="app-tabbar" 
    @contextmenu="$event.preventDefault()"
    @dragstart="$event.preventDefault()"
    @drop="$event.preventDefault()"
  >
    <div class="app-tabbar__layout">
      <tabbar class="app-tabbar__tabbar">
        <tabbar-item :to="{ name: 'feed' }" :title="t('header.nav.feed')">
          <icon name="home-line" size="20" />
        </tabbar-item>
      
        <tabbar-item :to="{ name: 'search' }" :title="t('header.nav.search')" :preActive="$route.meta.section == 'search'">
          <icon name="search-line" size="20" />
        </tabbar-item>

        <tabbar-item @click="openComposeModal" :title="t('header.nav.compose')">
          <icon name="edit-line" size="20" />
        </tabbar-item>

        <tabbar-item :to="{ name: 'notifications' }" :title="t('header.nav.notifications')" :badge="hasNewNotifications">
          <icon name="bell-line" size="20" />
        </tabbar-item>

        <template v-if="authData.is_auth">
          <tabbar-item :to="{ name: 'menu' }" :title="t('header.nav.menu')" :preActive="$route.meta.section == 'menu'">
            <icon name="menu-line" size="20" />
          </tabbar-item>
        </template>

        <template v-else>
          <tabbar-item :to="{ name: 'auth' }" :title="t('header.nav.auth')">
            <icon name="login-line" size="20" />
          </tabbar-item>
        </template>

      </tabbar>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { Tabbar, TabbarItem, Icon } from '@vue-norma/ui'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useModals } from '@vue-norma/ui'
import { useAuthStore } from '@/app/store/modules/auth'

defineOptions({
  name: 'app-tabbar'
})

const ComposeModal = defineAsyncComponent(() => import('@/modals/Compose.vue'))

// Composables
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const modals = useModals()

const authData = computed(() => authStore.data)
const isAuth = computed(() => authStore.isAuth)
const hasNewNotifications = computed(() => authStore.hasNewNotifications)

// Methods
function openComposeModal() {
  if (!isAuth.value) {
    router.push({ name: 'auth' })
    return
  }
  modals.show(ComposeModal)
}
</script>

<style lang="scss">
.app-tabbar {
  --tabbar-item-count: 5;
}

.app-tabbar {
  --tabbar--background: var(--x-body--background);
}

.app-tabbar {
  background: var(--tabbar--background);
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
    height: var(--tabbar--height);

    margin-right: auto;
    margin-left: auto;
    max-width: var(--large-screen-max-width);
    padding-right: var(--layout-tabbar-padding);
    padding-left: var(--layout-tabbar-padding);
  }

  @include on-mobile-device {
    position: fixed;
    bottom: 0;
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) - env(safe-area-max-inset-bottom, 0px));
  }

  @include on-tablet-device {
    position: sticky;
    top: 0;
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