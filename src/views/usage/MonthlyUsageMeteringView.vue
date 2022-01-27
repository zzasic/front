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
              :placeholder="searchForm.system ? undefined : $t('label.all')"
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
          <v-col cols="2">
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
      <!-- //그래프 영역 -->
      <v-card class="data-grid-wrap default" v-if="drawChart === true && pagination.totalRows > 0 && usageMeteringChartList && usageMeteringChartList.length > 0">
        <v-container class="db-card" no-gutters fluid>
          <v-row class="db-card__row">
            <v-col class="db-card__item">
              <div class="db-card__head db-card__head--noline">
                <h4 class="db-card__head-title">월별 서비스 사용량</h4>
              </div>
              <div class="db-card__chart">
                <bar-charts
                  :chartData="chartJSData"
                  :options="chartJSOptions"
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
          :headers="headers"
          :items="usageMeteringList"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center">{{ item.meteringDate }}</td>
              <td class="text-center">{{ item.systemNm }}</td>
              <td class="text-center">{{ item.tenantNm }}</td>
              <td class="text-right">{{ comma(item.sttCount) }}</td>
              <td class="text-right">{{ comma(item.chatbotCount) }}</td>
              <td class="text-right">{{ comma(item.ttsCount) }}</td>
              <td class="text-right">{{ comma(item.taCount) }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          @change="getUsageMeteringList"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="getUsageMeteringList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click.stop="getManualUsageMetering" v-auth="['SAU']">{{ $t('button.Statistics')}}</v-btn>
        <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        width="800"
        scrollable
        >
        <popup-stt-history-view
          :popup.sync="popup"
          v-if="popup.type === 'STT' && popup.tenantId !== null && popup.meteringDate !== null"
          />
        <popup-chatbot-history-view
          :popup.sync="popup"
          v-if="popup.type === 'CHATBOT' && popup.tenantId !== null && popup.meteringDate !== null"
          />
        <popup-tts-history-view
          :popup.sync="popup"
          v-if="popup.type === 'TTS' && popup.tenantId !== null && popup.meteringDate !== null"
          />
        <popup-ta-history-view
          :popup.sync="popup"
          v-if="popup.type === 'TA' && popup.tenantId !== null && popup.meteringDate !== null"
          />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import BarCharts from '@/components/chart/BarCharts'
import {
  getUsageMeteringSearchCondition,
  getUsageMeteringList,
  getUsageMeteringChartList,
  reqGetManualUsageMetering,
  reqExcelDownUsageMeteringList
} from '../../api/usage'
import datepicker from '@/plugins/datepicker'
import PopupSttHistoryView from '@/views/usage/PopupSttHistoryView'
import PopupChatbotHistoryView from '@/views/usage/PopupChatbotHistoryView'
import PopupTtsHistoryView from '@/views/usage/PopupTtsHistoryView'

export default {
  name: 'MonthlyUsageMeteringView',
  components: {
    BarCharts,
    PopupSttHistoryView,
    PopupChatbotHistoryView,
    PopupTtsHistoryView
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.getUsageMeteringSearchCondition()
    this.getUsageMeteringChartList()
  },
  data () {
    return {
      chartType: 'ChartJS',
      pickerYearMenu: false,
      drawChart: false,
      headers: [
        { text: '사용월', value: 'meteringDate', align: 'center', width: '150px' },
        { text: '시스템', value: 'systemNm', align: 'center', width: '200px' },
        { text: '테넌트', value: 'tenantNm', align: 'center' },
        { text: 'STT 사용량', value: 'sttCount', align: 'center', width: '200px' },
        { text: '챗봇 사용량', value: 'chatbotCount', align: 'center', width: '200px' },
        { text: 'TTS 사용량', value: 'ttsCount', align: 'center', width: '200px' },
        { text: 'TA 사용량', value: 'taCount', align: 'center', width: '200px' }
      ],
      usageMeteringList: [],
      usageMeteringChartList: [],
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
        itemsSystemInfoList: [],
        system: '',
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
        systemId: null,
        tenantId: null,
        meteringDate: null,
        startMonth: null,
        endMonth: null
      },
      bgColors: [ // bgColor Array
        '#5c6bc0',
        '#66bb6a',
        '#ef5350',
        '#ffa500'
      ]
    }
  },
  computed: {
    chartJSData: function () {
      const datas = this.usageMeteringChartList.reduce((acc, val) => {
        const key = val.serviceType
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(val)
        return acc
      }, {})
      const keys = Object.keys(datas)
      const labels = []
      const datasets = []
      // 월별
      let m = 1
      while (m <= 12) {
        labels.push(`${m}월`)
        m++
      }
      let bgIdx = 0
      for (const key of keys) {
        const data = []
        m = 1
        while (m <= 12) {
          data.push((datas[key].find((ch) => ch.meteringDate === `${m}월`) || { totalCount: 0 }).totalCount)
          m++
        }
        datasets.push({
          label: key,
          backgroundColor: this.bgColors[bgIdx], // bgColor Array
          data: data
        })
        bgIdx++
      }
      return {
        labels: labels,
        datasets: datasets
      }
    },
    chartJSOptions: function () {
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
          text: '월별 서비스 사용량'
        },
        maintainAspectRatio: false
      }
    },

    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsSystemInfoList () {
      const systemInfoList = [
        {
          text: this.$t('label.all'), // text: this.$t('label.choice'),
          value: ''
        }
      ]
      systemInfoList.push(...this.searchForm.itemsSystemInfoList)
      return systemInfoList
    },
    cptdItemsTenantList () {
      const tenantList = [
        {
          text: this.$t('label.all'), // text: this.$t('label.choice'),
          value: ''
        }
      ]
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
          this.getUsageMeteringList()
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
    /*
    pickerYearMenu: function (newVal, oldVal) {
      newVal && this.$nextTick(() => {
        this.$refs.pickerYear.internalActivePicker = 'YEAR'
      })
    }
    */
    pickerYearMenu: function (newVal, oldVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.pickerYear.internalActivePicker = 'YEAR'
        }, 100)
      }
    }
  },
  methods: {
    getUsageMeteringSearchCondition: function () {
      getUsageMeteringSearchCondition().then(
        response => {
          this.searchForm.itemsSystemInfoList = response.data.result.systemInfoList
          // this.searchForm.system = this.searchForm.itemsSystemInfoList[0].value
          this.searchForm.itemsTenantList = response.data.result.tenantList
          // this.searchForm.tenant = this.searchForm.itemsTenantList[0].value
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
    getUsageMeteringChartList: function () {
      this.drawChart = false
      const dateRange = []
      if (this.pickerYearMenu === true) {
        this.strYear = String(this.$refs.pickerYear.inputYear)
        this.pickerYearMenu = false
        this.$nextTick(() => {
          this.searchForm.year = this.strYear
        })
      }
      dateRange.push(this.strYear.substring(0, 4) + '-01')
      dateRange.push(this.strYear.substring(0, 4) + '-12')

      // param setting
      const searchCondition = {
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenant,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getUsageMeteringChartList(searchCondition).then(
        response => {
          this.usageMeteringChartList = response.data.result.usageMeteringList ? response.data.result.usageMeteringList : []
          // paging setting
        }
      ).finally(() => {
        this.pagination.loading = false
        this.$nextTick(() => {
          this.drawChart = true
          this.searchForm.startMonth = this.searchForm.months[0]
          this.searchForm.endMonth = this.searchForm.months[1]
        })
        this.getUsageMeteringList()
      })
    },
    getUsageMeteringList: function () {
      const dateRange = []
      if (this.pickerYearMenu === true) {
        this.strYear = String(this.$refs.pickerYear.inputYear)
        this.pickerYearMenu = false
        this.$nextTick(() => {
          this.searchForm.year = this.strYear
        })
      }
      dateRange.push(this.strYear.substring(0, 4) + '-01')
      dateRange.push(this.strYear.substring(0, 4) + '-12')
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenant,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getUsageMeteringList(searchCondition).then(
        response => {
          this.usageMeteringList = response.data.result.usageMeteringList ? response.data.result.usageMeteringList : []
          // paging setting
          this.pagination.totalRows = response.data.result.usageMeteringListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
        }
      ).finally(() => {
        this.pagination.loading = false
      })
    },
    searchBtn () {
      this.pagination.page = 1
      this.getUsageMeteringChartList()
    },
    getManualUsageMetering () {
      if (!confirm('통계수집을 진행하시겠습니까?')) {
        return
      }
      reqGetManualUsageMetering().then(
        response => {
          alert('통계수집을 완료하였습니다.')
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
    // STT 사용량 상세버튼
    sttDetailRow: function (data) {
      const dateRange = []
      dateRange.push(this.strYear.substring(0, 4) + '-01')
      dateRange.push(this.strYear.substring(0, 4) + '-12')
      this.popup = {
        type: 'STT',
        systemId: data.systemId,
        tenantId: data.tenantId,
        meteringDate: data.meteringDateCd || data.meteringDate,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // 챗봇 사용량 상세버튼
    chatbotDetailRow: function (data) {
      const dateRange = []
      dateRange.push(this.strYear.substring(0, 4) + '-01')
      dateRange.push(this.strYear.substring(0, 4) + '-12')
      this.popup = {
        type: 'CHATBOT',
        systemId: data.systemId,
        tenantId: data.tenantId,
        meteringDate: data.meteringDateCd || data.meteringDate,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    // TTS 사용량 상세버튼
    ttsDetailRow: function (data) {
      const dateRange = []
      dateRange.push(this.strYear.substring(0, 4) + '-01')
      dateRange.push(this.strYear.substring(0, 4) + '-12')

      this.popup = {
        type: 'TTS',
        systemId: data.systemId,
        tenantId: data.tenantId,
        meteringDate: data.meteringDateCd || data.meteringDate,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
    },
    excelDown: function () {
      const dateRange = []
      if (this.pickerYearMenu === true) {
        this.strYear = String(this.$refs.pickerYear.inputYear)
        this.pickerYearMenu = false
        this.$nextTick(() => {
          this.searchForm.year = this.strYear
        })
      }
      dateRange.push(this.strYear.substring(0, 4) + '-01')
      dateRange.push(this.strYear.substring(0, 4) + '-12')
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenant,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      reqExcelDownUsageMeteringList(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_월별_서비스_사용량.xlsx'

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
