import 'babel-polyfill'
import Vue from 'vue'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import lodash from 'lodash'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import auth from './plugins/auth'
import VueCookies from 'vue-cookies'
// import VueGoogleCharts from 'vue-google-charts'
// 전역 컴포넌트 임포트
import Header from './components/Header'
import PageTitle from './components/PageTitle'
import PageSectionTitle from './components/PageSectionTitle'
import ChatPopup from './components/ChatPopup'

import LNB from './components/LNB'
import i18n from './i18n'
import vuescroll from './scripts/vuescroll'

// 전역 스타일시트 임포트
import './assets/style/common.scss'

// IE 11 지원
if (typeof window.TextEncoder !== 'function') {
  const TextEncodingPolyfill = require('text-encoding')
  window.TextEncoder = TextEncodingPolyfill.TextEncoder
  window.TextDecoder = TextEncodingPolyfill.TextDecoder
}

Vue.use(VueMomentJS, moment)
Vue.use(VueCookies)
// Vue.use(VueGoogleCharts)

/**
 * 권한 Directive
 * <pre>
 * <v-btn v-auth="['CU', 'CAU', 'AU', 'SAU']"></v-btn>
 * </pre>
 */
Vue.directive('auth', auth)

// 1d 기본 쿠키 설정
Vue.$cookies.config('1d')

Vue.config.productionTip = false

// 컴포넌트 목록
Vue.component('Header', Header)
Vue.component('PageTitle', PageTitle)
Vue.component('PageSectionTitle', PageSectionTitle)
Vue.component('LNB', LNB)
Vue.component('ChatPopup', ChatPopup)

// vuescroll 글로벌 설정
vuescroll(Vue)

window.app = new Vue({
  router,
  store,
  vuetify,
  lodash,
  i18n,
  render: h => h(App)
}).$mount('#app')
