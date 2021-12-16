import { postRequest, postRequestBlob } from '../../AxioCreate.js'

function getKafkaInit (searchCondition) { /* Kafka Init 데이터 조회 */
  return postRequest('/api/icc/listIccInit', JSON.stringify(searchCondition))
}

function getKafkaMongoCallId (searchCondition) { /* Kafka Init 데이터 조회 */
  return postRequest('/api/icc/listIccInit', JSON.stringify(searchCondition))
}

export {
  getKafkaInit,
  getKafkaMongoCallId
}
