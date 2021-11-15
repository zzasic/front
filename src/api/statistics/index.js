import { postRequest, postRequestBlob } from '../AxioCreate.js'

function getSearchCondition () { /* 인바운드 상담 현황 조회조건  */
  return postRequest('/api/statistics/listInit', JSON.stringify({}))
}

function getStatisticsList (searchCondition) { /* 인바운드 상담 현황 조회 */
  return postRequest('/api/statistics/listView', JSON.stringify(searchCondition))
}

function getStatisticsChartList (searchCondition) { /* 인바운드 차트용 상담 현황 조회 */
  return postRequest('/api/statistics/listChartView', JSON.stringify(searchCondition))
}

function getOutboundSearchCondition () { /* 아웃바운드 상담 현황 조회조건  */
  return postRequest('/api/statistics/listOutboundInit', JSON.stringify({}))
}

function getOutboundStatisticsList (searchCondition) { /* 아웃바운드 상담 현황 조회 */
  return postRequest('/api/statistics/listOutboundView', JSON.stringify(searchCondition))
}

function getOutboundStatisticsChartList (searchCondition) { /* 아웃바운드 차트용 상담 현황 조회 */
  return postRequest('/api/statistics/listOutboundChartView', JSON.stringify(searchCondition))
}

function getSystemSearchCondition () { /* System 상담 현황 조회조건  */
  return postRequest('/api/systemStatistics/listSystemInit', JSON.stringify({}))
}

function getSystemStatisticsList (searchCondition) { /* System 상담 현황 조회 */
  return postRequest('/api/systemStatistics/listSystemView', JSON.stringify(searchCondition))
}

function getSystemStatisticsChartList (searchCondition) { /* System차트용 상담 현황 조회 */
  return postRequest('/api/systemStatistics/listSystemChartView', JSON.stringify(searchCondition))
}

function getScenarioSearchCondition () { /* 시나리오별 상담 현황 조회조건  */
  return postRequest('/api/statistics/listScenarioInit', JSON.stringify({}))
}

function getScenarioStatisticsList (searchCondition) { /* 시나리오별 상담 현황 조회 */
  return postRequest('/api/statistics/listScenarioView', JSON.stringify(searchCondition))
}

function getScenarioStatisticsChartList (searchCondition) { /* 시나리오별 차트용 상담 현황 조회 */
  return postRequest('/api/statistics/listScenarioChartView', JSON.stringify(searchCondition))
}

function reqGetManualStatistics () {
  return postRequest('/api/statistics/getManualStatistics', JSON.stringify({}))
}

function reqGetManualSystemStatistics () {
  return postRequest('/api/systemStatistics/getManualSystemStatistics', JSON.stringify({}))
}

function getInboundStartFailList (searchCondition) { /* 의도추론실패-단선 현황 조회 */
  return postRequest('/api/statistics/listInboundStartFailView', JSON.stringify(searchCondition))
}

function getInboundStartTransferList (searchCondition) { /* 의도추론실패-호전환 현황 조회 */
  return postRequest('/api/statistics/listInboundStartTransferView', JSON.stringify(searchCondition))
}

function getInboundFailList (searchCondition) { /* 의도추론성공-통화중단 현황 조회 */
  return postRequest('/api/statistics/listInboundFailView', JSON.stringify(searchCondition))
}

function getInboundTransferList (searchCondition) { /* 의도추론성공-호전환 현황 조회 */
  return postRequest('/api/statistics/listInboundTransferView', JSON.stringify(searchCondition))
}

function getInboundSuccessList (searchCondition) { /* 정상통화 현황 조회 */
  return postRequest('/api/statistics/listInboundSuccessView', JSON.stringify(searchCondition))
}

function getInboundTotalList (searchCondition) { /* 전체 현황 조회 */
  return postRequest('/api/statistics/listInboundTotalView', JSON.stringify(searchCondition))
}

