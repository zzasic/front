import { postRequest, postRequestBlob } from '../AxioCreate.js'

function getInboundCallSearchCondition () { /* 인바운드 상담이력 조회조건  */
  return postRequest('/api/counsel/listInboundCallInit', JSON.stringify({}))
}

function getInboundCallList (searchCondition) { /* 인바운드 상담이력 조회 */
  return postRequest('/api/counsel/listInboundCallView', JSON.stringify(searchCondition))
}

function reqExcelDownInboundCallList (searchCondition) { /* 인바운드 상담이력 엑셀 */
  return postRequestBlob('/api/counsel/excelDownInboundCallList', JSON.stringify(searchCondition))
}

function getOutboundCallSearchCondition () { /* 아웃바운드 상담이력 조회조건  */
  return postRequest('/api/counsel/listOutboundCallInit', JSON.stringify({}))
}

function getOutboundCallList (searchCondition) { /* 아웃바운드 상담이력 조회 */
  return postRequest('/api/counsel/listOutboundCallView', JSON.stringify(searchCondition))
}

function reqExcelDownOutboundCallList (searchCondition) { /* 아웃바운드 상담이력 엑셀 */
  return postRequestBlob('/api/counsel/excelDownOutboundCallList', JSON.stringify(searchCondition))
}

function getSystemCallSearchCondition () { /* System 상담이력 조회조건  */
  return postRequest('/api/counsel/listSystemCallInit', JSON.stringify({}))
}

function getSystemCallList (searchCondition) { /* System 상담이력 조회 */
  return postRequest('/api/counsel/listSystemCallView', JSON.stringify(searchCondition))
}

function getCallInfo (callId) { /* 대화 간략 정보 조회 */
  return postRequest(`/api/counsel/callInfo/${callId}`, JSON.stringify({}))
}

function getCallHistoryList (callId) { /* 대화이력 조회 */
  return postRequest(`/api/counsel/listCallHistory/${callId}`, JSON.stringify({}))
}

function getCallAllHistoryList (callId) { /* 대화이력 전체 조회 */
  return postRequest(`/api/counsel/listCallAllHistory/${callId}`, JSON.stringify({}))
}

function getSystemCallHistoryList (callId) { /* 시스템별 대화이력 조회 */
  return postRequest(`/api/counsel/listSystemCallHistory/${callId}`, JSON.stringify({}))
}

function getSystemCallAllHistoryList (callId) { /* 시스템별 대화이력 전체 조회 */
  return postRequest(`/api/counsel/listSystemCallAllHistory/${callId}`, JSON.stringify({}))
}

function switchCall (callId) { /* 호전환 */
  return postRequest(`/api/counsel/switch/${callId}`, JSON.stringify({}))
}

function initCallMockView () { /* 모의상담 조회조건 */
  return postRequest('/api/counsel/initCallMockView', JSON.stringify({}))
}

function mockCall (input) {
  return postRequest('/api/counsel/mockCall', JSON.stringify(input))
}

function custInfoView (input) {
  return postRequest('/api/counsel/custInfoView', JSON.stringify(input))
}

function reqGetManualHistory () {
  return postRequest('/api/counsel/getManualHistory', JSON.stringify({}))
}

function reqExcelDownSystemCallList (input) {
  return postRequestBlob('/api/counsel/excelDownSystemCallList', JSON.stringify(input))
}

function getIntentFailSearchCondition () { /* 의도추론 실패 상담이력 조회조건  */
  return postRequest('/api/counsel/listIntentFailInit', JSON.stringify({}))
}

function getIntentFailList (searchCondition) { /* 의도추론 실패 상담이력 조회 */
  return postRequest('/api/counsel/listIntentFailView', JSON.stringify(searchCondition))
}

function getAfterIntentFailSearchCondition () { /* 사후 상담원 의도추론 실패 상담이력 조회조건  */
  return postRequest('/api/counsel/listAfterIntentFailInit', JSON.stringify({}))
}

function getAfterIntentFailList (searchCondition) { /* 사후 상담원 의도추론 실패 상담이력 조회 */
  return postRequest('/api/counsel/listAfterIntentFailView', JSON.stringify(searchCondition))
}

function getOutboundIntentFailSearchCondition () { /* 의도추론 실패 상담이력 조회조건  */
  return postRequest('/api/counsel/listOutboundIntentFailInit', JSON.stringify({}))
}

