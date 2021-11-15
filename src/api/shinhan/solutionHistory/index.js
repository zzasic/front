import { postRequest, postRequestBlob } from '../../AxioCreate.js'

function getSolutionHistorySearchCondition () { /* 공통 초기 조회 조건 */
  return postRequest('/api/solutionHistory/listSolutionHistoryInit', JSON.stringify({}))
}

function getSolutionHistoryUsageChartList (searchCondition) { /* AI 솔루션별 사용량 집계 차트 조회 */
  return postRequest('/api/solutionHistory/solutionHistoryUsageChartList', JSON.stringify(searchCondition))
}

function getSolutionHistoryUsageList (searchCondition) { /* AI 솔루션별 사용량 집계 목록 조회조건 */
  return postRequest('/api/solutionHistory/solutionHistoryUsageList', JSON.stringify(searchCondition))
}

function reqSolutionHistoryUsageExcelDown (searchCondition) { /* AI 솔루션별 사용량 집계 엑셀 다운 */
  return postRequestBlob('/api/solutionHistory/solutionHistoryUsageExcelDown', JSON.stringify(searchCondition))
}

function getSolutionHistoryList (searchCondition) { /* AI 솔루션별 사용이력 조회 */
  return postRequest('/api/solutionHistory/solutionHistoryList', JSON.stringify(searchCondition))
}

function reqSolutionHistoryExcelDown (searchCondition) { /* AI 솔루션별 사용이력 엑셀 다운 */
  return postRequestBlob('/api/solutionHistory/solutionHistoryExcelDown', JSON.stringify(searchCondition))
}

export {
  getSolutionHistorySearchCondition,
  getSolutionHistoryUsageChartList,
  getSolutionHistoryUsageList,
  reqSolutionHistoryUsageExcelDown,
  getSolutionHistoryList,
  reqSolutionHistoryExcelDown
}
