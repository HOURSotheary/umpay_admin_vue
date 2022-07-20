import request from '@/utils/request'

export function depositIndex(params) {
  console.log(params)

  return request({
    url: '/finance/deposit',
    method: 'get',
    params
  })
}

export function depositDetail(id) {
  return request({
    url: '/finance/deposit/' + id,
    method: 'get'
  })
}

export function depositStore(data) {
  return request({
    url: '/finance/deposit',
    method: 'post',
    data
  })
}

export function withdrawIndex(params) {
  console.log(params)
  return request({
    url: '/finance/withdraw',
    method: 'get',
    params
  })
}

export function withdrawDetail(id) {
  return request({
    url: '/finance/withdraw/' + id,
    method: 'get'
  })
}

export function withdrawStore(data) {
  return request({
    url: '/finance/withdraw',
    method: 'post',
    data
  })
}

export function transferIndex(params) {
  return request({
    url: '/finance/transfer',
    method: 'get',
    params
  })
}

export function transferDetail(id) {
  return request({
    url: '/finance/transfer/' + id,
    method: 'get'
  })
}
