import { reactive } from 'vue'
import type { App } from 'vue'

// Types
export type ToastType =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'loading'
  | 'default'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  /** Заголовок тоста (необязательно) */
  title?: string
  /** Время показа в мс. 0 = не закрывать автоматически */
  timeout?: number
  /** Показывать кнопку закрытия. По умолчанию true */
  closable?: boolean
  /** Кнопка действия (undo и т.п.) */
  action?: ToastAction
}

export interface ToastItem extends Omit<Required<ToastOptions>, 'title' | 'action'> {
  id: number
  type: ToastType
  text: string
  title: string | null
  action: ToastAction | null
  /** @internal */
  _timer: ReturnType<typeof setTimeout> | null
}

export interface ToastPromiseMessages {
  loading: string
  success: string
  error: string
}

export interface ToastPlugin {
  /** @internal */
  _state: { toasts: ToastItem[] }
  /** @internal */
  _defaultTimeout: number
  /** @internal */
  _defaultClosable: boolean
  /** @internal */
  _add(payload: Partial<ToastItem> & { text: string }): number
  /** @internal */
  _startTimer(item: ToastItem): void
  /** @internal */
  _pauseTimer(item: ToastItem): void
  /** @internal */
  _resumeTimer(item: ToastItem): void

  /** Показать тост с типом success */
  success(text: string, options?: ToastOptions): number
  /** Показать тост с типом info */
  info(text: string, options?: ToastOptions): number
  /** Показать тост с типом warning */
  warning(text: string, options?: ToastOptions): number
  /** Показать тост с типом danger */
  danger(text: string, options?: ToastOptions): number
  /** Показать тост без типа */
  default(text: string, options?: ToastOptions): number

  /**
   * Показать тост, который меняет состояние по результату промиса.
   * @returns id тоста
   * @example
   * toast.promise(api.save(), {
   *   loading: 'Сохраняем...',
   *   success: 'Готово!',
   *   error: 'Ошибка'
   * })
   */
  promise<T>(promise: Promise<T>, messages: ToastPromiseMessages): number

  /** Закрыть тост по id */
  dismiss(id: number): void

  /** Vue plugin install */
  install(app: App, options?: Partial<Pick<ToastItem, 'timeout' | 'closable'>>): void
}
// Plugin
const instance: { value: ToastPlugin | null } = { value: null }

function createToast(defaults: { timeout?: number; closable?: boolean } = {}): ToastPlugin {
  const state = reactive<{ toasts: ToastItem[] }>({ toasts: [] })

  const toast: ToastPlugin = {
    _state: state,
    _defaultTimeout: defaults.timeout ?? 3500,
    _defaultClosable: defaults.closable ?? true,

    _add(payload) {
      const id = Date.now() + Math.random()
      const item: ToastItem = {
        id,
        type:     payload.type ?? 'default',
        title:    payload.title ?? null,
        text:     payload.text ?? '',
        timeout:  payload.timeout ?? toast._defaultTimeout,
        action:   payload.action ?? null,
        closable: payload.closable ?? toast._defaultClosable,
        _timer:   null,
      }
      state.toasts.unshift(item)
      toast._startTimer(item)
      return id
    },

    _startTimer(item) {
      if (item.timeout <= 0) return
      item._timer = setTimeout(() => toast.dismiss(item.id), item.timeout)
    },

    _pauseTimer(item) {
      if (item._timer) clearTimeout(item._timer)
    },

    _resumeTimer(item) {
      toast._startTimer(item)
    },

    dismiss(id) {
      const idx = state.toasts.findIndex(t => t.id === id)
      if (idx > -1) {
        clearTimeout(state.toasts[idx]._timer ?? undefined)
        state.toasts.splice(idx, 1)
      }
    },

    // Основные методы
    success(text, options: ToastOptions = {}) {
      return toast._add({ ...options, text, type: 'success' })
    },

    info(text, options: ToastOptions = {}) {
      return toast._add({ ...options, text, type: 'info' })
    },

    warning(text, options: ToastOptions = {}) {
      return toast._add({ ...options, text, type: 'warning' })
    },

    danger(text, options: ToastOptions = {}) {
      return toast._add({ ...options, text, type: 'danger' })
    },

    default(text, options: ToastOptions = {}) {
      return toast._add({ ...options, text, type: 'default' })
    },

    promise<T>(promise: Promise<T>, { loading, success, error }: ToastPromiseMessages) {
      const id = toast._add({ text: loading, type: 'loading', timeout: 0 })

      promise
        .then(() => {
          const item = state.toasts.find(t => t.id === id)
          if (!item) return
          item.type    = 'success'
          item.text    = success
          item.timeout = 3500
          toast._startTimer(item)
        })
        .catch(() => {
          const item = state.toasts.find(t => t.id === id)
          if (!item) return
          item.type    = 'danger'
          item.text    = error
          item.timeout = 4000
          toast._startTimer(item)
        })

      return id
    },

    install() {},
  }

  return toast
}

export function useToast(): ToastPlugin {
  if (!instance.value) {
    throw new Error('useToast: instance not initialized. Call initToast() first.')
  }
  return instance.value
}

// Вызывается один раз в плагине toast.ts
export function initToast(options: { timeout?: number; closable?: boolean } = {}): ToastPlugin {
  instance.value = createToast(options)
  return instance.value
}