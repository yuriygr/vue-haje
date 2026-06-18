import { watchEffect, onMounted, onActivated } from 'vue'

let globalOptions = {
  defaultTitle: false,
  separator: '-'
}

export function setMetaOptions(options) {
  globalOptions = { ...globalOptions, ...options }
}

function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches
}

function applyTitle(value) {
  if (!value) return
  document.title = !isPWA()
    ? `${value} ${globalOptions.separator} ${globalOptions.defaultTitle}`
    : (value || globalOptions.defaultTitle)
}

function applyMeta(key, value) {
  document.querySelector(`meta[name="${key}"]`)?.setAttribute('content', value)
}

function applyDataset(key, value) {
  if (!value) {
    delete document.documentElement.dataset[key]
  } else {
    document.documentElement.dataset[key] = value
  }
}

function applyAll(meta) {
  if (!meta) return
  if (meta.title) applyTitle(meta.title)
  if (meta.description) applyMeta('description', meta.description)
}

export function useMeta(metaFn) {
  onMounted(() => applyAll(metaFn()))
  onActivated(() => applyAll(metaFn()))
  watchEffect(() => applyAll(metaFn()))

  return {
    setTitle: applyTitle,
    setMeta: applyMeta,
    setDataset: applyDataset
  }
}