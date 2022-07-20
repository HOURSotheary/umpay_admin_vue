import request from '@/utils/request'

export function getPaymentField(payment_id) {
  return request({
    url: `/payment-fields?payment_id=` + payment_id,
    method: 'get'
  })
}

export function paymentFieldUpdate(id, data) {
  console.log(data)
  return request({
    url: '/payment-fields/update/' + id,
    method: 'post',
    data
  })
}

export function paymentFieldDelete(id, data) {
  return request({
    url: '/payment-fields/update/' + id,
    method: 'post'
  })
}
