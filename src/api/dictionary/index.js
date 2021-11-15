import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/dictionary/listInit', JSON.stringify({}))
}

function getDictionaryList (searchCondition) {
  return postRequest('/api/dictionary/listView', JSON.stringify(searchCondition))
}

function createDictionaryView () {
  return postRequest('/api/dictionary/createView', JSON.stringify({}))
}

function createDictionary (dictionary) {
  return postRequest('/api/dictionary/create', JSON.stringify(dictionary))
}

function getDictionary (dctnrCode, lang) {
  return postRequest(`${'/api/dictionary/' + dctnrCode + '/' + lang}`, JSON.stringify({}))
}

function updateDictionaryView (dctnrCode, lang) {
  return postRequest(`${'/api/dictionary/updateView/' + dctnrCode + '/' + lang}`, JSON.stringify({}))
}

function updateDictionary (dictionary) {
  return postRequest('/api/dictionary/update', JSON.stringify(dictionary))
}

function deleteDictionary (dictionarys) {
  return postRequest(`${'/api/dictionary/delete'}`, JSON.stringify(dictionarys))
}

export {
  getSearchCondition,
  getDictionaryList,
  createDictionaryView,
  createDictionary,
  getDictionary,
  updateDictionaryView,
  updateDictionary,
  deleteDictionary
}
