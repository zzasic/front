import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/scenario/listInit', JSON.stringify({}))
}

function getScenarioList (searchCondition) {
  return postRequest('/api/scenario/listView', JSON.stringify(searchCondition))
}

function initScenarioView () {
  return postRequest('/api/scenario/initView', JSON.stringify({}))
}

function createScenario (searchCondition) {
  return postRequest('/api/scenario/create', JSON.stringify(searchCondition))
}

function selectScenarioForUpdate (searchCondition) {
  return postRequest('/api/scenario/selectForUpdate', JSON.stringify(searchCondition))
}

function updateScenario (searchCondition) {
  return postRequest('/api/scenario/update', JSON.stringify(searchCondition))
}

function deleteScenario (searchCondition) {
  return postRequest('/api/scenario/delete', JSON.stringify(searchCondition))
}

function deleteScenarios (searchCondition) {
  return postRequest('/api/scenario/deletes', JSON.stringify(searchCondition))
}

function syncDapChatbotScenario (syncCondition) {
  return postRequest('/api/scenario/dapSync', JSON.stringify(syncCondition))
}

function syncDapChatbotScenarioNode (syncCondition) {
  return postRequest('/api/scenario/dapNodeSync', JSON.stringify(syncCondition))
}

function getScenarioNodeList (syncCondition) {
  return postRequest('/api/scenario/getScenarioNodeList', JSON.stringify(syncCondition))
}

function saveScenarioNode (syncCondition) {
  return postRequest('/api/scenario/saveScenarioNode', JSON.stringify(syncCondition))
}

export {
  getSearchCondition,
  getScenarioList,
  initScenarioView,
  createScenario,
  selectScenarioForUpdate,
  updateScenario,
  deleteScenario,
  deleteScenarios,
  syncDapChatbotScenario,
  syncDapChatbotScenarioNode,
  getScenarioNodeList,
  saveScenarioNode
}
