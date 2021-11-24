import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { login } from '../api/login'
import chat from './chat'

Vue.use(Vuex)

function getMenus (pid, accMenu) {
  const menus = accMenu[pid]
  if (menus && menus.length > 0) {
    for (const smenu of menus) {
      const submenus = getMenus(smenu.id, accMenu)
      if (submenus && submenus.length > 0) {
        smenu.subMenu = [...submenus]
        smenu.foldStatus = smenu.foldStatus || smenu.selected || smenu.subMenu.some(ss => ss.foldStatus || ss.selected)
      }
    }
  }
  return menus
}

function findMenuInfo (menus, name) {
  for (const mm of menus) {
    if (mm.subMenu && mm.subMenu.length > 0) {
      const mms = findMenuInfo(mm.subMenu, name)
      if (mms !== null) {
        return mms
      }
    }
    if (name === mm.link) {
      return mm
    }
  }
  return null
}

export default new Vuex.Store({
  state: {
    accessToken: null,
    orgMenus: null,
    menu: null,
    selectedMenu: null,
    mainInfo: null,
    ppolicy: null
  },
  getters: {
    getppolicy: state => {
      return state.ppolicy
    },
    getmenu: state => {
      return state.menu
    },
    getmain: state => {
      return state.mainInfo
    },
    pageTitle: state => {
      // MainView Check
      if (state.selectedMenu) {
        if (state.selectedMenu.link === 'MainView') {
          return findMenuInfo(state.menu, state.mainInfo.mainUrl).text
        }
        return state.selectedMenu.text
      } else {
        return ''
      }
    },
    pageDescription: state => {
      // MainView Check
      if (state.selectedMenu) {
        if (state.selectedMenu.link === 'MainView') {
          return findMenuInfo(state.menu, state.mainInfo.mainUrl).desc
        }
        return state.selectedMenu.desc
      } else {
        return ''
      }
    }
  },
  mutations: {
    PPOLICY (state, ppolicy) {
      state.ppolicy = ppolicy
    },
    LOGIN (state, session) {
      sessionStorage.accessToken = session.token
      sessionStorage.userId = session.userId
      sessionStorage.userEmail = session.userEmail
      sessionStorage.userName = session.userName
      sessionStorage.userAuthCode = session.userAuthCode
      sessionStorage.userDeptName = session.userDeptName
      sessionStorage.relationId = session.ssoUserId
      sessionStorage.tenantId = session.tenantId
      sessionStorage.systemIds = session.systemIds
      state.accessToken = session.token
    },
    LOGOUT (state) {
      // 토큰 정보 삭제
      delete sessionStorage.accessToken
      delete sessionStorage.userId
      delete sessionStorage.userEmail
      delete sessionStorage.userName
      delete sessionStorage.userAuthCode
      delete sessionStorage.userDeptName
      delete sessionStorage.tenantId
      state.accessToken = null
    },
    MENU (state, result) {
      const menus = JSON.parse(result.menus)
      const selectedMenu = JSON.parse(result.selectedMenu)
      state.selectedMenu = selectedMenu
      const mainInfo = JSON.parse(result.mainInfo)
      state.mainInfo = mainInfo
      const accMenu = menus.reduce((acc, obj) => {
        const pid = obj.pid ? obj.pid : ''
        if (!acc[pid]) {
          acc[pid] = []
        }
        if (obj.menuYn === 'Y') {
          acc[pid].push(obj)
        }
        return acc
      }, {})
      state.menu = getMenus('', accMenu)
    }
  },
  actions: {
    LOGIN ({ commit }, { email, password, localeCode }) {
      return login(email, password, localeCode)
        .then(({ data, config }) => {
          if (data.status === 200) {
            commit('LOGIN', data.result)
          }
          // alert('로그인 완료!!')
        })
        .catch(error => {
          console.log(error)
          // alert('로그인 아이디 또는 패스워드를 확인해주세요.')
        })
    },
    LOGOUT ({ commit }) {
      // HTTP 요청 헤더값 제거
      axios.defaults.headers.common.Authorization = undefined
      commit('LOGOUT')
    }
  },
  modules: {
    chat
  }
})
