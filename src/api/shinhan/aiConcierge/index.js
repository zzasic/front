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

function getBranchStatisticsSearchCondition () { /* 공통 초기 조회 조건 */
  return postRequest('/api/aiConcierge/listAiConciergeInit', JSON.stringify({}))
}
function getBranchStatisticsList (searchCondition) { /* 지점별 거래 현황 */
  return postRequest('/api/aiConcierge/branchStatiaticsView', JSON.stringify(searchCondition))
}

function reqBranchStatisticsExcelDown (searchCondition) { /* 지점별 거래 현황 엑셀 다운 */
  return postRequestBlob('/api/aiConcierge/branchStatisticsExcelDown', JSON.stringify(searchCondition))
}

function getCategoryHistoryList (searchCondition) { /* 업무분류별 처리이력 */
  return postRequest('/api/aiConcierge/digitalWorkTypeProcessView', JSON.stringify(searchCondition))
}

function reqCategoryHistoryExcelDown (searchCondition) { /* 업무분류별 처리이력 엑셀 다운 */
  return postRequestBlob('/api/aiConcierge/digitalWorkTypeProcessExcelDown', JSON.stringify(searchCondition))
}

function getTaskCategoryStatiaticsList (searchCondition) { /* 업무분류별 사용현황 */
  return postRequest('/api/aiConcierge/digitalWorkTypeUsageView', JSON.stringify(searchCondition))
}

function getTaskCategoryStatiaticsChart (searchCondition) { /* 업무분류별 파이 차트 */
  return postRequest('/api/aiConcierge/digitalWorkTypeUsageChart', JSON.stringify(searchCondition))
}

function getTaskCategoryStatiaticsDetailList (searchCondition) { /* 업무분류별 상세 사용현황 */
  return postRequest('/api/aiConcierge/digitalWorkTypeUsageDetailView', JSON.stringify(searchCondition))
}

function reqTaskCategoryStatiaticsExcelDown (searchCondition) { /* 업무분류별 사용현황 엑셀 다운 */
  return postRequestBlob('/api/aiConcierge/digitalWorkTypeUsageExcelDown', JSON.stringify(searchCondition))
}

function getScreenCategoryStatiaticsList (searchCondition) { /* 화면분류별 상세 사용현황 */
  return postRequest('/api/aiConcierge/digitalScreenTypeUsageView', JSON.stringify(searchCondition))
}

function getScreenCategoryStatiaticsChart (searchCondition) { /* 화면분류별 파이 차트 */
  return postRequest('/api/aiConcierge/digitalScreenTypeUsageChart', JSON.stringify(searchCondition))
}

function reqScreenCategoryStatiaticsExcelDown (searchCondition) { /* 화면분류별 사용현황 엑셀 다운 */
  return postRequestBlob('/api/aiConcierge/digitalScreenTypeUsageExcelDown', JSON.stringify(searchCondition))
}

function getScreenCategoryStatiaticsDetailList (searchCondition) { /* 화면분류별 상세 사용현황 */
  return postRequest('/api/aiConcierge/digitalScreenMiddleUsageView', JSON.stringify(searchCondition))
}

function getScreenCategoryStatiaticsMinorList (searchCondition) { /* 화면분류별 소분류 사용현황 */
  return postRequest('/api/aiConcierge/digitalScreenMinorUsageView', JSON.stringify(searchCondition))
}

function getScreenCategoryTypeUsageDetailList (searchCondition) { /* 화면분류별 최종 상세 사용현황 */
  return postRequest('/api/aiConcierge/digitalScreenTypeUsageDetailView', JSON.stringify(searchCondition))
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
  reqAiConciergeStatisticsBatch,
  getBranchStatisticsSearchCondition,
  getBranchStatisticsList,
  reqBranchStatisticsExcelDown,
  getCategoryHistoryList,
  reqCategoryHistoryExcelDown,
  getTaskCategoryStatiaticsList,
  getTaskCategoryStatiaticsChart,
  getTaskCategoryStatiaticsDetailList,
  reqTaskCategoryStatiaticsExcelDown,
  getScreenCategoryStatiaticsList,
  getScreenCategoryStatiaticsChart,
  getScreenCategoryStatiaticsDetailList,
  reqScreenCategoryStatiaticsExcelDown,
  getScreenCategoryStatiaticsMinorList,
  getScreenCategoryTypeUsageDetailList
}
