import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/tts/listInit', JSON.stringify({}))
}

function getTtsList (searchCondition) {
  return postRequest('/api/tts/listView', JSON.stringify(searchCondition))
}

function initTtsView () {
  return postRequest('/api/tts/initView', JSON.stringify({}))
}

function createTts (searchCondition) {
  return postRequest('/api/tts/create', JSON.stringify(searchCondition))
}

function selectTtsForUpdate (searchCondition) {
  return postRequest('/api/tts/selectForUpdate', JSON.stringify(searchCondition))
}

function updateTts (searchCondition) {
  return postRequest('/api/tts/update', JSON.stringify(searchCondition))
}

function deleteTts (searchCondition) {
  return postRequest('/api/tts/delete', JSON.stringify(searchCondition))
}

function deleteTtss (searchCondition) {
  return postRequest('/api/tts/deletes', JSON.stringify(searchCondition))
}

export {
  getSearchCondition,
  getTtsList,
  initTtsView,
  createTts,
  selectTtsForUpdate,
  updateTts,
  deleteTts,
  deleteTtss
}
