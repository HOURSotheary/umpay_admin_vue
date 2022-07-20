import request from '@/utils/request'

export function exchangeRateIndex(params) {
  return request({
    url: '/exchange/rate',
    method: 'get',
    params
  })
}

export function exchangeOptions() {
  return request({
    url: '/exchange/options',
    method: 'get'
  })
}

export function exchangeRateStore(params) {
  return request({
    url: '/exchange/rate',
    method: 'post',
    params
  })
}

export function exchangeRateDetail(id) {
  return request({
    url: '/exchange/rate/' + id,
    method: 'get'
  })
}

export function marketPriceList(params) {
  return request({
    url: '/exchange/market-price',
    method: 'get',
    params
  })
}
