<template>
  <group>
    <n-header>{{ $t('auth.login.title') }}</n-header>

    <form-group @submit="submit" :loading="loading">
      <form-status v-if="error"
        mode="error"
        icon="ui-error-warning"
        :header="error.status"
      >
        {{ error.message }}
      </form-status>

      <form-block>
        <div class="l-input">
          <div class="l-input__title">{{ $t('auth.field.email') }}</div>
          <input class="l-input__item" tabindex="1" type="email" name="email" v-model.trim="form.email" autocomplete="email">
        </div>
      </form-block>

      <form-block>
        <div class="l-input">
          <div class="l-input__title">{{ $t('auth.field.password') }}</div>
          <input class="l-input__item" tabindex="2" type="password" name="password" v-model.trim="form.password" autocomplete="current-password">
        </div>
      </form-block>

      <form-block>
        <n-button tabindex="3" size="l" :stretched="true" :disabled="loading">{{ $t('auth.button.login') }}</n-button>
      </form-block>

      <form-block>
        <n-button component="router-link" mode="secondary" :to="{ name: 'auth-forgot' }" :stretched="true">{{ $t('auth.forgot.title') }}</n-button>
      </form-block>

      <spacer heigth="50" />

      <form-text align="center">
        <i18n-t keypath="auth.login.create_account">
          <router-link :to="{ name: 'auth-register' }">{{ $t('auth.create_account.title') }}</router-link>
        </i18n-t>
      </form-text>
    </form-group>
  </group>
</template>

<script>
import { NButton, NHeader, Group, Spacer } from '@vue-norma/ui'

export default {
  name: 'auth-login',
  components: {
    NButton, NHeader, Group, Spacer
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('auth.login.title')
      },
      error: false,
      loading: false,

      form: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    canSubmit() {
      return (this.form.email.length > 0) && (this.form.password.length > 0)
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.error = false

      this.$api.post('auth/login', this.form)
      .then(result => {
        this.$store.dispatch('auth/fetch')

        this.$router.push(this.$route.query.redirect || { name: 'home' })
      })
      .catch(error => {
        this.error = error
      })
      .then(_ => this.loading = false)
    },
    cleanError(type) {

    },
    loginVia(e) {
      this.popup(e.currentTarget.href)
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

      const authWindow = window.open(`${url_path}${sep}`, 'producthuntPopup', windowOpts);
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
  },
  watch: {
    $route(to) {
      this.form = {}
      this.error = false
    }
  },
  mounted() { }
}
</script>

<style lang="scss">

</style>
