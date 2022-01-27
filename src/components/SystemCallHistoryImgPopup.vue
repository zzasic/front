
<template>
  <!-- 1. 상담이력에서는[monitor] class 삭제해주세요.  -->
  <div
    ref="vue-window-modal"
    class="vue-window-modal monitor"
    :class="[`${counselor.callYn === 'Y' && counselor.callId === chat.callId ? 'on' : 'fail'}`, `${chat.systempopup === true ? 'systempopup': 'monitor'}`]"
    :style="{ width, height }"
    @click="focusPopup()">
    <div
      ref="vue-window-modal-header"
      class="vue-window-modal-header">
      <h2>시스템 대화이력</h2>
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
                <span class="label">지점코드</span>
              </v-col>
              <v-col class="col-td">
                {{ call.branchCd }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="col-th">
                <span class="label">지점명</span>
              </v-col>
              <v-col class="col-td">
                {{ call.branchNm }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="col-th">
                <span class="label">단말번호</span>
              </v-col>
              <v-col class="col-td">
                {{ call.deviceNo }}
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
                <v-btn v-if="counselor.callYn === 'Y'" @click="recordPlay" text class="default" color="btn-primary">{{ $t('button.record')}}</v-btn>
              </v-col>
            </v-row>
          </vuescroll>
        </div>
      </div>
      <div class="chat-wrap">
        <h3 class="col-title">대화이력</h3>
        <div class="custview-right">
          <table>
            <tr>
              <td>
              <v-checkbox
                class="chk-cusview"
                v-model="onlyImg"
                label="화면표시"
                color="#26B9D1"
                true-value="Y"
                false-value="N"
                :ripple="false"
              ></v-checkbox>
              </td>
              <td width="5px"></td>
              <td>
              <v-checkbox
                class="chk-cusview"
                v-model="onlyStt"
                label="고객이력"
                color="#26B9D1"
                true-value="Y"
                false-value="N"
                :ripple="false"
              ></v-checkbox>
              </td>
            </tr>
          </table>
        </div>
        <div class="col-wrap">
          <vuescroll ref='vs'>
            <div class="chat-discussion">
              <div v-for="(hist, idx) in systemCallHistories" :key="idx" class="chat-message" v-show="hist.moudule !== 'CHATBOT_OUT' || onlyStt === 'N'" :class="hist.moudule === 'CHATBOT_OUT' ? 'left' : 'right'">
              <table border = 0>
                <tr v-if="!isEmpty(hist.topScreenCode) && imgSuccess(hist, idx, systemCallHistories, 'top')">
                  <td>
                  <v-img v-if="onlyImg === 'Y'"
                    :max-height="getImgSize(hist.topScreenCode, 'S').height + 'px'"
                    :max-width="getImgSize(hist.topScreenCode, 'S').width + 'px'"
                    :src="getIconImage(hist.topScreenCode)"
                    @click="popupImg(hist.topScreenCode, hist.topScreenName)"
                  ></v-img>
                  </td>
                  </tr>
                <tr v-if="!isEmpty(hist.bottomScreenCode) && imgSuccess(hist, idx, systemCallHistories, 'bottom')">
                  <td>
                  <v-img v-if="onlyImg === 'Y'"
                    :max-height="getImgSize(hist.bottomScreenCode, 'S').height + 'px'"
                    :max-width="getImgSize(hist.bottomScreenCode, 'S').width + 'px'"
                    :src="getIconImage(hist.bottomScreenCode)"
                    @click="popupImg(hist.bottomScreenCode, hist.bottomScreenName)"
                  ></v-img>
                  </td>
                  </tr>
                  <tr>
                    <td :align="hist.moudule === 'CHATBOT_OUT' ? 'left' : 'right'">
                    <table border = 0>
                      <tr>
                        <td>
                        <div v-if="hist.moudule === 'CHATBOT_OUT'" class="profile">
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
                        <div v-if="hist.moudule !== 'STT'" class="message">
                          <div class="message-content" @click="goScenario(hist.contents)" v-html="replaceHtml(hist.contents)"></div>
                          <div class="message-date">
                            {{ $moment(hist.timestamp, 'x').zone('+09:00').format('YYYY-MM-DD HH:mm:ss') }}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                  </td>
                </tr>
              </table>
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
       <v-dialog
        v-model="dialog"
        :width="popupWidth"
        :height="popupHeight"
        hide-overlay
        scrollable
        >
      <PopupScreenImage @popupAction="popupAction" v-if="popup.imagePopup === true" :param="param"
      />
    </v-dialog>
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
import { getSystemCallHistoryList, getSystemCallAllHistoryList } from '@/api/counsel'
import PopupScreenImage from '@/views/shinhan/aiConcierge/PopupScreenImage'
// import { getPlayer } from '@/api/player'
import {
  getCmnCodeList
} from '../api/cmnCode'
export default {
  name: 'SystemCallHistoryPopup',
  components: {
    PopupScreenImage
  },
  data () {
    return {
      onlyStt: 'Y',
      onlyImg: 'Y',
      custInfo: {},
      systemCallHistories: [],
      systemCallAllHistories: [],
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
      isActive: false,
      recUrl: '',
      snIdList: [],
      serviceList: [],
      scnUrl: '',
      imgUrl: '',
      popup: {
        imagePopup: false
      },
      imgWidth: 0,
      imgHeight: 0,
      popupWidth: 0,
      popupHeight: 0,
      param: []
    }
  },
  computed: {
    dialog: function () {
      return (this.popup.imagePopup === true)
    },
    width: function () {
      if (this.sttHist.historyId) {
        return '1311px' // return '1311px'
      }
      return '846px' // return '846px'
    },
    mockWidth: function () {
      if (this.sttHist.historyId) {
        return '435px'
      }
      return '0px'
    },
    isScenarios: function () {
      return this.systemCallAllHistories.some((ih) => {
        return ih.moudule === 'CHATBOT_OUT' && ih.scenarioNm !== null && ih.scenarioNm !== ''
      })
    },
    scenarioNms: function () {
      return Object.values(this.systemCallAllHistories.filter((ih) => {
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
        for (const ih of this.systemCallAllHistories) {
          // STT
          if (befMoudule === 'CHATBOT_OUT' && ih.moudule === 'STT') {
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
    popupAction: function (type, obj) {
      this.popup[`${type}`] = !this.popup[`${type}`]
    },
    getImgSize: function (strVall, div) {
      const deviceKind = strVall.substring(0, 2)
      let imgW = 0
      let imgH = 0
      if (deviceKind === 'DD') {
        imgW = 1171
        imgH = 659
      } else if (deviceKind === 'AC') {
        imgW = 216
        imgH = 384
      } else if (deviceKind === 'CK') {
        imgW = 1280
        imgH = 1024
      } else if (deviceKind === 'SK') {
        imgW = 1280
        imgH = 1024
      } else {
        imgW = 1280
        imgH = 1024
      }
      if (div === 'S') {
        const obj = { width: (imgW * 0.25), height: (imgH * 0.25) }
        // console.log(' div ' + div + ' obj ' + JSON.stringify(obj))
        return obj
      } else {
        const obj = { width: imgW * 0.8, height: imgH * 0.8 }
        return obj
      }
    },
    popupImg: function (screeIdStr, screenNmStr) {
      // const deviceKind = screeIdStr.substring(0, 2)
      const obj = this.getImgSize(screeIdStr)

      this.param = { screenId: screeIdStr, screenName: screenNmStr, imgUrl: this.imgUrl, imgWidth: obj.width, imgHeight: obj.height }
      this.popupWidth = obj.width * 0.8
      this.popupHeight = obj.height * 0.8
      this.popup.imagePopup = true
    },
    popupImgaa: function (screeIdStr, screenNmStr) {
      const obj = this.getImgSize(screeIdStr)
      const opt = 'width=' + obj.width + ', height=' + obj.height + ', left=250, top=300, location=no' // 1280 * 1024
      window.open(require('@/assets/image/' + screeIdStr + '.png'), '_blank', opt)
    },
    getIconImage: function (str) {
      return this.imgUrl + str + '.png'
      // return require('@/assets/image/' + str + '.png')
    },
    // 공통코드유형 정보 조회
    async getCmnCodeList () {
      // param setting
      let searchCondition = {
        codeType: 'SCN_ID',
        useYn: 'Y'
      }
      const result = await getCmnCodeList(searchCondition)
      const list = result.data.result.cmnCodeList ? result.data.result.cmnCodeList : []
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          this.snIdList.push(list[i].codeValue)
        }
      }
      // this.snIdList.push('신용정보')
      // console.log(' snIdList ' + JSON.stringify(this.snIdList))
      searchCondition = {
        codeType: 'SCN_URL',
        useYn: 'Y'
      }
      const resultURL = await getCmnCodeList(searchCondition)
      this.scnUrl = resultURL.data.result.cmnCodeList ? resultURL.data.result.cmnCodeList[0].codeValue : ''
      // console.log(' this.scnUrl ' + this.scnUrl)
      searchCondition = {
        codeType: 'IMG_URL',
        useYn: 'Y'
      }
      const resultImgURL = await getCmnCodeList(searchCondition)
      this.imgUrl = resultImgURL.data.result.cmnCodeList ? resultImgURL.data.result.cmnCodeList[0].codeValue : ''
      console.log(' this.imgUrl1 ' + this.imgUrl)
    },
    goScenario (str) {
      const tmpStr = !this.isEmpty(str) && str.length > 3 ? str.substring(0, 3) : str
      // if (this.snIdList.includes(str)) {
      if (tmpStr === 'SCN' || tmpStr === 'QNA') {
        /*
        this.scnUrl = this.scnUrl + '/#/' + this.call.callId.split('-')[1] + '/11002/dlg/dlg-mdl'
        this.scnUrl = this.scnUrl + '?operators=AND,AND,AND&columns=IMPORTANT,IMPORTANT,IMPORTANT&types=PART,PART,PART&keywords=' + (str + ',' + str + ',' + str)
        window.open(this.scnUrl, '_blank')
        */
        const form = document.createElement('form')
        form.setAttribute('target', '_blank')
        form.setAttribute('method', 'POST')
        form.setAttribute('action', this.scnUrl)

        let hiddenField = document.createElement('input')
        hiddenField.setAttribute('type', 'hidden')
        hiddenField.setAttribute('name', 'relationId')
        hiddenField.setAttribute('value', `${sessionStorage.relationId}`)
        form.appendChild(hiddenField)
        hiddenField = document.createElement('input')
        hiddenField.setAttribute('type', 'hidden')
        hiddenField.setAttribute('name', 'repoId')
        hiddenField.setAttribute('value', this.call.callId.split('-')[1])
        form.appendChild(hiddenField)
        hiddenField = document.createElement('input')
        hiddenField.setAttribute('type', 'hidden')
        hiddenField.setAttribute('name', 'keywords')
        hiddenField.setAttribute('value', str)
        form.appendChild(hiddenField)
        document.body.appendChild(form)
        console.log(form)
        form.submit()
        document.body.removeChild(form)
      }
    },
    replaceHtml (str) {
      if (str) {
        return str.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, '').replace(/(\r)*\n/g, '<br>')
      } else {
        return '<br>' // str
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
    imgSuccess (obj, idx, list, div) {
      let isSuccsss = false
      if (div === 'top') {
        if (idx === 0) {
          if (this.isEmpty(list[idx].topScreenCode)) {
            isSuccsss = false
          } else {
            isSuccsss = true
          }
        } else {
          if (list[idx - 1].topScreenCode !== obj.topScreenCode) {
            if (this.isEmpty(list[idx].topScreenCode)) {
              isSuccsss = false
            } else {
              isSuccsss = true
            }
          }
        }
      } else {
        if (idx === 0) {
          if (this.isEmpty(list[idx].bottomScreenCode)) {
            isSuccsss = false
          } else {
            isSuccsss = true
          }
        } else {
          if (list[idx - 1].bottomScreenCode !== obj.bottomScreenCode) {
            if (this.isEmpty(list[idx].bottomScreenCode)) {
              isSuccsss = false
            } else {
              isSuccsss = true
            }
          }
        }
      }
      return isSuccsss
    },
    isEmpty: function (x) {
      return (x === null || x === undefined || x === '')
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
        ctx.style.left = (pageWidth / 2) - (elemWidth / 2) + diff + 'px'
        ctx.style.top = (pageHeight / 2) - (elemHeight / 2) + diff + 'px'
      }
    },
    getSystemCallHistoryList () {
      getSystemCallHistoryList(this.chat.callId).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            this.call = response.data.result.systemCall
            this.systemCallHistories = response.data.result.systemCallHistoryList
            // console.log(' this.systemCallHistories ' + JSON.stringify(this.systemCallHistories))
            /*
            if (this.systemCallHistories.length > 0) {
              this.systemCallHistories[0].topScreenCode = '0001'
              this.systemCallHistories[1].topScreenCode = '0001'
              this.systemCallHistories[2].topScreenCode = '0001'
              this.systemCallHistories[3].topScreenCode = '0001'
              this.systemCallHistories[4].topScreenCode = '0015'
              this.systemCallHistories[5].topScreenCode = '1060'
              this.systemCallHistories[6].topScreenCode = '0001'
              this.systemCallHistories[0].topScreenName = '화면명입니다.'
              this.systemCallHistories[0].bottomScreenCode = '0015'
              this.systemCallHistories[1].bottomScreenCode = '1060'
              this.systemCallHistories[2].bottomScreenCode = '0001'
              this.systemCallHistories[3].bottomScreenCode = '0015'
              this.systemCallHistories[4].bottomScreenCode = ''
              this.systemCallHistories[5].bottomScreenCode = '1060'
              this.systemCallHistories[6].bottomScreenCode = '0001'
            }
            */
            // console.log(' ==== ' + JSON.stringify(this.systemCallHistories))
            this.recUrl = this.call.recUrl
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
    getSystemCallAllHistoryList () {
      getSystemCallAllHistoryList(this.chat.callId).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            // this.call = response.data.result.call
            this.systemCallAllHistories = response.data.result.systemCallAllHistoryList
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
    /*
    getPlayer () {
      const searchCondition = {
        trnsNo: ''
      }
      getPlayer(searchCondition).then(
        response => {
          const status = response.data.status
          if (status === 200) {
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
    */
    sttClick (hist) {
      if (hist.moudule === 'CHATBOT_IN') {
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
    recordPlay () {
      // window.open(process.env.VUE_APP_PLAYER_URL + '/recseePlayer?SEQNO=')
      window.open(this.recUrl + '/recseePlayer?SEQNO=' + this.call.callId, '_blank', 'width=850, height=400, left=250, top=300, location=no')
      // location.href = process.env.VUE_APP_PLAYER_URL + '/recseePlayer?SEQNO='
      // this.getPlayer()
      // console.log(process.env.VUE_APP_PLAYER_URL + ' ==counselor=== ' + JSON.stringify(this.counselor))
      // alert('준비중')
    }
  },
  destroyed () {
    window.removeEventListener('keydown', (e) => {
    })
  },
  created () {
  },
  mounted () {
    const $vm = this
    document.body.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        // console.log($vm.chat.visible + ' 111 ' + $vm.popup.imagePopup)
        if ($vm.popup.imagePopup) {
          // alert(' 222 ' + $vm.popup.imagePopup)
          // $vm.popup.imagePopup = false
          const type = 'imagePopup'
          this.popup[`${type}`] = !this.popup[`${type}`]
          // alert(' 333 ' + $vm.popup.imagePopup)
        } else {
          // $vm.chat.visible = false
          this.closeModalPopup(e)
          // console.log(JSON.stringify($vm.chat))
        }
      }
    })
    // this.chat.visible = false
    this.getCmnCodeList()
    this.centerWindow()
    this.focusPopup()
    this.dragElement()
    // this.dragElement()
    this.getSystemCallHistoryList()
    this.getSystemCallAllHistoryList()
    this.$emit('resizePopup', { width: this.width, height: this.height })
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
.vue-window-modal.monitor.fail {
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
.mock-result__history {
  width:280px;
  p {
    word-break: break-word;
  }
}
.message-content{
  word-break: break-word;
}
</style>
