export interface LoginBrowser {
  name: string
  version: string
}

export interface LoginOS {
  name: string
  version: string
}

export interface LoginDevice {
  family: string
  model: string
  brand: string
}

export interface Login {
  login_id: number
  user_id: number
  session_id: string
  ip: string
  browser: LoginBrowser
  os: LoginOS
  device: LoginDevice
  date_added: string
}