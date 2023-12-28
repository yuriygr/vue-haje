import Auth from '@/views/Auth'
import { AuthLogin, AuthRegister, AuthForgot, AuthLogout, AuthResetPassword } from '@/views/_auth'

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
      { path: 'forgot', name: 'auth-forgot', component: AuthForgot },
      { path: 'reset-password', name: 'auth-reset-password', component: AuthResetPassword },
      { path: 'logout', name: 'auth-logout', component: AuthLogout },
	    { path: ':pathMatch(.*)*', redirect: { name: 'auth-login' } }
    ]
  }
]