import { postRequest } from '../AxioCreate.js'

function getUserServiceList () {
  return postRequest('/api/main/listMainView', JSON.stringify({}))
}

export {
  getUserServiceList
}
