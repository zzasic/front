import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/terms/listInit', JSON.stringify({}))
}

function getTermsList (terms) {
  return postRequest('/api/terms/listView', JSON.stringify(terms))
}

function getTermsPrivateList () {
  return postRequest('/api/terms/privateListView', JSON.stringify({}))
}

function getTermsNeedList () {
  return postRequest('/api/terms/needListView', JSON.stringify({}))
}

function postTermsAgree (termsAgrees) {
  return postRequest('/api/termsAgree/agree', JSON.stringify(termsAgrees))
}

function createTermsView () {
  return postRequest('/api/terms/createView', JSON.stringify({}))
}

function createTerms (terms) {
  return postRequest('/api/terms/create', JSON.stringify(terms))
}

function updateTermsView (termsId, termsVer) {
  return postRequest(`/api/terms/updateView/${termsId}/${termsVer}`, JSON.stringify({}))
}

function updateTerms (terms) {
  return postRequest('/api/terms/update', JSON.stringify(terms))
}

function deleteTerms (termses) {
  return postRequest('/api/terms/delete', JSON.stringify(termses))
}

export {
  getSearchCondition,
  getTermsList,
  getTermsNeedList,
  getTermsPrivateList,
  postTermsAgree,
  createTermsView,
  createTerms,
  updateTermsView,
  updateTerms,
  deleteTerms
}
