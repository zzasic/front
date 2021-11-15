import { postRequest, postRequestBlob } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/cmncode/listInit', JSON.stringify({}))
}

function getCmnCodeList (searchCondition) {
  return postRequest('/api/cmncode/listView', JSON.stringify(searchCondition))
}

function getChooseCondition () {
  return postRequest('/api/cmncode/getChooseCondition', JSON.stringify({}))
}

function getCmnCodeByCodeType (searchCondition) {
  return postRequest('/api/cmncode/getCmnCodeByCodeType', JSON.stringify(searchCondition))
}

function createCodeType (searchCondition) {
  return postRequest('/api/cmncode/createCodeType', JSON.stringify(searchCondition))
}

function codeTypeDupCheck (searchCondition) {
  return postRequest('/api/cmncode/codeTypeDupCheck', JSON.stringify(searchCondition))
}

function createCmnCode (searchCondition) {
  return postRequest('/api/cmncode/create', JSON.stringify(searchCondition))
}

function selectCmnCodeForUpdate (searchCondition) {
  return postRequest('/api/cmncode/selectForUpdate', JSON.stringify(searchCondition))
}

function getChildrenCmnCodes (searchCondition) {
  return postRequest('/api/cmncode/getChildrenCmnCodes', JSON.stringify(searchCondition))
}

function getChildrenCmnCode (searchCondition) {
  return postRequest('/api/cmncode/getChildrenCmnCode', JSON.stringify(searchCondition))
}

function updateCmnCode (searchCondition) {
  return postRequest('/api/cmncode/update', JSON.stringify(searchCondition))
}

function deleteCmnCode (searchCondition) {
  return postRequest('/api/cmncode/delete', JSON.stringify(searchCondition))
}

function deleteCmnCodes (searchCondition) {
  return postRequest('/api/cmncode/deletes', JSON.stringify(searchCondition))
}

function reqExcelDown (input) { /* 엑셀 다운로드 */
  return postRequestBlob('/api/cmncode/excelDown', JSON.stringify(input))
}

export {
  getCmnCodeList,
  getSearchCondition,
  getChooseCondition,
  getCmnCodeByCodeType,
  getChildrenCmnCodes,
  getChildrenCmnCode,
  createCodeType,
  codeTypeDupCheck,
  createCmnCode,
  selectCmnCodeForUpdate,
  updateCmnCode,
  deleteCmnCode,
  deleteCmnCodes,
  reqExcelDown
}
