
<template>
  <!-- 1. 상담이력에서는[monitor] class 삭제해주세요.  -->
  <div
    ref="vue-window-modal"
    class="vue-window-modal"
    :class="[`${counselor.callYn === 'Y' && counselor.callId === chat.callId ? 'on' : 'fail'}`, `${chat.systempopup === true ? 'systempopup': 'monitor'}`]"
    :style="{ width, height }"
    @click="focusPopup()">
    <div
      ref="vue-window-modal-header"
      class="vue-window-modal-header">
      <h2>인바운드 대화이력</h2>
      <button class="close" @mousedown="closeModalPopupBefore($event)" @mouseup="closeModalPopupBefore($event)" @click="closeModalPopup($event)"></button>
    </div>
    <div
      ref="vue-window-modal-body"
      class="vue-window-modal-body"
      :class="sttHist && sttHist.historyId ? 'mock-result-view' : ''"
      >
      <div class="cust-result ml-0" :style="{ width: '392px' }">
        <h3 class="col-title">기본정보</h3>
        <div class="col-wrap">
          <vuescroll>
            <v-row>
              <v-col cols="3" class="col-th">
                <span class="label">CALL ID</span>
              </v-col>
              <v-col class="col-td">
                {{ call.callId }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="col-th">
                <span class="label">고객전화번호</span>
              </v-col>
              <v-col class="col-td">
                {{ call.custNum ? call.custNum.replace(/-/g, '').replace(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/, '$1****$3') : '' }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="col-th">
                <span class="label">상담일시</span>
              </v-col>
              <v-col class="col-td">
                {{ $moment(call.startDt).zone('+09:00').format('YYYY-MM-DD HH:mm') }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="col-th">
                <span class="label">통화시간</span>
              </v-col>
              <v-col class="col-td cust-result__record">
                <span class="cust-result__record-time">{{ call.timeDiff }}</span>
                <v-btn @click="record" text class="default" color="btn-primary">{{ $t('button.record')}}</v-btn>
              </v-col>
            </v-row>
            <v-row v-if="isScenarios">
              <v-col cols="3" class="col-th">
                <span class="label">시나리오</span>
              </v-col>
              <v-col class="col-td">
                <v-row v-for="(scn, idx) in scenarioNms" :key="idx">
                  <v-col class="pa-0">{{ scn }}</v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-if="isScenarios">
              <v-col cols="3" class="col-th">
                <span class="label">최종 대화단계</span>
              </v-col>
              <v-col class="col-td">
                {{ call.nodeNm}}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="col-th">
                <span class="label">이상감지</span>
              </v-col>
              <v-col class="col-td">
                {{ call.abnormalCount}} 건
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="col-th">
                <span class="label">호전환</span>
              </v-col>
              <v-col class="col-td">
                {{ call.isTransfer > 0 ? 'Y' : 'N' }}
              </v-col>
            </v-row>
          </vuescroll>
        </div>
      </div>
      <div class="chat-wrap">
        <h3 class="col-title">대화이력</h3>
        <div class="custview-right">
          <v-checkbox
            class="chk-cusview"
            v-model="onlyStt"
            label="고객이력"
            color="#26B9D1"
            true-value="Y"
            false-value="N"
            :ripple="false"
          ></v-checkbox>
        </div>
        <div class="col-wrap">
          <vuescroll ref='vs'>
            <div class="chat-discussion">
              <div v-for="(hist, idx) in callHistories" :key="idx" class="chat-message" v-show="hist.moudule !== 'TTS' || onlyStt === 'N'" :class="hist.moudule === 'TTS' ? 'left' : 'right'">
                <div v-if="hist.moudule === 'TTS'" class="profile">
                  <div class="bg-circle">
                    <i class="icon icon-lg-chatbot-fill"></i>
                  </div>
                  <span>
                    AI상담원
                  </span>
                </div>
                <div v-else class="profile"
                  @click="sttClick(hist)"
                  :class="sttHist && sttHist.historyId && sttHist.historyId === hist.historyId ? 'active' : 'inActive'">
                  <div class="bg-circle">
                    <i class="icon icon-lg-ic_my_28_s_900"></i>
                  </div>
                  <span>
                    고객
                  </span>
                </div>
                <div class="message">
                  <div class="message-content" v-html="replaceHtml(hist.contents)"></div>
                  <div class="message-date">
                    {{ $moment(hist.timestamp, 'x').zone('+09:00').format('HH:mm:ss') }}
                  </div>
                </div>
              </div>
            </div>
          </vuescroll>
        </div>
      </div>
      <div v-if="sttHist && sttHist.historyId" class="mock-result" :style="{ width: mockWidth }">
        <h3 class="col-title">상세내역</h3>
        <div class="col-wrap">
          <vuescroll>
            <v-row class="mock-result__item" v-for="(hist, idx) in sttHistories" :key="hist.historyId" :class="{ 'first': idx === 0 }">
              <v-col class="mock-result__left">
                <i class="mock-result__point"></i>
                <div class="mock-result__title">{{ hist.moudule === 'CHATBOT_IN' ? 'FILTER' : hist.moudule === 'CHATBOT_OUT' ? 'CHATBOT' : hist.moudule }}</div>
                <div class="mock-result__time">{{ $moment(hist.timestamp, 'x').zone('+09:00').format('HH:mm:ss.SSS') }}</div>
              </v-col>
              <v-col class="mock-result__right">
                <ul class="mock-result__scenario" v-if="hist.moudule === 'CHATBOT_OUT' ">
                  <li>시나리오 : {{ hist.scenarioNm }}</li>
                  <li>진행단계 : {{ hist.nodeNm }}</li>
                </ul>
                <div class="mock-result__history">
                  <p v-html="replaceHtml(hist.contents)"></p>
                </div>
              </v-col>
            </v-row>
          </vuescroll>
        </div>
      </div>
    </div>
    <div
      class="vue-window-modal-btn">
      <v-btn
        class="btn-reset"
        :ripple="false"
        @click="closeModalPopup($event)">
        닫기
      </v-btn>
    </div>
  </div>
</template>

<script>
import { getCallHistoryList, getCallAllHistoryList } from '@/api/counsel'

export default {
  name: 'InboundHistoryPopup',
  data () {
    return {
      onlyStt: 'N',
      custInfo: {},
      callHistories: [],
      callAllHistories: [],
      call: {},
      chatSub: null,
      height: '600px',
      isdown: false,
      pos1: 0,
      pos2: 0,
      pos3: 0,
      pos4: 0,
      scrollTop1: '',
      scrollTop2: '',
      scrollLeft1: '',
      scrollLeft2: '',
      sttHist: {},
      isActive: false
    }
  },
  computed: {
    width: function () {
      if (this.sttHist.historyId) {
        return '1311px'
      }
      return '846px'
    },
    mockWidth: function () {
      if (this.sttHist.historyId) {
        return '435px'
      }
      return '0px'
    },
    isScenarios: function () {
      return this.callAllHistories.some((ih) => {
        return ih.moudule === 'CHATBOT_OUT' && ih.scenarioNm !== null && ih.scenarioNm !== ''
      })
    },
    scenarioNms: function () {
      return Object.values(this.callAllHistories.filter((ih) => {
        return ih.moudule === 'CHATBOT_OUT' && ih.scenarioNm !== null && ih.scenarioNm !== '' && ih.monitoringYn === 'Y'
      }).map((ih) => ih.scenarioNm).reduce((prev, curr) => {
        if (!prev[curr]) {
          prev[curr] = curr
        }
        return prev
      }, {}))
    },
    sttHistories: function () {
      const list = []
      if (this.sttHist.historyId) {
        let befMoudule = 'STT'
        let isFirst = true
        for (const ih of this.callAllHistories) {
          // STT
          if (befMoudule === 'TTS' && ih.moudule === 'STT') {
            if (list.some(lh => lh.historyId === this.sttHist.historyId)) {
              break
            }
            if (isFirst) {
              isFirst = false
            } else {
              list.splice(0)
            }
          }
          befMoudule = ih.moudule
          list.push(ih)
        }
      }
      return list
    }
  },
  props: {
    // active: Boolean,
    chat: Object,
    counselor: Object
  },
  watch: {
    width: function () {
      this.$emit('resizePopup', { width: this.width, height: this.height })
    }
  },
  updated () {
    // console.log('ModalPopup = updated....' + this.chat.callId)
  },
  methods: {
    replaceHtml (str) {
      if (str) {
        return str.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, '').replace(/(\r)*\n/g, '<br>')
      } else {
        return str
      }
    },
    dragElement () {
      const context = this
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      const _window = this.$refs['vue-window-modal']
      const _windowHeader = this.$refs['vue-window-modal-header']
      _windowHeader.onmousedown = dragMouseDown
      function dragMouseDown (e) {
        e = e || window.event
        context.focusPopup()
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
        // set the element's new position:
        if (_window.offsetTop < (window.innerHeight - 35)) {
          _window.style.top = (_window.offsetTop - pos2) + 'px'
        } else {
          context.centerWindow()
        }
        if (_window.offsetLeft < (window.innerWidth - 35)) {
          _window.style.left = (_window.offsetLeft - pos1) + 'px'
        } else {
          context.centerWindow()
        }
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
      this.$refs['vue-window-modal'].style.zIndex = popups.map(el => Number(el.style.zIndex)).reduce((z1, z2) => Math.max(z1, z2), 9998) + 1
    },
    centerWindow () {
      if (!this.chat.systempopup) {
        const popups = Array.from(document.getElementsByClassName('vue-window-modal'))
        const diff = popups.length * 15
        const pageWidth = window.innerWidth
        const pageHeight = window.innerHeight
        const elemWidth = Number(this.width.replace(/px$/, ''))
        const elemHeight = Number(this.height.replace(/px$/, ''))
        // console.logpageWidth, pageHeight, elemWidth, elemHeight)
        const ctx = this.$refs['vue-window-modal']
        // console.log((pageWidth / 2) - (elemWidth / 2) + diff + 'px', (pageHeight / 2) - (elemHeight / 2) + diff + 'px')
        ctx.style.left = (pageWidth / 2) - (elemWidth / 2) + diff + 'px'
        ctx.style.top = (pageHeight / 2) - (elemHeight / 2) + diff + 'px'
      }
    },
    getCallHistoryList () {
      getCallHistoryList(this.chat.callId).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            this.call = response.data.result.call
            this.callHistories = response.data.result.callHistoryList
            this.recordUrl = response.data.result.recordUrl
          }
        },
        error => {
          console.error(error)
          const status = error.data.status
          if (status === 403) {
            this.$router.push({ name: '403', query: { t: new Date().getTime() } })
          } else {
            delete sessionStorage.accessToken
            this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
          }
        }
      )
    },
    getCallAllHistoryList () {
      getCallAllHistoryList(this.chat.callId).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            // this.call = response.data.result.call
            this.callAllHistories = response.data.result.callAllHistoryList
          }
        },
        error => {
          console.error(error)
          const status = error.data.status
          if (status === 403) {
            this.$router.push({ name: '403', query: { t: new Date().getTime() } })
          } else {
            delete sessionStorage.accessToken
            this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
          }
        }
      )
    },
    sttClick (hist) {
      if (hist.moudule === 'STT') {
        if (hist.historyId === this.sttHist.historyId) {
          this.sttHist = {}
        } else {
          this.sttHist = hist
        }
      }
    },
    closeModalPopupBefore (e) {
      e.stopPropagation()
    },
    closeModalPopup (e) {
      e.stopPropagation()
      this.$emit('clickClose', this.chat)
    },
    record () {
      window.open(`${this.recordUrl}`, `popup_${this.chat.callId}`, 'top=10, left=10, width=600, height=500, status=no, menubar=no, toolbar=no, resizable=no')
    }
  },
  created () {
  },
  mounted () {
    this.centerWindow()
    this.focusPopup()
    this.dragElement()
    // this.dragElement()
    this.getCallHistoryList()
    this.getCallAllHistoryList()
    this.$emit('resizePopup', { width: this.width, height: this.height })
  },
  destroyed () {
  }
}
</script>

