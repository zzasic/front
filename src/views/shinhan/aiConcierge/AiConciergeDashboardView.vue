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
          <v-col class="text-right">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-search"
              :ripple="false"
              @click="fnc_getAiConciergeStatisticsChartList"
            >{{ $t('button.search')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- 사용량 -->
      <v-container class="sol_use" no-gutters fluid>
        <v-row class="sol_use__status-wrap" align="center" justify="center">
        <v-chip-group>
          <v-card class="sol_use__status-total" color="#e9eff5"><!-- #CEF279 -->
            전체
          </v-card>
          <v-card class="sol_use__status-value">
            {{ totalCnt }}
          </v-card>
          <v-card class="sol_use__status-list" color="#ffb0c1">
            음성
          </v-card>
          <v-card class="sol_use__status-value">
            {{ voiceCnt }}
          </v-card>
        </v-chip-group>
        <v-chip-group>
          <v-card class="sol_use__status-list" color="#ffe6aa">
            버튼
          </v-card>
          <v-card class="sol_use__status-value">
            {{ buttonCnt }}
          </v-card>
          <v-card class="sol_use__status-list" color="#9ad0f5">
            침묵
          </v-card>
          <v-card class="sol_use__status-value">
            {{ silenceCnt }}
          </v-card>
          </v-chip-group>
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
          disable-sort
          :headers="headers"
          :items="aiConciergeBotBranchTopFiveList"
          :options.sync="optionSync"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
        </v-data-table>
      </v-card>
      <!-- <div class="btn-group align-right">
        <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div> -->
    </vuescroll>
  </div>
</template>

<script>
// 시간별 조회를 하기 위해서 추가한 api 및 데이터

import LineCharts from '@/components/LineCharts'
import {
  getAiConciergeSearchCondition, // 초기 조회 조건
  getAiConciergeSearchList
} from '../../../api/shinhan/aiConcierge'

export default {
  name: 'AiConciergeDashboardView',
  components: {
    // GChart,
    LineCharts
  },
  mixins: [],
  created () {
  },
  mounted () {
    this.init()
  },
  data () {
    return {
      chartType: 'ChartJS',
      pickerYearMenu: false,
      drawChart: false,
      headers: [
        { text: '지점코드', value: 'branchCd', align: 'center', width: '200px' },
        { text: '지점명', value: 'branchNm', align: 'center', width: '250px' },
        { text: '음성(건)', value: 'voiceCnt', align: 'center', width: '200px' },
        { text: '버튼(건)', value: 'buttonCnt', align: 'center', width: '200px' },
        { text: '침묵(건)', value: 'silenceCnt', align: 'center', width: '200px' },
        { text: '전체', value: 'totalCnt', align: 'center', width: '200px' }
      ],
      aiConciergeUseCnt: [],
      aiConciergeStatisticsChartList: [],
      aiConciergeBotBranchTopFiveList: [],
      pagination: {
        sectionTitle: '지점별 TOP 5'
      },
      options: {},
      strYear: this.$moment(new Date()).format('YYYY'),
      searchForm: {
        itemsTenantList: [],
        tenant: '',
        timeType: 'D'
        // year: this.$moment(new Date()).format('YYYY'),
        // months: [
        //   this.$moment(new Date()).format('YYYY-MM'),
        //   this.$moment(new Date()).format('YYYY-MM')
        // ],
        // startMonth: this.$moment(new Date()).format('YYYY-MM'),
        // endMonth: this.$moment(new Date()).format('YYYY-MM')
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
      const datas = this.aiConciergeStatisticsChartList.reduce((acc, val) => {
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

      lineColors.push('#ff6384', '#ffcd56', '#36a2eb', '#4bc0c0', '#9966ff', '#ff9f40', '#04b4ae', '#df01a5', '#21610b', '#5f4c0b')
      backgroundColors.push('#ffb0c1', '#ffe6aa', '#9ad0f5', '#a4dfdf', '#ccb2ff', '#ffb0c1', '#81f7f3', '#f5a9e1', '#bcf5a9', '#f3e2a9')
      // 시간별
      let m = 0
      let n = 0
      while (m <= 23) {
        labels.push(`${m}시`)
        m++
      }
      for (const key of keys) {
        const data = []
        m = 0
        while (m <= 23) {
          data.push((datas[key].find((ch) => ch.dayText === `${m}시`) || { totalCnt: 0 }).totalCnt)
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
    totalCnt: function () {
      let totalCnt = 0
      if (this.aiConciergeUseCnt[0]) { totalCnt = this.aiConciergeUseCnt[0].totalCnt }
      return totalCnt
    },
    voiceCnt: function () {
      let voiceCnt = 0
      if (this.aiConciergeUseCnt[0]) { voiceCnt = this.aiConciergeUseCnt[0].voiceCnt }
      return voiceCnt
    },
    buttonCnt: function () {
      let buttonCnt = 0
      if (this.aiConciergeUseCnt[0]) { buttonCnt = this.aiConciergeUseCnt[0].buttonCnt }
      return buttonCnt
    },
    silenceCnt: function () {
      let silenceCnt = 0
      if (this.aiConciergeUseCnt[0]) { silenceCnt = this.aiConciergeUseCnt[0].silenceCnt }
      return silenceCnt
    },
    // dateRangeText: {
    //   get: function () {
    //     const dateRange = this.searchForm.months
    //     dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
    //     return dateRange.join(' ~ ')
    //   },
    //   set: function (value) {
    //     if (!value) {
    //       this.searchForm.months = []
    //     }
    //   }
    // },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.fnc_getAiConciergeStatisticsChartList()
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
    async init () {
      await this.fnc_getAiConciergeSearchCondition()
      this.fnc_getAiConciergeStatisticsChartList()
    },
    fnc_getAiConciergeSearchCondition: function () {
      getAiConciergeSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
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
    fnc_getAiConciergeStatisticsChartList: function () {
      this.drawChart = false
      // param setting
      const searchCondition = {
        searchDate: this.$moment().format('YYYY-MM-DD'),
        tenantId: this.searchForm.tenant
      }
      // 대시보드 정보 조회
      getAiConciergeSearchList(searchCondition).then(
        response => {
          this.aiConciergeUseCnt = response.data.result.aiConciergeUseCount ? response.data.result.aiConciergeUseCount : []
          this.aiConciergeStatisticsChartList = response.data.result.aiConciergeStatisticsChartList ? response.data.result.aiConciergeStatisticsChartList : []
          this.aiConciergeBotBranchTopFiveList = response.data.result.aiConciergeBotBranchTopFiveList ? response.data.result.aiConciergeBotBranchTopFiveList : []

          console.log('상단 사용량 : ', this.aiConciergeUseCnt)
          console.log('차트 : ', this.aiConciergeStatisticsChartList)
          console.log('그리드 : ', this.aiConciergeBotBranchTopFiveList)
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
