/* eslint-disable no-console */

import { register } from 'register-service-worker'

// if (process.env.NODE_ENV === 'production') {
register(`${process.env.BASE_URL}sw.js`, {
  ready () {
    // alert(
    //   'App is being served from cache by a service worker.\n' +
    //   'For more details, visit https://goo.gl/AFskqB'
    // )
  },
  registered () {
    // alert('Service worker has been registered.')
  },
  cached () {
    // alert('Content has been cached for offline use.')
  },
  updatefound () {
    // alert('New content is downloading.')
  },
  updated () {
    // alert('New content is available; please refresh.')
  },
  offline () {
    // alert('No internet connection found. App is running in offline mode.')
  },
  error (error) {
    alert('Error during service worker registration:', error)
  }
})
// }
