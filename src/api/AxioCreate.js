import Axios from 'axios'
import router from '../router'

const aiccHost = process.env.VUE_APP_AICC_URL

function createAxios () {
  const axios = Axios.create()
  axios.interceptors.request.use(
    conf => {
      const token = sessionStorage.accessToken

      if (token) {
        conf.headers.Authorization = `Bearer ${token}`
      }

      return conf
    },
    error => {
      return Promise.reject(error)
    }
  )
  axios.interceptors.response.use(
    response => {
      const resStatus = response.data.status ? response.data.status : response.status
      if (response.data.routerMove) {
        router.push(response.data.routerMove)
        return response
      }
      if (resStatus !== 200) {
        if (response.data.message) {
          alert(response.data.message)
        }
        if (resStatus === 401) {
          delete sessionStorage.accessToken
          if (!response.data.message) {
            alert('해당 계정으로 다른 곳에서 로그인하였거나, 로그인정보가 만료되었습니다.')
          }
          router.push({ name: 'Login', query: { t: new Date().getTime() } })
        } else if (resStatus > 500) {
          router.push({ name: 'ErrorPage', query: { t: new Date().getTime() } })
        }
        return response
      }
      return response
    },
    error => {
      if (error && error.response && error.response.status) {
        const status = error.response.status
        const err = error.response.data

        if (status === 401) {
          delete sessionStorage.accessToken
          if (err.message === 'User credentials have expired') {
            alert('해당 계정으로 다른 곳에서 로그인하였거나, 로그인정보가 만료되었습니다.')
          }
          router.push({ name: 'Login', query: { t: new Date().getTime() } })
        } else {
          router.push({ name: 'ErrorPage', query: { t: new Date().getTime() } })
        }
      } else {
        router.push({ name: 'ErrorPage', query: { t: new Date().getTime() } })
      }
      return Promise.reject(error)
    }
  )
  return axios
}

function getRequest (url) {
  return createAxios().get(`${aiccHost}${url}`)
}

function deleteRequest (url) {
  return createAxios().delete(`${aiccHost}${url}`)
}

function postRequest (url, data) {
  return createAxios().post(`${aiccHost}${url}`, data, { headers: { 'Content-Type': 'application/json' } })
}

function postRequestBlob (url, data) {
  return createAxios().post(`${aiccHost}${url}`, data, { responseType: 'blob', headers: { 'Content-Type': 'application/json' } })
}

function putRequest (url, data) {
  return createAxios().put(`${aiccHost}${url}`, data, { headers: { 'Content-Type': 'application/json' } })
}

function getRequestSleep (url) {
  return Axios.get(`${aiccHost}${url}`)
}

function deleteRequestSleep (url) {
  return Axios.delete(`${aiccHost}${url}`)
}

function postRequestSleep (url, data) {
  return Axios.post(`${aiccHost}${url}`, data, { headers: { 'Content-Type': 'application/json' } })
}

function putRequestSleep (url, data) {
  return Axios.put(`${aiccHost}${url}`, data, { headers: { 'Content-Type': 'application/json' } })
}

function uploadRequest (url, file) {
  return createAxios().post(`${aiccHost}${url}`, file, { headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' } })
}

export {
  aiccHost,

  getRequest,
  deleteRequest,
  postRequest,
  postRequestBlob,
  putRequest,

  getRequestSleep,
  deleteRequestSleep,
  postRequestSleep,
  putRequestSleep,

  uploadRequest
}
