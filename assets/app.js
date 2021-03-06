import Vue from 'vue'
import App from './App.vue'
import VueClipboards from 'vue-clipboards'
import VueLazyload from 'vue-lazyload'
import VueMarkdown from 'vue-markdown'
import axios from 'axios'
import _ from 'lodash'
import Vuetify from './vuetify.js'

import * as Components from 'components/_index.js'

import { createStore } from 'store/index'
import { createRouter } from 'router/index'
import { sync } from 'vuex-router-sync'

Vuetify(Vue)
Vue.use(VueClipboards)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: 'static/Hestia.gif',
  error: 'static/error.jpg',
  attempt: 1,
  lazyComponent: true
})

Vue.prototype.$_ = _
Vue.prototype.$axios = axios
Vue.prototype.$log = (...args) => console.log(`[${(new Date()).toLocaleTimeString()}]:`, ...args)

Vue.component('vue-markdown', VueMarkdown)
Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key])
})

if (typeof window !== 'undefined' && process.env.NODE_ENV) window.NODE_ENV = process.env.NODE_ENV

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp (ssrContext) {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  // App initialization
  store.dispatch('init')
  !['KawAnime-test', 'development'].includes(process.env.NODE_ENV) && store.dispatch('update/check')

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    ssrContext,
    render: h => h(App)
  })

  return { app, router, store }
}
