import { postRequest, postRequestBlob } from '../../AxioCreate.js'

function getCallBotSearchCondition (searchCondition) { /* 콜봇 공통 초기 조회 조건 */
  return postRequest('/api/callBot/listCallBotInit', JSON.stringify(searchCondition))
}

function getCallBotDashboardList (searchCondition) { /* 콜봇 대시보드 조회조건 */
  return postRequest('/api/callBot/callBotDashboardList', JSON.stringify(searchCondition))
}

function getCallBotStatisticsChartList (searchCondition) { /* 콜봇 기간별 집계 조회 */
  return postRequest('/api/callBot/callBotSolutionChartList', JSON.stringify(searchCondition))
}

function getCallBotStatisticsList (searchCondition) { /* 콜봇 기간별 집계 조회 */
  return postRequest('/api/callBot/callBotSolutionList', JSON.stringify(searchCondition))
}

function reqCallBotStatisticsExcelDown (searchCondition) { /* 콜봇 기간별 집계 엑셀다운 */
  return postRequestBlob('/api/callBot/callBotSolutionExcelDown', JSON.stringify(searchCondition))
}

function reqCallBotStatisticsBatch () { /* 콜봇 통게 데이터 수집 */
  return postRequest('/api/callBot/getStatisticsCollection')
}

export {
  getCallBotSearchCondition,
  getCallBotDashboardList,
  getCallBotStatisticsChartList,
  getCallBotStatisticsList,
  reqCallBotStatisticsExcelDown,
  reqCallBotStatisticsBatch
}
