import { postRequest } from '../AxioCreate.js'

function login (email, password, locale) {
  return postRequest('/public/users/login', JSON.stringify({ userEmail: email, password: password, localeCode: locale }))
}

function logout () {
  return postRequest('/auth/logout')
}

function httpLogin (data) {
  return postRequest('/auth/current', JSON.stringify({ authId: data }))
}

export {
  login,
  logout,
  httpLogin
}
