import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/menu/listInit', JSON.stringify({}))
}

function getMenuList (searchCondition) {
  return postRequest('/api/menu/listView', JSON.stringify(searchCondition))
}

function batchMenuUpdate (params) {
  return postRequest('/api/menu/batchUpdate', JSON.stringify(params))
}

function getMenuListById (menuId, authCd) {
  return postRequest('/api/menu/auth/' + menuId + '/' + authCd, { data: '' })
}

export {
  getMenuList,
  getSearchCondition,
  batchMenuUpdate,
  getMenuListById
}
