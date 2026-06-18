import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

/**
 * Основной store приложения, который я планирую реиспользовать в других пет-проектах.
 * Данные по умолчанию берутся из файла окружения
 *
 * @version 2.0.0
 */
export const useAppStore = defineStore('app', () => {
  // ─── State ───────────────────────────────────────────────────────────────────

  const title    = ref(process.env.VUE_APP_TITLE)
  const basePath = ref(process.env.VUE_APP_BASE_URL)
  const version  = ref(process.env.PACKAGE_VERSION)

  const theme   = ref(localStorage.getItem('theme')   || process.env.VUE_APP_DEFAULT_THEME)
  const density = ref(localStorage.getItem('density') || process.env.VUE_APP_DEFAULT_DENSITY)
  const locale  = ref(localStorage.getItem('locale')  || process.env.VUE_APP_I18N_LOCALE)

  const cachedComponents = ref([])

  // ─── Persist ─────────────────────────────────────────────────────────────────

  watch(theme,   val => localStorage.setItem('theme',   val))
  watch(density, val => localStorage.setItem('density', val))
  watch(locale,  val => localStorage.setItem('locale',  val))

  // ─── Getters ─────────────────────────────────────────────────────────────────

  const themeStatusBar = computed(() => {
    const colors = { white: '#ffffff',  black: '#111111', void: '#000000' }
    return colors[theme.value]
  })

  const themes    = computed(() => ['white', 'black', 'void'])
  const densities = computed(() => ['compact', 'default', 'spacious'])

  // ─── Actions ─────────────────────────────────────────────────────────────────

  function setTheme(payload)   { theme.value   = payload }
  function setLocale(payload)  { locale.value  = payload }
  function setDensity(payload) { density.value = payload }

  function addCachedComponent(componentName) {
    if (!cachedComponents.value.includes(componentName)) {
      cachedComponents.value.push(componentName)
    }
  }

  function removeCachedComponent(componentName) {
    cachedComponents.value = cachedComponents.value.filter(
      name => name !== componentName
    )
  }

  function resetCachedComponents() {
    cachedComponents.value = []
  }

  return {
    // state
    title, basePath, version,
    theme, density, locale,
    cachedComponents,
    // getters
    themeStatusBar, themes, densities,
    // actions
    setTheme, setLocale, setDensity,
    addCachedComponent, removeCachedComponent, resetCachedComponents,
  }
})