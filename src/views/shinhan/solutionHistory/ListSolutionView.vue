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
              v-model="searchForm.system"
              :items="cptdItemsSystemInfoList"
              :label="$t('label.system')"
              :placeholder="searchForm.system ? undefined : $t('label.choice')"
              clearable
            ></v-select>
          </v-col>
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
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.moudule"
              :items="cptdMouduleList"
              :label="$t('label.solutionList')"
              :placeholder="searchForm.moudule ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="1">
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
          <v-col cols="1">
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
      <v-card class="data-grid-wrap default">
        <v-data-table
          :headers="headers"
          :items="solutionHistoryList"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
      <template v-slot:item="props">
        <tr :title="convertContents(props.item.contents)">
          <td class="text-center">{{ props.item.systemNm }}</td>
          <td class="text-center">{{ props.item.tenantNm }}</td>
          <td class="text-center">{{ props.item.callId }}</td>
          <td class="text-center">{{ props.item.branchCd }}</td>
          <td class="text-center">{{ props.item.branchNm }}</td>
          <td class="text-center">{{ props.item.deviceNo }}</td>
          <td class="text-center">{{ props.item.moudule }}</td>
          <td class="text-center">{{ props.item.tranId }}</td>
          <td class="text-center">{{ getContents(props.item.contents) }}</td>
          <td class="text-center">{{ props.item.startDt }}</td>
          <td class="text-center" >{{ props.item.endDt }}</td>
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
          @input="fnc_getSolutionHistoryList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div v-auth="['SAU', 'CAU', 'AU']" class="btn-group align-right">
        <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div>
    </vuescroll>
    <div v-for="chat in chats" :key="chat.chatId">
      <inbound-history-popup v-if="chat.visible === true" :chat="chat" :counselor="chat.counselor" @clickClose="chat.visible = false" />
    </div>
  </div>
</template>

<script>
import {
  getSolutionHistorySearchCondition,
  getSolutionHistoryList,
  reqSolutionHistoryExcelDown
} from '../../../api/shinhan/solutionHistory'
import datepicker from '@/plugins/datepicker'
// TODO
import InboundHistoryPopup from '@/views/shinhan/aiConcierge/AiConciergeDetailPopup'

