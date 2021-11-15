import { postRequest } from '../AxioCreate.js'

function initIncident () {
  return postRequest('/api/incident/init', JSON.stringify({}))
}

function getIncidentList (searchCondition) {
  return postRequest('/api/incident/listView', JSON.stringify(searchCondition))
}

function createIncident (input) {
  return postRequest('/api/incident/create', JSON.stringify(input))
}

function selectIncidentForUpdate (searchCondition) {
  return postRequest('/api/incident/selectForUpdate', JSON.stringify(searchCondition))
}

function updateIncident (input) {
  return postRequest('/api/incident/update', JSON.stringify(input))
}

function deleteIncidents (inputs) {
  return postRequest('/api/incident/deletes', JSON.stringify(inputs))
}

export {
  initIncident,
  getIncidentList,
  createIncident,
  selectIncidentForUpdate,
  updateIncident,
  deleteIncidents
}
