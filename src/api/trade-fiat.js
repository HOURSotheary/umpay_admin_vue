import request from '@/utils/request'

export function tradeFaitAds(params) {
  return request({
    url: '/trade/fiat/ads',
    method: 'get',
    params
  })
}

export function tradeFaitAdsDetail(id) {
  return request({
    url: '/trade/fiat/ads/' + id,
    method: 'get'
  })
}

export function tradeFaitOrder(params) {
  return request({
    url: '/trade/fiat/order',
    method: 'get',
    params
  })
}

export function tradeFaitOrderDetail(id) {
  return request({
    url: '/trade/fiat/order/' + id,
    method: 'get'
  })
}
