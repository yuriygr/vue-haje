import { createRouter, createWebHistory } from 'vue-router'

import Entry from '@/views/Entry'
const Home = () => import('@/views/Home')
const Donate = () => import('@/views/Donate')
import Menu from '@/views/Menu'
const About = () => import('@/views/About')

import FeedRoutes from '@/app/components/router/modules/feed'
import TagRoutes from '@/app/components/router/modules/tag'
import UserRoutes from '@/app/components/router/modules/user'
import SearchRoutes from '@/app/components/router/modules/search'
import BookmarksRoutes from '@/app/components/router/modules/bookmarks'
import FeedsRoutes from '@/app/components/router/modules/feeds'
import SettingsRoutes from '@/app/components/router/modules/settings'
import HelpRoutes from '@/app/components/router/modules/help'
import NotificationsRoutes from '@/app/components/router/modules/notifications'
import AuthRoutes from '@/app/components/router/modules/auth'

const routes = [
	...FeedRoutes,
	...TagRoutes,
	...UserRoutes,
	...SettingsRoutes,
	...BookmarksRoutes,
	...FeedsRoutes,
	...SearchRoutes,
	...HelpRoutes,
	...NotificationsRoutes,
	...AuthRoutes,
	
	{ path: '/', name: 'home', component: Home },
	
	{ path: '/e/:uuid', name: 'entry', component: Entry, props: true },

	{ path: '/menu', name: 'menu', component: Menu, meta: { section: 'menu' } },
	{ path: '/donate', name: 'donate', component: Donate, meta: { section: 'menu' } },
	{ path: '/about', name: 'about', component: About, meta: { section: 'menu' } },

	{ path: '/:pathMatch(.*)*', redirect: { name: 'feed' } }
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	pathToRegexOptions: { strict: true },
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition)
			return savedPosition
		else if (to.hash)
			return { selector: to.hash }
		else
			return { x: 0, y: 0 }
	}
})

export default  {
	install(app, options) {
		router.install(app)

		router.beforeEach((to, from, next) => {
			app.config.globalProperties.$modals.close()
			app.config.globalProperties.$popover.close()
			app.config.globalProperties.$alerts.close()
		
			next()
		})
	}
}
