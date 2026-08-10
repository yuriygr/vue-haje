import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/app/store/modules/app'
import { useModals } from '@vue-norma/ui'

import Entry from '@/views/Entry'
import Menu from '@/views/Menu'
const Donate = () => import('@/views/Donate')
const About = () => import('@/views/About')

// Load modules from folder
const modules = {}
const requireModule = require.context('./modules', false,  /\.js$/)
requireModule.keys().forEach(filename => {
  const moduleName = filename.replace(/(\.\/|\.js)/g, '').replace(/^\w/, c => c.toLowerCase())
  modules[moduleName] = requireModule(filename).default || requireModule(filename)
})

const routes = [
	...Object.values(modules).flat(),
	
	{ path: '/', name: 'home', redirect: { name: 'feed' } },
	
	{ path: '/e/:uuid', name: 'entry', component: Entry, props: true },

	{ path: '/menu', name: 'menu', component: Menu, meta: { section: 'menu' } },
	{ path: '/donate', name: 'donate', component: Donate, meta: { section: 'menu' } },
	{ path: '/about', name: 'about', component: About, meta: { section: 'menu' } },

	{ path: '/:pathMatch(.*)*', redirect: { name: 'feed' } }
]

// Create router
const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	pathToRegexOptions: { strict: true },
	scrollBehavior (to, from, savedPosition) {
    if (savedPosition)
			return savedPosition
		else if (to.query.comment)
      return { el: `#comment-${to.query.comment}`, top: 90 }
    else if (to.hash)
			return { el: to.hash }
		else
			return { top: 0, left: 0 }
	}
})

export default  {
	install(app, options) {
		router.install(app)

		router.beforeEach((to, from, next) => {
			const appStore = useAppStore(app.config.globalProperties.$pinia)
			const modals = useModals()

			modals.close()
			app.config.globalProperties.$popover.close()

		
			if (to?.name === 'entry') {
				if (from?.name === 'feed-timeline') appStore.addCachedComponent('feed-timeline')
				if (from?.name === 'feed-abyss')    appStore.addCachedComponent('feed-abyss')
			}

			next()
		})
	}
}
