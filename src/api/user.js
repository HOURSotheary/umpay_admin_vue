import request from '@/utils/request'
import requestNoAuth from '@/utils/requestNoAuth'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function userBill(params) {
  return request({
    url: '/user/bill',
    method: 'get',
    params
  })
}

export function userBillDetail(id) {
  return request({
    url: '/user/bill_detail/' + id,
    method: 'get'
  })
}

export function userList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function userBasic(id) {
  return request({
    url: '/user/basic/' + id,
    method: 'get'
  })
}
/**
 * Update user basic info
 * @param {*} id
 * @param {*} data
 * @returns
 */
export function updateUserBasic(id, data) {
  return request({
    url: '/user/basic/' + id,
    method: 'put',
    data
  })
}

/**
 * Update user password
 * @param {*} id
 * @param {*} data
 * @returns
 */
export function updateUserPassword(id, data) {
  return request({
    url: '/user/password/' + id,
    method: 'put',
    data
  })
}

/**
 * Update user pin
 * @param {*} id
 * @param {*} data
 * @returns
 */
export function updateUserPin(id, data) {
  return request({
    url: '/user/pin/' + id,
    method: 'put',
    data
  })
}

/**
 * Update user priority
 * @param {*} id
 * @param {*} data
 * @returns
 */
export function updateUserPriority(id, data) {
  return request({
    url: '/user/priority/' + id,
    method: 'put',
    data
  })
}

export function userStatistics(id) {
  return request({
    url: '/user/statistics/' + id,
    method: 'get'
  })
}

export function userVerify(params) {
  return request({
    url: '/user/verify',
    method: 'get',
    params
  })
}

export function userVerifyDetail(id) {
  return request({
    url: '/user/verify_detail/' + id,
    method: 'get'
  })
}

export function userVerifyStatusList() {
  return request({
    url: '/user/verify_status_list',
    method: 'get'
  })
}

/**
 * Update user verify status
 * @param {*} id
 * @param {*} data
 * @returns
 */
export function updateUserVerifyStatus(id, data) {
  return request({
    url: '/user/verify-status/' + id,
    method: 'put',
    data
  })
}

export function getRefreshToken() {
  return requestNoAuth({
    url: '/refresh_token',
    method: 'get'
  })
}

export function getMenuSidebar(params) {
  return requestNoAuth({
    url: '/menu',
    method: 'get',
    params
  })
}

export function userPaymentAccount(params) {
  return request({
    url: '/user/payment_account',
    method: 'get',
    params
  })
}

export function userStatusList() {
  return request({
    url: '/user/status_list',
    method: 'get'
  })
}

export function phoneCountryList() {
  return request({
    url: '/common/country_list?page_size=1000',
    method: 'get'
  })
}

export function userVerifyUpdate(id, data) {
  return request({
    url: '/user/verify/' + id,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function userUnlock(id) {
  return request({
    url: '/user/unlock/' + id,
    method: 'post'
  })
}
