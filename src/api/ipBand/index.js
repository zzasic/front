import { postRequest } from '../AxioCreate.js'

function reqIpBandList (searchCondition) {
  return postRequest('/api/ipBand/listView', JSON.stringify(searchCondition))
}

function reqCreateIpBand (searchCondition) {
  return postRequest('/api/ipBand/create', JSON.stringify(searchCondition))
}

function reqUpdateIpBand (searchCondition) {
  return postRequest('/api/ipBand/update', JSON.stringify(searchCondition))
}

function reqDeleteIpBand (searchCondition) {
  return postRequest('/api/ipBand/delete', JSON.stringify(searchCondition))
}

export {
  reqIpBandList,
  reqCreateIpBand,
  reqUpdateIpBand,
  reqDeleteIpBand
}