export default {
  name: 'ListSolutionView',
  components: {
    InboundHistoryPopup
  },
  mixins: [datepicker],
  created () {
    if (sessionStorage.userAuthCode === 'CU' || sessionStorage.userAuthCode === 'CAU') {
      this.authOpt = false
      this.searchForm.system = sessionStorage.systemIds
    }
  },
  mounted () {
    this.InitSolutionHistoryView()
  },
  data () {
    return {
      moudules: [
        // { text: '전체', value: '' },
        { opt1: 'AIH', opt2: null, opt3: null, opt4: null, text: 'CHATBOT', value: 'CHATBOT' },
        { opt1: 'AIH,ICC', opt2: null, opt3: null, opt4: null, text: 'STT', value: 'STT' },
        { opt1: 'AIH,ICC', opt2: null, opt3: null, opt4: null, text: 'TTS', value: 'TTS' },
        { opt1: 'ICC', opt2: null, opt3: null, opt4: null, text: 'TA_GW', value: 'TA_GW' },
        { opt1: 'ICC', opt2: null, opt3: null, opt4: null, text: 'TA_TA', value: 'TA_TA' }
      ],
      headers: [
        { text: '시스템', value: 'systemNm', align: 'center', class: 'text-center', width: '120px' },
        { text: '테넌트', value: 'tenantNm', align: 'center', class: 'text-center', width: '120px' },
        { text: 'CALL ID', value: 'callId', align: 'center', class: 'text-center', width: '240px' },
        { text: '지점코드', value: 'branchCd', align: 'center', class: 'text-center', width: '70px' },
        { text: '지점명', value: 'branchNm', align: 'center', width: '100px' },
        { text: '단말번호', value: 'deviceNo', align: 'center', class: 'text-center', width: '100px' },
        { text: '솔루션', value: 'moudule', align: 'center', class: 'text-center', width: '120px' },
        { text: '트랜잭션ID', value: 'tranId', align: 'center', class: 'text-center', width: '120px' },
        { text: '컨텐츠', value: 'contents', align: 'center', class: 'text-center', width: '120px' },
        { text: '사용시작', value: 'startDt', align: 'center', class: 'text-center', width: '120px' },
        { text: '사용종료', value: 'endDt', align: 'center', class: 'text-center', width: '120px' }
      ],
      solutionHistoryList: [],
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
      callTypes: [],
      searchForm: {
        itemsSystemInfoList: [],
        system: '',
        solutionId: '',
        itemsTenantList: [],
        tenant: '',
        branchNm: '',
        moudule: '',
        deviceNo: '',
        status: '',
        callType: '',
        dates: [this.$moment().add(-1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      },
      chats: [],
      authOpt: true
    }
  },

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsSystemInfoList () {
      const systemInfoList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      systemInfoList.push(...this.searchForm.itemsSystemInfoList)
      if (this.authOpt) {
        return systemInfoList
      } else {
        return this.searchForm.itemsSystemInfoList
      }
    },
    cptdItemsTenantList () { // 시스템에 따라 테넌트 정보 필터(default all)
      const tenantList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      tenantList.push(...this.searchForm.itemsTenantList.filter(s => s.value.indexOf(this.searchForm.system) === 0))
      return tenantList
    },
    cptdMouduleList () {
      const moudules = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      moudules.push(...this.moudules.filter(s => s.opt1.indexOf(this.searchForm.system) !== -1))
      return moudules
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
          this.fnc_getSolutionHistoryList()
        }
      }
    }
  },

  watch: {
  },

  methods: {
    getContents (str) {
      let content
      let setStr
      if (str === null || str === undefined || str === '') {
        content = ''
      } else {
        setStr = str // .replace('\\n', '')
        // console.log(' setStr ' + setStr)
        if (setStr.length > 10) {
          content = setStr.substring(0, 9) + '...'
        } else {
          content = setStr
        }
      }
      return content
    },
    convertContents (str) {
      return str === null || str === '' ? '' : str // .replaceAll('\\n', '\n') //  setStr = str.replace('\\n', '&lt;br&gt;') .replace('\n', '<br>')
    },
    InitSolutionHistoryView () {
      this.fnc_getSolutionHistorySearchCondition()
    },
    // 검색 조건 조회
    fnc_getSolutionHistorySearchCondition: function () {
      // system, solution 등을 조회
      getSolutionHistorySearchCondition().then(
        response => {
          this.searchForm.itemsSystemInfoList = response.data.result.systemInfoList ? response.data.result.systemInfoList : []
          // this.searchForm.system = this.searchForm.itemsSystemInfoList[0].value
          this.searchForm.itemsTenantList = response.data.result.tenantList
          // this.searchForm.tenant = this.searchForm.itemsTenantList[0].value
          this.searchForm.itemsTimeTypeList = response.data.result.timeTypeList
          this.searchForm.timeType = this.searchForm.itemsTimeTypeList[0].value
          this.fnc_getSolutionHistoryList()
        }
      )
    },
    fnc_getSolutionHistoryList: function () {
      /* datepicker open */
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenant,
        branchNm: this.searchForm.branchNm,
        moudule: this.searchForm.moudule,
        deviceNo: this.searchForm.deviceNo,
        status: this.searchForm.status,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      console.log(' searchCondition ' + JSON.stringify(searchCondition))
      this.pagination.loading = true
      getSolutionHistoryList(searchCondition).then(
        response => {
          this.solutionHistoryList = response.data.result.solutionHistoryList ? response.data.result.solutionHistoryList : []
          // paging setting
          this.pagination.totalRows = response.data.result.solutionHistoryListCount
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
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.fnc_getSolutionHistoryList()
    },
    excelDown: function () {
      /* datepicker open */
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenant,
        branchNm: this.searchForm.branchNm,
        moudule: this.searchForm.moudule,
        deviceNo: this.searchForm.deviceNo,
        status: this.searchForm.status,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      reqSolutionHistoryExcelDown(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_솔루션별_사용이력.xlsx'

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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
