import Settings from '@/views/Settings'

import {
  SettingsMenu,
  SettingsConnections,
  SettingsAppearance,
  SettingsAccount,
  SettingsProfile,
  SettingsPassword,
  SettingsPermissions,
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
    meta: { section: 'menu' },
    redirect: { name: 'settings-menu' },
    children: [
      { path: '', name: 'settings-menu', component: SettingsMenu },
      { path: 'profile', name: 'settings-profile', component: SettingsProfile },
      { path: 'notifications', name: 'settings-notifications', component: SettingsNotifications },
      { path: 'connections', name: 'settings-connections', component: SettingsConnections },
      { path: 'appearance', name: 'settings-appearance', component: SettingsAppearance },
      { path: 'account', name: 'settings-account', component: SettingsAccount },
      { path: 'password', name: 'settings-password', component: SettingsPassword },
      { path: 'permissions', name: 'settings-permissions', component: SettingsPermissions },
      { path: 'login-activity', name: 'settings-login-activity', component: SettingsLoginActivity },
      { path: 'gdpr', name: 'settings-gdpr', component: SettingsGDPR },
      { path: 'delete-account', name: 'settings-delete-account', component: SettingsDeleteAccount },
    ]
  }
]