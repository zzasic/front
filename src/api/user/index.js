import { postRequest } from '../AxioCreate.js'

function getSearchCondition () { /* 사용자 관리 조회조건 */
  return postRequest('/api/user/listInit', JSON.stringify({}))
}

function selectUserList (searchCondition) { /* 사용자 모두 조회 */
  return postRequest('/api/user/listView', JSON.stringify(searchCondition))
}

function getSelectOption () { /* 사용자 관리 등록 선택 조건 */
  return postRequest('/api/user/getSelectOption', JSON.stringify({}))
}

function createUser (input) { /* 사용자 등록 */
  return postRequest('/api/user/create', JSON.stringify(input))
}

function updateUser (input) { /* 사용자 수정 */
  return postRequest('/api/user/update', JSON.stringify(input))
}

function reqDeleteUser (input) { /* 사용자 삭제 */
  return postRequest('/api/user/delete', JSON.stringify(input))
}

function reqEmailDupCheck (input) { /* 사용자 이메일ID 중복 확인 */
  return postRequest('/api/user/emailDupCheck', JSON.stringify(input))
}

function reqPopupSrchCondition () { /* 사용자 관리 조회조건 */
  return postRequest('/api/user/popup/listInit', JSON.stringify({}))
}

function reqPopupUserList (searchCondition) { /* 사용자 모두 조회 */
  return postRequest('/api/user/popup/list', JSON.stringify(searchCondition))
}

function reqUpdateView (searchCondition) { /* 사용자 관리 상세 조회 */
  return postRequest('/api/user/updateView', JSON.stringify(searchCondition))
}

function reqSelectProfile () { /* 헤더 사용자 정보 상세 */
  return postRequest('/api/user/selectProfile', JSON.stringify())
}

function reqUpdateProfile (input) { /* 헤더 사용자 정보 수정 */
  return postRequest('/api/user/updateProfile', JSON.stringify(input))
}

function reqSelectAccountPolicy (input) { /* 사용자 비밀번호 정책 */
  return postRequest('/api/user/selectAccountPolicy', JSON.stringify(input))
}

function reqBeforeSetUserPassword (input) { /* 헤더 사용자 비밀번호 변경 */
  return postRequest('/api/user/beforeUpdateUserPassword', JSON.stringify(input))
}

function reqSetUserPassword (input) { /* 헤더 사용자 비밀번호 변경 */
  return postRequest('/api/user/updateUserPassword', JSON.stringify(input))
}

function reqUpdateUserUnLock (input) { /* 사용자 계정 잠김 해제처리 */
  return postRequest('/api/user/updateUserUnLock', JSON.stringify(input))
}

function reqUserLogOut () { /* 사용자 로그아웃 */
  return postRequest('/api/auth/logout', JSON.stringify({}))
}

function reqWithdrawUser (input) { /* 사용자 탈퇴 */
  return postRequest('/api/user/withdrawUser', JSON.stringify(input))
}

function reqMailSendForAuthCode (input) { /* 비밀번호 초기화 인증메일발송 */
  return postRequest('/api/user/mailSendForAuthCode', JSON.stringify(input))
}

function reqBeforeResetUserPassword (input) { /* 비밀번호 초기화 */
  return postRequest('/api/user/beforeResetUserPassword', JSON.stringify(input))
}

function reqResetUserPassword (input) { /* 비밀번호 초기화 */
  return postRequest('/api/user/resetUserPassword', JSON.stringify(input))
}

function reqUpdateUserPswBySau (input) { /* 비밀번호 초기화 (사용자 관리 상세 화면) */
  return postRequest('/api/user/updateUserPswBySau', JSON.stringify(input))
}

function getUserAuthHistorySearchCondition () { /* 개인정보 접근로그 조회조건 */
  return postRequest('/api/user/listUserAuthHistoryInit', JSON.stringify({}))
}

function selectUserAuthHistoryList (searchCondition) { /* 개인정보 접근로그 모두 조회 */
  return postRequest('/api/user/listUserAuthHistoryView', JSON.stringify(searchCondition))
}

function getUserConnLogSearchCondition () { /* 시스템 접근로그 조회조건 */
  return postRequest('/api/user/listUserConnLogInit', JSON.stringify({}))
}

function selectUserConnLogHistoryList (searchCondition) { /* 시스템 접근로그 모두 조회 */
  return postRequest('/api/user/listUserConnLogHistoryView', JSON.stringify(searchCondition))
}

export {
  getSearchCondition,
  selectUserList,
  getSelectOption,
  createUser,
  updateUser,
  reqDeleteUser,
  reqEmailDupCheck,
  reqPopupSrchCondition,
  reqPopupUserList,
  reqUpdateView,
  reqSelectProfile,
  reqUpdateProfile,
  reqSelectAccountPolicy,
  reqBeforeSetUserPassword,
  reqSetUserPassword,
  reqUpdateUserUnLock,
  reqUserLogOut,
  reqWithdrawUser,
  reqMailSendForAuthCode,
  reqBeforeResetUserPassword,
  reqResetUserPassword,
  reqUpdateUserPswBySau,
  getUserAuthHistorySearchCondition,
  selectUserAuthHistoryList,
  getUserConnLogSearchCondition,
  selectUserConnLogHistoryList
}
