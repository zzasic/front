import { getCounselorStatusList } from '@/api/counselor'
import { Client } from '@stomp/stompjs'

function setSubscribe (_this, client, counselor) {
  client.subscribe(`/sub/counselor/${counselor.extension}`, (message) => {
    const body = JSON.parse(message.body)
    // console.log('body', body)
    if (body.hist) {
      _this.commit('ADD_HIST', body.hist)
      if (body.counselor) {
        Object.assign(counselor, { abnormalCount: body.counselor.abnormalCount, chatbotId: body.counselor.chatbotId, taskId: body.counselor.taskId, taskNm: body.counselor.taskNm }) // 이상감지, 업무명
      }
    } else if (body.hists) {
      _this.commit('ADD_HISTS', body.hists)
      if (body.counselor) {
        Object.assign(counselor, { abnormalCount: body.counselor.abnormalCount, chatbotId: body.counselor.chatbotId, taskId: body.counselor.taskId, taskNm: body.counselor.taskNm }) // 이상감지, 업무명
      }
    } else {
      if (body.counselor) {
        Object.assign(counselor, body.counselor)
      }
    }
  })
}

function setSysSubscribe (_this, client) {
  client.subscribe('/sub/sysCounselor', (message) => {
    const body = JSON.parse(message.body)
    // console.log('sysBody', body)
    if (body.counselor) {
      _this.commit('ADD_COUNSELORS', { counselors: [], systemCounselors: [body.counselor] })
    }
    if (body.hist) {
      _this.commit('ADD_HIST', body.hist)
    } else if (body.hists) {
      _this.commit('ADD_HISTS', body.hists)
    }
  })
}

