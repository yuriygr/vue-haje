const Auth = () => import('@/views/Auth')

import { AuthLogin, AuthRegister, AuthForgot, AuthForgotCode, AuthLogout, AuthForgotChange } from '@/views/_auth'

export default [
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
    meta: { section: 'auth' },
    redirect: { name: 'auth-login' },
    children: [
      { path: 'login', name: 'auth-login', component: AuthLogin },
      { path: 'register', name: 'auth-register', component: AuthRegister },

      { path: 'forgot', children: [
        { path: '', name: 'auth-forgot', component: AuthForgot },
        { path: 'code/:token', name: 'auth-forgot-code', component: AuthForgotCode, props: true },
        { path: 'change/:token', name: 'auth-forgot-change', component: AuthForgotChange, props: true },
      ] },
        
      { path: 'logout', name: 'auth-logout', component: AuthLogout },
	    { path: ':pathMatch(.*)*', redirect: { name: 'auth-login' } }
    ]
  }
]