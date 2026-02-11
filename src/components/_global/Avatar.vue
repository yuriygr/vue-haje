<template>
  <div
    :class="elClass"

    v-on="$elEvents"
    v-bind="$elBinds"
  >
    <img :src="avatarUrl" alt="" />
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'avatar',
  props: {
    ...RouterLink.props,
    data: {
      type: [ Boolean, Object ],
      default: false
    },
    size: {
      type: Number,
      default: 50
    }
  },
  computed: {
    elClass() {
      return [
        'avatar',
        {
          'avatar--has-view': true
        }
      ]
    },

    $elEvents() {
      return {

      }
    },
    $elBinds() {
      return {

      }
    },

    avatarUrl() {
      return `https://www.gravatar.com/avatar/${this.data.hash}?s=${this.size}&d=identicon`
    },
    isHasLink() {
      return typeof this.to === 'string' || typeof this.to === 'object'
    },
    isInnerLink() {
      return typeof this.to === 'object'
    },
    isExternalLink() {
      return typeof this.to === 'string' && this.to.startsWith('http')
    }
  }
}

</script>

<style lang="scss">
$avatar-default-size: 40px;
$avatar-default-border-radius: 8px;

.avatar {
  --avatar--background: rgba(0, 0, 0, 0.09);
  
  html[data-theme="black"] & {
    --avatar--background: rgba(255, 255, 255, 0.09);
  }
}

.avatar {
  background: var(--avatar--background, rgba(0, 0, 0, 0.09));
  border-radius: $avatar-default-border-radius;
  position: relative;
  overflow: hidden;
  width: $avatar-default-size;
  height: $avatar-default-size;
  
  @media(hover: hover) {
     &:is(a, &--action):hover {
      cursor: pointer;
      color: inherit;
      text-decoration: none;
    }
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>