<template>
  <teleport to="body">
    <div
      v-if="active"
      ref="dropdownRef"
      class="mention-dropdown"
      :class="{ 'mention-dropdown--visible': visible }"
      :style="style"
    >
      <div v-if="loading" class="mention-dropdown__loading">
        {{ $t('state.loading') }}
      </div>

      <template v-else>
        <div
          v-for="(user, index) in users"
          :key="user.id"
          class="mention-dropdown__item"
          :class="{ 'mention-dropdown__item--selected': index === selectedIndex }"
          @mousedown.prevent="$emit('pick', user)"
        >
          <user-item :data="user" :showSubscribeAction="false" mode="normal" />
        </div>
      </template>
    </div>
  </teleport>
</template>

<script>
import { UserItem } from '@/components/user'

export default {
  name: 'mention-dropdown',

  components: { UserItem },

  props: {
    active:        { type: Boolean, default: false },
    users:         { type: Array,   default: () => [] },
    loading:       { type: Boolean, default: false },
    selectedIndex: { type: Number,  default: 0 },
    position:      { type: Object,  default: () => ({ top: 0, left: 0 }) },
  },

  emits: ['pick', 'close', 'recalc'],

  data() {
    return {
      visible:      false,
      computedLeft: 0,
    }
  },

  computed: {
    style() {
      return {
        top:  this.position.top + 'px',
        left: this.computedLeft + 'px',
      }
    },
  },

  watch: {
    position: {
      handler() { this.recalcEdges() },
      deep: true,
    },
    // Пересчёт при появлении результатов — ширина дропдауна могла измениться
    users() {
      this.$nextTick(() => this.recalcEdges())
    },
    // При закрытии сбрасываем, чтобы при следующем открытии
    // не было мигания на старой позиции
    active(val) {
      if (!val) this.visible = false
    },
  },

  mounted() {
    window.addEventListener('resize',   this.onResize)
    window.addEventListener('scroll',   this.onScroll, { passive: true, capture: true })
    document.addEventListener('mousedown', this.onOutsideClick)
  },

  beforeUnmount() {
    window.removeEventListener('resize',   this.onResize)
    window.removeEventListener('scroll',   this.onScroll, { capture: true })
    document.removeEventListener('mousedown', this.onOutsideClick)
  },

  methods: {
    recalcEdges() {
      this.visible = false
      this.$nextTick(() => {
        const el = this.$refs.dropdownRef
        if (!el) {
          this.visible = true
          return
        }
        const overflow = this.position.left + el.offsetWidth - window.innerWidth
        this.computedLeft = overflow > 0
          ? Math.max(0, this.position.left - overflow - 8)
          : this.position.left
        this.visible = true
      })
    },

    onOutsideClick(e) {
      // $refs.dropdownRef — реальный DOM-узел внутри teleport, не якорь
      if (this.$refs.dropdownRef?.contains(e.target)) return
      this.$emit('close')
    },

    onScroll() {
      // Скролл сдвигает контент — позицию нужно пересчитать
      this.$emit('recalc')
    },

    onResize() {
      // При ресайзе проще закрыть — позиция всё равно невалидна
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss">
.mention-dropdown {
  --mention-background:           #fff;
  --mention-box-shadow:           0 4px 8px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.25);
  --mention__item--color-selected: var(--x-color-pink--tint90);

  html[data-theme="black"] & {
    --mention-background:           #181818;
    --mention-box-shadow:           0 4px 8px rgb(0 0 0 / 25%), 0 0 1px rgba(255, 255, 255, 0.25);
    --mention__item--color-selected: var(--x-color-pink--shade80);
  }
}

.mention-dropdown {
  position:       fixed;
  z-index:        9999;
  background:     var(--mention-background);
  box-shadow:     var(--mention-box-shadow);
  border-radius:  6px;
  max-height:     300px;
  overflow-y:     auto;
  max-width:      400px;
  opacity:        0;
  pointer-events: none;

  &--visible {
    opacity:        1;
    pointer-events: auto;
  }

  @media (max-width: 859px) {
    max-width: 320px;
  }

  &__item {
    cursor:        pointer;
    padding:       .5rem;
    margin:        .5rem;
    border-radius: 4px;
    transition:    background .1s;

    &:not(:last-child) {
      margin-bottom: .2rem;
    }

    &--selected,
    &:hover {
      background: var(--mention__item--color-selected);
    }
  }

  &__loading {
    padding:   .5rem .75rem;
    font-size: 1.3rem;
    opacity:   .6;
  }
}
</style>