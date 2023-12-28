import { createRouter, createWebHistory } from 'vue-router'

import Feed from '@/views/Feed'
import Tag from '@/views/Tag'
import Notifications from '@/views/Notifications'
import Entry from '@/views/Entry'
import Menu from '@/views/Menu'
import About from '@/views/About'

import UserRoutes from '@/app/components/router/modules/user'
import SearchRoutes from '@/app/components/router/modules/search'
import SettingsRoutes from '@/app/components/router/modules/settings'
import HelpRoutes from '@/app/components/router/modules/help'
import AuthRoutes from '@/app/components/router/modules/auth'


const routes = [
	...UserRoutes,
	...SettingsRoutes,
	...SearchRoutes,
	...HelpRoutes,
	...AuthRoutes,
	
	{ path: '/timeline', name: 'timeline', component: Feed },
	
	{ path: '/e/:uuid', name: 'entry', component: Entry, props: true },
	{ path: '/t/:slug', name: 'tag', component: Tag, props: true  },

	{ path: '/notifications', name: 'notifications', component: Notifications },
	
	{ path: '/menu', name: 'menu', component: Menu },
	{ path: '/donate', name: 'donate', component: About },
	{ path: '/about', name: 'about', component: About },


	{ path: '/:pathMatch(.*)*', redirect: { name: 'timeline' } }
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
