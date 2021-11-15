import { postRequest, postRequestBlob } from '../../AxioCreate.js'

function getAiConciergeSearchCondition () { /* 공통 초기 조회 조건 */
  return postRequest('/api/aiConcierge/listAiConciergeInit', JSON.stringify({}))
}

// ========= 인공인간 대시보드
function getAiConciergeSearchList (searchCondition) { /* AI 컨시어지 대시보드 조회조건 */
  return postRequest('/api/aiConcierge/aiConciergeDashboardList', JSON.stringify(searchCondition))
}

// ========= 인공인간 기간별 집계
function getAiConciergeStatisticsChartList (searchCondition) { /* AI 컨시어지 기간별 집계 차트 조회 */
  return postRequest('/api/aiConcierge/aiConciergeSolutionChartList', JSON.stringify(searchCondition))
}

function getAiConciergeStatisticsList (searchCondition) { /* AI 컨시어지 기간별 집계 조회 */
  return postRequest('/api/aiConcierge/aiConciergeSolutionList', JSON.stringify(searchCondition))
}

function reqAiConciergeStatisticsExcelDown (input) { /* AI 컨시어지 기간별 집계 엑셀 다운로드 */
  return postRequestBlob('/api/aiConcierge/aiConciergeStatisticsListExcelDown', JSON.stringify(input))
}

// ========= 인공인간 처리이력
function getAiConciergeHistoryList (searchCondition) { /* AI 컨시어지 처리이력 */
  return postRequest('/api/aiConcierge/aiConciergeHistoryList', JSON.stringify(searchCondition))
}

function getAiConciergeHistoryDetailList (callId) { /* AI 컨시어지 대화이력 조회 */
  return postRequest(`/api/aiConcierge/aiConciergeHistoryDetailList/${callId}`, JSON.stringify({}))
}

function getAiConciergeAllHistoryDetailList (callId) { /* AI 컨시어지 대화이력 조회 */
  return postRequest(`/api/aiConcierge/aiConciergeAllHistoryDetailInfo/${callId}`, JSON.stringify({}))
}

function reqAiConciergeHistoryExcelDown (input) { /* AI 컨시어지 처리이력 엑셀 다운로드 */
  return postRequestBlob('/api/aiConcierge/aiConciergeHistoryExcelDown', JSON.stringify(input))
}

function reqAiConciergeStatisticsBatch () { /* 콜봇 통게 데이터 수집 */
  return postRequest('/api/aiConcierge/getStatisticsCollection')
}

export {
  getAiConciergeSearchCondition,
  getAiConciergeSearchList,
  getAiConciergeStatisticsChartList,
  getAiConciergeStatisticsList,
  reqAiConciergeStatisticsExcelDown,
  getAiConciergeHistoryList,
  getAiConciergeHistoryDetailList,
  getAiConciergeAllHistoryDetailList,
  reqAiConciergeHistoryExcelDown,
  reqAiConciergeStatisticsBatch
}
