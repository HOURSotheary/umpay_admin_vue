import request from '@/utils/request'

export function versionList(params) {
  return request({
    url: '/version',
    method: 'get',
    params
  })
}

export function versionCreate(params) {
  return request({
    url: '/version',
    method: 'post',
    params
  })
}

export function getVersion(id) {
  return request({
    url: `/version/${id}`,
    method: 'get'
  })
}

export function versionUpdate(id, params) {
  return request({
    url: `/version/${id}`,
    method: 'put',
    params
  })
}

export function versionStatusList() {
  return request({
    url: '/version_status_list',
    method: 'get'
  })
}
