<template>
  <template v-if="data">
    <div :class="[ 'login-item' ]">
      <div class="login-item__content">
        <div class="login-item__key">ОС:</div>
        <div class="login-item__value">{{ data.os.name }} {{ data.os.version }}</div>
      </div>
      <div class="login-item__content">
        <div class="login-item__key">Браузер:</div>
        <div class="login-item__value">{{ data.browser.name }} {{ data.browser.version }}</div>
      </div>
      <div class="login-item__content">
        <div class="login-item__key">Дата:</div>
        <div class="login-item__value">{{ formatedDate }}</div>
      </div>
    </div>
  </template>

  <template v-else>
    <div :class="[ 'login-item' ]">
      <div class="login-item__content">
        <div class="login-item__key">ОС:</div>
        <div class="login-item__value"><skeleton :width="randomWidth" :height="7" /></div>
      </div>
      <div class="login-item__content">
        <div class="login-item__key">Браузер:</div>
        <div class="login-item__value"><skeleton :width="randomWidth" :height="7" /></div>
      </div>
      <div class="login-item__content">
        <div class="login-item__key">Дата:</div>
        <div class="login-item__value"><skeleton :width="randomWidth" :height="7" /></div>
      </div>
    </div>
  </template>
</template>

<script>
export default {
  name: 'login-item',
  props: {
    data: false,
    clickable: {
      type: Boolean,
      default: true
    },
    showSubscribeAction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: { }
    }
  },
  computed: {
    formatedDate() {
      return this.$filters.timeAgo(this.data.date_added, this.$i18n.locale)
    },
    randomWidth() {
      return Math.floor(Math.random() * 100) + 60;
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
.login-item {
  --login-item--background: #f1f3f5;
  --login-item__key--color: #868e96;
  --login-item__value--color: #212529;

  --login-item--background-hover: #e9ecef;

  html[data-theme='black'] & {
    --login-item--background: #1f1f1f;
    --login-item__key--color: var(--x-color-white--shade40, #999);
    --login-item__value--color: #f0f0f0;

    --login-item--background-hover: #242424;
  }
}

.login-item {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;

  background: var(--login-item--background);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  padding: 1.25rem 1.5rem;
  transition: var(--x-transition);

  &__content {
    display: flex;
    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: .5rem;
    }
  }

  &__key {
    color: var(--login-item__key--color);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.2 * 1em);
  }

  &__value {
    display: flex;
    justify-content: center;
    color: var(--login-item__value--color);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.2 * 1em);
  }

  &__key + &__value {
    margin-left: .5rem;
  }
}
</style>