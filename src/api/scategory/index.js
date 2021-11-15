import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/scategory/listInit', JSON.stringify({}))
}

function getScenarioCategoryList (searchCondition) {
  return postRequest('/api/scategory/listView', JSON.stringify(searchCondition))
}

function initScenarioCategoryView () {
  return postRequest('/api/scategory/initView', JSON.stringify({}))
}

function createScenarioCategory (searchCondition) {
  return postRequest('/api/scategory/create', JSON.stringify(searchCondition))
}

function selectScenarioCategoryForUpdate (searchCondition) {
  return postRequest('/api/scategory/selectForUpdate', JSON.stringify(searchCondition))
}

function updateScenarioCategory (searchCondition) {
  return postRequest('/api/scategory/update', JSON.stringify(searchCondition))
}

function deleteScenarioCategory (searchCondition) {
  return postRequest('/api/scategory/delete', JSON.stringify(searchCondition))
}

function deleteScenarioCategorys (searchCondition) {
  return postRequest('/api/scategory/deletes', JSON.stringify(searchCondition))
}

function syncDapChatbotCategory (syncCondition) {
  return postRequest('/api/scategory/dapSync', JSON.stringify(syncCondition))
}
export {
  getSearchCondition,
  getScenarioCategoryList,
  initScenarioCategoryView,
  createScenarioCategory,
  selectScenarioCategoryForUpdate,
  updateScenarioCategory,
  deleteScenarioCategory,
  deleteScenarioCategorys,
  syncDapChatbotCategory
}
