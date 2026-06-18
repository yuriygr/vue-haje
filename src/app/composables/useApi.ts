import axios from 'axios'
import type { AxiosInstance } from 'axios'

interface ApiOptions {
  baseURL: string
  version: string
  withCredentials?: boolean
}

const instance: { value: AxiosInstance | null } = { value: null }
let token: string | false = false

function createInstance(options: ApiOptions) {
  const ax = axios.create({
    baseURL: options.baseURL + options.version + '/',
    withCredentials: options.withCredentials ?? true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  ax.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  ax.interceptors.response.use(
    (data) => JSON.parse(data.request.response),
    (error) => {
      if (!error.response) {
        return Promise.reject({
          code: error.code,
          status: error.code ?? 'network_error'
        })
      }
      const response = error.response.data
      return Promise.reject({
        code: response.code,
        error: response.error,
        status: response.status
      })
    }
  )

  return ax
}

export function useApi() {
  if (!instance.value) {
    throw new Error('useApi: instance not initialized. Call initApi() first.')
  }

  function setToken(t: string) {
    token = t
  }

  function preparePostData(params: Record<string, any>) {
    const formData = new FormData()
    Object.keys(params).forEach(key => formData.append(key, params[key]))
    return formData
  }

  function get(path: string, params = {}) {
    return instance.value!.get(path, { params })
  }

  function post(path: string, params: Record<string, any> = {}) {
    return instance.value!.post(path, preparePostData(params), {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  function postJSON(path: string, json = {}, headers = {}) {
    return instance.value!.post(path, json, { headers })
  }

  function upload(path: string, formdata: FormData, opt = {}) {
    return instance.value!.post(path, formdata, opt)
  }

  function del(path: string, params = {}) {
    return instance.value!.delete(path, { params })
  }

  return { get, post, postJSON, upload, delete: del, setToken }
}

// Вызывается один раз в main.ts
export function initApi(options: ApiOptions) {
  instance.value = createInstance(options)
}