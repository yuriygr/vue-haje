import Help from '@/views/Help'
import { HelpMenu } from '@/views/_help'

export default [
  {
    path: '/help',
    name: 'helps',
    component: Help,
    meta: { section: 'help' },
    redirect: { name: 'help-menu' },
    children: [
      { path: '', name: 'help-menu', component: HelpMenu },
      { path: 'all-questions', name: 'help-all-questions', component: HelpMenu },
      { path: 'my-questions', name: 'help-my-questions', component: HelpMenu },
      { path: 'add-question', name: 'help-add-question', component: HelpMenu },
      { path: ':uuid', name: 'help-page', component: Help },
	    { path: ':pathMatch(.*)*', redirect: { name: 'help-menu' } }
	] }
]