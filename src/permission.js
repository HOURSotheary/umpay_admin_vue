import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getRefreshToken } from '@/api/user'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login'] // no redirect whitelist

router.then((router) => {
  router.beforeEach(async(to, from, next) => {
  // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in

    // if (hasToken) {
    //   if (to.path === '/login') {
    //     // if is logged in, redirect to the home page
    //     next({ path: '/' })
    //     NProgress.done()
    //   } else {
    //     const hasGetUserInfo = store.getters.name
    //     if (hasGetUserInfo) {
    //       next()
    //     } else {
    //       try {
    //         // get user info
    //         await store.dispatch('user/getInfo')

    //         next()
    //       } catch (error) {
    //         // remove token and go to login page to re-login
    //         await store.dispatch('user/resetToken')
    //         Message.error(error || 'Has Error')
    //         next(`/login?redirect=${to.path}`)
    //         NProgress.done()
    //       }
    //     }
    //   }
    // } else {
    //   /* has no token*/

    //   if (whiteList.indexOf(to.path) !== -1) {
    //     // in the free login whitelist, go directly
    //     next()
    //   } else {
    //     // other pages that do not have permission to access are redirected to the login page.
    //     next(`/login?redirect=${to.path}`)
    //     NProgress.done()
    //   }
    // }
    const hasToken = getToken()

    if (hasToken) {
      if (to.path === '/login') {
      // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
      } else {
        getRefreshToken().then((response) => {
          if (response.status === 200) {
            setToken(response.data.token)
            next()
          }
        }).catch(async(response) => {
          await resetToken()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        })
      }
    } else {
    /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
        next()
      } else {
      // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
  // finish progress bar
    NProgress.done()
  })
})

async function resetToken() {
  return await store.dispatch('user/resetToken')
}
