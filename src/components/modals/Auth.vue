<template>
  <modal class="auth">
    <div class="auth__cover" :style="coverStyle"></div>
    <div class="auth__content">
      <modal-header :title="$t('modals.auth')">
        <template #after>
          <icon-button name="close-circle-line" @click.exact="closeModal" :title="$t('actions.close')" />
        </template>
      </modal-header>
      <div class="auth__list" v-show="activePanel == 'home'">
        <div class="auth__method" @click.exact="loginVia('vk')">
          <icon name="vk" width="20" height="20" /> {{ $t('auth.method.vk') }}
        </div>
        <div class="auth__method" @click.exact="loginVia('github')">
          <icon name="github" width="20" height="20" /> {{ $t('auth.method.github') }}
        </div>
        <div class="auth__method" @click.exact="loginVia('yandex')">
          <icon name="yandex" width="20" height="20" /> {{ $t('auth.method.yandex') }}
        </div>
        <div class="auth__method" @click.exact="loginVia('microsoft')">
          <icon name="microsoft" width="20" height="20" /> {{ $t('auth.method.microsoft') }}
        </div>
        <div class="auth__method" @click.exact="setActivePanel('login-email')">
          <icon name="email" width="20" height="20" /> {{ $t('auth.method.email') }}
        </div>
      </div>
      <div v-show="activePanel == 'login-email'">
        login-email
        <div @click="back">back</div>
      </div>
      <div v-show="activePanel == 'register-email'">
        register-email
      </div>
      <div v-show="activePanel == 'forgot-email'">
        forgot-email
      </div>
      <div v-show="activePanel == 'message'">
        message
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: 'auth-modal',
  data() {
    return {
      activePanel: 'home',
      panels: [
        'home', 'login-email', 'register-email', 'forgot-email', 'message'
      ],
      panelsHistory: [],
    }
  },
  computed: {
    coverStyle() {
      return {
        'background-image': 'url("https://leonardo.osnova.io/dfc1cb18-aadb-7e41-4854-88af19bd9a63/-/format/webp/")'
      }
    }
  },
  methods: {
    setActivePanel(panel) {
      this.panelsHistory.push(this.activePanel)
      this.activePanel = panel
    },
    back() {
      const panel = this.panelsHistory.pop()
      this.activePanel = panel
    },

    loginVia(code) {
      let link = this.$router.resolve({ name: 'oauth-platform', params: { platform: code } })
      this.popup(link.href)
    },

    popup(url_path) {
      const windowArea = {
        width: Math.floor(window.outerWidth * 0.8),
        height: Math.floor(window.outerHeight * 0.5),
      };

      if (windowArea.width < 1000) { windowArea.width = 1000; }
      if (windowArea.height < 630) { windowArea.height = 630; }
      windowArea.left = Math.floor(window.screenX + ((window.outerWidth - windowArea.width) / 2));
      windowArea.top = Math.floor(window.screenY + ((window.outerHeight - windowArea.height) / 8));

      const sep = (url_path.indexOf('?') !== -1) ? '&' : '?';
      const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
        width=${windowArea.width},height=${windowArea.height},
        left=${windowArea.left},top=${windowArea.top}`;

      const authWindow = window.open(`${url_path}${sep}`, 'oauthWindow', windowOpts);
      // Create IE + others compatible event handler
      const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
      const eventer = window[eventMethod];
      const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

      // Listen to message from child window
      const authPromise = new Promise((resolve, reject) => {
        eventer(messageEvent, (e) => {
          if (e.origin !== window.SITE_DOMAIN) {
            authWindow.close();
            reject('Not allowed');
          }

          if (e.data.auth) {
            resolve(JSON.parse(e.data.auth));
            authWindow.close();
          } else {
            authWindow.close();
            reject('Unauthorised');
          }
        }, false);
      });

      return authPromise;
    },

    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.auth {
  display: grid;
  grid-template-columns: 212px 1fr;

  &__cover {
    background-color: #d9f5ff;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    padding: 25px 30px;
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  &__content {
    position: relative;
    min-width: 0;
    display: flex;
    flex-direction: column;
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
  }

  &__list {
    margin: 4rem;
  }

  &__method {
    background: #f0f2f5;
    display: flex;
    justify-content: start;
    align-items: center;
    border-radius: 12px;
    padding: 1.5rem;
    line-height: 20px;
    margin-bottom: 16px;
    text-align: center;
    width: 100%;
    cursor: pointer;
    position: relative;

    svg {
      fill: currentColor;
      flex-shrink: 0;
      margin-right: 1rem;
    }
  }
}
</style>