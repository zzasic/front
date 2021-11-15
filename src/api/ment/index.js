import { postRequest } from '../AxioCreate.js'

function getSearchCondition (codeType) { /* 엔트관리 조회조건 */
  return postRequest(`/api/ment/listInit/${codeType}`, JSON.stringify({}))
}

function selectMentList (codeType, searchCondition) { /* 엔트 조회  */
  return postRequest(`/api/ment/listView/${codeType}`, JSON.stringify(searchCondition))
}

function updateMent (ment) { /* 멘트 수정 */
  return postRequest('/api/ment/update', JSON.stringify(ment))
}

export {
  getSearchCondition,
  selectMentList,
  updateMent
}
