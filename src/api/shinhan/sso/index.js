import { postRequest } from '../../AxioCreate.js'

/* api 호출은 sso가 들어감 */
function getSsoLoginInit () { /* systemList 초기 조회 조건 */
  return postRequest('/api/sso/ssoLoginInit', JSON.stringify({}))
}

function getSsoLoginConfirm (searchCondition) { /* SSO 로그인 정보 확인 */
  return postRequest('/api/sso/ssoLoginConfirm', JSON.stringify(searchCondition))
}

function sendSsoUseApprovalReq (searchCondition) { /* SSO 사용 승인 신청 */
  return postRequest('/api/sso/sendSsoUseApprovalReq', JSON.stringify(searchCondition))
}

/* AI Connecter 사용 승인 */
function getSsoUseApprovalInit () { /* 승인 요청 조회 조건 */
  return postRequest('/api/sso/ssoUseApprovalInit', JSON.stringify({}))
}

function getSsoUseApprovalReqList (searchCondition) { /* 승인 요청 목록 조회 */
  return postRequest('/api/sso/ssoUseApprovalReqList', JSON.stringify(searchCondition))
}

function getSsoUseApprovalReqDetailInfo (searchCondition) { /* SSO 사용 승인 신청 상세 조회 */
  return postRequest('/api/sso/ssoUseApprovalReqDetailInfo', JSON.stringify(searchCondition))
}

function setSsoUseApprovalReqPermit (searchCondition) { /* SSO 사용자 승인 허가 (단건) */
  return postRequest('/api/sso/ssoUseApprovalReqPermit', JSON.stringify(searchCondition))
}

// function setSsoUseApprovalReqPermits (searchCondition) { /* SSO 사용자 승인 허가 */
//   return postRequest('/api/sso/ssoUseApprovalReqPermits', JSON.stringify(searchCondition))
// }

export {
  getSsoLoginInit,
  getSsoLoginConfirm,
  sendSsoUseApprovalReq,
  getSsoUseApprovalInit,
  getSsoUseApprovalReqList,
  getSsoUseApprovalReqDetailInfo,
  setSsoUseApprovalReqPermit
  // setSsoUseApprovalReqPermits
}
