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
              v-model="searchForm.chatbot"
              :items="cptdItemsChatbotList"
              label="챗봇"
              :placeholder="searchForm.chatbot ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.scenario"
              :items="cptdItemsScenarioList"
              label="시나리오"
              :placeholder="searchForm.scenario ? undefined : $t('label.all')"
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
              @click="getScenarioStatisticsChartList"
            >{{ $t('button.search')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-card class="data-grid-wrap default" v-if="drawChart === true && pagination.totalRows > 0 && statisticsChartList && statisticsChartList.length > 0">
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
              <td class="text-left">{{ props.item.tenantNm }}</td>
              <td class="text-left">{{ props.item.scenarioNm }}</td>
              <td class="text-right"><v-btn @click="startFailDetailRow(props.item)" text class="default">{{ comma(props.item.startFailCount) }}</v-btn></td>
              <td class="text-right"><v-btn @click="failDetailRow(props.item)" text class="default">{{ comma(props.item.failCount) }}</v-btn></td>
              <td class="text-right"><v-btn @click="transferDetailRow(props.item)" text class="default">{{ comma(props.item.transferCount) }}</v-btn></td>
              <td class="text-right"><v-btn @click="successDetailRow(props.item)" text class="default">{{ comma(props.item.successCount) }}</v-btn></td>
              <td class="text-right"><v-btn @click="totalDetailRow(props.item)" text class="default">{{ comma(props.item.totalCount) }}</v-btn></td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          @change="getScenarioStatisticsList"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="getScenarioStatisticsList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        width="1280"
        scrollable
        >
        <popup-scenario-start-fail-history-view
          :popup.sync="popup"
          v-if="popup.type === 'SF' && popup.scenarioId !== null && popup.callDate !== null"
          />
        <popup-scenario-fail-history-view
          :popup.sync="popup"
          v-if="popup.type === 'FA' && popup.scenarioId !== null && popup.callDate !== null"
          />
        <popup-scenario-success-history-view
          :popup.sync="popup"
          v-if="popup.type === 'SS' && popup.scenarioId !== null && popup.callDate !== null"
          />
        <popup-scenario-total-history-view
          :popup.sync="popup"
          v-if="popup.type === 'AL' && popup.scenarioId !== null && popup.callDate !== null"
          />
        <popup-scenario-transfer-history-view
          :popup.sync="popup"
          v-if="popup.type === 'TR' && popup.scenarioId !== null && popup.callDate !== null"
          />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
// import { GChart } from 'vue-google-charts'
import LineCharts from '@/components/LineCharts'
import {
  getScenarioSearchCondition,
  getScenarioStatisticsList,
  getScenarioStatisticsChartList,
  reqExcelDownScenarioStat
} from '../../api/statistics'
import datepicker from '@/plugins/datepicker'
import PopupScenarioStartFailHistoryView from '@/views/statistics/PopupScenarioStartFailHistoryView'
import PopupScenarioFailHistoryView from '@/views/statistics/PopupScenarioFailHistoryView'
import PopupScenarioSuccessHistoryView from '@/views/statistics/PopupScenarioSuccessHistoryView'
import PopupScenarioTotalHistoryView from '@/views/statistics/PopupScenarioTotalHistoryView'
import PopupScenarioTransferHistoryView from '@/views/statistics/PopupScenarioTransferHistoryView'

export default {
  name: 'DailyScenarioStatisticsView',
  components: {
    // GChart,
    LineCharts,
    PopupScenarioStartFailHistoryView,
    PopupScenarioFailHistoryView,
    PopupScenarioSuccessHistoryView,
    PopupScenarioTotalHistoryView,
    PopupScenarioTransferHistoryView
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.getScenarioSearchCondition()
    this.getScenarioStatisticsChartList()
  },
  data () {
    return {
      chartType: 'ChartJS',
      pickerYearMenu: false,
      drawChart: false,
      headers: [
        { text: '테넌트', value: 'tenantNm', align: 'center', width: '200px' },
        { text: '시나리오명', value: 'scenarioNm', align: 'center' },
        { text: '단선', value: 'startFailCount', align: 'center', width: '150px' },
        { text: '통화중단', value: 'failCount', align: 'center', width: '150px' },
        { text: '호전환', value: 'transferCount', align: 'center', width: '150px' },
        { text: '정상통화', value: 'successCount', align: 'center', width: '150px' },
        { text: '전체', value: 'totalCount', align: 'center', width: '150px' }
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
        itemsChatbotList: [],
        chatbot: '',
        itemsScenarioList: [],
        scenario: '',
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
        scenarioId: null,
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
    statisticsChartData: function () {
      const result = []
      const data = []
      data.push('callDate')
      const dataKeys = Object.values(this.statisticsChartList.reduce((acc, val) => {
        const key = `${val.scenarioId}`
        if (!acc[key]) {
          acc[key] = {
            scenarioId: val.scenarioId,
            scenarioNm: val.scenarioNm
          }
        }
        return acc
      }, {}))
      for (const dataKey of dataKeys) {
        data.push(`${dataKey.scenarioNm}`)
        data.push({ type: 'string', role: 'tooltip', p: { html: true } })
      }

      if (this.searchForm.rsltTimeType === 'D') {
        // 시간별
        result.push(...Object.values(this.statisticsChartList.reduce((acc, val) => {
          const key = val.callDate
          if (!acc[key]) {
            acc[key] = []
            acc[key].push(key)
            for (const d of dataKeys) {
              acc[key].push(0)
              acc[key].push(`<table><tr><td colspan="2" width="86px" style="font-weight:bold">${this.$moment(key).format('MM.DD')}</td></tr><tr><td>${d.scenarioNm}</td><td width="38px" style="text-align:right">0건</td></tr></table>`)
            }
          }
          const dkIdx = dataKeys.findIndex((dk) => {
            return val.scenarioId === dk.scenarioId
          })
          if (dkIdx > -1) {
            acc[key].splice((dkIdx * 2) + 1, 2, val.totalCount, `<table><tr><td colspan="2" style="font-weight:bold">${this.$moment(key).format('MM.DD')}</td></tr><tr><td>${val.scenarioNm}</td><td width="38px" style="text-align:right">${this.comma(val.totalCount)}건</td></tr></table>`)
          }
          return acc
        }, {})))
      } else if (this.searchForm.rsltTimeType === 'C') {
        // 요일별
        result.push(...Object.values(this.statisticsChartList.reduce((acc, val) => {
          const key = val.callDate
          if (!acc[key]) {
            acc[key] = []
            acc[key].push(key)
            for (const d of dataKeys) {
              acc[key].push(0)
              acc[key].push(`<table><tr><td colspan="2" width="86px" style="font-weight:bold">${this.$moment(key).format('MM.DD')}</td></tr><tr><td>${d.scenarioNm}</td><td width="38px" style="text-align:right">0건</td></tr></table>`)
            }
          }
          const dkIdx = dataKeys.findIndex((dk) => {
            return val.scenarioId === dk.scenarioId
          })
          if (dkIdx > -1) {
            acc[key].splice((dkIdx * 2) + 1, 2, val.totalCount, `<table><tr><td colspan="2" style="font-weight:bold">${this.$moment(key).format('MM.DD')}</td></tr><tr><td>${val.scenarioNm}</td><td width="38px" style="text-align:right">${this.comma(val.totalCount)}건</td></tr></table>`)
          }
          return acc
        }, {})))
      } else if (this.searchForm.rsltTimeType === 'B') {
        // 월별
        result.push(...Object.values(this.statisticsChartList.reduce((acc, val) => {
          const key = val.callDate
          if (!acc[key]) {
            acc[key] = []
            acc[key].push(key)
            for (const d of dataKeys) {
              acc[key].push(0)
              acc[key].push(`<table><tr><td colspan="2" width="86px" style="font-weight:bold">${this.$moment(key).format('MM.DD')}</td></tr><tr><td>${d.scenarioNm}</td><td width="38px" style="text-align:right">0건</td></tr></table>`)
            }
          }
          const dkIdx = dataKeys.findIndex((dk) => {
            return val.scenarioId === dk.scenarioId
          })
          if (dkIdx > -1) {
            acc[key].splice((dkIdx * 2) + 1, 2, val.totalCount, `<table><tr><td colspan="2" style="font-weight:bold">${this.$moment(key).format('MM.DD')}</td></tr><tr><td>${val.scenarioNm}</td><td width="38px" style="text-align:right">${this.comma(val.totalCount)}건</td></tr></table>`)
          }
          return acc
        }, {})))
      } else {
        result.push(...Object.values(this.statisticsChartList.reduce((acc, val) => {
          const key = val.callDate
          if (!acc[key]) {
            acc[key] = []
            acc[key].push(this.$moment(key).toDate())
            for (const d of dataKeys) {
              acc[key].push(0)
              acc[key].push(`<table><tr><td colspan="2" width="86px" style="font-weight:bold">${this.$moment(key).format('MM.DD')}</td></tr><tr><td>${d.scenarioNm}</td><td width="38px" style="text-align:right">0건</td></tr></table>`)
            }
          }
          const dkIdx = dataKeys.findIndex((dk) => {
            return val.scenarioId === dk.scenarioId
          })
          // console.log(dataKeys, val, dkIdx)
          if (dkIdx > -1) {
            acc[key].splice((dkIdx * 2) + 1, 2, val.totalCount, `<table><tr><td colspan="2" style="font-weight:bold">${this.$moment(key).format('MM.DD')}</td></tr><tr><td>${val.scenarioNm}</td><td width="38px" style="text-align:right">${this.comma(val.totalCount)}건</td></tr></table>`)
          }
          return acc
        }, {})))
      }
      result.splice(0, 0, data)
      return result
    },
    statisticsChartOptions: function () {
      if (this.searchForm.rsltTimeType === 'D') {
        return {
          // 시간유형 D
          legend: {
            position: 'right',
            maxLines: 3,
            textStyle: {
              fontSize: 10
            }
          },
          title: '시간별 상담 현황',
          height: 350,
          tooltip: {
            isHtml: true,
            textStyle: {
              fontSize: 10
            }
          },
          vAxis: {
            minValue: 0,
            textStyle: {
              fontSize: 10
            }
          },
          hAxis: {
            // format: 'HH',
            textStyle: {
              fontSize: 10
            }
          }
        }
      } else if (this.searchForm.rsltTimeType === 'C') {
        return {
          // 시간유형 C
          legend: {
            position: 'right',
            maxLines: 3,
            textStyle: {
              fontSize: 10
            }
          },
          title: '요일별 상담 현황',
          height: 350,
          tooltip: {
            isHtml: true,
            textStyle: {
              fontSize: 10
            }
          },
          vAxis: {
            minValue: 0,
            textStyle: {
              fontSize: 10
            }
          },
          hAxis: {
            // format: 'days',
            type: 'string',
            textStyle: {
              fontSize: 10
            }
          }
        }
      } else if (this.searchForm.rsltTimeType === 'B') {
        return {
          // 시간유형 B
          legend: {
            position: 'right',
            maxLines: 3,
            textStyle: {
              fontSize: 10
            }
          },
          title: '월별 상담 현황',
          height: 350,
          tooltip: {
            isHtml: true,
            textStyle: {
              fontSize: 10
            }
          },
          vAxis: {
            minValue: 0,
            textStyle: {
              fontSize: 10
            }
          },
          hAxis: {
            // format: 'yyyy.MM',
            type: 'string',
            textStyle: {
              fontSize: 10
            }
          }
        }
      } else {
        return {
          // 시간유형 A
          legend: {
            position: 'right',
            maxLines: 3,
            textStyle: {
              fontSize: 10
            }
          },
          title: '일별 상담 현황',
          height: 350,
          // isStacked: true,
          tooltip: {
            isHtml: true,
            textStyle: {
              fontSize: 10
            }
          },
          vAxis: {
            minValue: 0,
            textStyle: {
              fontSize: 10
            }
          },
          hAxis: {
            format: 'MM.dd',
            textStyle: {
              fontSize: 10
            }
          }
        }
      }
    },
    statisticsChartJSData: function () {
      const datas = this.statisticsChartList.reduce((acc, val) => {
        const key = `${val.scenarioId}|${val.scenarioNm}`
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(val)
        return acc
      }, {})
      // console.log(datas)
      const keys = Object.keys(datas)
      // console.log(keys)
      const labels = []
      const datasets = []
      const lineColors = []
      const backgroundColors = []

      lineColors.push('#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40', '#04b4ae', '#df01a5', '#21610b', '#5f4c0b')
      backgroundColors.push('#ffb0c1', '#9ad0f5', '#ffe6aa', '#a4dfdf', '#ccb2ff', '#ffb0c1', '#81f7f3', '#f5a9e1', '#bcf5a9', '#f3e2a9')
      if (this.searchForm.rsltTimeType === 'D') {
        // 시간별
        let m = 1
        while (m <= 24) {
          labels.push(`${m}시`)
          m++
        }
        for (const key of keys) {
          const data = []
          m = 1
          while (m <= 24) {
            data.push((datas[key].find((ch) => ch.callDate === `${m}시`) || { totalCount: 0 }).totalCount)
            m++
          }
          datasets.push({
            label: key.split(/[|]/)[1],
            borderColor: '#f67019',
            data: data
          })
        }
      } else if (this.searchForm.rsltTimeType === 'C') {
        // 요일별
        let m = 0
        labels.push('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일')
        for (const key of keys) {
          const data = []
          m = 0
          while (m < 7) {
            data.push((datas[key].find((ch) => ch.callDate === labels[m]) || { totalCount: 0 }).totalCount)
            m++
          }
          datasets.push({
            label: key.split(/[|]/)[1],
            borderColor: 'blue',
            data: data
          })
        }
      } else if (this.searchForm.rsltTimeType === 'B') {
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
            label: key.split(/[|]/)[1],
            borderColor: 'green',
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
        let m = 0
        for (const key of keys) {
          const data = []
          dateStart = this.$moment(`${this.searchForm.startMonth}-01`)
          while (dateEnd.format('YYYYMMDD') >= dateStart.format('YYYYMMDD')) {
            data.push((datas[key].find((ch) => ch.callDate === dateStart.format('YYYYMMDD')) || { totalCount: 0 }).totalCount)
            dateStart.add(1, 'days')
          }
          datasets.push({
            label: key.split(/[|]/)[1],
            borderColor: lineColors[m],
            backgroundColor: backgroundColors[m],
            data: data
          })
          m++
        }
      }
      return {
        labels: labels,
        datasets: datasets
      }
    },
    statisticsChartJSOptions: function () {
      if (this.searchForm.rsltTimeType === 'D') {
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
      } else if (this.searchForm.rsltTimeType === 'C') {
        // 요일별
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
            text: '요일별 상담 현황'
          },
          maintainAspectRatio: false
        }
      } else if (this.searchForm.rsltTimeType === 'B') {
        // 월별
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
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsTimeTypeList () {
      const timeTypeList = []
      timeTypeList.push(...this.searchForm.itemsTimeTypeList.filter((it) => it.value !== 'D'))
      return timeTypeList
    },
    cptdItemsTenantList () {
      const tenantList = []
      tenantList.push(...this.searchForm.itemsTenantList)
      return tenantList
    },
    cptdItemsChatbotList () {
      const chatbotList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      // chatbotList.push(...this.searchForm.itemsChatbotList.filter(s => s.opt1 === this.searchForm.tenant))
      chatbotList.push(...this.searchForm.itemsChatbotList)
      return chatbotList
    },
    cptdItemsScenarioList () {
      const scenarioList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      // scenarioList.push(...this.searchForm.itemsScenarioList.filter(s => s.opt1 === (this.searchForm.tenant || s.opt1) && s.opt2 === (this.searchForm.chatbot || s.opt2)))
      scenarioList.push(...this.searchForm.itemsScenarioList.filter(s => s.opt2 === (this.searchForm.chatbot || s.opt2)))
      return scenarioList
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
          this.getScenarioStatisticsList()
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
    getScenarioSearchCondition: function () {
      getScenarioSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
          this.searchForm.tenant = this.searchForm.itemsTenantList[0].value
          this.searchForm.itemsChatbotList = response.data.result.chatbotList
          this.searchForm.itemsScenarioList = response.data.result.scenarioList
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
    getScenarioStatisticsChartList: function () {
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
        chatbotId: this.searchForm.chatbot,
        scenarioId: this.searchForm.scenario,
        timeType: this.searchForm.timeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getScenarioStatisticsChartList(searchCondition).then(
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
        this.getScenarioStatisticsList()
      })
    },
    getScenarioStatisticsList: function () {
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
        timeType: this.searchForm.timeType,
        chatbotId: this.searchForm.chatbot,
        scenarioId: this.searchForm.scenario,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getScenarioStatisticsList(searchCondition).then(
        response => {
          this.statisticsList = response.data.result.statisticsList ? response.data.result.statisticsList : []
          // paging setting
          this.pagination.totalRows = response.data.result.statisticsListCount
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
    // 단선상세버튼
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
        scenarioId: data.scenarioId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 통화중단상세버튼
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
        type: 'FA',
        scenarioId: data.scenarioId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 호전환상세버튼
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
        scenarioId: data.scenarioId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 정상통화상세버튼
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
        type: 'SS',
        scenarioId: data.scenarioId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 전체통화상세버튼
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
        type: 'AL',
        scenarioId: data.scenarioId,
        callDate: data.callDateCd || data.callDate,
        timeType: this.searchForm.rsltTimeType,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
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
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        tenantId: this.searchForm.tenant,
        timeType: this.searchForm.timeType,
        chatbotId: this.searchForm.chatbot,
        scenarioId: this.searchForm.scenario,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      reqExcelDownScenarioStat(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_시나리오별_상담_현황.xlsx'

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
