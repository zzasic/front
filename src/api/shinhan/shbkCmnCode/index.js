import { postRequest } from '../../AxioCreate.js'

/* SHBK 공통코드 요청 */
function getBranchInitList (searchCondition) { /* branchCd, branchNm 초기 조회 조건 */
  return postRequest('/api/shbkCmnCode/branchList', JSON.stringify(searchCondition))
}

export {
  getBranchInitList
}
