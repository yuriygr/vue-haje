import { watchEffect, onMounted, onActivated } from 'vue'

// Types
export interface MetaOptions {
  defaultTitle?: string | false
  separator?: string | false
}

export interface MetaData {
  title?: string
  description?: string
  canonical?: string
  [key: string]: string | undefined
}

// Plugin
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

/**
 * Ставит/обновляет <link rel="canonical">. Если href не передан —
 * подставляется текущий URL без query-параметров и хэша (стандартная
 * практика для SPA: self-referencing canonical по умолчанию, чтобы
 * избежать дублей контента из-за query-параметров вроде ?utm_source=...).
 */
export function applyCanonical(href?: string): void {
  const url = href || `${window.location.origin}${window.location.pathname}`
 
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
 
  link.setAttribute('href', url)
}

function applyAll(meta?: MetaData | null): void {
  if (!meta) return
  if (meta.title) applyTitle(meta.title)
  if (meta.description) applyMeta('description', meta.description)
    applyCanonical(meta.canonical)
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
    setDataset: applyDataset,
    setCanonical: applyCanonical
  }
}