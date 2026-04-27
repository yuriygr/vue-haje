import Support from '@/views/Support'

import { SupportTickets, SupportTicket } from '@/views/_support'

export default [
  {
    path: '/support',
    name: 'support',
    component: Support,
    meta: { section: 'menu' },
    redirect: { name: 'support-tickets' },
    children: [
      { path: '', name: 'support-tickets', component: SupportTickets },
      { path: ':uuid', name: 'support-ticket', component: SupportTicket, props: true },
	    { path: ':pathMatch(.*)*', redirect: { name: 'support-tickets' } }
	] }
]