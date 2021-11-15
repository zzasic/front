import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/systemInfo/listInit', JSON.stringify({}))
}

function getSystemInfoList (searchCondition) {
  return postRequest('/api/systemInfo/listView', JSON.stringify(searchCondition))
}

function initSystemInfoView () {
  return postRequest('/api/systemInfo/initView', JSON.stringify({}))
}

function createSystemInfo (searchCondition) {
  return postRequest('/api/systemInfo/create', JSON.stringify(searchCondition))
}

function selectSystemInfoForUpdate (searchCondition) {
  return postRequest('/api/systemInfo/selectForUpdate', JSON.stringify(searchCondition))
}

function updateSystemInfo (searchCondition) {
  return postRequest('/api/systemInfo/update', JSON.stringify(searchCondition))
}

function deleteSystemInfo (searchCondition) {
  return postRequest('/api/systemInfo/delete', JSON.stringify(searchCondition))
}

export {
  getSearchCondition,
  getSystemInfoList,
  initSystemInfoView,
  createSystemInfo,
  selectSystemInfoForUpdate,
  updateSystemInfo,
  deleteSystemInfo
}
