<template>
  <router-link :to="tagLink" :class="[ 'tag-item' ]" active-class="" exact-active-class="">
    <div class="tag-item__content">
      <div class="tag-item__hash">#</div>
      <div class="tag-item__label">{{ data.label }}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'tag-item',
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
    tagLink() {
      return { name: 'tag', params: { slug: this.data.slug } }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
.tag-item {
  --tag-item--background: #f1f3f5;
  --tag-item__hash--color: #868e96;
  --tag-item__label--color: #212529;

  --tag-item--background-hover: #e9ecef;

  html[data-theme='black'] & {
    --tag-item--background: #1f1f1f;
    --tag-item__hash--color: #999;
    --tag-item__label--color: #f0f0f0;

    --tag-item--background-hover: #242424;
  }
}

.tag-item {
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  background: var(--tag-item--background);
  border-radius: 8px;
  height: 28px;
  position: relative;
  overflow: hidden;
  padding: 0 1.25rem;
  transition: var(--x-transition);

  &__content {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__hash {
    color: var(--tag-item__hash--color);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.2 * 1em);
  }

  &__label {
    color: var(--tag-item__label--color);
    font-size: 1.4rem;
    font-weight: var(--x-font-weight--normal);
    line-height: calc(1.2 * 1em);
  }

  &__hash + &__label {
    margin-left: .75rem;
  }

  &__actions {
    margin-left: auto;
  }

  @media(hover: hover) {
    &[href]:hover {
      background: var(--tag-item--background-hover);
      text-decoration: none;

      &__label {
      }
    }
  }
}
</style>