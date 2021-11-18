<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.system"
              :items="cptdItemsSystemInfoList"
              :label="$t('label.system')"
              :placeholder="searchForm.system ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="1">
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
          <v-col cols="1">
            <v-text-field
              class="default search"
              v-model="searchForm.deviceNo"
              :label="$t('label.deviceNo')"
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
          <v-col cols="1">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.custCommu"
              :items="cptdCustCommuYnList"
              label="고객발화여부"
              :placeholder="searchForm.custCommu ? undefined : $t('label.all')"
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
          show-select
          :headers="systemCallViewHeaders"
          :items="systemCallList"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr @click="detailRow(props.item), selected = props.item.callId">
              <td class="text-center"><input type="checkbox" name="view" :checked="totChkList.includes(props.item.callId) ? true : false" disabled></td>
              <td class="text-center">{{ props.item.systemNm }}</td>
              <td class="text-center">{{ props.item.tenantNm }}</td>
              <td class="text-center">{{ props.item.callId }}</td>
              <td class="text-center">{{ props.item.branchCd }}</td>
              <td class="text-center">{{ props.item.branchNm }}</td>
              <td class="text-center">{{ props.item.deviceNo }}</td>
              <td class="text-center">{{ getDeviceKind(props.item.callId) }}</td>
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
          @input="getSystemCallList"
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
    </vuescroll>
    <div v-for="chat in chats" :key="chat.chatId">
      <systemCall-history-popup v-if="chat.visible === true" :chat="chat" :counselor="chat.counselor" @clickClose="chat.visible = false" />
    </div>
  </div>
</template>

<script>
import SystemCallHistoryPopup from '@/components/SystemCallHistoryPopup'
import PopupSearchBanch from '@/views/counsel/PopupSearchBanch'

