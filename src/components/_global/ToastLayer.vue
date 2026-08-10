<template>
  <Teleport to="body">
    <div class="toast-layer" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" v-if="toasts.length > 0">
      <div class="toast-layer__list">
        <div
          v-for="item in toasts"
          :key="item.id"
          class="toast-item"
          :class="[`toast-item--${item.type}`]"
        >
          <span class="toast-item__icon">
            <svg v-if="item.type === 'success'" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="item.type === 'danger'" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 5v4M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="item.type === 'warning'" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="item.type === 'info'" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 7.5v3.5M8 5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="item.type === 'loading'" viewBox="0 0 16 16" fill="none" class="toast-item__spinner">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-dashoffset="10" stroke-linecap="round"/>
            </svg>
            <svg v-else viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </span>

          <div class="toast-item__body">
            <span v-if="item.title" class="toast-item__title">{{ item.title }}</span>
            <span class="toast-item__text">{{ item.text }}</span>
          </div>

          <div class="toast-item__actions">
            <button
              v-if="item.action"
              class="toast-item__action-btn"
              @click.stop="runAction(item)"
            >
              {{ item.action.label }}
            </button>
            <button
              v-if="item.closable"
              class="toast-item__close"
              @click.stop="toast.dismiss(item.id)"
              aria-label="Закрыть"
            >
              <svg viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/app/composables/useToast'
import type { ToastItem } from '@/app/composables/useToast'

defineOptions({ name: 'toast-layer' })

// Composables
const toast = useToast()

// Computed
const toasts = computed(() => toast._state.toasts)

// Methods
function onMouseEnter() {
  toasts.value.forEach(item => toast._pauseTimer(item))
}

function onMouseLeave() {
  toasts.value.forEach(item => toast._resumeTimer(item))
}

function runAction(item: ToastItem) {
  item.action?.onClick?.()
  toast.dismiss(item.id)
}
</script>

<style scoped lang="scss">
.toast-layer {
  --toast-z: 900;
  --toast-offset: 1.25rem;
  --toast-width: 340px;
  --toast-radius: 12px;
  --toast-gap: 0.5rem;
  --toast-font-size: 13px;
  --toast-padding: 0.625rem 0.75rem;

  --toast-bg: #ffffff;
  --toast-border: rgba(0, 0, 0, 0.08);
  --toast-shadow: 0 4px 20px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06);
  --toast-text: #1a1a1a;
  --toast-subtext: #666;

  --color-success: #22a06b;
  --color-info:    #0c8ce9;
  --color-warning: #d97706;
  --color-danger:  #e53e3e;
  --color-default: #555;
  --color-loading: #888;

  html[data-theme="black"] & {
    --toast-bg: #1e1e1e;
    --toast-border: rgba(255, 255, 255, 0.1);
    --toast-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
    --toast-text: #f0f0f0;
    --toast-subtext: #999;
  }
}

.toast-layer {
  position: fixed;
  bottom: var(--toast-offset);
  left: var(--toast-offset);
  z-index: var(--toast-z);
  width: var(--toast-width);
  pointer-events: none;

  &__list {
    display: flex;
    flex-direction: column-reverse;
    gap: var(--toast-gap);
  }
}

.toast-item {
  width: 100%;
  pointer-events: all;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: var(--toast-padding);
  background: var(--toast-bg);
  border: 1px solid var(--toast-border);
  border-radius: var(--toast-radius);
  box-shadow: var(--toast-shadow);
  font-size: var(--toast-font-size);
  color: var(--toast-text);
  cursor: default;
  box-sizing: border-box;

  &__icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 1px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    line-height: 1.4;
  }

  &__text {
    color: var(--toast-subtext);
    line-height: 1.45;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.toast-item--success .toast-item__icon { color: var(--color-success); }
.toast-item--info    .toast-item__icon { color: var(--color-info); }
.toast-item--warning .toast-item__icon { color: var(--color-warning); }
.toast-item--danger  .toast-item__icon { color: var(--color-danger); }
.toast-item--default .toast-item__icon { color: var(--color-default); }
.toast-item--loading .toast-item__icon { color: var(--color-loading); }

@keyframes spin {
  to { transform: rotate(360deg); }
}
.toast-item__spinner {
  animation: spin 0.8s linear infinite;
  transform-origin: center;
}



.toast-item:not(:has(.toast-item__title)) .toast-item__text {
  color: var(--toast-text);
  font-weight: 500;
}

.toast-item__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.toast-item__action-btn {
  background: none;
  border: 1px solid var(--toast-border);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--toast-text);
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  
  &:hover {
    background: rgba(0,0,0,0.05);
  }
}


.toast-item__close {
  background: none;
  border: none;
  padding: 2px;
  border-radius: 4px;
  color: var(--toast-subtext);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s;

  &:hover {
    background: rgba(0,0,0,0.07);
    color: var(--toast-text);
  }

  svg {
    width: 12px;
    height: 12px;
  }
}

.toast-item:hover .toast-item__close {
  opacity: 1;
}


@media (max-width: 480px) {
  .toast-layer {
    --toast-width: calc(100vw - 2 * var(--toast-offset));
    right: var(--toast-offset);
    left: var(--toast-offset);
    bottom: calc((var(--tabbar--height) + var(--toast-offset)))
  }
}
</style>