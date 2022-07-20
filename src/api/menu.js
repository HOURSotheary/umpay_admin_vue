import request from '@/utils/request'

export function menuList(params) {
  return request({
    url: '/menu',
    method: 'get',
    params
  })
}

export function menuCreate(params) {
  return request({
    url: '/menu',
    method: 'post',
    params
  })
}

export function menuLevelList(params) {
  return request({
    url: '/menu/level',
    method: 'get',
    params
  })
}

export function getMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'get'
  })
}

export function menuUpdate(id, params) {
  return request({
    url: `/menu/update/${id}`,
    method: 'post',
    params
  })
}

export function parentMenuList(params) {
  return request({
    url: '/menu/parent',
    method: 'get',
    params
  })
}

export function deleteMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}
