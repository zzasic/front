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
              label="단말번호"
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.jobCode"
              :items="cptdItemsTaskList"
              :label="'업무분류'"
              item-key="codeId"
              item-text="codeValue"
              item-value="codeId"
              :placeholder="searchForm.jobCode ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.recognition"
              :items="cptdMouduleList"
              :label="$t('label.recognition')"
              :placeholder="searchForm.recognition ? undefined : $t('label.all')"
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
                  class="default text-field-date pr-4"
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
                  <v-btn text :ripple="false" color="pink" @click="betweenConfirm(searchForm)">{{ $t('button.confirm')}}</v-btn>
                </v-date-picker>
              </div>
            </v-menu>
          </v-col>
          <v-col v-auth="['CAU', 'AU', 'SAU']">
            <v-select
            class="default search"
            :menu-props="{ offsetY: true }"
            v-model="searchForm.testType"
            :items="cptdTestTypeList"
            item-key="codeId"
            item-text="codeValue"
            item-value="codeId"
            :label="$t('label.testType')"
            :placeholder="searchForm.testType ? undefined : $t('label.all')"
            clearable
            ></v-select>
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
          :items="taskCategoryHistoryList"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
      <template v-slot:item="props">
        <tr :title="convertContents(props.item.contents)">
          <td class="text-center">{{ props.item.jobCode }}</td>
          <td class="text-center">{{ props.item.jobName }}</td>
          <td class="text-center">{{ props.item.callId }}</td>
          <td class="text-center">{{ props.item.branchCd }}</td>
          <td class="text-center">{{ props.item.branchNm }}</td>
          <td class="text-center">{{ props.item.deviceNo }}</td>
          <td class="text-center">{{ props.item.topScreenCode }}</td>
          <td class="text-center">{{ props.item.topScreenName }}</td>
          <td class="text-center">{{ props.item.bottomScreenCode }}</td>
          <td class="text-center">{{ props.item.bottomScreenName }}</td>
          <td class="text-center">{{ props.item.customerNo }}</td>
          <td class="text-center">{{ props.item.recognition }}</td>
          <td class="text-center">{{ getContents(props.item.contents) }}</td>
          <td class="text-center">{{ props.item.convoDt }}</td>
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
          @input="fnc_getCategoryHistoryList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <v-dialog
        v-model="dialogBranch"
        persistent
        :max-width="600"
        hide-overlay
        scrollable v-if="popup.branchPopup === true"
        >
      <PopupSearchBanch
      @popupAction="popupAction"
      />
    </v-dialog>
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
  getCategoryHistoryList,
  reqCategoryHistoryExcelDown
} from '../../../api/shinhan/aiConcierge'
import datepicker from '@/plugins/datepicker'
import {
  getCmnCodeList
} from '../../../api/cmnCode'
import PopupSearchBanch from '@/views/counsel/PopupSearchBanch'