<style lang="scss">
.vue-window-modal {
  position: fixed;
  background-color: #f7f7f7;
  box-shadow: 7px 7px 50px 5px rgba(0,0,0,0.13);
  border-radius: 3px;
  display: block;
  max-height: 90vh;
  // max-width: 90vw;
  border-width: 1px;
  border-color: #FE7A7A;
  background: #FFFFFF;
  /* Elevation / Depth 2 */
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.17), 0px 4px 5px rgba(0, 0, 0, 0.11);
  border-radius: 3px;
  &.systempopup {
    max-height: 100vh;
    .vue-window-modal-body {
      height: calc(100% - 106px);
    }
    .vue-window-modal-btn {
      display: block;
    }
  }
  &.monitor {
    max-height: 90vh;
    .vue-window-modal-body {
      height: calc(100% - 106px);
    }
    .vue-window-modal-btn {
      display: block;
    }
  }
  &.on {
    .vue-window-modal-header {
      background: linear-gradient(90deg, #ffe9a9 0%, #FE7A7A 100%), linear-gradient(90deg, #ffe9a9 0%, #FE7A7A 100%);
    }
    .vue-window-modal-body,
    .vue-window-modal-body .chat-wrap .__vuescroll,
    .vue-window-modal-btn {
      border-color: #ffe9a9;
    }
  }
  &.wating {
    .vue-window-modal-header {
      background: linear-gradient(90deg, #c6f3fb 0%, #4dc9dc 100%), linear-gradient(90deg, #c6f3fb 0%, #4dc9dc 100%);
    }
    .vue-window-modal-body,
    .vue-window-modal-body .chat-wrap .__vuescroll,
    .vue-window-modal-btn {
      border-color: #c6f3fb;
    }
  }
  &.connecting {
    .vue-window-modal-header {
      background: linear-gradient(90deg, #e9cbff 0%, #FFBF6B 100%), linear-gradient(90deg, #e9cbff 0%, #FFBF6B 100%);
    }
    .vue-window-modal-body,
    .vue-window-modal-body .chat-wrap .__vuescroll,
    .vue-window-modal-btn {
      border-color: #e9cbff;
    }
  }
  &.fail {
    .vue-window-modal-header {
      background: linear-gradient(90deg, #e5ffbb 0%, #58c1b8 100%), linear-gradient(90deg, #e5ffbb 0%, #58c1b8 100%);
    }
    .vue-window-modal-body,
    .vue-window-modal-body .chat-wrap .__vuescroll,
    .vue-window-modal-btn {
      //border-color: #e5ffbb;
      border-color: #dedede;
    }

  }
  .vue-window-modal-header {
    padding: 5px;
    padding-left: 8px;
    padding-right: 8px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: white;
    height: 40px;
    font-size: 16px;
    cursor: -webkit-grab;
    user-select: none;
    font-weight: bold;
    h2 {
      display: inline-block;
      position: relative;
      top: 0;
      padding: 3px 0;
      font-size: 16px !important;
      color: #333;
      max-width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    button {
      &.close {
        margin: 0 7px;
        float: right;
        cursor: pointer;
        position: relative;
        top: 0px;
        &::after {
          content: '';
          background-image: url('~@/assets/image/ic_close_white.png');
          background-repeat: no-repeat;
          display: inline-block;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .vue-window-modal-body {
    display: inline-flex;
    height: calc(100% - 35px);
    overflow: hidden;
    padding: 15px 20px 15px 15px;
    border: 1px solid #808080;
    .chat-wrap {
      height: 100%;
      margin-left: 30px;
      padding-right: 23px;
      .chat-discussion {
        width: 364px !important;
        .chat-message.right .profile {
          cursor: pointer;
          &.active {
            .bg-circle {
              background: #12a6be;
              border-radius: 18px 18px 1px 19px;
              transform: rotate(-45deg);
              > .icon {
                transform: rotate(45deg);
              }
            }
          }
        }
      }
    }
    .__vuescroll.hasVBar {
      > .__panel > .__view > .chat-discussion {
        width: 370px !important;
      }
      .__rail-is-vertical {
        right: 0 !important;
      }
    }
  }
  .cust-result {
    max-width: 50%;
    .row {
      .col-th {
        display: inline-block;
        width: 120px;
        min-width: 80px;
        max-width: 120px;
        border-bottom: 1px solid #BEC9D4;
        border-right: 1px solid #BEC9D4;
        border-left: 1px solid #BEC9D4;
        padding: 12px 0;
        text-align: center;
        background: #E9EFF5;
        .label {
          font-size: 13px;
        }
      }
      .col-td {
        border-right: 1px solid #BEC9D4;
        border-bottom: 1px solid #BEC9D4;
        padding: 12px 0 12px 12px;
      }
      &:first-child {
        .col-th, .col-td {
          border-top: 1px solid #BEC9D4;
        }
      }
    }
    &__record {
      padding-top: 8px !important;
      padding-bottom: 9px !important;
      padding-right: 12px !important;
      &-time {
        line-height: 28px;
      }
      .v-btn {
        float: right;
        width: auto;
        height: 28px;
        border: 1px solid #BEC9D4;
        box-sizing: border-box;
        padding: 0;
        border-radius: 3px;
        background-color: #fff !important;
        .v-btn__content {
          font-weight: normal;
          font-size: 11px;
          line-height: 17px;
          letter-spacing: 0.05px;
          color: #56606B;
          margin: 0 12px;
        }
      }
    }
  }
  .mock-result-view {
    .cust-result {
      height: 100%;
      padding: 0 !important;
      border: 0 solid #DAE3ED;
      border-radius: 3px;
      background: #ffffff;
      margin-bottom: 1px;
      margin-left: 1px;
      .__vuescroll.hasVBar {
        .__rail-is-vertical {
        }
      }
    }
    .chat-wrap {
      > .__vuescroll {
        margin-right: 10px;
        border-right: 1px solid #ddd;
        .__rail-is-vertical {
          right: 4px !important;
        }
      }
    }
    .mock-result {
      position: relative;
      overflow: hidden;
      height: 100%;
      margin-left: 30px;
      padding-right: 23px;
      background: #ffffff;
      .__vuescroll.hasVBar {
        .__rail-is-vertical {
          right: 0 !important;
        }
      }
      &:before {
        content: '';
        position: absolute;
        left: 82px;
        top: 38px;
        width: 2px;
        height: 100%;
        background-color: #FFBF6B;
      }
      &__item {
        margin-top: 20px !important;
        border-radius: 5px;
        &.first {
          margin-top: 0 !important;
        }
      }
      &__left {
        position: relative;
        flex: 0 0 auto;
        width: 90px;
        padding: 0;
        text-align: right;
      }
      &__point {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #FFBF6B;
      }
      &__title {
        position: absolute;
        right: 21px;
        top: -1px;
        font-size: 13px;
        font-weight: 500;
      }
      &__time {
        position: absolute;
        right: 20px;
        top: 15px;
        font-size: 11px;
        font-weight: 300;
        letter-spacing: 0.3px;
        color: #56606B;
        opacity: 0.8;
      }
      &__right {
        position: relative;
        margin-left: 14px;
        padding: 10px;
        border-radius: 5px;
        background-color: #e9eff5;
        &:before {
          content: '';
          position: absolute;
          left: -13px;
          top: 5px;
          border: 5px solid transparent;
          border-right: 8px solid #e9eff5;
        }
      }
      &__scenario {
        margin-bottom: 10px;
        padding: 0 !important;
        font-size: 13px;
        font-weight: 500;
        li {
          position: relative;
          padding-left: 7px;
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 9px;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background-color: #333;
          }
        }
      }
      &__history {
        p {
          margin: 0;
        }
      }
    }
  }
  .vue-window-modal-btn {
    display: none;
    padding: 15px;
    text-align: right;
    border: 1px solid #808080;
    border-top: 0;
    button {
      padding: 0 16px;
      font-size: 12px;
      color: #2C3238;
      margin-left: 6px;
      height: 28px;
      text-align: center;
      border-radius: 3px;
      box-sizing: border-box;
      box-shadow: none;
      border: 1px solid #DAE3ED;
      background-color: #ffffff !important;
      &:first-child {
        margin-left: 0;
      }
      &.button-default {
        color: #ffffff;
        background-color: #424952 !important;
      }
    }
  }
  .col-title {
    height: 34px;
    font-size: 15px;
  }
  .col-wrap {
    height: calc(100% - 34px);
  }
}
.vue-window-modal.monitor.on,
.vue-window-modal.monitor.fail,
.vue-window-modal.systempopup.on,
.vue-window-modal.systempopup.fail {
  max-width: none;
}
/* IE10+ hack */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .vue-window-modal-header {
    h2 {
      font-weight: 300;
    }
  }
  .vue-window-modal-body {
    .__vuescroll.hasVBar {
      .__panel > .__view > div,
      .__panel > .__view > .row {
        width: calc(100% - 30px) !important;
      }
    }
  }
}
.col-title {
  display: inline-block;
}
.custview-right {
  position: relative;
  left: 10px;
  top: 0px;
  display: inline-block;
  float: right;
}
.v-input--selection-controls {
  margin-right: 0px !important;
  margin-top: 0px !important;
}
.chk-cusview {
  .v-input--selection-controls__input {
    margin-right: 4px !important;
    width: 15px;
    height: 14px;
  }
  label {
    text-transform: capitalize;
    font-size: 14px !important;
    color: #2C3238;
    letter-spacing: 0;
  }
}
</style>