function getOutboundIntentFailList (searchCondition) { /* 의도추론 실패 상담이력 조회 */
  return postRequest('/api/counsel/listOutboundIntentFailView', JSON.stringify(searchCondition))
}

function getTransferSearchCondition () { /* 인바운드 호전환 상담이력 조회조건  */
  return postRequest('/api/counsel/listTransferInit', JSON.stringify({}))
}

function getTransferList (searchCondition) { /* 인바운드 호전환 상담이력 조회 */
  return postRequest('/api/counsel/listTransferView', JSON.stringify(searchCondition))
}

function getOutboundTransferSearchCondition () { /* 아웃바운드 호전환 상담이력 조회조건  */
  return postRequest('/api/counsel/listOutboundTransferInit', JSON.stringify({}))
}

function getOutboundTransferList (searchCondition) { /* 아웃바운드 호전환 상담이력 조회 */
  return postRequest('/api/counsel/listOutboundTransferView', JSON.stringify(searchCondition))
}

function getOutboundProcessingSearchCondition () { /* 아웃바운드 진척 현황 조회조건  */
  return postRequest('/api/counsel/listOutboundProcessingInit', JSON.stringify({}))
}

function getOutboundProcessingList (searchCondition) { /* 아웃바운드 진척 현황 조회 */
  return postRequest('/api/counsel/listOutboundProcessingView', JSON.stringify(searchCondition))
}

function getUserCallList (searchCondition) { /* 고객별 통화이력 조회 */
  return postRequest('/api/counsel/listUserCallView', JSON.stringify(searchCondition))
}

function reqExcelDownIntentFail (input) { /* I/B 의도추론 실패 엑셀 다운로드 */
  return postRequestBlob('/api/counsel/excelDownIntentFail', JSON.stringify(input))
}

function reqExcelDownAfterIntentFail (input) { /* I/B 의도추론 실패(사후) 엑셀 다운로드 */
  return postRequestBlob('/api/counsel/excelDownAfterIntentFail', JSON.stringify(input))
}

function reqExcelDownOutboundIntentFail (input) { /* O/B 의도추론 실패 엑셀 다운로드 */
  return postRequestBlob('/api/counsel/excelDownOutboundIntentFail', JSON.stringify(input))
}

function reqExcelDownTransferList (input) { /* I/B 호전환 현황 엑셀 다운로드 */
  return postRequestBlob('/api/counsel/excelDownTransferList', JSON.stringify(input))
}

function reqExcelDownOutboundTransferList (input) { /* O/B 호전환 현황 엑셀 다운로드 */
  return postRequestBlob('/api/counsel/excelDownOutboundTransferList', JSON.stringify(input))
}

function reqExcelDownOutboundProcessingList (input) { /* O/B 단계별 현황 엑셀 다운로드 */
  return postRequestBlob('/api/counsel/excelDownOutboundProcessingList', JSON.stringify(input))
}

export {
  getInboundCallSearchCondition,
  getInboundCallList,
  reqExcelDownInboundCallList,
  getOutboundCallSearchCondition,
  getOutboundCallList,
  reqExcelDownOutboundCallList,
  getSystemCallSearchCondition,
  getSystemCallList,
  getCallInfo,
  getCallHistoryList,
  getCallAllHistoryList,
  getSystemCallHistoryList,
  getSystemCallAllHistoryList,
  switchCall,
  initCallMockView,
  mockCall,
  custInfoView,
  reqGetManualHistory,
  reqExcelDownSystemCallList,
  getIntentFailSearchCondition,
  getIntentFailList,
  getAfterIntentFailSearchCondition,
  getAfterIntentFailList,
  getOutboundIntentFailSearchCondition,
  getOutboundIntentFailList,
  getTransferSearchCondition,
  getTransferList,
  getOutboundTransferSearchCondition,
  getOutboundTransferList,
  getOutboundProcessingSearchCondition,
  getOutboundProcessingList,
  getUserCallList,
  reqExcelDownIntentFail,
  reqExcelDownAfterIntentFail,
  reqExcelDownOutboundIntentFail,
  reqExcelDownTransferList,
  reqExcelDownOutboundTransferList,
  reqExcelDownOutboundProcessingList
}
