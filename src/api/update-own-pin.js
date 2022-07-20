import request from '@/utils/request'

export function updateOwnPin(data) {
  return request({
    url: '/manager/pin',
    method: 'post',
    data
  })
}
