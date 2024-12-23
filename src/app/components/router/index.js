import { createRouter, createWebHistory } from 'vue-router'

import Entry from '@/views/Entry'
const Home = () => import('@/views/Home')
const Notifications = () => import('@/views/Notifications')
import Menu from '@/views/Menu'
import About from '@/views/About'

import FeedRoutes from '@/app/components/router/modules/feed'
import TagRoutes from '@/app/components/router/modules/tag'
import UserRoutes from '@/app/components/router/modules/user'
import SearchRoutes from '@/app/components/router/modules/search'
import BookmarksRoutes from '@/app/components/router/modules/bookmarks'
import FeedsRoutes from '@/app/components/router/modules/feeds'
import SettingsRoutes from '@/app/components/router/modules/settings'
import HelpRoutes from '@/app/components/router/modules/help'
import AuthRoutes from '@/app/components/router/modules/auth'
import CommunitiesRoutes from '@/app/components/router/modules/communities'

const routes = [
	...FeedRoutes,
	...TagRoutes,
	...UserRoutes,
	...SettingsRoutes,
	...BookmarksRoutes,
	...FeedsRoutes,
	...SearchRoutes,
	...HelpRoutes,
	...AuthRoutes,
	...CommunitiesRoutes,
	
	{ path: '/', name: 'home', component: Home },
	
	{ path: '/e/:uuid', name: 'entry', component: Entry, props: true },

	{ path: '/notifications', name: 'notifications', component: Notifications },
	
	{ path: '/menu', name: 'menu', component: Menu },
	{ path: '/donate', name: 'donate', component: About },
	{ path: '/about', name: 'about', component: About },

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

export default router
