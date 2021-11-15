import { postRequest } from '../AxioCreate.js'

function getBatchLogList (searchCondition) {
  return postRequest('/api/batchLog/listView', JSON.stringify(searchCondition))
}

function getBatchList (searchCondition) {
  return postRequest('/api/batch/listView', JSON.stringify(searchCondition))
}

function createBatch (searchCondition) {
  return postRequest('/api/batch/create', JSON.stringify(searchCondition))
}

function selectBatchForUpdate (searchCondition) {
  return postRequest('/api/batch/selectForUpdate', JSON.stringify(searchCondition))
}

function updateBatch (searchCondition) {
  return postRequest('/api/batch/update', JSON.stringify(searchCondition))
}

function deleteBatch (searchCondition) {
  return postRequest('/api/batch/delete', JSON.stringify(searchCondition))
}

function deleteBatchs (searchCondition) {
  return postRequest('/api/batch/deletes', JSON.stringify(searchCondition))
}

export {
  getBatchLogList,
  getBatchList,
  createBatch,
  selectBatchForUpdate,
  updateBatch,
  deleteBatch,
  deleteBatchs
}
