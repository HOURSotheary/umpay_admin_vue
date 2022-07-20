import request from '@/utils/request'

export function broadcastLists(params) {
  return request({
    url: '/broadcast',
    method: 'get',
    params
  })
}

export function broadcastCreate(data) {
  return request({
    url: '/broadcast',
    method: 'post',
    data
  })
}

export function broadcastUpdate(id, data) {
  return request({
    url: '/broadcast/' + id,
    method: 'put',
    data
  })
}

export function broadcastDetail(id) {
  return request({
    url: '/broadcast/' + id,
    method: 'get'
  })
}
