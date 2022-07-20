import request from '@/utils/request'

export function managerLists(params) {
  return request({
    url: '/manager',
    method: 'get',
    params
  })
}

export function managerCreate(data) {
  return request({
    url: '/manager',
    method: 'post',
    data
  })
}

export function managerUpdate(id, data) {
  return request({
    url: '/manager/' + id,
    method: 'put',
    data
  })
}

export function managerDelete(id) {
  return request({
    url: '/manager/' + id,
    method: 'delete'
  })
}

export function managerUnlock(id) {
  return request({
    url: '/manager/unlock_manager/' + id,
    method: 'post'
  })
}

export function managerStatusList() {
  return request({
    url: '/manager/status/options',
    method: 'get'
  })
}

export function managerLog(params) {
  return request({
    url: '/manager/log/admin',
    method: 'get',
    params
  })
}

export function managerLogUser(params) {
  return request({
    url: '/manager/log/user',
    method: 'get',
    params
  })
}

export function managerLogGateway(params) {
  return request({
    url: '/manager/log/gateway',
    method: 'get',
    params
  })
}

export function managerUpdatePassword(id, data) {
  return request({
    url: '/manager/password/' + id,
    method: 'post',
    data
  })
}

export function managerUpdatePin(id, data) {
  return request({
    url: '/manager/pin/' + id,
    method: 'put',
    data
  })
}

export function managerDetail(id) {
  return request({
    url: '/manager/' + id,
    method: 'get'
  })
}

export function unlock(data) {
  return request({
    url: 'manager/unlock_manager',
    method: 'post',
    data
  })
}
