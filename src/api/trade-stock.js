import request from '@/utils/request'

export function tradeStockOrder(params) {
  return request({
    url: '/trade/stock/order',
    method: 'get',
    params
  })
}

export function tradeStockOrderDetail(id) {
  return request({
    url: '/trade/stock/order/' + id,
    method: 'get'
  })
}

export function stockOrderStatusList() {
  return request({
    url: '/trade/stock/order/status_list',
    method: 'get'
  })
}
