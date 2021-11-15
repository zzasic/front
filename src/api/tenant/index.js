import { postRequest } from '../AxioCreate.js'

function reqTenantSearchCondition () {
  return postRequest('/api/tenant/listInit', JSON.stringify({}))
}

function reqTenantList (searchCondition) {
  return postRequest('/api/tenant/listView', JSON.stringify(searchCondition))
}

function reqInitTenantView () {
  return postRequest('/api/tenant/initView', JSON.stringify({}))
}

function reqCreateTenant (searchCondition) {
  return postRequest('/api/tenant/create', JSON.stringify(searchCondition))
}

function reqSelectTenantForUpdate (searchCondition) {
  return postRequest('/api/tenant/selectForUpdate', JSON.stringify(searchCondition))
}

function reqUpdateTenant (searchCondition) {
  return postRequest('/api/tenant/update', JSON.stringify(searchCondition))
}

function reqDeleteTenant (searchCondition) {
  return postRequest('/api/tenant/delete', JSON.stringify(searchCondition))
}

function reqDeleteTenants (searchCondition) {
  return postRequest('/api/tenant/deletes', JSON.stringify(searchCondition))
}

export {
  reqTenantSearchCondition,
  reqTenantList,
  reqInitTenantView,
  reqCreateTenant,
  reqSelectTenantForUpdate,
  reqUpdateTenant,
  reqDeleteTenant,
  reqDeleteTenants
}
