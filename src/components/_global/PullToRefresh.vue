<template>
  <div class="pull-down"
    @touchstart.passive="onTouchstart"
    @touchmove.passive="onTouchmove"
    @touchend="onTouchend"
  >
    <div class="pull-down__header" :style="{'height': pullDown.height + 'px'}">
      <div class="pull-down__indicator" :style="{ bottom: (config.pullDownHeight - 60) / 2 + 'px' }">
        <transition>
          <svg class="dsdsds" :style="
          { '--test': runAni2 }
          " :class="{ 'dsdsds--show': runAni }" width="33px" height="33px" viewBox="0 0 44 44">
            <circle class="path" fill="none" stroke-width="5" stroke-linecap="round" cx="22" cy="22" r="20"></circle>
          </svg>
        </transition>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
// https://raw.githubusercontent.com/lakb248/vue-pull-refresh/master/src/vue-pull-refresh.vue

// status of pull down
const STATUS_ERROR = -1;
const STATUS_START = 0;
const STATUS_READY = 1;
const STATUS_REFRESH = 2;

export default {
  name: 'pull-to-refresh',
  props: {
    onRefresh: {
      type: Function
    },
    config: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      pullDown: {
        status: 0,
        height: 0,
        msg: ''
      },
      canPull: false,

      touchPosition: {
        start: 0,
        distance: 0
      },
      distance: 0
    };
  },
  computed: {
    runAni2() {
      return (this.touchPosition.distance / this.config.pullDownHeight) * 100
    },
    runAni() {
      return (this.touchPosition.distance) >= this.config.pullDownHeight
    }
  },
  methods: {
    resetPullDown(withAnimation) {
      this.pullDown.height = 0
      this.pullDown.status = STATUS_START
    },
    restTouchPosition() {
      this.touchPosition.distance = 0
      this.touchPosition.start = 0
    },
    // Touchstart event to store start position of touch
    onTouchstart(e) {
      this.canPull = (this.$el.scrollTop === 0)
      this.touchPosition.start = e.touches.item(0).pageY
    },
    /**
     * Touchmove event, do the following:
     * first, update the height of pull down
     * finally, update the status of pull down based on the distance
     */
    onTouchmove(e) {
      if (!this.canPull) return

      var distance = e.touches.item(0).pageY - this.touchPosition.start
      // limit the height of pull down to limit height
      distance = distance > this.config.limitHeight ? this.config.limitHeight : distance
      // prevent native scroll
      if (distance > 0) {
          this.$el.style.overflow = 'hidden'
      }
      // update touchPosition and the height of pull down
      this.touchPosition.distance = distance
      this.pullDown.height = distance

      /**
       * if distance is bigger than the height of pull down
       * set the status of pull down to STATUS_READY
       */
      if (distance > this.config.pullDownHeight) {
        this.pullDown.status = STATUS_READY;
      } else {
        /**
         * else set the status of pull down to STATUS_START
         * and rotate the icon based on distance
         */
        this.pullDown.status = STATUS_START;
      }
    },
    onTouchend(e) {
      this.canPull = false;
      this.$el.style.overflowY = 'auto';
      // if distance is bigger than 60
      if (this.touchPosition.distance - this.$el.scrollTop >= this.config.pullDownHeight) {
        this.$el.scrollTop = 0;
        this.pullDown.height = this.config.pullDownHeight;
        this.pullDown.status = STATUS_REFRESH;
        // trigger refresh callback
        if (this.onRefresh && typeof this.onRefresh === 'function') {
          var res = this.onRefresh();
          // if onRefresh return promise
          if (res && res.then && typeof res.then === 'function') {
            res.then(result => {
                this.resetPullDown(true);
            }, error => {
              // show error and hide the pull down after 1 second
              if (typeof error !== 'string') {
                  error = false;
              }
              this.pullDown.msg = error;
              this.pullDown.status = STATUS_ERROR;
              setTimeout(() => {
                  this.resetPullDown(true);
              }, 1000);
            });
          } else {
              this.resetPullDown();
          }
        } else {
          this.resetPullDown();
          console.warn('please use :on-refresh to pass onRefresh callback');
        }
      } else {
        this.resetPullDown();
      }
      this.restTouchPosition()
    }
  },
  mounted() {
    this.config.limitHeight = this.config.limitHeight || 90;
    this.config.pullDownHeight = this.config.pullDownHeight || 80;
  }
}
</script>

<style lang="scss">
.dsdsds {
  transition: opacity 0.15s ease;
  animation: rotator1 1.4s linear infinite;
  animation-play-state: paused;

  &--show {
    animation-play-state: running;
  }

  .path {
    stroke: currentColor;
    stroke-dasharray: 112;
    stroke-dashoffset: calc(100 - var(--test));
    transform-origin: center;
  }
}

@keyframes rotator1 {
  0% {
    transform: scale(0.5) rotate(0deg);
  }

  50% {
    transform: scale(0.5) rotate(270deg);
  }

  100% {
    transform: scale(0.5) rotate(360deg);
  }
}


.pull-down {
  height: 100%;
  max-height: 100%;
  overflow-y: auto;

  &__header {
    width: 100%;
    height: 0px;
    overflow: hidden;
    position: relative;
  }

  &__indicator {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 35px;
    height: 35px;
    text-align: center;
    background: #1f1f1f;
    color: #f0f0f0;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    svg { fill: currentColor; flex-shrink: 0; display: block; }
  }
}
</style>