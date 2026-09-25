import axios from 'axios'
import type { AxiosInstance } from 'axios'

// Types
export interface ApiOptions {
  key?: string
  baseURL: string
  version: string
  withCredentials?: boolean
}

// Plugin
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
    (response) => {
      if (response.config.responseType === 'blob') {
        return response
      }
      return JSON.parse(response.request.response)
    },
    (error) => {
      if (!error.response) {
        return Promise.reject({
          code: 'network_error',
          status: 'network_error'
        })
      }
  
      const parseBody = (data: any) => ({
        httpStatus: error.response.status,
        code: data.code,
        message: data.message,
        status: data.status,
        payload: data.payload
      })
  
      if (error.config?.responseType === 'blob' && error.response.data instanceof Blob) {
        return error.response.data.text().then((text: string) => {
          let parsed
          try {
            parsed = JSON.parse(text)
          } catch {
            parsed = { code: 'internal_server_error', message: text, status: 'internal_server_error' }
          }
          return Promise.reject(parseBody(parsed))
        })
      }
  
      return Promise.reject(parseBody(error.response.data))
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

  function preparePostData(params: Record<string, any> | FormData) {
    if (params instanceof FormData) {
      return params
    }
    
    const formData = new FormData()
    Object.keys(params).forEach(key => formData.append(key, params[key]))
    return formData
  }

  function get(path: string, params = {}) {
    return instance.value!.get(path, { params })
  }

  function post(
    path: string,
    params: Record<string, any> = {},
    options: { headers?: Record<string, string>; [key: string]: any } = {}
  ) {
    const { headers, ...rest } = options
  
    return instance.value!.post(path, preparePostData(params), {
      ...rest,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
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