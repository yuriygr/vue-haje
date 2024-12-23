<template>
  <a class="link" :href="data.url" target="_blank">
    <div class="link__icon">
      <icon :name="data.icon" size="16" />
    </div>
    <div class="link__content">
      <div class="link__label">
        {{ data.label }}
      </div>
      <div class="link__url">
        {{ data.url }}
      </div>
    </div>
  </a>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'link-item',
  components: {
    Icon
  },
  props: {
    data: false
  },
  data() {
    return {
      loading: { }
    }
  },
  computed: {},
  methods: {

  }
}
</script>

<style lang="scss">
.link {
  --link__icon--background: #f1f3f5;
  --link__icon--color: #212529;
  
  --link__label--color: #212529;
  --link__url--color: #495057;

  html[data-theme='black'] & {
    --link__icon--background: #1f1f1f;
    --link__icon--color: #f0f0f0;

    --link__label--color: #f0f0f0;
    --link__url--color: #999;
  }
}

.link {
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  position: relative;
  overflow: hidden;
  text-decoration: none;
  transition: var(--x-transition);

  &__icon {
    background: var(--link__icon--background);
    color: var(--link__icon--color);
    margin-right: 9px;
    padding: 11px;
    border-radius: 8px;

    svg { display: block; fill: currentColor; }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }

  &__label {
    color: var(--link__label--color);
    font-size: 1.4rem;
    font-weight: 500;
    line-height: calc(1.4 * 1em);
  }

  &__url {
    color: var(--link__url--color);
    font-size: 1.3rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
  }

  @media(hover: hover) {
    &:hover {
      text-decoration: none;
    }
  }
}
</style>