import {
  getSystemCallSearchCondition,
  getSystemCallList,
  reqGetManualHistory
} from '../../api/counsel'
import {
  getCmnCodeList
} from '../../api/cmnCode'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'ListSystemCallView',
  components: {
    SystemCallHistoryPopup,
    PopupSearchBanch
  },
  mixins: [datepicker],
  created () {
    this.totChkList = sessionStorage.getItem('counselread').split(',')
  },
  mounted () {
    this.getCmnCodeList()
    this.initSystemCallView()
  },
  data () {
    return {
      systemCallViewHeaders: [
        { text: '시스템', value: 'systemNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '테넌트', value: 'tenantNm', align: 'center', class: 'text-center', width: '150px' },
        { text: 'CALL ID', value: 'callId', align: 'center', class: 'text-center', width: '250px' },
        { text: '지점코드', value: 'branchCd', align: 'center', class: 'text-center', width: '100px' },
        { text: '지점명', value: 'branchNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '단말번호', value: 'deviceNo', align: 'center', class: 'text-center', width: '100px' },
        { text: '단말종류', value: 'deviceKind', align: 'center', class: 'text-center', width: '100px' },
        { text: '통화시작일시', value: 'startDt', align: 'center', class: 'text-center', width: '120px' },
        { text: '통화시간', value: 'timeDiff', align: 'center', class: 'text-center', width: '90px' },
        { text: '대화이력', value: 'buttonhere', align: 'center', class: 'text-center', width: '80px', sortable: false }
      ],
      systemCallList: [],
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
      custComuYns: [
        {
          text: '고객발화',
          value: 'Y'
        },
        {
          text: '고객발화 외',
          value: 'N'
        }
      ],
      searchForm: {
        tenants: [],
        tenant: '',
        systemInfos: [],
        system: '',
        deviceNo: '',
        deviceKind: '',
        commYn: '',
        dates: [this.$moment().add(-1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
        custCommu: 'Y',
        codeIdArr: []
      },
      deviceKindList: [],
      chats: [],
      popup: {
        branchPopup: false
      },
      chkList: [],
      totChkList: []
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
      tenantList.push(...this.searchForm.tenants)
      return tenantList
    },
    cptdItemsSystemInfoList () {
      const systemInfoList = [
        {
          text: this.$t('label.all'), // text: this.$t('label.choice'),
          value: ''
        }
      ]
      systemInfoList.push(...this.searchForm.systemInfos)
      return systemInfoList
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
    cptdCustCommuYnList () {
      const custCommuList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      custCommuList.push(...this.custComuYns)
      return custCommuList
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
          this.getSystemCallList()
        }
      }
    }
  },

  watch: {
  },

  methods: {
    getDeviceKind (callId) {
      let str
      for (let i = 0; i < this.deviceKindList.length; i++) {
        if (callId.substring(5, 7) === this.deviceKindList[i].codeId) {
          str = this.deviceKindList[i].codeValue
        }
      }
      return str // this.deviceKindList[this.deviceKindList.indexOf(callId.substring(5, 7))].codeValue
    },
    async initSystemCallView () {
      await this.getSearchCondition()
      this.getSystemCallList()
    },
    getSearchCondition: function () {
      getSystemCallSearchCondition().then(
        response => {
          this.searchForm.tenants = response.data.result.tenantList
          this.searchForm.systemInfos = response.data.result.systemInfoList
          // this.searchForm.system = this.searchForm.systemInfos[0].value
        }
      )
    },
    popupAction: function (popup, obj) {
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
    dialog: function () {
      return (this.popup.branchPopup === true)
    },
    // 검색버튼
    searchBtn: function () {
      console.log('form' + JSON.stringify(this.searchForm))
      this.pagination.page = 1
      this.getSystemCallList()
    },
    searhPopup: function () {
      this.popup.branchPopup = true
    },
    getSystemCallList: function () {
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
        systemId: this.searchForm.system,
        deviceNo: this.searchForm.deviceNo,
        deviceKind: this.searchForm.deviceKind, // 단말기 종류
        commYn: this.searchForm.commYn,
        codeIdArr: this.searchForm.codeIdArr, // 지점명 배열
        custCommu: this.searchForm.custCommu, // 고객발화여부
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getSystemCallList(searchCondition).then(
        response => {
          this.systemCallList = response.data.result.systemCallList ? response.data.result.systemCallList : []
          console.log(' this.systemCallList ' + JSON.stringify(this.systemCallList))
          // paging setting
          this.pagination.totalRows = response.data.result.systemCallListCount
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
    detailRow: function (systemCall) {
      const stTmp = this.isEmpty(sessionStorage.getItem('counselread')) ? '' : sessionStorage.getItem('counselread')
      if (stTmp.indexOf(systemCall.callId) < 1) {
        this.chkList = this.isEmpty(stTmp) ? [] : stTmp.split(',')
        this.chkList.push(systemCall.callId)
        // console.log(' systemCall.callId ' + systemCall.callId)
        sessionStorage.setItem('counselread', this.chkList)
        // console.log(' sessionStorage ' + JSON.stringify(sessionStorage.getItem('counselread')))
        this.totChkList = sessionStorage.getItem('counselread').split(',')
      }
      const chat = {
        callId: systemCall.callId,
        deviceNo: systemCall.deviceNo,
        counselor: {
          callYn: systemCall.commYn,
          tenantNm: systemCall.tenantNm,
          deviceNo: systemCall.deviceNo
        },
        visible: true
      }
      let idx = -1
      if ((idx = this.chats.findIndex(ct => ct.callId === chat.callId)) > -1) {
        this.chats.splice(idx, 1, chat)
      } else {
        this.chats.push(chat)
      }
      // window.open(`/#/popup/counsel/history/${systemCall.callId}`, `popup_${systemCall.callId}`, 'top=10, left=10, width=100, height=100, status=no, menubar=no, toolbar=no, resizable=no')
    },
    getManualHistory () {
      if (!confirm('상담내역 동기화를 진행하시겠습니까?')) {
        return
      }
      reqGetManualHistory().then(
        response => {
          alert('상담내역 동기화를 완료하였습니다.')
          this.getSystemCallList()
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
