import request from '@/utils/request'

export function paymentList(params) {
  return request({
    url: '/payment',
    method: 'get',
    params
  })
}

export function paymentCreate(data) {
  return request({
    url: `/payment`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getPayment(id) {
  return request({
    url: `/payment/${id}`,
    method: 'get'
  })
}

export function paymentUpdate(id, data) {
  return request({
    url: `/payment/update/${id}`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function paymentStatusList() {
  return request({
    url: '/payment_status_list',
    method: 'get'
  })
}

export function currencyList() {
  return request({
    url: '/currency/all?type',
    method: 'get'
  })
}
