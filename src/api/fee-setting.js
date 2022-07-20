import request from '@/utils/request'

export function feeSettingList(params) {
  return request({
    url: '/setting-fee',
    method: 'get',
    params
  })
}

export function getFeeSetting(id) {
  return request({
    url: '/setting-fee/' + id,
    method: 'get'
  })
}

export function feeSettingEdit(id, data) {
  return request({
    url: '/setting-fee/' + id,
    method: 'post',
    data
  })
}
