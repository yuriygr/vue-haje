<template>
  <a class="external-link" :href="data.url" target="_blank">
    <div class="external-link__icon">
      <icon :name="$t(`brands.${data.code}.icon`)" size="24" />
    </div>
    <div class="external-link__content">
      <div class="external-link__label">
        {{ $t(`brands.${data.code}.label`) }}
      </div>
      <div class="external-link__url">
        {{ data.url }}
      </div>
    </div>
  </a>
</template>

<script>
import { Icon, IconButton } from '@vue-norma/ui'

export default {
  name: 'external-link-item',
  components: {
    Icon, IconButton
  },
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
  computed: {},
  methods: {

  }
}
</script>

<style lang="scss">
.external-link {
  --external-link__icon--background: #f7f7f7;
  --external-link__icon--color: #111;
  
  --external-link__label--color: #111;
  --external-link__url--color: #999;

  html[data-theme='black'] & {
    --external-link__icon--background: #1f1f1f;
    --external-link__icon--color: #f0f0f0;

    --external-link__label--color: #f0f0f0;
    --external-link__url--color: #999;
  }
}

.external-link {
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  position: relative;
  overflow: hidden;
  text-decoration: none;
  transition: var(--x-transition);

  &__icon {
    background: var(--external-link__icon--background);
    color: var(--external-link__icon--color);
    margin-right: 12px;
    padding: 10px;
    border-radius: 8px;

    svg { display: block; fill: currentColor; }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }

  &__label {
    color: var(--external-link__label--color);
    font-size: 1.5rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.4 * 1em);
  }

  &__url {
    color: var(--external-link__url--color);
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