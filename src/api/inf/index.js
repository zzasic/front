import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/inf/listInit', JSON.stringify({}))
}

function getApiList (searchCondition) {
  return postRequest('/api/inf/listView', JSON.stringify(searchCondition))
}

function initApiView () {
  return postRequest('/api/inf/initView', JSON.stringify({}))
}

function createApi (searchCondition) {
  return postRequest('/api/inf/create', JSON.stringify(searchCondition))
}

function sendApi (searchCondition) {
  return postRequest('/api/inf/send', JSON.stringify(searchCondition))
}

function selectApiForUpdate (searchCondition) {
  return postRequest('/api/inf/selectForUpdate', JSON.stringify(searchCondition))
}

function updateApi (searchCondition) {
  return postRequest('/api/inf/update', JSON.stringify(searchCondition))
}

function deleteApi (searchCondition) {
  return postRequest('/api/inf/delete', JSON.stringify(searchCondition))
}

function getApiCallSearchCondition () {
  return postRequest('/api/infCall/listInit', JSON.stringify({}))
}

function getApiCallList (searchCondition) {
  return postRequest('/api/infCall/listView', JSON.stringify(searchCondition))
}

function initApiCallView () {
  return postRequest('/api/infCall/initView', JSON.stringify({}))
}

function createApiCall (searchCondition) {
  return postRequest('/api/infCall/create', JSON.stringify(searchCondition))
}

function sendApiCall (searchCondition) {
  return postRequest('/api/infCall/send', JSON.stringify(searchCondition))
}

function selectApiCallForUpdate (searchCondition) {
  return postRequest('/api/infCall/selectForUpdate', JSON.stringify(searchCondition))
}

function updateApiCall (searchCondition) {
  return postRequest('/api/infCall/update', JSON.stringify(searchCondition))
}

function deleteApiCall (searchCondition) {
  return postRequest('/api/infCall/delete', JSON.stringify(searchCondition))
}

function getApiCallHistorySearchCondition () {
  return postRequest('/api/infCall/listHistoryInit', JSON.stringify({}))
}

function getApiCallHistoryList (searchCondition) {
  return postRequest('/api/infCall/listHistoryView', JSON.stringify(searchCondition))
}

function selectApiCallHistoryForUpdate (searchCondition) {
  return postRequest('/api/infCall/selectHistoryForUpdate', JSON.stringify(searchCondition))
}

function resendApiCallHistory (searchCondition) {
  return postRequest('/api/infCall/resend', JSON.stringify(searchCondition))
}

function getApiRoutingSearchCondition () {
  return postRequest('/api/infRouting/listInit', JSON.stringify({}))
}

function getApiRoutingList (searchCondition) {
  return postRequest('/api/infRouting/listView', JSON.stringify(searchCondition))
}

function initApiRoutingView () {
  return postRequest('/api/infRouting/initView', JSON.stringify({}))
}

function createApiRouting (searchCondition) {
  return postRequest('/api/infRouting/create', JSON.stringify(searchCondition))
}

function selectApiRoutingForUpdate (searchCondition) {
  return postRequest('/api/infRouting/selectForUpdate', JSON.stringify(searchCondition))
}

function updateApiRouting (searchCondition) {
  return postRequest('/api/infRouting/update', JSON.stringify(searchCondition))
}

function deleteApiRouting (searchCondition) {
  return postRequest('/api/infRouting/delete', JSON.stringify(searchCondition))
}

export {
  getSearchCondition,
  getApiList,
  initApiView,
  createApi,
  sendApi,
  selectApiForUpdate,
  updateApi,
  deleteApi,
  getApiCallSearchCondition,
  getApiCallList,
  initApiCallView,
  createApiCall,
  sendApiCall,
  selectApiCallForUpdate,
  updateApiCall,
  deleteApiCall,
  getApiCallHistorySearchCondition,
  getApiCallHistoryList,
  selectApiCallHistoryForUpdate,
  resendApiCallHistory,
  getApiRoutingSearchCondition,
  getApiRoutingList,
  initApiRoutingView,
  createApiRouting,
  selectApiRoutingForUpdate,
  updateApiRouting,
  deleteApiRouting
}
