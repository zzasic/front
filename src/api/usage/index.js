import { postRequest, postRequestBlob } from '../AxioCreate.js'

function getUsageMeteringSearchCondition () { /* 월별 서비스 사용량 조회조건  */
  return postRequest('/api/statistics/listUsageMeteringInit', JSON.stringify({}))
}

function getUsageMeteringList (searchCondition) { /* 월별 서비스 사용량 조회 */
  return postRequest('/api/statistics/listUsageMeteringView', JSON.stringify(searchCondition))
}

function getUsageMeteringChartList (searchCondition) { /* 월별 차트용 서비스 사용량 조회 */
  return postRequest('/api/statistics/listUsageMeteringChartView', JSON.stringify(searchCondition))
}

function getDailyUsageMeteringSearchCondition () { /* 일별별 서비스 사용량 조회조건  */
  return postRequest('/api/statistics/listDailyUsageMeteringInit', JSON.stringify({}))
}

function getDailyUsageMeteringList (searchCondition) { /* 일별 서비스 사용량 조회 */
  return postRequest('/api/statistics/listDailyUsageMeteringView', JSON.stringify(searchCondition))
}

function reqGetManualUsageMetering () {
  return postRequest('/api/statistics/getManualUsageMetering', JSON.stringify({}))
}

function getSttHistoryList (searchCondition) { /* STT 일별 현황 조회 */
  return postRequest('/api/statistics/listSttHistoryView', JSON.stringify(searchCondition))
}

function getChatbotHistoryList (searchCondition) { /* 챗봇 일별 현황 조회 */
  return postRequest('/api/statistics/listChatbotHistoryView', JSON.stringify(searchCondition))
}

function getTtsHistoryList (searchCondition) { /* TTS 일별 현황 조회 */
  return postRequest('/api/statistics/listTtsHistoryView', JSON.stringify(searchCondition))
}

function reqExcelDownUsageMeteringList (searchCondition) { /* 월별 서비스 사용량 엑셀 다운로드 */
  return postRequestBlob('/api/statistics/excelDownUsageMeteringList', JSON.stringify(searchCondition))
}

export {
  getUsageMeteringSearchCondition,
  getUsageMeteringList,
  getUsageMeteringChartList,
  getDailyUsageMeteringSearchCondition,
  getDailyUsageMeteringList,
  reqGetManualUsageMetering,
  getSttHistoryList,
  getChatbotHistoryList,
  getTtsHistoryList,
  reqExcelDownUsageMeteringList
}
