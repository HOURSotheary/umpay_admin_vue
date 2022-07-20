import request from '@/utils/request'

export function userStatusList() {
  return request({
    url: '/user/status_list',
    method: 'get'
  })
}
