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
              @click="fnc_getCallBotDashboardList"
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
          disable-sort
          :headers="headers"
          :items="callbotBranchTopFiveList"
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
import {
  getCallBotSearchCondition,
  getCallBotDashboardList
} from '../../../api/shinhan/callBot'

export default {
  name: 'CallBotDashBoardView',
  components: {
    // GChart,
    LineCharts
  },
  mixins: [],
  created () {
  },
  mounted () {
    this.fnc_getCallBotSearchCondition()
    this.fnc_getCallBotDashboardList()
  },
  data () {
    return {
      chartType: 'ChartJS',
      drawChart: false,
      headers: [
        { text: '지점명', value: 'branchCd', align: 'center', width: '250px', sortable: false },
        // { text: '챗봇', value: 'chatBotCnt', align: 'center', width: '200px' },
        { text: 'STT', value: 'sttCnt', align: 'center', width: '200px' },
        { text: 'TTS', value: 'ttsCnt', align: 'center', width: '200px' },
        { text: 'TA', value: 'taCnt', align: 'center', width: '200px' },
        { text: '전체', value: 'totCnt', align: 'center', width: '200px' }
      ],
      callBotUseCnt: [],
      callBotStatisticsChartList: [],
      callbotBranchTopFiveList: [],
      pagination: {
        sectionTitle: '지점별 TOP 5'
      },
      options: {},
      searchForm: {
        itemsTenantList: [],
        tenant: ''
      }
    }
  },
  computed: {
    statisticsChartJSData: function () {
      const datas = this.callBotStatisticsChartList.reduce((acc, val) => {
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
        maintainAspectRatio: false
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
      if (this.callBotUseCnt[0]) { totCnt = this.callBotUseCnt[0].totCnt }
      return totCnt
    },
    sttCnt: function () {
      let sttCnt = 0
      if (this.callBotUseCnt[0]) { sttCnt = this.callBotUseCnt[0].sttCnt }
      return sttCnt
    },
    ttsCnt: function () {
      let ttsCnt = 0
      if (this.callBotUseCnt[0]) { ttsCnt = this.callBotUseCnt[0].ttsCnt }
      return ttsCnt
    },
    taCnt: function () {
      let taCnt = 0
      if (this.callBotUseCnt[0]) { taCnt = this.callBotUseCnt[0].taCnt }
      return taCnt
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.fnc_getCallBotDashboardList()
        }
      }
    }
  },
  watch: {},
  methods: {
    fnc_getCallBotSearchCondition: function () {
      getCallBotSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
        }
      )
    },
    fnc_getCallBotDashboardList: function () {
      this.drawChart = false
      // param setting
      const searchCondition = {
        tenantId: this.searchForm.tenant
      }
      // 차트 목록 조회
      getCallBotDashboardList(searchCondition).then(
        response => {
          this.callBotStatisticsChartList = response.data.result.callBotStatisticsChartList ? response.data.result.callBotStatisticsChartList : []
          this.callBotUseCnt = response.data.result.callBotUseCount ? response.data.result.callBotUseCount : []
          this.callbotBranchTopFiveList = response.data.result.callBotBranchTopFiveList ? response.data.result.callBotBranchTopFiveList : []
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
