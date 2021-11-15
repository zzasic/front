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
          <!-- 날짜 검색 -->
          <v-col cols="2">
            <v-menu
              content-class="date-picker"
              ref="pickerMenu"
              v-model="pickerMenu"
              :return-value.sync="searchForm.searchDate"
              :close-on-content-click="false"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="default text-field-date pr-0"
                  v-model='searchForm.searchDate'
                  label="검색일"
                  placeholder="YYYY-MM-DD"
                  v-on="on"
                  :rules="[
                    v => !!v || '검색일을 선택해주세요'
                  ]"
                  readonly
                  clearable
                  @click="clickPicker"
                >
                </v-text-field>
              </template>
              <div @click="clickPicker">
                <v-date-picker
                  class="single-date"
                  v-model="searchForm.searchDate"
                  no-title
                  scrollable
                  :date-format="date => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(searchForm.searchDate)">{{ $t('button.confirm')}}</v-btn>
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
              @click="fnc_getIccDashboardList"
            >{{ $t('button.search')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- 사용량 -->
      <v-container class="sol_use" no-gutters fluid>
        <v-row class="sol_use__status-wrap" align="center" justify="center">
          <v-card class="sol_use__status-total" color="#FFDCDC">
            전체
          </v-card>
          <v-card class="sol_use__status-value">
            {{ totCnt }}
          </v-card>
          <v-card class="sol_use__status-list" color="#C8FFFF">
            STT
          </v-card>
          <v-card class="sol_use__status-value">
            {{ sttCnt }}
          </v-card>
          <v-card class="sol_use__status-list" color="#C8FFFF">
            TTS
          </v-card>
          <v-card class="sol_use__status-value">
            {{ ttsCnt }}
          </v-card>
          <v-card class="sol_use__status-list" color="#C8FFFF">
            TA
          </v-card>
          <v-card class="sol_use__status-value">
            {{ taCnt }}
          </v-card>
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
                <line-charts
                  :chartData="statisticsChartJSData"
                  :options="statisticsChartJSOptions"
                ></line-charts>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <PageSectionTitle
        :title="pagination.sectionTitle"
      >
      </PageSectionTitle>
      <v-card class="data-grid-wrap default">
        <v-data-table
          :headers="headers"
          :items="iccBranchTopFiveList"
          :options.sync="optionSync"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
        </v-data-table>
      </v-card>
    </vuescroll>
  </div>
</template>

<script>
// 시간별 조회를 하기 위해서 추가한 api 및 데이터

import LineCharts from '@/components/LineCharts'
import datepicker from '@/plugins/datepicker'
import {
  getIccSearchCondition,
  getIccDashboardList
} from '../../../api/shinhan/icc'

export default {
  name: 'IccDashboardView',
  components: {
    // GChart,
    LineCharts
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.fnc_getIccSearchCondition()
    this.fnc_getIccDashboardList()
  },
  data () {
    return {
      chartType: 'ChartJS',
      pickerYearMenu: false,
      drawChart: false,
      headers: [
        { text: '지점코드', value: 'branchCd', align: 'center', width: '200px', sortable: false },
        { text: '지점명', value: 'branchNm', align: 'center', width: '250px' },
        { text: 'STT', value: 'sttCnt', align: 'center', width: '200px' },
        { text: 'TTS', value: 'ttsCnt', align: 'center', width: '200px' },
        { text: 'TA', value: 'taCnt', align: 'center', width: '200px' },
        { text: '전체', value: 'totCnt', align: 'center', width: '200px' }
      ],
      iccUseCnt: [],
      iccStatisticsChartList: [],
      iccBranchTopFiveList: [],
      pagination: {
        sectionTitle: '지점별 TOP 5'
      },
      options: {},
      strYear: this.$moment(new Date()).format('YYYY'),
      searchForm: {
        itemsTenantList: [],
        searchDate: this.$moment().format('YYYY-MM-DD'),
        tenant: '',
        timeType: 'D',
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
        scenarioId: null,
        callDate: null,
        timeType: null,
        startMonth: null,
        endMonth: null
      }
    }
  },
  computed: {
    statisticsChartJSData: function () {
      const datas = this.iccStatisticsChartList.reduce((acc, val) => {
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
      const lineColors = []
      const backgroundColors = []

      lineColors.push('#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40', '#04b4ae', '#df01a5', '#21610b', '#5f4c0b')
      backgroundColors.push('#ffb0c1', '#9ad0f5', '#ffe6aa', '#a4dfdf', '#ccb2ff', '#ffb0c1', '#81f7f3', '#f5a9e1', '#bcf5a9', '#f3e2a9')
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
          borderColor: lineColors[n],
          backgroundColor: backgroundColors[n],
          data: data
        })
        n++
      }
      return {
        labels: labels,
        datasets: datasets
      }
    },
    statisticsChartJSOptions: function () {
      // 시간별
      return {
        responsive: true,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 50,
            bottom: 20
          }
        },
        legend: {
          position: 'right'
        },
        title: {
          display: false,
          text: '시간별 상담 현황'
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
    },
    statisticsChartTitle: function () {
      // 시간별
      return '시간별 상담 현황'
    },
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
    totCnt: function () {
      let totCnt = 0
      if (this.iccUseCnt[0]) { totCnt = this.iccUseCnt[0].totCnt }
      return totCnt
    },
    sttCnt: function () {
      let sttCnt = 0
      if (this.iccUseCnt[0]) { sttCnt = this.iccUseCnt[0].sttCnt }
      return sttCnt
    },
    ttsCnt: function () {
      let ttsCnt = 0
      if (this.iccUseCnt[0]) { ttsCnt = this.iccUseCnt[0].ttsCnt }
      return ttsCnt
    },
    taCnt: function () {
      let taCnt = 0
      if (this.iccUseCnt[0]) { taCnt = this.iccUseCnt[0].taCnt }
      return taCnt
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
          this.fnc_getIccDashboardList()
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
  watch: {},
  methods: {
    fnc_getIccSearchCondition: function () {
      getIccSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
        }
      )
    },
    fnc_getIccDashboardList: function () {
      this.drawChart = false
      const searchCondition = {
        searchDate: this.searchForm.searchDate,
        tenantId: this.searchForm.tenant
      }
      // 차트 목록 조회
      getIccDashboardList(searchCondition).then(
        response => {
          this.iccStatisticsChartList = response.data.result.iccStatisticsChartList ? response.data.result.iccStatisticsChartList : []
          this.iccUseCnt = response.data.result.iccUseCount ? response.data.result.iccUseCount : []
          this.iccBranchTopFiveList = response.data.result.iccBranchTopFiveList ? response.data.result.iccBranchTopFiveList : []
        }
      ).finally(() => {
        this.$nextTick(() => {
          this.drawChart = true
        })
      })
    },
    comma: function (n) {
      return Number(n).toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>

<style lang="scss">
.sol_use {
  margin-bottom: 10px;
  &__status-wrap {
    padding: 20px;
    border: 1px solid #DAE3ED;
    background: #ffffff;
  }
  &__status-total {
    padding-top: 5px;
    height: 75px;
    width: 200px;
    text-align: center;
    font-size: 40px;
  }
  &__status-list {
    padding-top: 5px;
    height: 75px;
    width: 200px;
    text-align: center;
    font-size: 40px;
  }
  &__status-value {
    padding-top: 5px;
    margin-right: 25px;
    height: 75px;
    width: 160px;
    text-align: center;
    font-size: 40px;
  }
}
</style>
