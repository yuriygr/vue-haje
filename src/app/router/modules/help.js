import Help from '@/views/Help'

import { HelpPages, HelpPage } from '@/views/_help'

export default [
  {
    path: '/help',
    name: 'helps',
    component: Help,
    meta: { section: 'menu' },
    redirect: { name: 'help-pages' },
    children: [
      { path: '', name: 'help-pages', component: HelpPages },
      { path: ':slug', name: 'help-page', component: HelpPage, props: true },
	    { path: ':pathMatch(.*)*', redirect: { name: 'help-pages' } }
	] }
]