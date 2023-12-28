import Settings from '@/views/Settings'
import {
  SettingsMenu,
  SettingsProfile,
  SettingsPassword,
  SettingsLoginActivity,
  SettingsNotifications,
  SettingsDeleteAccount,
  SettingsGDPR
} from '@/views/_settings'

export default [
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { section: 'settings' },
    redirect: { name: 'settings-menu' },
    children: [
      { path: '', name: 'settings-menu', component: SettingsMenu },
      { path: 'profile', name: 'settings-profile', component: SettingsProfile },
      { path: 'notifications', name: 'settings-notifications', component: SettingsNotifications },
      { path: 'connections', name: 'settings-connections', component: SettingsMenu },
      { path: 'appearance', name: 'settings-appearance', component: SettingsMenu },
      { path: 'account', name: 'settings-account', component: SettingsMenu },
      { path: 'password', name: 'settings-password', component: SettingsPassword },
      { path: 'login-activity', name: 'settings-login-activity', component: SettingsLoginActivity },
      { path: 'gdpr', name: 'settings-gdpr', component: SettingsGDPR },
      { path: 'delete-account', name: 'settings-delete-account', component: SettingsDeleteAccount },
    ]
  }
]