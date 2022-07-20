import request from '@/utils/request'

export function gateWayOrderIndex(params) {
  return request({
    url: '/gateway-order',
    method: 'get',
    params
  })
}

export function gateWayStatusList() {
  return request({
    url: '/gateway-order/options',
    method: 'get'
  })
}

export function gateWayOrderDetail(id) {
  return request({
    url: '/gateway-order/' + id,
    method: 'get'
  })
}
