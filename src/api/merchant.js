import request from '@/utils/request'

export function merchantIndex(params) {
  return request({
    url: '/merchant',
    method: 'get',
    params
  })
}

export function getIpWhiteList(id) {
  return request({
    url: '/whitelist/' + id,
    method: 'get'
  })
}

export function deleteWhiteList(id) {
  return request({
    url: '/whitelist/' + id,
    method: 'delete'
  })
}

export function merchantIPWhiteListStore(params) {
  return request({
    url: '/whitelist',
    method: 'post',
    params
  })
}

export function merchantStatusList() {
  return request({
    url: '/merchant/options',
    method: 'get'
  })
}

export function merchantBaseInfo(id) {
  return request({
    url: '/merchant/' + id,
    method: 'get'
  })
}

export function merchantBaseInfoStore(id, data) {
  return request({
    url: '/merchant/' + id,
    method: 'put',
    data
  })
}

export function merchantGateway(id) {
  return request({
    url: '/merchant/gateway/' + id,
    method: 'get'
  })
}

export function merchantGateWayStore(id) {
  return request({
    url: '/merchant/gateway/renew/' + id,
    method: 'put'
  })
}