export default {
  name: 'TaskCategoryHistoryView',
  components: {
    PopupSearchBanch
  },
  mixins: [datepicker],
  created () {
    if (sessionStorage.userAuthCode === 'CU' || sessionStorage.userAuthCode === 'CAU') {
      this.authOpt = false
      this.searchForm.system = sessionStorage.systemIds
    }
  },
  mounted () {
    this.getCmnCodeList()
    this.InitCategoryHistorysView()
  },
  data () {
    return {
      moudules: [
        { opt1: 'AIH', opt2: null, opt3: null, opt4: null, text: '음성', value: 'VO' },
        { opt1: 'AIH', opt2: null, opt3: null, opt4: null, text: '버튼', value: 'BT' },
        { opt1: 'AIH', opt2: null, opt3: null, opt4: null, text: '침묵', value: 'SL' }
      ],
      headers: [
        { text: '업무코드', value: 'jobCode', align: 'center', class: 'text-center', width: '5%' },
        { text: '업무명', value: 'jobName', align: 'center', class: 'text-center', width: '10%' },
        { text: 'CALL ID', value: 'callId', align: 'center', class: 'text-center', width: '17%' },
        { text: '지점코드', value: 'branchCd', align: 'center', class: 'text-center', width: '5%' },
        { text: '지점명', value: 'branchNm', align: 'center' },
        { text: '단말번호', value: 'deviceNo', align: 'center', class: 'text-center', width: '5%' },
        { text: '상단화면ID', value: 'topScreenCode', align: 'center', class: 'text-center', width: '5%' },
        { text: '상단화면명', value: 'topScreenName', align: 'center', class: 'text-center', width: '10%' },
        { text: '하단화면ID', value: 'bottomScreenCode', align: 'center', class: 'text-center', width: '6%' },
        { text: '하단화면명', value: 'bottomScreenName', align: 'center', class: 'text-center', width: '8%' },
        { text: '고객번호', value: 'customerNo', align: 'center', class: 'text-center', width: '5%' },
        { text: '인식구분', value: 'recognition', align: 'center', class: 'text-center', width: '5%' },
        { text: '컨텐츠', value: 'contents', align: 'center', class: 'text-center', width: '7%' },
        { text: '발생일시', value: 'convoDt', align: 'center', class: 'text-center', width: '10%' }
      ],
      taskCategoryHistoryList: [],
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
        branchNm: '',
        codeIdArr: [],
        recognition: '',
        deviceNo: '',
        jobCode: '',
        callType: '',
        dates: [this.$moment().add(-7, 'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
        testType: '',
        tasktList: [],
        system: ''
      },
      chats: [],
      authOpt: true,
      popup: {
        branchPopup: false
      },
      testTypeList: []
    }
  },

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdTestTypeList () {
      const testList = [
        {
          codeValue: this.$t('label.all'),
          codeId: ''
        }
      ]
      testList.push(...this.testTypeList)
      // console.log(' computed testList ' + JSON.stringify(testList))
      return testList
    },
    cptdItemsTaskList () {
      const tasktList = [
        {
          codeValue: this.$t('label.all'),
          codeId: ''
        }
      ]
      // tenantList.push(...this.searchForm.itemsTenantList.filter(s => s.value.indexOf(this.searchForm.system) === 0))
      tasktList.push(...this.searchForm.tasktList)
      return tasktList
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
          this.fnc_getCategoryHistoryList()
        }
      }
    }
  },

  watch: {
  },

  methods: {
    betweenConfirm: function (val) {
      if (this.isEmpty(val.dates[1])) {
        this.searchForm.dates[1] = val.dates[0]
      }
      const startDate = val.dates[0].split('-')
      const endDate = val.dates[1].split('-')
      const sTime = new Date(startDate[0], startDate[1] - 1, startDate[2])
      const eTime = new Date(endDate[0], endDate[1] - 1, endDate[2])
      const days = (eTime - sTime) / 60 / 60 / 24 / 1000
      if (days > 30) {
        alert('검색기간은 30일을 초과하여 조회할 수 없습니다.')
        const tmpDate = new Date(val.dates[1])
        tmpDate.setDate(tmpDate.getDate() - 30)
        const stDt = tmpDate.getFullYear() + '-' + ((tmpDate.getMonth() + 1) > 9 ? (tmpDate.getMonth() + 1).toString() : '0' + (tmpDate.getMonth() + 1)) + '-' + (tmpDate.getDate() > 9 ? tmpDate.getDate().toString() : '0' + tmpDate.getDate().toString())
        this.searchForm.dates = [stDt, val.dates[1]]
        this.$refs.pickerMenu.save(this.searchForm.dates)
        return false
      } else {
        this.$refs.pickerMenu.save(this.searchForm.dates)
        return true
      }
    },
    async getCmnCodeList () {
      // param setting
      let searchCondition = {
        codeType: 'TEST_TYPE',
        useYn: 'Y'
      }
      const resultTestType = await getCmnCodeList(searchCondition)
      this.testTypeList = resultTestType.data.result.cmnCodeList ? resultTestType.data.result.cmnCodeList : []
      // console.log(' this.testTypeList ' + JSON.stringify(this.testTypeList))
      searchCondition = {
        codeType: 'SHBK_JOB_TYPE',
        useYn: 'Y',
        page: 1,
        itemsPerPage: 20
      }
      const resultTask = await getCmnCodeList(searchCondition)
      this.searchForm.tasktList = resultTask.data.result.cmnCodeList ? resultTask.data.result.cmnCodeList : []
      // console.log(' this.searchForm.tasktList ' + JSON.stringify(this.searchForm.tasktList))
    },
    searhPopup: function () {
      this.popup.branchPopup = true
    },
    popupAction: function (type, obj) {
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
      this.popup[`${type}`] = !this.popup[`${type}`]
    },
    dialogBranch: function () {
      return (this.popup.branchPopup === true)
    },
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
    InitCategoryHistorysView () {
      this.fnc_getCategoryHistorySearchCondition()
    },
    // 검색 조건 조회
    fnc_getCategoryHistorySearchCondition: function () {
      this.fnc_getCategoryHistoryList()
    },
    fnc_getCategoryHistoryList: function () {
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
        codeIdArr: this.searchForm.codeIdArr, // 지점명 배열
        recognition: this.searchForm.recognition, // 인식구분
        deviceNo: this.searchForm.deviceNo, // 단말번호
        workType: this.searchForm.jobCode, // 업무분류
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : '',
        noBranchYn: this.searchForm.testType
      }
      // console.log(' searchCondition ' + JSON.stringify(searchCondition))
      this.pagination.loading = true
      getCategoryHistoryList(searchCondition).then(
        response => {
          // console.log(response.data)
          this.taskCategoryHistoryList = response.data.result.digitalUsageViewList ? response.data.result.digitalUsageViewList : []
          // paging setting
          this.pagination.totalRows = response.data.result.digitalUsageViewCount
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
      const isSuccess = this.betweenConfirm(this.searchForm)
      if (isSuccess) {
        this.pagination.page = 1
        this.fnc_getCategoryHistoryList()
      }
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    },
    excelDown: function () {
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
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        codeIdArr: this.searchForm.codeIdArr, // 지점명 배열
        recognition: this.searchForm.recognition, // 인식구분
        deviceNo: this.searchForm.deviceNo, // 단말번호
        workType: this.searchForm.jobCode, // 업무분류
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : '',
        noBranchYn: this.searchForm.testType
      }
      reqCategoryHistoryExcelDown(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_지점별_거래현황.xlsx'

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
