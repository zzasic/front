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
              @click="searchBtn"
            >{{ $t('button.search')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- 통화 건수 및 시간 -->
      <v-container class="db-card" no-gutters fluid>
        <v-row class="db-card__row">
          <v-col class="db-card__item">
            <div class="db-card__head">
              <h4 class="db-card__head-title">전체 통화 건수</h4>
              <!-- 해당 페이지 이동 버튼 -->
              <button type="button" class="db-card__head-link"></button>
            </div>
            <ul class="db-card__list">
              <li class="db-card__dl"><div class="db-card__dt">전체</div><div class="db-card__dd"><strong>1,000</strong>건</div></li>
              <li class="db-card__dl"><div class="db-card__dt">인바운드</div><div class="db-card__dd"><strong>500</strong>건</div></li>
              <li class="db-card__dl"><div class="db-card__dt">아웃바운드</div><div class="db-card__dd"><strong>500</strong>건</div></li>
              <li class="db-card__dl"><div class="db-card__dt">전일대비 증감</div><div class="db-card__dd">
                <!-- 오른 경우 up / 떨어진 경우 down 클래스 -->
                <strong class="up">1000</strong>%</div>
              </li>
            </ul>
          </v-col>
          <v-col class="db-card__item">
            <div class="db-card__head">
              <h4 class="db-card__head-title">호전환 건수</h4>
              <button type="button" class="db-card__head-link"></button>
            </div>
            <ul class="db-card__list">
              <li class="db-card__dl"><div class="db-card__dt">전체</div><div class="db-card__dd"><strong>1,000</strong>건</div></li>
              <li class="db-card__dl"><div class="db-card__dt">인바운드</div><div class="db-card__dd"><strong>500</strong>건</div></li>
              <li class="db-card__dl"><div class="db-card__dt">아웃바운드</div><div class="db-card__dd"><strong>500</strong>건</div></li>
              <li class="db-card__dl"><div class="db-card__dt">전일대비 증감</div><div class="db-card__dd"><strong class="down">10</strong>%</div></li>
            </ul>
          </v-col>
          <v-col class="db-card__item">
            <div class="db-card__head">
              <h4 class="db-card__head-title">전체 통화 시간</h4>
              <button type="button" class="db-card__head-link"></button>
            </div>
            <ul class="db-card__list">
              <li class="db-card__dl"><div class="db-card__dt">전체</div><div class="db-card__dd"><strong>11:00:00</strong></div></li>
              <li class="db-card__dl"><div class="db-card__dt">인바운드</div><div class="db-card__dd"><strong>06:00:00</strong></div></li>
              <li class="db-card__dl"><div class="db-card__dt">아웃바운드</div><div class="db-card__dd"><strong>5:00:00</strong></div></li>
              <li class="db-card__dl"><div class="db-card__dt">전일대비 증감</div><div class="db-card__dd"><strong class="up">44.9</strong>%</div></li>
            </ul>
          </v-col>
          <v-col class="db-card__item">
            <div class="db-card__head">
              <h4 class="db-card__head-title">평균 통화 시간</h4>
              <button type="button" class="db-card__head-link"></button>
            </div>
            <ul class="db-card__list">
              <li class="db-card__dl"><div class="db-card__dt">전체</div><div class="db-card__dd"><strong>11:00:00</strong></div></li>
              <li class="db-card__dl"><div class="db-card__dt">인바운드</div><div class="db-card__dd"><strong>06:00:00</strong></div></li>
              <li class="db-card__dl"><div class="db-card__dt">아웃바운드</div><div class="db-card__dd"><strong>5:00:00</strong></div></li>
              <li class="db-card__dl"><div class="db-card__dt">전일대비 증감</div><div class="db-card__dd"><strong class="down">44.9</strong>%</div></li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
      <!-- //통화 건수 및 시간 -->
      <!-- 그래프 영역 -->
      <v-container class="db-card" no-gutters fluid>
        <v-row class="db-card__row">
          <v-col class="db-card__item">
            <div class="db-card__head db-card__head--noline">
              <h4 class="db-card__head-title">전체 통화 건수 그래프</h4>
            </div>
            <div class="db-card__chart">
              <bar-charts
                v-if="chartLoad.chart1 === true"
                :chartData="barChartJSData"
                :options="barChartJSOptions"
              ></bar-charts>
            </div>
          </v-col>
          <v-col class="db-card__item">
            <div class="db-card__head db-card__head--noline">
              <h4 class="db-card__head-title">호전환 건수 그래프</h4>
            </div>
            <div class="db-card__chart">
              <line-charts
                v-if="chartLoad.chart2 === true"
                :chartData="lineChartJSData"
                :options="lineChartJSOptions"
              ></line-charts>
            </div>
          </v-col>
          <v-col class="db-card__item">
            <div class="db-card__head db-card__head--noline">
              <h4 class="db-card__head-title">호전환 건수 그래프</h4>
            </div>
            <div class="db-card__chart">
              <pie-charts
                v-if="chartLoad.chart3 === true"
                :chartData="pieChartJSData"
                :options="pieChartJSOptions"
              ></pie-charts>
            </div>
          </v-col>
        </v-row>
        <v-row class="db-card__row">
          <v-col class="db-card__item">
            <div class="db-card__head db-card__head--noline">
              <h4 class="db-card__head-title">전체 통화 시간 그래프</h4>
            </div>
            <div class="db-card__chart">
              <bar-charts
                v-if="chartLoad.chart4 === true"
                :chartData="statisticsChartJSData"
                :options="statisticsChartJSOptions"
              ></bar-charts>
            </div>
          </v-col>
          <v-col class="db-card__item">
            <div class="db-card__head db-card__head--noline">
              <h4 class="db-card__head-title">평균 통화 시간 그래프</h4>
            </div>
            <div class="db-card__chart">
              <bar-charts
                v-if="chartLoad.chart5 === true"
                :chartData="statisticsChartJSData"
                :options="statisticsChartJSOptions"
              ></bar-charts>
            </div>
          </v-col>
        </v-row>
        <v-row class="db-card__row">
          <v-col class="db-card__item">
            <div class="db-card__head db-card__head--noline">
              <h4 class="db-card__head-title">전체 통화 시간 그래프</h4>
            </div>
            <div class="db-card__chart">
              <bar-charts
                v-if="chartLoad.chart6 === true"
                :chartData="statisticsChartJSData"
                :options="statisticsChartJSOptions"
              ></bar-charts>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <!-- //그래프 영역 -->
      <v-dialog
        v-model="dialog"
        persistent
        width="1280"
        scrollable
        >
        <popup-start-fail-history-view
          :popup.sync="popup"
          v-if="popup.type === 'SF' && popup.tenantId !== null && popup.callDate !== null"
          />
        <popup-start-transfer-history-view
          :popup.sync="popup"
          v-if="popup.type === 'ST' && popup.tenantId !== null && popup.callDate !== null"
          />
        <popup-fail-history-view
          :popup.sync="popup"
          v-if="popup.type === 'F' && popup.tenantId !== null && popup.callDate !== null"
          />
        <popup-transfer-history-view
          :popup.sync="popup"
          v-if="popup.type === 'TR' && popup.tenantId !== null && popup.callDate !== null"
          />
        <popup-success-history-view
          :popup.sync="popup"
          v-if="popup.type === 'S' && popup.tenantId !== null && popup.callDate !== null"
          />
        <popup-total-history-view
          :popup.sync="popup"
          v-if="popup.type === 'T' && popup.tenantId !== null && popup.callDate !== null"
          />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import BarCharts from '@/components/chart/BarCharts'
import PieCharts from '@/components/chart/PieCharts'
import LineCharts from '@/components/chart/LineCharts'
import {
  getSearchCondition,
  getStatisticsChartList,
  reqGetManualStatistics
} from '../../api/statistics'
import datepicker from '@/plugins/datepicker'
import PopupStartFailHistoryView from '@/views/statistics/PopupStartFailHistoryView'
import PopupStartTransferHistoryView from '@/views/statistics/PopupStartTransferHistoryView'
import PopupFailHistoryView from '@/views/statistics/PopupFailHistoryView'
import PopupTransferHistoryView from '@/views/statistics/PopupTransferHistoryView'
import PopupSuccessHistoryView from '@/views/statistics/PopupSuccessHistoryView'
import PopupTotalHistoryView from '@/views/statistics/PopupTotalHistoryView'

export default {
  name: 'DailyStatisticsView',
  components: {
    // GChart,
    BarCharts,
    PieCharts,
    LineCharts,
    PopupStartFailHistoryView,
    PopupStartTransferHistoryView,
    PopupFailHistoryView,
    PopupTransferHistoryView,
    PopupSuccessHistoryView,
    PopupTotalHistoryView
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.getSearchCondition()
    this.getStatisticsChartList()
  },
  data () {
    return {
      chartLoad: {
        chart1: false,
        chart2: false,
        chart3: false,
        chart4: false,
        chart5: false,
        chart6: false
      },
      bgColors: ['blue', 'red', 'yellow', 'navy', 'maroon', 'lime', 'purple', 'orange', 'green', 'fuchsia', 'brown', 'teal', 'deeppink', 'olive', 'aqua'],
      chartType: 'ChartJS',
      pickerYearMenu: false,
      drawChart: false,
      headers: [
        { text: '상담일', value: 'callDate', align: 'center', width: '200px' },
        { text: '테넌트', value: 'tenantNm', align: 'center' },
        { text: '추론실패-단선', value: 'startFailCount', align: 'center', width: '200px' },
        { text: '추론실패-호전환', value: 'startTransferCount', align: 'center', width: '200px' },
        { text: '추론성공-중단', value: 'failCount', align: 'center', width: '200px' },
        { text: '추론성공-호전환', value: 'transferCount', align: 'center', width: '200px' },
        { text: '추론성공-정상', value: 'successCount', align: 'center', width: '200px' },
        { text: '전체', value: 'totalCount', align: 'center', width: '200px' }
      ],
      statisticsList: [],
      statisticsChartList: [],
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
    statisticsChartJSData: function () {
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
        let dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
        const dateEnd = this.$moment(`${this.searchForm.endMonth}-01`).endOf('month')
        while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
          labels.push(dateStart.format('MM-DD'))
          dateStart.add(1, 'days')
        }
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
    barChartJSData: function () {
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
        let dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
        const dateEnd = this.$moment(`${this.searchForm.endMonth}-01`).endOf('month')
        while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
          labels.push(dateStart.format('MM-DD'))
          dateStart.add(1, 'days')
        }
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
    lineChartJSData: function () {
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
            borderColor: this.bgColors[xi++ % this.bgColors.length],
            data: data,
            tension: 0.1,
            fill: false
          })
        }
      } else {
        // 일별
        let dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
        const dateEnd = this.$moment(`${this.searchForm.endMonth}-01`).endOf('month')
        while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
          labels.push(dateStart.format('MM-DD'))
          dateStart.add(1, 'days')
        }
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
            borderColor: this.bgColors[xi++ % this.bgColors.length],
            data: data,
            tension: 0.1,
            fill: false
          })
        }
      }
      return {
        labels: labels,
        datasets: datasets
      }
    },
    lineChartJSOptions: function () {
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
    pieChartJSData: function () {
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
        for (const key of keys) {
          const data = []
          m = 1
          while (m <= 12) {
            data.push((datas[key].find((ch) => ch.callDate === `${m}월`) || { totalCount: 0 }).totalCount)
            m++
          }
          datasets.push({
            label: '월별',
            backgroundColor: this.bgColors,
            data: data,
            hoverOffset: 4
          })
        }
      } else {
        // 일별
        let dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
        const dateEnd = this.$moment(`${this.searchForm.endMonth}-01`).endOf('month')
        while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
          labels.push(dateStart.format('MM-DD'))
          dateStart.add(1, 'days')
        }
        for (const key of keys) {
          const data = []
          dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
          while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
            data.push((datas[key].find((ch) => ch.callDate === dateStart.format('YYYYMMDD')) || { totalCount: 0 }).totalCount)
            dateStart.add(1, 'days')
          }
          datasets.push({
            label: '일별',
            backgroundColor: this.bgColors,
            data: data,
            hoverOffset: 4
          })
        }
      }
      return {
        labels: labels,
        datasets: datasets
      }
    },
    pieChartJSOptions: function () {
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
            position: 'right'
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
            position: 'right'
          },
          title: {
            display: false,
            text: '일별 상담 현황'
          },
          maintainAspectRatio: false
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
      const timeTypeList = [{
        text: '일별',
        value: 'A'
      },
      {
        text: '월별',
        value: 'B'
      }]
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
    getSearchCondition: function () {
      getSearchCondition().then(
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
    getStatisticsChartList: function () {
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
        timeType: this.searchForm.timeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getStatisticsChartList(searchCondition).then(
        response => {
          this.statisticsChartList = response.data.result.statisticsList ? response.data.result.statisticsList : []
          // paging setting
        }
      ).finally(() => {
        this.pagination.loading = false
        this.$nextTick(() => {
          this.drawChart = true
          this.searchForm.rsltTimeType = this.searchForm.timeType
          this.searchForm.startMonth = this.searchForm.months[0]
          this.searchForm.endMonth = this.searchForm.months[1]
        })
        this.chartLoad.chart1 = true
        this.chartLoad.chart2 = true
        this.chartLoad.chart3 = true
        this.chartLoad.chart4 = true
        this.chartLoad.chart5 = true
        this.chartLoad.chart6 = true
      })
    },
    searchBtn () {
      this.pagination.page = 1
      this.getStatisticsChartList()
    },
    getManualStatistics () {
      if (!confirm('통계수집을 진행하시겠습니까?')) {
        return
      }
      reqGetManualStatistics().then(
        response => {
          alert('통계수집을 완료하였습니다.')
          this.getStatisticsChartList()
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    comma: function (n) {
      return Number(n).toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
    popupAction: function (popup) {
      this.popup = popup
    },
    // 의도추론실패-단선상세버튼
    startFailDetailRow: function (data) {
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      this.popup = {
        type: 'SF',
        tenantId: data.tenantId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 의도추론실패-호전환 상세버튼
    startTransferDetailRow: function (data) {
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      this.popup = {
        type: 'ST',
        tenantId: data.tenantId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 의도추론성공-통화중단상세버튼
    failDetailRow: function (data) {
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      this.popup = {
        type: 'F',
        tenantId: data.tenantId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 의도추론성공-호전환상세버튼
    transferDetailRow: function (data) {
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      this.popup = {
        type: 'TR',
        tenantId: data.tenantId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 의도추론성공-정상통화상세버튼
    successDetailRow: function (data) {
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      this.popup = {
        type: 'S',
        tenantId: data.tenantId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 전체상세버튼
    totalDetailRow: function (data) {
      const dateRange = []
      if (this.searchForm.timeType === 'B') {
        dateRange.push(this.strYear.substring(0, 4) + '-01')
        dateRange.push(this.strYear.substring(0, 4) + '-12')
      } else {
        dateRange.push(...this.searchForm.months)
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      }
      this.popup = {
        type: 'T',
        tenantId: data.tenantId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
