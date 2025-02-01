import Press from '@/views/Pres'

import { PressHome, PressItem } from '@/views/_press'

export default [
  {
    path: '/press',
    name: 'press',
    component: Press,
    meta: { section: 'menu' },
    redirect: { name: 'press-home' },
    children: [
      { path: '', name: 'press-home', component: PressHome },
      { path: ':uuid', name: 'press-item', component: PressItem },
      { path: ':pathMatch(.*)*', redirect: { name: 'press-home' } }
  ] }
]