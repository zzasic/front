import { getRequest } from '../AxioCreate.js'

function getPortalPolicy () {
  return getRequest('/api/home/ppolicy')
}

export {
  getPortalPolicy
}
