import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/ta/listInit', JSON.stringify({}))
}

function getTaList (searchCondition) {
  return postRequest('/api/ta/listView', JSON.stringify(searchCondition))
}

function initTaView () {
  return postRequest('/api/ta/initView', JSON.stringify({}))
}

function createTa (searchCondition) {
  return postRequest('/api/ta/create', JSON.stringify(searchCondition))
}

function selectTaForUpdate (searchCondition) {
  return postRequest('/api/ta/selectForUpdate', JSON.stringify(searchCondition))
}

function updateTa (searchCondition) {
  return postRequest('/api/ta/update', JSON.stringify(searchCondition))
}

function deleteTa (searchCondition) {
  return postRequest('/api/ta/delete', JSON.stringify(searchCondition))
}

function deleteTas (searchCondition) {
  return postRequest('/api/ta/deletes', JSON.stringify(searchCondition))
}

export {
  getSearchCondition,
  getTaList,
  initTaView,
  createTa,
  selectTaForUpdate,
  updateTa,
  deleteTa,
  deleteTas
}
