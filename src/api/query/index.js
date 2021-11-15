import { postRequest, postRequestBlob } from '../AxioCreate.js'

function getQueryList (searchCondition) {
  return postRequest('/api/query/query', JSON.stringify(searchCondition))
}

function reqExcelDownQuery (input) {
  return postRequestBlob('/api/query/excelDown', JSON.stringify(input))
}

export {
  getQueryList,
  reqExcelDownQuery
}