function getOutboundStartFailList (searchCondition) { /* 아웃 단선 현황 조회 */
  return postRequest('/api/statistics/listOutboundStartFailView', JSON.stringify(searchCondition))
}

function getOutboundFailList (searchCondition) { /* 아웃 통화중단 현황 조회 */
  return postRequest('/api/statistics/listOutboundFailView', JSON.stringify(searchCondition))
}

function getOutboundTransferHistoryViewList (searchCondition) { /* 아웃 호전환 현황 조회 */
  return postRequest('/api/statistics/listOutboundTransferHistoryView', JSON.stringify(searchCondition))
}

function getOutboundSuccessList (searchCondition) { /* 아웃 정상통화 현황 조회 */
  return postRequest('/api/statistics/listOutboundSuccessView', JSON.stringify(searchCondition))
}

function getOutboundTotalList (searchCondition) { /* 아웃 전체 현황 조회 */
  return postRequest('/api/statistics/listOutboundTotalView', JSON.stringify(searchCondition))
}

function getScenarioStartFailList (searchCondition) { /* 시나리오 단선 현황 조회 */
  return postRequest('/api/statistics/listScenarioStartFailView', JSON.stringify(searchCondition))
}

function getScenarioFailList (searchCondition) { /* 시나리오 통화중단 현황 조회 */
  return postRequest('/api/statistics/listScenarioFailView', JSON.stringify(searchCondition))
}

function getScenarioTransferHistoryViewList (searchCondition) { /* 시나리오 호전환 현황 조회 */
  return postRequest('/api/statistics/listScenarioTransferHistoryView', JSON.stringify(searchCondition))
}

function getScenarioSuccessList (searchCondition) { /* 시나리오 성공 현황 조회 */
  return postRequest('/api/statistics/listScenarioSuccessView', JSON.stringify(searchCondition))
}

function getScenarioTotalList (searchCondition) { /* 시나리오 전체 현황 조회 */
  return postRequest('/api/statistics/listScenarioTotalView', JSON.stringify(searchCondition))
}

function reqExcelDownInbound (input) { /* I/B 상담 현황 엑셀 다운로드 */
  return postRequestBlob('/api/statistics/excelDownInbound', JSON.stringify(input))
}

function reqExcelDownOutbound (input) { /* O/B 상담 현황 엑셀 다운로드 */
  return postRequestBlob('/api/statistics/excelDownOutbound', JSON.stringify(input))
}

function reqExcelDownScenarioStat (input) { /* 시나리오별 상담 현황 엑셀 다운로드 */
  return postRequestBlob('/api/statistics/excelDownScenarioStat', JSON.stringify(input))
}

function reqExcelDownSystemStatisticsList (input) { /* 시스템별 상담 현황 엑셀 다운로드 */
  return postRequestBlob('/api/systemStatistics/excelDownSystemStatisticsList', JSON.stringify(input))
}

export {
  getSearchCondition,
  getStatisticsList,
  getStatisticsChartList,
  getOutboundSearchCondition,
  getOutboundStatisticsList,
  getOutboundStatisticsChartList,
  getSystemSearchCondition,
  getSystemStatisticsList,
  getSystemStatisticsChartList,
  getScenarioSearchCondition,
  getScenarioStatisticsList,
  getScenarioStatisticsChartList,
  reqGetManualStatistics,
  reqGetManualSystemStatistics,
  getInboundStartFailList,
  getInboundStartTransferList,
  getInboundFailList,
  getInboundTransferList,
  getInboundSuccessList,
  getInboundTotalList,
  getOutboundStartFailList,
  getOutboundFailList,
  getOutboundTransferHistoryViewList,
  getOutboundSuccessList,
  getOutboundTotalList,
  getScenarioStartFailList,
  getScenarioFailList,
  getScenarioTransferHistoryViewList,
  getScenarioSuccessList,
  getScenarioTotalList,
  reqExcelDownInbound,
  reqExcelDownOutbound,
  reqExcelDownScenarioStat,
  reqExcelDownSystemStatisticsList
}
