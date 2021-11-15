import { postRequest } from '../AxioCreate.js'

function getSearchCondition () { /* AI상담원 관리 조회조건 */
  return postRequest('/api/counselor/listInit', JSON.stringify({}))
}

function getCounselorList (searchCondition) { /* AI상담원 조회  */
  return postRequest('/api/counselor/listView', JSON.stringify(searchCondition))
}

function getCounselorStatusSearchCondition () { /* AI상담원 모니터링 조회조건 */
  return postRequest('/api/counselor/listCounselorStatusInit', JSON.stringify({}))
}

function getCounselorStatusList (searchCondition) { /* AI상담원 모니터링 조회  */
  return postRequest('/api/counselor/listCounselorStatusView', JSON.stringify(searchCondition))
}

function createCounselorView () {
  return postRequest('/api/counselor/createView', JSON.stringify({}))
}

function extensionDupCheck (counselor) {
  return postRequest('/api/counselor/extensionDupCheck', JSON.stringify(counselor))
}

function createCounselor (counselor) {
  return postRequest('/api/counselor/create', JSON.stringify(counselor))
}

function updateCounselorView (counselorId) {
  return postRequest(`/api/counselor/updateView/${counselorId}`, JSON.stringify({}))
}

function updateCounselor (counselor) {
  return postRequest('/api/counselor/update', JSON.stringify(counselor))
}

function deleteCounselor (counselor) {
  return postRequest('/api/counselor/delete', JSON.stringify(counselor))
}

function getCallGroupSearchCondition () { /* CallGroup 관리 조회조건 */
  return postRequest('/api/callGroup/listInit', JSON.stringify({}))
}

function getCallGroupList (searchCondition) { /* CallGroup 조회  */
  return postRequest('/api/callGroup/listView', JSON.stringify(searchCondition))
}

function createCallGroupView () {
  return postRequest('/api/callGroup/createView', JSON.stringify({}))
}

function callGroupNoDupCheck (callGroup) {
  return postRequest('/api/callGroup/callGroupNoDupCheck', JSON.stringify(callGroup))
}

function createCallGroup (callGroup) {
  return postRequest('/api/callGroup/create', JSON.stringify(callGroup))
}

function updateCallGroupView (callGroupId) {
  return postRequest(`/api/callGroup/updateView/${callGroupId}`, JSON.stringify({}))
}

function updateCallGroup (callGroup) {
  return postRequest('/api/callGroup/update', JSON.stringify(callGroup))
}

function deleteCallGroup (callGroup) {
  return postRequest('/api/callGroup/delete', JSON.stringify(callGroup))
}

export {
  getSearchCondition,
  getCounselorList,
  getCounselorStatusSearchCondition,
  getCounselorStatusList,
  createCounselorView,
  extensionDupCheck,
  createCounselor,
  updateCounselorView,
  updateCounselor,
  deleteCounselor,
  getCallGroupSearchCondition,
  getCallGroupList,
  createCallGroupView,
  callGroupNoDupCheck,
  createCallGroup,
  updateCallGroupView,
  updateCallGroup,
  deleteCallGroup
}
