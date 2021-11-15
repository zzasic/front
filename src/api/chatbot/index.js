import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/chatbot/listInit', JSON.stringify({}))
}

function getChatbotList (searchCondition) {
  return postRequest('/api/chatbot/listView', JSON.stringify(searchCondition))
}

function initChatbotView () {
  return postRequest('/api/chatbot/initView', JSON.stringify({}))
}

function createChatbot (searchCondition) {
  return postRequest('/api/chatbot/create', JSON.stringify(searchCondition))
}

function selectChatbotForUpdate (searchCondition) {
  return postRequest('/api/chatbot/selectForUpdate', JSON.stringify(searchCondition))
}

function updateChatbot (searchCondition) {
  return postRequest('/api/chatbot/update', JSON.stringify(searchCondition))
}

function deleteChatbot (searchCondition) {
  return postRequest('/api/chatbot/delete', JSON.stringify(searchCondition))
}

function deleteChatbots (searchCondition) {
  return postRequest('/api/chatbot/deletes', JSON.stringify(searchCondition))
}

function syncDapChatbot (syncCondition) {
  return postRequest('/api/chatbot/dapSync', JSON.stringify(syncCondition))
}

export {
  getSearchCondition,
  getChatbotList,
  initChatbotView,
  createChatbot,
  selectChatbotForUpdate,
  updateChatbot,
  deleteChatbot,
  deleteChatbots,
  syncDapChatbot
}
