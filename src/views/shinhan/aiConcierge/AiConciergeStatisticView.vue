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
          <v-col cols="2">
            <v-text-field
              class="default search"
              v-model="searchForm.branchNm"
              label="지점명"
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="fnc_getAiConciergeCartList"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.timeType"
              :items="cptdItemsTimeTypeList"
              :label="$t('label.timeType')"
              :placeholder="searchForm.timeType"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2" v-if="searchForm.timeType === 'B'">
            <v-menu
              content-class="date-picker"
              ref="pickerYearMenu"
              v-model="pickerYearMenu"
              :return-value.sync="searchForm.year"
              :close-on-content-click="false"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="default text-field-date pr-0"
                  v-model='yearText'
                  label="검색년도"
                  placeholder="YYYY"
                  v-on="on"
                  readonly
                >
                </v-text-field>
              </template>
              <v-date-picker
                ref="pickerYear"
                v-model="searchForm.year"
                @click:year="setYear(searchForm.year)"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text :ripple="false" color="pink" @click="pickerYearMenu = false">{{ $t('button.close')}}</v-btn>
                <v-btn text :ripple="false" color="pink" @click="saveYear(searchForm.year)">{{ $t('button.confirm')}}</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="2" v-else>
            <v-menu
              content-class="date-picker"
              ref="pickerMenu"
              v-model="pickerMenu"
              :return-value.sync="searchForm.months"
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
                  placeholder="YYYY.MM - YYYY.MM"
                  v-on="on"
                  readonly
                  clearable
                >
                </v-text-field>
              </template>
              <v-date-picker
                v-model="searchForm.months"
                type="month"
                range
                no-title
                scrollable
                :event-color="
                  date =>
                    date == searchForm.months[0]
                      ? ['startMonth']
                      : date == searchForm.months[1]
                      ? ['endMonth']
                      : ''
                "
                :events="searchForm.months"
                :date-format="date => new Date(date).toDateString()"
                :locale="$i18n.locale"
                :picker-date.sync="pickerDate"
                @click:date="dateClick"
              >
                <v-spacer></v-spacer>
                <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(searchForm.months)">{{ $t('button.confirm')}}</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="text-right">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-search"
              :ripple="false"
              @click="fnc_getAiConciergeCartList"
            >{{ $t('button.search')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-card class="data-grid-wrap default">
        <v-container class="db-card" no-gutters fluid>
          <v-row class="db-card__row">
            <v-col class="db-card__item">
              <div class="db-card__head db-card__head--noline">
                <h4 class="db-card__head-title">{{ statisticsChartTitle }}</h4>
              </div>
              <div class="db-card__chart">
                <bar-charts
                  :chartData="statisticsChartJSData"
                  :options="statisticsChartJSOptions"
                ></bar-charts>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <PageSectionTitle
        :title="pagination.sectionTitle"
        :totalRows="pagination.totalRows"
        :subtitle="pagination.sectionSubTitle"
      >
      </PageSectionTitle>
      <v-card class="data-grid-wrap default">
        <v-data-table
          :headers="headerz"
          :items="statisticsList"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr>
              <td class="text-center">{{ props.item.callDate }}</td>
              <td class="text-center">{{ props.item.tenantNm }}</td>
              <td class="text-center">{{ props.item.branchCd }}</td>
              <td class="text-center">{{ props.item.branchNm }}</td>
              <td class="text-center">{{ props.item.chatBotCnt }}</td>
              <td class="text-center">{{ props.item.sttCnt }}</td>
              <td class="text-center">{{ props.item.ttsCnt }}</td>
              <!-- <td class="text-center">{{ props.item.taCnt }}</td> -->
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          @change="fnc_getAiConciergeStatisticsList"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="fnc_getAiConciergeStatisticsList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click.stop="fnc_reqAiConciergeStatisticsBatch" v-auth="['SAU']">{{ $t('button.Statistics')}}</v-btn>
        <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div>
    </vuescroll>
  </div>
</template>

<script>
import BarCharts from '@/components/chart/BarCharts'
import {
  getAiConciergeSearchCondition, // 초기 조회 조건
  getAiConciergeStatisticsChartList, // 차트 목록 조회
  getAiConciergeStatisticsList, // 그리드 목록 조회
  reqAiConciergeStatisticsExcelDown, // 엑셀 다운
  reqAiConciergeStatisticsBatch
} from '../../../api/shinhan/aiConcierge'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'AiConciergeStatisticView',
  components: {
    // GChart,
    BarCharts
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.fnc_getAiConciergeSearchCondition()
    this.fnc_getAiConciergeCartList()
  },
  data () {
    return {
      bgColors: ['blue', 'red', 'yellow', 'navy', 'maroon', 'lime', 'purple', 'orange', 'green', 'fuchsia', 'brown', 'teal', 'deeppink', 'olive', 'aqua'],
      chartType: 'ChartJS',
      pickerYearMenu: false,
      drawChart: false,
      headers: [
        { text: '테넌트', value: 'tenantNm', align: 'center', width: '200px' },
        { text: '지점코드', value: 'branchCd', align: 'center', width: '200px' },
        { text: '지점명', value: 'branchNm', align: 'center', width: '250px' },
        { text: 'CHATBOT(건)', value: 'chatbotCnt', align: 'center', width: '200px' },
        { text: 'STT(건)', value: 'sttCnt', align: 'center', width: '200px' },
        { text: 'TTS(건)', value: 'ttsCnt', align: 'center', width: '200px' }
        // { text: 'TA(건)', value: 'taCnt', align: 'center', width: '200px' }
      ],
      statisticsList: [],
      statisticsChartList: [], // stt, tts, ta 각각 리스트를 만들어서 일별로 보여줘야할듯
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
      options: {},
      strYear: this.$moment(new Date()).format('YYYY'),
      searchForm: {
        branchNm: '',
        itemsTenantList: [],
        tenant: '',
        itemsTimeTypeList: [],
        timeType: '',
        rsltTimeType: '',
        year: this.$moment(new Date()).format('YYYY'),
        months: [
          this.$moment(new Date()).format('YYYY-MM'),
          this.$moment(new Date()).format('YYYY-MM')
        ],
        startMonth: this.$moment(new Date()).format('YYYY-MM'),
        endMonth: this.$moment(new Date()).format('YYYY-MM')
      },
      popup: {
        type: null,
        tenantId: null,
        callDate: null,
        timeType: null,
        startMonth: null,
        endMonth: null
      }
    }
  },
  computed: {
    headerz: function () {
      const dynamicColumnHeader = this.headers.slice()
      if (this.searchForm.rsltTimeType === 'D') {
        // 시간별
        dynamicColumnHeader.splice(0, 0, { text: '상담시간', value: 'callDate', align: 'center', width: '200px' })
      } else if (this.searchForm.rsltTimeType === 'C') {
        // 요일별
        dynamicColumnHeader.splice(0, 0, { text: '상담요일', value: 'callDate', align: 'center', width: '200px' })
      } else if (this.searchForm.rsltTimeType === 'B') {
        // 월별
        dynamicColumnHeader.splice(0, 0, { text: '상담월', value: 'callDate', align: 'center', width: '200px' })
      } else {
        // 일별
        dynamicColumnHeader.splice(0, 0, { text: '상담일', value: 'callDate', align: 'center', width: '200px' })
      }
      return dynamicColumnHeader
    },
    statisticsChartJSData: function () {
      const datas = this.statisticsChartList.reduce((acc, val) => {
        const key = `${val.moudule}`
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(val)
        return acc
      }, {})
      const keys = Object.keys(datas)
      const labels = []
      const datasets = []
      const backgroundColors = []
      backgroundColors.push('#ffb0c1', '#9ad0f5', '#ffe6aa', '#a4dfdf', '#ccb2ff', '#ffb0c1', '#81f7f3', '#f5a9e1', '#bcf5a9', '#f3e2a9')
      if (this.searchForm.rsltTimeType === 'D') {
        // 시간별
        let m = 1
        let n = 0
        while (m <= 24) {
          labels.push(`${m}시`)
          m++
        }
        for (const key of keys) {
          const data = []
          m = 1
          while (m <= 24) {
            data.push((datas[key].find((ch) => ch.callDate === `${m}시`) || { totCnt: 0 }).totCnt)
            m++
          }
          datasets.push({
            label: key,
            backgroundColor: backgroundColors[n],
            data: data
          })
          n++
        }
      } else if (this.searchForm.rsltTimeType === 'C') {
        // 요일별
        let m = 0
        let n = 0
        labels.push('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일')
        for (const key of keys) {
          const data = []
          m = 0
          while (m < 7) {
            data.push((datas[key].find((ch) => ch.callDate === labels[m]) || { totCnt: 0 }).totCnt)
            m++
          }
          datasets.push({
            label: key,
            backgroundColor: backgroundColors[n],
            data: data
          })
          n++
        }
      } else if (this.searchForm.rsltTimeType === 'B') {
        // 월별
        let m = 1
        let n = 0
        while (m <= 12) {
          labels.push(`${m}월`)
          m++
        }
        for (const key of keys) {
          const data = []
          m = 1
          while (m <= 12) {
            data.push((datas[key].find((ch) => ch.callDate === `${m}월`) || { totCnt: 0 }).totCnt)
            m++
          }
          datasets.push({
            label: key,
            backgroundColor: backgroundColors[n],
            data: data
          })
          n++
        }
      } else {
        // 일별
        let dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
        const dateEnd = this.$moment(`${this.searchForm.endMonth}-01`).endOf('month')
        while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
          labels.push(dateStart.format('MM-DD'))
          dateStart.add(1, 'days')
        }
        let n = 0
        for (const key of keys) {
          const data = []
          dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
          while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
            data.push((datas[key].find((ch) => ch.callDate === dateStart.format('YYYYMMDD')) || { totCnt: 0 }).totCnt)
            dateStart.add(1, 'days')
          }
          datasets.push({
            label: key,
            backgroundColor: backgroundColors[n],
            data: data
          })
          n++
        }
      }
      return {
        labels: labels,
        datasets: datasets
      }
    },
    statisticsChartJSOptions: function () {
      if (this.searchForm.rsltTimeType === 'B') {
        // 월별
        return {
          responsive: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          legend: {
            position: 'bottom'
          },
          title: {
            display: false,
            text: '월별 상담 현황'
          },
          maintainAspectRatio: false
        }
      } else {
        // 일별
        return {
          responsive: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          legend: {
            position: 'bottom'
          },
          title: {
            display: false,
            text: '일별 상담 현황'
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                offsetGridLines: true
              }
            }]
          }
        }
      }
    },
    statisticsChartTitle: function () {
      if (this.searchForm.rsltTimeType === 'D') {
        // 시간별
        return '시간별 상담 현황'
      } else if (this.searchForm.rsltTimeType === 'C') {
        // 요일별
        return '요일별 상담 현황'
      } else if (this.searchForm.rsltTimeType === 'B') {
        // 월별
        return '월별 상담 현황'
      } else {
        // 일별
        return '일별 상담 현황'
      }
    },
    barChartJSData: function () {
      // key : value = callType : {[datas]}
      const datas = this.statisticsChartList.reduce((acc, val) => {
        const key = val.callType
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(val)
        return acc
      }, {})
      const keys = Object.keys(datas)
      const labels = []
      const datasets = []
      if (this.searchForm.rsltTimeType === 'B') {
        // 월별
        let m = 1
        while (m <= 12) {
          labels.push(`${m}월`)
          m++
        }
        let xi = 0
        for (const key of keys) {
          const data = []
          m = 1
          while (m <= 12) {
            data.push((datas[key].find((ch) => ch.callDate === `${m}월`) || { totalCount: 0 }).totalCount)
            m++
          }
          datasets.push({
            label: key,
            backgroundColor: this.bgColors[xi++ % this.bgColors.length],
            data: data
          })
        }
      } else {
        // 일별
        // x축 설정
        let dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
        const dateEnd = this.$moment(`${this.searchForm.endMonth}-01`).endOf('month')
        while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
          labels.push(dateStart.format('MM-DD'))
          dateStart.add(1, 'days') // 이거를 여기랑 아래에서 셋팅해주는 이유는 무엇...?
        }
        // 데이터 넣기
        /*
          라벨에 일치하는 날짜를 찾아서 count => data에 밀어넣음
          [0,2,0,0,0...]
        */
        let xi = 0
        for (const key of keys) {
          const data = []
          dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
          while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
            data.push((datas[key].find((ch) => ch.callDate === dateStart.format('YYYYMMDD')) || { totalCount: 0 }).totalCount)
            dateStart.add(1, 'days')
          }
          datasets.push({
            label: key,
            backgroundColor: this.bgColors[xi++ % this.bgColors.length],
            data: data
          })
        }
      }
      return {
        labels: labels,
        datasets: datasets
      }
    },
    barChartJSOptions: function () {
      if (this.searchForm.rsltTimeType === 'B') {
        // 월별
        return {
          responsive: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          legend: {
            position: 'bottom'
          },
          title: {
            display: false,
            text: '월별 상담 현황'
          },
          maintainAspectRatio: false
        }
      } else {
        // 일별
        return {
          responsive: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          legend: {
            position: 'bottom'
          },
          title: {
            display: false,
            text: '일별 상담 현황'
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                offsetGridLines: true
              }
            }]
          }
        }
      }
    },
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsTimeTypeList () {
      const timeTypeList = []
      timeTypeList.push(...this.searchForm.itemsTimeTypeList)
      return timeTypeList
    },
    cptdItemsTenantList () {
      const tenantList = []
      tenantList.push(...this.searchForm.itemsTenantList)
      return tenantList
    },
    dateRangeText: {
      get: function () {
        const dateRange = this.searchForm.months
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
        return dateRange.join(' ~ ')
      },
      set: function (value) {
        if (!value) {
          this.searchForm.months = []
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
          this.fnc_getAiConciergeStatisticsList()
        }
      }
    },
    yearText: function () {
      return this.searchForm.year.substring(0, 4)
    },
    dialog: function () {
      return this.popup.type !== null
    }
  },
  watch: {
    pickerYearMenu: function (newVal, oldVal) {
      if (this.searchForm.timeType === 'B') {
        newVal && this.$nextTick(() => {
          this.$refs.pickerYear.internalActivePicker = 'YEAR'
        })
      }
    }
  },
  methods: {
    fnc_getAiConciergeSearchCondition: function () {
      getAiConciergeSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
          this.searchForm.tenant = this.searchForm.itemsTenantList[0].value
          this.searchForm.itemsTimeTypeList = response.data.result.timeTypeList
          this.searchForm.timeType = this.searchForm.itemsTimeTypeList[0].value
        }
      )
    },
    setYear: function (year) {
      this.$refs.pickerYear.internalActivePicker = 'YEAR'
    },
    saveYear: function (year) {
      this.strYear = String(this.$refs.pickerYear.inputYear)
      this.pickerYearMenu = false
      this.$nextTick(() => {
        this.searchForm.year = this.strYear
      })
    },
    fnc_getAiConciergeCartList: function () {
      this.drawChart = false
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        if (this.pickerYearMenu === true) {
          this.strYear = String(this.$refs.pickerYear.inputYear)
          this.pickerYearMenu = false
          this.$nextTick(() => {
            this.searchForm.year = this.strYear
          })
        }
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        if (this.pickerMenu === true) {
          this.$refs.pickerMenu.save(this.searchForm.months)
        }
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      // param setting
      const searchCondition = {
        tenantId: this.searchForm.tenant,
        branchNm: this.searchForm.branchNm,
        timeType: this.searchForm.timeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getAiConciergeStatisticsChartList(searchCondition).then(
        response => {
          this.statisticsChartList = response.data.result.aiConciergeStatisticsChartList ? response.data.result.aiConciergeStatisticsChartList : []
        }
      ).finally(() => {
        this.pagination.loading = false
        this.$nextTick(() => {
          this.drawChart = true
          this.searchForm.rsltTimeType = this.searchForm.timeType
          this.searchForm.startMonth = this.searchForm.months[0]
          this.searchForm.endMonth = this.searchForm.months[1]
        })
        this.fnc_getAiConciergeStatisticsList()
      })
    },
    fnc_getAiConciergeStatisticsList: function () {
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        if (this.pickerYearMenu === true) {
          this.strYear = String(this.$refs.pickerYear.inputYear)
          this.pickerYearMenu = false
          this.$nextTick(() => {
            this.searchForm.year = this.strYear
          })
        }
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        if (this.pickerMenu === true) {
          this.$refs.pickerMenu.save(this.searchForm.months)
        }
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        tenantId: this.searchForm.tenant,
        branchNm: this.searchForm.branchNm,
        timeType: this.searchForm.timeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getAiConciergeStatisticsList(searchCondition).then(
        response => {
          this.statisticsList = response.data.result.aiConciergeStatisticsList ? response.data.result.aiConciergeStatisticsList : []
          // paging setting
          this.pagination.totalRows = response.data.result.aiConciergeStatisticsListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
        }
      ).finally(() => {
        this.pagination.loading = false
      })
    },
    comma: function (n) {
      return Number(n).toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
    excelDown: function () {
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        if (this.pickerYearMenu === true) {
          this.strYear = String(this.$refs.pickerYear.inputYear)
          this.pickerYearMenu = false
          this.$nextTick(() => {
            this.searchForm.year = this.strYear
          })
        }
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        if (this.pickerMenu === true) {
          this.$refs.pickerMenu.save(this.searchForm.months)
        }
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      // param setting
      const searchCondition = {
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        tenantId: this.searchForm.tenant,
        branchNm: this.searchForm.branchNm,
        timeType: this.searchForm.timeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      reqAiConciergeStatisticsExcelDown(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_AI컨시어지_기간별_집계.xlsx'

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
    fnc_reqAiConciergeStatisticsBatch: function () {
      if (!confirm('통계수집을 진행하시겠습니까?')) {
        return
      }
      reqAiConciergeStatisticsBatch().then(
        response => {
          alert('통계수집을 완료하였습니다.')
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.v-data-table {
  thead {
    tr {
      th {
        border-bottom: thin solid rgba(0, 0, 0, 0.12);
      }
    }
  }
}
</style>
