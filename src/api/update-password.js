import request from '@/utils/request'

export function updateOwnPassword(data) {
  return request({
    url: '/manager/password',
    method: 'post',
    data
  })
}

