<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenant"
              :items="cptdItemsTenantList"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenant ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <!--
          <v-col cols="2">
            <v-text-field
              class="default search"
              v-model="searchForm.branchNm"
              label="지점명"
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          -->
          <v-col cols="2">
            <v-text-field
              class="default search"
              v-model="searchForm.branchNm"
              label="지점명"
              placeholder=" "
              hide-details
              clearable
              readonly
              @click="searhPopup"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default search"
              v-model="searchForm.deviceNo"
              label="단말번호"
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.deviceKind"
              :items="cptdDeviceKindList"
               item-key="codeId"
              item-text="codeValue"
              item-value="codeId"
              :label="'단말종류'"
              :placeholder="searchForm.deviceKind ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.commYn"
              :items="cptdCommYnList"
              label="상담완료여부"
              :placeholder="searchForm.commYn ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-menu
              content-class="date-picker"
              ref="pickerMenu"
              v-model="pickerMenu"
              :return-value.sync="searchForm.dates"
              :close-on-content-click="false"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="default text-field-date pr-0"
                  v-model='dateRangeText'
                  label="검색기간"
                  placeholder="YYYY.MM.DD - YYYY.MM.DD"
                  v-on="on"
                  readonly
                  clearable
                  @click="clickPicker"
                >
                </v-text-field>
              </template>
              <div @click="clickPicker">
                <v-date-picker
                  v-model="searchForm.dates"
                  range
                  no-title
                  scrollable
                  :event-color="
                    date =>
                      date == searchForm.dates[0]
                        ? ['startDate']
                        : date == searchForm.dates[1]
                        ? ['endDate']
                        : ''
                  "
                  :events="searchForm.dates"
                  :date-format="date => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(searchForm.dates)">{{ $t('button.confirm')}}</v-btn>
                </v-date-picker>
              </div>
            </v-menu>
          </v-col>
          <v-col class="text-right">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-search"
              :ripple="false"
              @click="searchBtn"
            >{{ $t('button.search')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <PageSectionTitle
        :title="pagination.sectionTitle"
        :totalRows="pagination.totalRows"
        :subtitle="pagination.sectionSubTitle"
      >
      </PageSectionTitle>
      <v-card class="data-grid-wrap default clickable">
        <v-data-table
          :single-select="true"
          :headers="headers"
          :items="aiConciergeHistoryList"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          show-select
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr @click="detailRow(props.item), selected = props.item.callId">
              <td class="text-center"><input type="checkbox" name="view" :checked="totChkList.includes(props.item.callId) ? true : false" disabled></td>
              <td class="text-center">{{ props.item.tenantNm }}</td>
              <td class="text-center">{{ props.item.branchCd }}</td>
              <td class="text-center">{{ props.item.branchNm }}</td>
              <td class="text-center">{{ props.item.deviceNo }}</td>
              <td class="text-center">{{ props.item.deviceKind }}</td>
              <td class="text-center">{{ props.item.startDt ? $moment(props.item.startDt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('MM-DD HH:mm:ss') : '' }}</td>
              <td class="text-center">{{ props.item.timeDiff }}</td>
              <td class="text-center"><v-btn @click="detailRow(props.item)" text class="default" color="btn-secondary" >{{ $t('button.detail')}}</v-btn></td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          @change="searchBtn"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="fnc_getAiConciergeHistoryList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        :max-width="600"
        hide-overlay
        scrollable v-if="popup.branchPopup === true"
        >
      <PopupSearchBanch
      @popupAction="popupAction"
      />
    </v-dialog>
      <div class="btn-group align-right">
        <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div>
    </vuescroll>
    <div v-for="chat in chats" :key="chat.chatId">
      <ai-concierge-detail-popup v-if="chat.visible === true" :chat="chat" :counselor="chat.counselor" @clickClose="chat.visible = false" />
    </div>
  </div>
</template>

<script>
import AiConciergeDetailPopup from '@/views/shinhan/aiConcierge/AiConciergeDetailPopup'
import PopupSearchBanch from '@/views/counsel/PopupSearchBanch'

import {
  getAiConciergeSearchCondition,
  getAiConciergeHistoryList,
  reqAiConciergeHistoryExcelDown
} from '../../../api/shinhan/aiConcierge'
import {
  getCmnCodeList
} from '../../../api/cmnCode'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'ListAiConciergeView',
  components: {
    AiConciergeDetailPopup,
    PopupSearchBanch
  },
  mixins: [datepicker],
  created () {
    this.totChkList = sessionStorage.getItem('airead').split(',')
  },
  mounted () {
    this.initAiConciergeView()
    this.fnc_getAiConciergeHistoryList()
  },
  data () {
    return {
      testValue: '',
      headers: [
        { text: '테넌트', value: 'tenantNm', align: 'center', class: 'text-center', width: '120px' },
        { text: '지점코드', value: 'branchCd', align: 'center', class: 'text-center', width: '120px' },
        { text: '지점명', value: 'branchNm', align: 'center', width: '250px' },
        { text: '단말번호', value: 'deviceNo', align: 'center', class: 'text-center', width: '120px' },
        { text: '단말종류', value: 'deviceKind', align: 'center', class: 'text-center', width: '120px' },
        { text: '통화시작일시', value: 'startDt', align: 'center', class: 'text-center', width: '120px' },
        { text: '통화시간', value: 'timeDiff', align: 'center', class: 'text-center', width: '90px' },
        { text: '대화이력', value: 'buttonhere', align: 'center', class: 'text-center', width: '80px', sortable: false }
      ],
      aiConciergeHistoryList: [],
      deviceKindList: [],
      pagination: {
        page: 1, // 현재페이지
        length: 1, // 페이징숫자 갯수
        itemsPerPage: 10, // table row view 갯수
        itemsPerPages: [10, 20, 30], // 왼쪽하단 selectbox
        totalRows: 0,
        sectionTitle: this.$t('label.totalCnt'),
        sectionSubTitle: '',
        loading: false
      },
      options: null,
      commYns: [
        {
          text: '상담완료',
          value: 'Y'
        },
        {
          text: '상담중',
          value: 'N'
        }
      ],
      searchForm: {
        itemsTenantList: [],
        tenant: '',
        branchNm: '',
        codeIdArr: [],
        commYn: '',
        dates: [this.$moment().add(-1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
        deviceNo: '',
        deviceKind: ''
      },
      chats: [],
      chkList: [],
      totChkList: [],
      popup: {
        branchPopup: false
      }
    }
  },

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsTenantList () {
      const tenantList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      tenantList.push(...this.searchForm.itemsTenantList)
      return tenantList
    },
    cptdDeviceKindList () {
      const deviceKindList = [
        {
          codeValue: this.$t('label.all'),
          codeId: ''
        }
      ]
      deviceKindList.push(...this.deviceKindList)
      return deviceKindList
    },
    cptdCommYnList () {
      const commYnList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      commYnList.push(...this.commYns)
      return commYnList
    },
    dateRangeText: {
      get: function () {
        const dateRange = this.searchForm.dates
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
        return dateRange.join(' ~ ')
      },
      set: function (value) {
        if (!value) {
          this.searchForm.dates = []
        }
      }
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.fnc_getAiConciergeHistoryList()
        }
      }
    }
  },

  watch: {
  },

  methods: {
    async initAiConciergeView () {
      this.getCmnCodeList()
      await this.fnc_getAiConciergeSearchCondition()
      this.fnc_getAiConciergeHistoryList()
    },
    fnc_getAiConciergeSearchCondition: function () {
      getAiConciergeSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
          // this.searchForm.tenant = this.searchForm.itemsTenantList[0].value
          this.searchForm.itemsTimeTypeList = response.data.result.timeTypeList
          this.searchForm.timeType = this.searchForm.itemsTimeTypeList[0].value
        }
      )
    },
    dialog: function () {
      return (this.popup.branchPopup === true)
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.fnc_getAiConciergeHistoryList()
    },
    searhPopup: function () {
      this.popup.branchPopup = true
    },
    popupAction: function (popup, obj) {
      this.searchForm.codeIdArr = []
      if (obj != null && obj.length > 0) {
        let txt = ''
        for (let i = 0; i < obj.length; i++) {
          if (i === (obj.length - 1)) {
            txt = txt + obj[i].codeValue
          } else {
            txt = txt + obj[i].codeValue + ','
          }
          this.searchForm.codeIdArr.push(obj[i].codeId)
        }
        this.searchForm.branchNm = txt
      }
      this.popup = popup
    },
    fnc_getAiConciergeHistoryList: function () {
      /* datepicker open */
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      if (this.isEmpty(this.searchForm.branchNm)) {
        this.searchForm.codeIdArr = []
      }
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        tenantId: this.searchForm.tenant,
        branchNm: this.searchForm.branchNm,
        codeIdArr: this.searchForm.codeIdArr, // 지점명 배열
        deviceNo: this.searchForm.deviceNo,
        deviceKind: this.searchForm.deviceKind,
        commYn: this.searchForm.commYn,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      console.log('=====searchCondition=====' + JSON.stringify(searchCondition))
      this.pagination.loading = true
      getAiConciergeHistoryList(searchCondition).then(
        response => {
          this.aiConciergeHistoryList = response.data.result.aiConciergeHistoryList ? response.data.result.aiConciergeHistoryList : []
          // paging setting
          this.pagination.totalRows = response.data.result.aiConciergeHistoryListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
        },
        error => {
          const status = error.data.status
          if (status === 403) {
            this.$router.push({ name: '403', query: { t: new Date().getTime() } })
          } else {
            delete sessionStorage.accessToken
            this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
          }
        }
      ).finally(() => {
        this.pagination.loading = false
      })
    },
    // 상세버튼
    detailRow: function (aiConciergeList) {
      const stTmp = this.isEmpty(sessionStorage.getItem('airead')) ? '' : sessionStorage.getItem('airead')
      if (stTmp.indexOf(aiConciergeList.callId) < 1) {
        this.chkList = this.isEmpty(stTmp) ? [] : stTmp.split(',')
        this.chkList.push(aiConciergeList.callId)
        // console.log(' systemCall.callId ' + systemCall.callId)
        sessionStorage.setItem('airead', this.chkList)
        // console.log(' sessionStorage ' + JSON.stringify(sessionStorage.getItem('airead')))
        this.totChkList = sessionStorage.getItem('airead').split(',')
      }
      const chat = {
        callId: aiConciergeList.callId,
        // extension: inboundCall.extension,
        counselor: {
          tenantNm: aiConciergeList.tenantNm
        },
        visible: true
      }
      let idx = -1
      if ((idx = this.chats.findIndex(ct => ct.callId === chat.callId)) > -1) {
        this.chats.splice(idx, 1, chat)
      } else {
        this.chats.push(chat)
      }
    },
    excelDown: function () {
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        tenantId: this.searchForm.tenant,
        branchNm: this.searchForm.branchNm,
        codeIdArr: this.searchForm.codeIdArr, // 지점명 배열
        deviceNo: this.searchForm.deviceNo,
        deviceKind: this.searchForm.deviceKind,
        commYn: this.searchForm.commYn,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      reqAiConciergeHistoryExcelDown(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_AIconcierge_처리이력.xlsx'

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: response.headers['content-type']
          })
        )
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
      },
      error => {
        console.error(error)
        const status = error.data.status
        if (status === 403) {
          this.$router.push({
            name: '403',
            query: { t: new Date().getTime() }
          })
        } else {
          delete sessionStorage.accessToken
          this.$router.push({
            name: 'Login',
            query: { t: new Date().getTime() }
          })
        }
      })
    },
    isEmpty: function (x) {
      return (x === null || x === undefined || x === '')
    },
    // 공통코드유형 정보 조회
    getCmnCodeList: function () {
      // param setting
      const searchCondition = {
        codeType: 'DEVICE',
        useYn: 'Y'
      }
      // retrieve
      // this.pagination.loading = true
      getCmnCodeList(searchCondition).then(
        response => {
          this.deviceKindList = response.data.result.cmnCodeList ? response.data.result.cmnCodeList : []
          console.log(' this.deviceKind ' + JSON.stringify(this.deviceKind))
          // paging setting
          // this.pagination.totalRows = response.data.result.cmnCodeListCount
          // const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          // this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
        },
        error => {
          console.error(error)
          const status = error.data.status
          if (status === 403) {
            this.$router.push({
              name: '403',
              query: { t: new Date().getTime() }
            })
          } else {
            delete sessionStorage.accessToken
            this.$router.push({
              name: 'Login',
              query: { t: new Date().getTime() }
            })
          }
        }
      ).finally(() => {
        // this.pagination.loading = false
      })
    }
  }
}
</script>
