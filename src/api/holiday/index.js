import { postRequest } from '../AxioCreate.js'

function getSearchCondition () {
  return postRequest('/api/holiday/listInit', JSON.stringify({}))
}

function getHolidayList (searchCondition) {
  return postRequest('/api/holiday/listView', JSON.stringify(searchCondition))
}

function createHolidayView () {
  return postRequest('/api/holiday/createView', JSON.stringify({}))
}

function createHoliday (holiday) {
  return postRequest('/api/holiday/create', JSON.stringify(holiday))
}

function getHoliday (holidayId) {
  return postRequest(`${'/api/holiday/' + holidayId}`, JSON.stringify({}))
}

function updateHolidayView (holidayId) {
  return postRequest(`${'/api/holiday/updateView/' + holidayId}`, JSON.stringify({}))
}

function updateHoliday (holiday) {
  return postRequest('/api/holiday/update', JSON.stringify(holiday))
}

function deleteHolidaies (holidaies) {
  return postRequest(`${'/api/holiday/delete'}`, JSON.stringify(holidaies))
}

function checkDuplicateHoliday (holiday) {
  return postRequest('/api/holiday/checkDuplicateHoliday', JSON.stringify(holiday))
}

export {
  getSearchCondition,
  getHolidayList,
  createHolidayView,
  createHoliday,
  getHoliday,
  updateHolidayView,
  updateHoliday,
  deleteHolidaies,
  checkDuplicateHoliday
}
