import request from '@/utils/request'

export function currencyList(params) {
  return request({
    url: '/currency',
    method: 'get',
    params
  })
}

export function currencyStatusList() {
  return request({
    url: '/currency_status_list',
    method: 'get'
  })
}

export function currencyCreate(data) {
  return request({
    url: '/currency',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getCurrency(id) {
  return request({
    url: `/currency/${id}`,
    method: 'get'
  })
}

export function currencyUpdate(id, data) {
  return request({
    url: `/currency/update/${id}`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function bindFaitCurrencyStatusList() {
  return request({
    url: '/currency/all?type=1',
    method: 'get'
  })
}

export function currencyListOption() {
  return request({
    url: '/currency/all?type',
    method: 'get'
  })
}
