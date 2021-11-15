import { postRequest, postRequestBlob } from '../../AxioCreate.js'

function getIccSearchCondition (searchCondition) { /* 불완전판매방지 공통 초기 조회 조건 */
  return postRequest('/api/icc/listIccInit', JSON.stringify(searchCondition))
}

function getIccDashboardList (searchCondition) { /* 불완전판매방지 대시보드 조회조건 */
  return postRequest('/api/icc/iccDashboardList', JSON.stringify(searchCondition))
}

function getIccStatisticsChartList (searchCondition) { /* 불완전판매방지 기간별 집계 차트 조회 */
  return postRequest('/api/icc/iccSolutionChartList', JSON.stringify(searchCondition))
}

function getIccStatisticsList (searchCondition) { /* 불완전판매방지 기간별 집계 그리드 조회 */
  return postRequest('/api/icc/iccSolutionList', JSON.stringify(searchCondition))
}

function reqIccStatisticstExcelDown (searchCondition) { /* 불완전판매방지 기간별 집계 엑셀다운 */
  return postRequestBlob('/api/icc/iccSolutionExcelDown', JSON.stringify(searchCondition))
}

function reqIccStatisticsBatch () { /* 불완전판매방지 통게 데이터 수집 */
  return postRequest('/api/icc/getStatisticsCollection')
}

export {
  getIccSearchCondition,
  getIccDashboardList,
  getIccStatisticsChartList,
  getIccStatisticsList,
  reqIccStatisticstExcelDown,
  reqIccStatisticsBatch
}
