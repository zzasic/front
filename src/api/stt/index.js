import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/stt/listInit', JSON.stringify({}))
}

function getSttList (searchCondition) {
  return postRequest('/api/stt/listView', JSON.stringify(searchCondition))
}

function initSttView () {
  return postRequest('/api/stt/initView', JSON.stringify({}))
}

function createStt (searchCondition) {
  return postRequest('/api/stt/create', JSON.stringify(searchCondition))
}

function selectSttForUpdate (searchCondition) {
  return postRequest('/api/stt/selectForUpdate', JSON.stringify(searchCondition))
}

function updateStt (searchCondition) {
  return postRequest('/api/stt/update', JSON.stringify(searchCondition))
}

function deleteStt (searchCondition) {
  return postRequest('/api/stt/delete', JSON.stringify(searchCondition))
}

function deleteStts (searchCondition) {
  return postRequest('/api/stt/deletes', JSON.stringify(searchCondition))
}

export {
  getSearchCondition,
  getSttList,
  initSttView,
  createStt,
  selectSttForUpdate,
  updateStt,
  deleteStt,
  deleteStts
}