export default {
  data () {
    return {
    }
  },
  state: {
    counselors: [], // AI상담원
    systemCounselors: [], // 인공인간, 불완전판매
    chats: [], // 콜
    hists: [], // 대화내용
    subs: false, // Listener
    client: null // WebSocket
  },
  getters: {
    getcounselors: state => {
      return state.counselors
    },
    getsyscounselors: state => {
      return state.systemCounselors
    },
    getchats: state => {
      return state.chats
    },
    gethists: state => {
      return state.hists
    },
    getclient: state => {
      return state.client
    },
    getsubs: state => {
      return state.subs
    }
  },
  mutations: {
    // ADD_COUNSELORS (state, counselors) {
    //   console.log('ADD_COUNSELORS', counselors)
    //   if (counselors) {
    //     for (const counselor of counselors) {
    //       if (!state.counselors.some(cn => cn.counselorId === counselor.counselorId)) {
    //         state.counselors.push(counselor)
    //       } else {
    //         const old = state.counselors.find(cn => cn.counselorId === counselor.counselorId)
    //         Object.assign(old, counselor)
    //       }
    //     }
    //   }
    //   if (state.subs === false) {
    //     // AI 상담원
    //     for (const counselor of state.counselors) {
    //       setSubscribe(this, state.client, counselor)
    //     }
    //   }
    //   state.subs = true
    // },
    // ADD_SYSTEM_COUNSELORS (state, systemCounselors) {
    //   console.log('ADD_SYSTEM_COUNSELORS', systemCounselors)
    //   if (systemCounselors) {
    //     for (const sysCounselor of systemCounselors) {
    //       if (!state.systemCounselors.some(cn => cn.systemId === sysCounselor.systemId && cn.tenantId === sysCounselor.tenantId && cn.branchCd === sysCounselor.branchCd && cn.deviceNo === sysCounselor.deviceNo)) {
    //         state.systemCounselors.push(sysCounselor)
    //       } else {
    //         const old = state.systemCounselors.find(cn => cn.systemId === sysCounselor.systemId && cn.tenantId === sysCounselor.tenantId && cn.branchCd === sysCounselor.branchCd && cn.deviceNo === sysCounselor.deviceNo)
    //         Object.assign(old, sysCounselor)
    //       }
    //     }
    //   }
    //   if (state.sysSubs === false) {
    //     // 인공인간, 불완전판매 상담원
    //     setSysSubscribe(this, state.client)
    //   }
    //   state.sysSubs = true
    // },
    ADD_COUNSELORS (state, { counselors, systemCounselors }) {
      // console.log('ADD_COUNSELORS', counselors, systemCounselors)
      if (counselors) {
        for (const counselor of counselors) {
          if (!state.counselors.some(cn => cn.counselorId === counselor.counselorId)) {
            state.counselors.push(counselor)
          } else {
            const old = state.counselors.find(cn => cn.counselorId === counselor.counselorId)
            Object.assign(old, counselor)
          }
        }
      }
      if (systemCounselors) {
        for (const sysCounselor of systemCounselors) {
          if (!state.systemCounselors.some(cn => cn.systemId === sysCounselor.systemId && cn.tenantId === sysCounselor.tenantId && cn.branchCd === sysCounselor.branchCd && cn.deviceNo === sysCounselor.deviceNo)) {
            state.systemCounselors.push(sysCounselor)
          } else {
            const old = state.systemCounselors.find(cn => cn.systemId === sysCounselor.systemId && cn.tenantId === sysCounselor.tenantId && cn.branchCd === sysCounselor.branchCd && cn.deviceNo === sysCounselor.deviceNo)
            Object.assign(old, sysCounselor)
          }
        }
      }
      if (state.subs === false) {
        // AI 상담원
        for (const counselor of state.counselors) {
          setSubscribe(this, state.client, counselor)
        }
        setSysSubscribe(this, state.client)
      }
      state.subs = true
    },
    CLIENT (state, client) {
      state.client = client
    },
    ADD_CHAT (state, chat) {
      if (chat.callId) {
        const fchat = state.chats.find(cs => cs.callId === chat.callId)
        if (fchat && fchat.callId) {
          fchat.visible = true
        } else {
          chat.visible = true
          state.chats.push(chat)
        }
      }
    },
    REM_CHAT (state, chat) {
      if (chat.callId) {
        const fchat = state.chats.find(cs => cs.callId === chat.callId)
        if (fchat && fchat.callId) {
          fchat.visible = false
          // hist 삭제
          if (state.hists) {
            let idx = -1
            while ((idx = state.hists.findIndex(h => h.callId === chat.callId)) > -1) {
              state.hists.splice(idx, 1)
            }
          }
        }
      }
    },
    ADD_HIST (state, hist) {
      // console.log('ADD_HISTS', hist)
      state.hists.push(hist)
    },
    ADD_HISTS (state, hists) {
      const tempHists = state.hists.slice(0).filter((hist) => {
        return hist.callId !== hists[0].callId
      })
      state.hists.splice(0)
      state.hists.push(...tempHists, ...hists)
    }
  },
  actions: {
    CREATE ({ commit, state }) {
      // console.log('CLIENT dispatch')
      const token = sessionStorage.accessToken
      const wsUrl = process.env.VUE_APP_WS_AICC_URL || `${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}`
      const client = new Client()
      commit('CLIENT', client) // 동기처리
      client.configure({
        brokerURL: `${wsUrl}/ws/websocket`,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        onConnect: (frame) => {
          // WebSocket 연결 완료
          getCounselorStatusList({}).then(
            (response) => {
              const status = response.data.status
              if (status === 200) {
                // console.log(' response.data.result.counselorList ' + JSON.stringify(response.data.result.counselorList))
                console.log(' systemCounselorList ' + JSON.stringify(response.data.result.systemCounselorList))
                // 조회결과
                // 1. AICC 상담원 목록 조회 후, 초기값 등록
                // 2. 인공인간, 불판 초기값 등록
                // commit('ADD_COUNSELORS', { counselors: (this.counselors || []), systemCounselors: (this.systemCounselors || []) })
                commit('ADD_COUNSELORS', { counselors: (response.data.result.counselorList || []), systemCounselors: (response.data.result.systemCounselorList || []) })
                // commit('ADD_SYSTEM_COUNSELORS', (response.data.result.systemCounselorList || []))
              }
            }
          )
        },
        onDisconnect: (frame) => {
          // console.log('onDisconnect')
        },
        onWebSocketClose: () => {
          // console.log('onWebSocketClose')
          state.subs = false
        },
        onStompError: () => {
          // console.log('onStompError')
        }
      })
      client.activate()
    },
    DESTORY ({ state }) {
      state.counselors = [] // AI상담원
      state.systemCounselors = [] // system상담원
      state.chats = [] // 콜
      state.hists = [] // 대화내용
      state.subs = false
      state.client.deactivate()
    }
  }
}
