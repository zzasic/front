
<template>
  <!-- 1. 상담이력에서는[monitor] class 삭제해주세요.  -->
  <div
    ref="vue-window-modal"
    class="vue-window-modal monitor hist"
    :class="counselor.callYn === 'Y' && counselor.callId === chat.callId ? 'on' : 'fail'"
    :style="{ width, height }"
    @click="focusPopup()">
    <div
      ref="vue-window-modal-header"
      class="vue-window-modal-header">
      <h2>
        {{ isAicc ? `${counselor.extension} - ` : `${counselor.branchCd} - ${counselor.deviceNo}` }}
        <button
          v-if="isAicc"
          style="margin-top: -5px !important"
          @click="calllist">
          {{ `${call.custNum ? call.custNum.replace(/-/g, '').replace(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/, '$1****$3') : ''}` }}
        </button>
      </h2>
      <button class="close" @mousedown="closeModalPopupBefore($event)" @mouseup="closeModalPopupBefore($event)" @click="closeModalPopup($event)"></button>
    </div>
    <div
      ref="vue-window-modal-body"
      class="vue-window-modal-body"
      :style="{ width: '100%', paddingRight: '10px' }">
      <vuescroll
        ref='vs'
        @handle-scroll="handleScroll">
        <!--<div class="custview-right">-->
          <v-checkbox
            class="chk-cusview"
            v-model="onlyStt"
            label="고객이력"
            color="#26B9D1"
            true-value="Y"
            false-value="N"
            :ripple="false"
          ></v-checkbox>
        <!--</div>-->
        <div class="chat-discussion">
          <div v-for="(hist, idx) in callHistories" :key="idx" class="chat-message" :class="hist.moudule === 'TTS' || hist.moudule === 'CHATBOT_OUT' ? 'left' : 'right'">
            <!-- <div v-if="idx === 0 || $moment.parseZone(callHistories[idx - 1].timestamp, 'x').format('YYYY-MM-DD') !== $moment.parseZone(hist.timestamp, 'x').format('YYYY-MM-DD')">
              {{ $moment.parseZone(hist.timestamp, 'x').format('YYYY-MM-DD') }}
            </div> -->
            <div v-if="hist.moudule === 'TTS' || hist.moudule === 'CHATBOT_OUT' || hist.moudule === 'CHATBOT.OUT'" class="profile">
              <div class="bg-circle">
                <i class="icon icon-lg-chatbot-fill"></i>
              </div>
              <span>AI상담원</span>
            </div>
            <div v-else class="profile">
              <div class="bg-circle">
                <i class="icon icon-lg-ic_my_28_s_900"></i>
              </div>
              <span>고객</span>
            </div>
            <div class="message">
              <div class="message-content" v-html="replaceHtml(hist.contents)" @click="selectSearch"></div>
              <div class="message-date">
                {{ $moment(hist.timestamp, 'x').zone('+09:00').format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </div>
          </div>
        </div>
      </vuescroll>
    </div>
    <div
      class="vue-window-modal-btn"
      :style="{ height: '65px' }">
      <v-btn v-if="isAicc && counselor.callYn === 'Y' && counselor.callId === chat.callId"
        class="button-default"
        :ripple="false"
        @click="switchCall($event)">
        호전환
      </v-btn>
      <v-btn
        v-if="isAicc"
        class="btn-reset"
        :ripple="false"
        @click="calllist($event)">
        통화이력
      </v-btn>
      <v-btn
        class="btn-reset"
        :ripple="false"
        @click="closeModalPopup($event)">
        닫기
      </v-btn>
    </div>
    <v-menu
      v-model="showContextMenu"
      :position-x="ctxX"
      :position-y="ctxY"
      absolute
      offset-y
    >
      <v-list
        class="menu-default tree-menu"
        style="cursor: default"
        dense>
        <v-list-item v-for="(menu, idx) in contextMenus" :key="idx" @click="contextMenuClick(menu)">
          <v-list-item-title>"{{ sel }}" {{ menu.name }} 검색</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import {
  getCallHistoryList,
  getSystemCallHistoryList,
  switchCall
} from '@/api/counsel'

export default {
  name: 'ChatPopupHist',
  data () {
    return {
      popupType: 'hist',
      chatSub: null,
      width: '400px',
      height: '600px',
      isdown: false,
      scrollTop1: '',
      scrollTop2: '',
      scrollLeft1: '',
      scrollLeft2: '',
      sel: '',
      showContextMenu: false,
      contextMenus: [
        {
          name: 'Wiki',
          url: 'https://ko.wikipedia.org/wiki/#sel'
        }
      ],
      ctxX: 0,
      ctxY: 0,
      onlyStt: 'N'
    }
  },
  computed: {
    isAicc: function () {
      return !this.counselor.systemId || this.counselor.systemId === 'AICC'
    },
    callHistories: function () {
      let hists = ''
      if (this.onlyStt === 'Y') {
        hists = this.gethists.filter(hs => this.chat.callId === hs.callId && hs.moudule !== 'TTS' && hs.moudule !== 'CHATBOT_OUT')
      } else {
        hists = this.gethists.filter(hs => this.chat.callId === hs.callId)
      }
      // const hists = this.gethists.filter(hs => this.chat.callId === hs.callId)
      // const hists = dupHists.filter((dup1, index) => {
      //   return dupHists.findIndex((dup2) => dup2.historyId === dup1.historyId) === index
      // })
      hists.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return 1
        }
        if (a.timestamp < b.timestamp) {
          return -1
        }
        return 0
      })
      return hists
    },
    getcounselors: function () {
      return this.$store.getters.getcounselors
    },
    gethists: function () {
      return this.$store.getters.gethists
    }
  },
  props: {
    // active: Boolean,
    call: Object,
    chat: Object,
    counselor: Object
  },
  watch: {
    'chat.visible': function (newVal) {
      // console.log'chat.visible', newVal)
      if (newVal === true) {
        this.focusPopup()
      }
    },
    callHistories: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (((oldVal || []).length !== (newVal || []).length) && this.scrollTop1 === this.scrollTop2) {
          this.$nextTick(() => {
            this.$refs.vs.scrollTo({ y: '100%' }, 500, 'easeInQuad')
          })
        }
      }
    }
  },
  updated () {
    // console.log('ModalPopup = updated....' + this.chat.callId)
  },
  methods: {
    getFilter () {
      // console.log('====' + JSON.stringify(this.callHistories))
      const ddd = this.callHistories.filter((cal) => cal.moudule !== 'CHATBOT_OUT')
      console.log('====' + JSON.stringify(ddd))
      this.callHistories = ddd
    },
    replaceHtml (str) {
      if (str) {
        return str.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, '').replace(/(\r)*\n/g, '<br>')
      } else {
        return str
      }
    },
    selectSearch (e) {
      this.sel = window.getSelection().toString()
      if (this.sel) {
        e.preventDefault()
        this.ctxX = event.clientX
        this.ctxY = event.clientY
        this.$nextTick(() => {
          this.showContextMenu = true
        })
      }
    },
    contextMenuClick (item) {
      if (item && item.name) {
        this.$emit('openiframe', item.url.replace(/#sel/, this.sel))
      }
    },
    handleScroll (vertical, horizontal, nativeEvent) {
      // console.log('handleScroll start', this.scrollTop1, this.scrollTop2, this.scrollLeft1, this.scrollLeft2)
      const { scrollTop, scrollLeft } = this.$refs.vs.getPosition()
      this.scrollTop1 = Math.max(this.scrollTop1, scrollTop)
      this.scrollLeft1 = Math.max(this.scrollLeft1, scrollLeft)
      this.scrollTop2 = scrollTop
      this.scrollLeft2 = scrollLeft
      // console.log('handleScroll complete', this.scrollTop1, this.scrollTop2, this.scrollLeft1, this.scrollLeft2)
    },
    dragElement () {
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      const _context = this
      // const _parent = this.$parent
      // const _window = this.$refs['vue-window-modal']
      const _windowHeader = this.$refs['vue-window-modal-header']
      _windowHeader.onmousedown = dragMouseDown
      function dragMouseDown (e) {
        e = e || window.event
        _context.focusPopup()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
        _windowHeader.style.cursor = '-webkit-grabbing'
      }
      function elementDrag (e) {
        e = e || window.event
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY

        const _arr = _context.$parent.$children.filter(_vc => {
          return _vc.sticky === true || _vc.popupType === 'hist'
        })
        const _offsetTop = _arr.reduce((acc, cur) => {
          const _win = cur.$refs['vue-window-modal']
          return Math.min(acc, _win.offsetTop)
        }, window.innerHeight)
        const _offsetBottom = _arr.reduce((acc, cur) => {
          const _win = cur.$refs['vue-window-modal']
          return Math.max(acc, _win.offsetTop + Number(cur.height.replace(/px$/, '')))
        }, 0)
        const _offsetLeft = _arr.reduce((acc, cur) => {
          const _win = cur.$refs['vue-window-modal']
          return Math.min(acc, _win.offsetLeft)
        }, window.innerWidth)
        const _offsetRight = _arr.reduce((acc, cur) => {
          const _win = cur.$refs['vue-window-modal']
          return Math.max(acc, _win.offsetLeft + Number(cur.width.replace(/px$/, '')))
        }, 0)
        // 같이 움직임
        _arr.forEach((_vue, _idx) => {
          const _win = _vue.$refs['vue-window-modal']
          // set the element's new position:
          if (_win.offsetTop < 0) {
            _win.style.top = '0px'
          } else if ((_win.offsetTop + Number(_vue.height.replace(/px$/, ''))) > window.innerHeight) {
            _win.style.top = (window.innerHeight - Number(_vue.height.replace(/px$/, ''))) + 'px'
          } else if (_win.offsetTop < (window.innerHeight - 35)) {
            if (_offsetTop - pos2 > 0 && _offsetBottom - pos2 < window.innerHeight) {
              _win.style.top = (_win.offsetTop - pos2) + 'px'
            }
          } else {
            _vue.centerWindow()
          }
          if (_win.offsetLeft < 0) {
            _win.style.left = '0px'
          } else if ((_win.offsetLeft + Number(_vue.width.replace(/px$/, ''))) > window.innerWidth) {
            _win.style.left = (window.innerWidth - Number(_vue.width.replace(/px$/, ''))) + 'px'
          } else if (_win.offsetLeft < (window.innerWidth - 35)) {
            if (_offsetLeft - pos1 > 0 && _offsetRight - pos1 < window.innerWidth) {
              _win.style.left = (_win.offsetLeft - pos1) + 'px'
            }
          } else {
            _vue.centerWindow()
          }
        })
      }
      function closeDragElement () {
        /* stop moving when mouse button is released: */
        document.onmouseup = null
        document.onmousemove = null
        _windowHeader.style.cursor = '-webkit-grab'
      }
    },
    focusPopup () {
      const popups = Array.from(document.getElementsByClassName('vue-window-modal'))
      const _zIndex = popups.map(el => Number(el.style.zIndex)).reduce((z1, z2) => Math.max(z1, z2), 9998) + 1
      this.$parent.$children.forEach((_vue, _idx) => {
        _vue.$refs['vue-window-modal'].style.zIndex = _zIndex
      })
      // this.$refs['vue-window-modal'].style.zIndex = popups.map(el => Number(el.style.zIndex)).reduce((z1, z2) => Math.max(z1, z2), 9998) + 1
      // this.$refs['vue-window-modal'].style.zIndex = popups.map(el => Number(el.style.zIndex)).reduce((z1, z2) => Math.max(z1, z2), 9998) + 1
    },
    centerWindow () {
      const popups = Array.from(document.getElementsByClassName('vue-window-modal'))
      const diff = popups.length * 15
      const pageWidth = window.innerWidth
      const pageHeight = window.innerHeight
      const elemWidth = Number(this.width.replace(/px$/, ''))
      const elemHeight = Number(this.height.replace(/px$/, ''))
      // console.logpageWidth, pageHeight, elemWidth, elemHeight)
      const ctx = this.$refs['vue-window-modal']
      ctx.style.left = (pageWidth / 2) - (elemWidth / 2) + diff + 'px'
      ctx.style.top = (pageHeight / 2) - (elemHeight / 2) + diff + 'px'
    },
    getCallHistoryList () {
      if (this.isAicc) {
        getCallHistoryList(this.chat.callId).then(
          (response) => {
            const status = response.data.status
            if (status === 200) {
              // 조회결과
              const call = response.data.result.call
              this.$emit('update:call', call)
              this.$store.commit('ADD_HISTS', response.data.result.callHistoryList)
              this.$nextTick(() => {
                this.$refs.vs.scrollTo({ y: '100%' }, 1, 'easeInQuad')
              })
            }
          }
        )
      } else {
        getSystemCallHistoryList(this.chat.callId).then(
          (response) => {
            const status = response.data.status
            if (status === 200) {
              // 조회결과
              const call = response.data.result.systemCall
              this.$emit('update:call', call)
              this.$store.commit('ADD_HISTS', response.data.result.systemCallHistoryList)
              this.$nextTick(() => {
                this.$refs.vs.scrollTo({ y: '100%' }, 1, 'easeInQuad')
              })
            }
          }
        )
      }
    },
    switchCall (e) {
      e.stopPropagation()
      switchCall(this.chat.callId).then(
        (response) => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            const workYn = response.data.result.workYn
            if (workYn !== 'Y') {
              alert('상담업무가 종료되었거나, 상담원 비근무일 입니다.')
            }
          }
        }
      )
    },
    closeModalPopupBefore (e) {
      e.stopPropagation()
    },
    closeModalPopup (e) {
      e.stopPropagation()
      // this.$store.commit('REM_CHAT', this.chat)
      this.$emit('closechat', this.chat)
    },
    calllist (e) {
      e.stopPropagation()
      this.$emit('opencust', this.call)
    }
  },
  created () {
    // console.log'ModalPopup = created....' + this.chat.callId)
  },
  mounted () {
    // console.log'ModalPopup = mounted....' + this.chat.callId)
    this.centerWindow()
    this.focusPopup()
    this.dragElement()
    this.getCallHistoryList()
  },
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/style/chatpopup.scss';
</style>
