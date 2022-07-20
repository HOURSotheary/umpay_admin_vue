import request from '@/utils/request'

export function appealLists(params) {
  return request({
    url: '/appeal',
    method: 'get',
    params
  })
}

export function appearCreate(data) {
  return request({
    url: '/appeal',
    method: 'post',
    data
  })
}

export function appearUpdate(id, data) {
  return request({
    url: '/appeal/update/' + id,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function appearDetail(id) {
  return request({
    url: '/appeal/' + id,
    method: 'get'
  })
}

export function appealStatusList() {
  return request({
    url: '/appeal/options/list',
    method: 'get'
  })
}
