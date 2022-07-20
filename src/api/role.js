import request from '@/utils/request'

export function roleList(params) {
  return request({
    url: '/role',
    method: 'get',
    params
  })
}

export function roleCreate(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function getRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}

export function roleUpdate(id, data) {
  return request({
    url: '/role/' + id,
    method: 'put',
    data
  })
}

export function roleDelete(id) {
  return request({
    url: '/manager/' + id,
    method: 'delete'
  })
}
