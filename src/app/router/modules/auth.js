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
      { path: 'login', name: 'auth-login', components: { auth: AuthLogin } },
      { path: 'register', name: 'auth-register', components: { auth: AuthRegister } },

      { path: 'forgot', children: [
        { path: '', name: 'auth-forgot', components: { auth: AuthForgot } },
        { path: 'code/:token', name: 'auth-forgot-code', components: { auth: AuthForgotCode }, props: true },
        { path: 'change/:token', name: 'auth-forgot-change', components: { auth: AuthForgotChange }, props: true },
      ] },
        
      { path: 'logout', name: 'auth-logout', components: { auth: AuthLogout } },
	    { path: ':pathMatch(.*)*', redirect: { name: 'auth-login' } }
    ]
  }
]