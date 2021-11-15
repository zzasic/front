import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/notice/listInit', JSON.stringify({}))
}

function getNoticeList (notice) {
  return postRequest('/api/notice/listView', JSON.stringify(notice))
}

function getPopupNoticeList () {
  return postRequest('/api/notice/popupListView', JSON.stringify({}))
}

function currentNoticeList () {
  return postRequest('/api/notice/currentNoticeList', JSON.stringify({}))
}

function currentNotice (noticeId) {
  return postRequest(`/api/notice/currentNotice/${noticeId}`, JSON.stringify({}))
}

function getNotice (noticeId) {
  return postRequest(`/api/notice/${noticeId}`, JSON.stringify({}))
}

function createNoticeView () {
  return postRequest('/api/notice/createView', JSON.stringify({}))
}

function createNotice (notice) {
  return postRequest('/api/notice/create', JSON.stringify(notice))
}

function updateNoticeView (noticeId) {
  return postRequest(`/api/notice/updateView/${noticeId}`, JSON.stringify({}))
}

function updateNotice (notice) {
  return postRequest('/api/notice/update', JSON.stringify(notice))
}

function deleteNotice (notice) {
  return postRequest('/api/notice/delete', JSON.stringify(notice))
}

export {
  getSearchCondition,
  getNoticeList,
  getPopupNoticeList,
  currentNoticeList,
  currentNotice,
  getNotice,
  createNoticeView,
  createNotice,
  updateNoticeView,
  updateNotice,
  deleteNotice

}
