import { watchEffect, onMounted, onActivated } from 'vue'

export interface MetaOptions {
  defaultTitle?: string | false
  separator: string
}

interface MetaData {
  title?: string
  description?: string
  [key: string]: string | undefined
}

type MetaFn = () => MetaData | undefined | null

let globalOptions: MetaOptions = {
  defaultTitle: false,
  separator: '-'
}

export function setMetaOptions(options: Partial<MetaOptions>): void {
  globalOptions = { ...globalOptions, ...options }
}

function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
}

// ─── Низкоуровневые сеттеры ──────────────────────────────────────────────
// Экспортируются напрямую (не только через useMeta), потому что нужны и
// вне контекста "мета для конкретной страницы" — например, в App.vue для
// установки data-атрибутов темы/локали/плотности, которые не привязаны
// к жизненному циклу страницы и не требуют reactive metaFn.

export function applyTitle(value?: string): void {
  if (!value) return
  document.title = !isPWA()
    ? `${value} ${globalOptions.separator} ${globalOptions.defaultTitle}`
    : (value || String(globalOptions.defaultTitle))
}

export function applyMeta(key: string, value: string): void {
  document.querySelector(`meta[name="${key}"]`)?.setAttribute('content', value)
}

export function applyDataset(key: string, value?: string | false): void {
  if (!value) {
    delete document.documentElement.dataset[key]
  } else {
    document.documentElement.dataset[key] = value
  }
}

function applyAll(meta?: MetaData | null): void {
  if (!meta) return
  if (meta.title) applyTitle(meta.title)
  if (meta.description) applyMeta('description', meta.description)
}

// ─── Реактивный composable для мета-данных страницы ─────────────────────
// Используется внутри setup() конкретной страницы/компонента, где есть
// реактивные title/description, обновляющиеся по ходу жизни компонента:
//   useMeta(() => ({ title: title.value }))

export function useMeta(metaFn: MetaFn) {
  onMounted(() => applyAll(metaFn()))
  onActivated(() => applyAll(metaFn()))
  watchEffect(() => applyAll(metaFn()))

  return {
    setTitle: applyTitle,
    setMeta: applyMeta,
    setDataset: applyDataset
  }
}