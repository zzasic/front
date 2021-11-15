import { postRequest } from '../AxioCreate.js'

function getCampaignSearchCondition () {
  return postRequest('/api/campaign/init-list', JSON.stringify({}))
}
function getCampaignList (searchCondition) {
  return postRequest('/api/campaign/list', JSON.stringify(searchCondition))
}
function getCampaignViewCondition () {
  return postRequest('/api/campaign/init-view')
}
function createCampaign (campaign) {
  return postRequest('/api/campaign/create', JSON.stringify(campaign))
}
function getCampaign (campaign) {
  return postRequest('/api/campaign/retrieve', JSON.stringify(campaign))
}
function updateCampaign (campaign) {
  return postRequest('/api/campaign/update', JSON.stringify(campaign))
}
function deleteCampaign (campaign) {
  return postRequest('/api/campaign/delete', JSON.stringify(campaign))
}
function deleteCampaignList (campaignList) {
  return postRequest('/api/campaign/list/delete', JSON.stringify(campaignList))
}
export {
  getCampaignSearchCondition,
  getCampaignList,
  getCampaignViewCondition,
  createCampaign,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  deleteCampaignList
}
