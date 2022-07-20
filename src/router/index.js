import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '@/utils/auth' // get token from cookie

Vue.use(Router)
import i18n from '../lang' // internationalization
/* Layout */
import Layout from '@/layout'
import { getMenuSidebar } from '@/api/user'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: 'Umpay',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/edit-own-password/',
    component: Layout,
    redirect: '',
    children: [
      {
        path: 'update',
        name: 'Dashboard',
        component: () => import('@/views/edit-own-password/update')
      }
    ]
  },
  {
    path: '/edit-own-pin/',
    component: Layout,
    redirect: '',
    children: [
      {
        path: 'update',
        name: 'Dashboard',
        component: () => import('@/views/edit-own-pin/update')
      }
    ]
  },
  {
    path: '/system/',
    component: Layout,
    redirect: '',
    children: [
      {
        path: 'payment_field/edit/:id',
        name: 'Dashboard',
        component: () => import('@/views/system/payment/fields')
      }
    ]
  },
  {
    path: '/manager/role/edit/',
    component: Layout,
    redirect: '',
    children: [
      {
        path: ':id',
        name: 'Dashboard',
        component: () => import('@/views/manager/role/edit')
      }
    ]
  },
  {
    path: '/manager/',
    component: Layout,
    redirect: '',
    children: [
      {
        path: 'role/create',
        name: 'Dashboard',
        component: () => import('@/views/manager/role/edit')
      }
    ]
  },
  {
    path: '/operation/appeal/tracking/',
    component: Layout,
    redirect: '',
    children: [
      {
        path: ':id',
        name: 'Dashboard',
        component: () => import('@/views/operation/appeal/tracking')
      }
    ]
  }
  // 404 page must be placed at the end !!!
  //   { path: '*', redirect: '/404', hidden: true }
]
let firstView = false

function getMenuFromApi() {
  return new Promise((resolve, reject) => {
    if (getToken() && !firstView) {
      getMenuSidebar({
        left_menu: 1
      })
        .then((response) => {
          console.log('KK' + response)
          const newConstantRoutes = constantRoutes
          response.data.forEach((element) => {
            const title = i18n.t('menu.' + element.title)
            let level_1 = []
            level_1 = {
              path: element.route,
              component: Layout,
              redirect: element.route,
              name: element.name,
              // alwaysShow: (element.children_menu.length > 0),
              meta: {
                title,
                icon: element.icon
              },
              children: []
            }

            const level_2 = []
            element.children_menu.forEach((children_menu_2) => {
              const level_3 = []
              children_menu_2.children_menu.forEach((children_menu_3) => {
                level_3.push({
                  path: children_menu_3.route,
                  name: children_menu_3.name,
                  component: () => import('@/views/user/index'),
                  hidden: true,
                  meta: {
                    title: children_menu_3.title,
                    icon: children_menu_3.icon
                  },
                  children: []
                })
              })

              level_2.push({
                path: children_menu_2.route,
                name: children_menu_2.name,
                component: (resolve) =>
                  require([`@/views${children_menu_2.route}`], resolve),
                meta: {
                  title: children_menu_2.title,
                  icon: children_menu_2.icon,
                  operate_options: children_menu_2.children_menu
                },
                children: level_3
              })
            })
            // console.log(level_2)

            level_1.children = level_2
            newConstantRoutes.push(level_1)
          })

          firstView = true

          newConstantRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })

          resolve(newConstantRoutes)
        })
        .catch((response) => {
          resolve(constantRoutes)
        })
    } else {
      resolve(constantRoutes)
    }
    // resolve(constantRoutes)
  })
}

const createRouter = async() => {
  const menu = await getMenuFromApi()
  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: menu
  })
}
//   new Router({
//     // mode: 'history', // require service support
//     scrollBehavior: () => ({ y: 0 }),
//     routes: constantRoutes
//   })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  console.log(this)
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
