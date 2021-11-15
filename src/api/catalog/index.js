import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/catalog/listInit', JSON.stringify({}))
}

function getCatalogList (searchCondition) {
  return postRequest('/api/catalog/listView', JSON.stringify(searchCondition))
}

function initCatalogView () {
  return postRequest('/api/catalog/initView', JSON.stringify({}))
}

function createCatalog (searchCondition) {
  return postRequest('/api/catalog/create', JSON.stringify(searchCondition))
}

function selectCatalogForUpdate (searchCondition) {
  return postRequest('/api/catalog/selectForUpdate', JSON.stringify(searchCondition))
}

function updateCatalog (searchCondition) {
  return postRequest('/api/catalog/update', JSON.stringify(searchCondition))
}

function deleteCatalog (searchCondition) {
  return postRequest('/api/catalog/delete', JSON.stringify(searchCondition))
}

function deleteCatalogs (searchCondition) {
  return postRequest('/api/catalog/deletes', JSON.stringify(searchCondition))
}

function getUseCatalogList () {
  return postRequest('/api/catalog/useListView', JSON.stringify({}))
}

function selectAddApiInfoList (searchCondition) {
  return postRequest('/api/catalog/selectAddApiInfoList', JSON.stringify(searchCondition))
}

export {
  getSearchCondition,
  getCatalogList,
  initCatalogView,
  createCatalog,
  selectCatalogForUpdate,
  updateCatalog,
  deleteCatalog,
  deleteCatalogs,
  getUseCatalogList,
  selectAddApiInfoList
}
