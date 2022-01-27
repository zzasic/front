<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="3">
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
      <v-container>
      <v-row>
      <v-col cols="5">
      <v-card class="data-grid-wrap default clickable" :style="'width: 97%; height: 90%'">
        <div class="db-card__chart">
           <div class="db-card__head db-card__head--noline">
              <h4 class="db-card__head-title"><br><br><br><br></h4>
            </div>
          <pie-charts v-if="isChart"
            :chartData="pieChartJSData"
            :options="pieChartJSOptions"
          ></pie-charts>
           <div class="db-card__head db-card__head--noline">
              <h2 class="db-card__head-title"><br><br></h2>
            </div>
        </div>
      </v-card>
      </v-col>
      <v-col>
      <v-card class="data-grid-wrap default clickable" style="width: 100%">
        <v-data-table
          :single-select="true"
          :headers="headers"
          :items="digitalUsageViewList"
          :options.sync="optionSync"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr @click="detailRow(props.item, selectedDate)" :style=" props.item.typeCode === rowkey ? 'backgroundColor:#FBFBEF' : ''">
              <td class="text-center">{{ props.item.typeName }}</td>
              <td class="text-center">{{ toComma(props.item.voiceCnt) }}</td>
              <td class="text-center">{{ toComma(props.item.buttonCnt) }}</td>
              <td class="text-center">{{ toComma(props.item.silenceCnt) }}</td>
              <td class="text-center">{{ toComma(props.item.totalCnt) }}</td>
            </tr>
          </template>
          <template slot="body.append" v-if="digitalUsageViewList.length > 0">
              <tr style="backgroundColor:#CEECF5">
                  <th class="text-center title">Total</th>
                  <th class="text-center title">{{ toComma(digitalUsageViewTotalCnt.voiceCnt) }}</th>
                  <th class="text-center title">{{ toComma(digitalUsageViewTotalCnt.buttonCnt) }}</th>
                  <th class="text-center title">{{ toComma(digitalUsageViewTotalCnt.silenceCnt) }}</th>
                  <th class="text-center title">{{ toComma(digitalUsageViewTotalCnt.totalCnt) }}</th>
              </tr>
          </template>
        </v-data-table>
      </v-card>
      </v-col>
      </v-row>
      </v-container>
      <PageSectionTitle
        :title="pagination.sectionTitle"
        :totalRows="toComma(pagination.totalRows)"
        :subtitle="pagination.sectionSubTitle"
      >
      </PageSectionTitle>
      <v-card class="data-grid-wrap default">
        <v-data-table
          :headers="subHeaders"
          :items="digitalUsageViewDetailList"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalRows"
          :options.sync="optionDetailSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr @click="detailStatiatics(props.item, selectedDate)">
              <td class="text-center">{{ props.item.typeCode }}</td>
              <td class="text-center">{{ props.item.typeName }}</td>
              <td class="text-center">{{ toComma(props.item.voiceCnt) }}</td>
              <td class="text-center">{{ toComma(props.item.buttonCnt) }}</td>
              <td class="text-center">{{ toComma(props.item.silenceCnt) }}</td>
              <td class="text-center">{{ toComma(props.item.totalCnt) }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          @change="detailRow(itemObj, selectedDate)"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="detailRow(itemObj, selectedDate)"
          :total-visible="10"
        ></v-pagination>
      </div>
    <div class="btn-group align-right">
      <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown" v-auth="['SAU', 'CAU', 'AU']">엑셀 다운로드</v-btn>
    </div>
      <v-dialog
        v-model="dialogView"
        persistent
        hide-overlay
        scrollable
        :max-width="'80%'"
        >
      <PopupScreenMinorListsView
      @popupAction="popupAction" :item="itemMiddleObj" v-if="popup.screenMinorPopup === true"
      />
    </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import PieCharts from '@/components/chart/PieCharts'
import PopupScreenMinorListsView from '@/views/shinhan/aiConcierge/PopupScreenMinorListsView'
import {
  getScreenCategoryStatiaticsList,
  getScreenCategoryStatiaticsChart,
  getScreenCategoryStatiaticsDetailList,
  reqScreenCategoryStatiaticsExcelDown
} from '../../../api/shinhan/aiConcierge'

import datepicker from '@/plugins/datepicker'

export default {
  name: 'ScreenCategoryStatiaticsView',
  components: {
    PieCharts,
    PopupScreenMinorListsView
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.initAiConciergeView(this.initSuccess)
  },
  data () {
    return {
      testValue: '',
      headers: [
        { text: '대분류명', value: 'typeCode', align: 'center', class: 'text-center', width: '20%', sortable: false }, // sortable: false
        { text: '음성(건)', value: 'voiceCnt', align: 'center', class: 'text-center', width: '20%', sortable: false },
        { text: '버튼(건)', value: 'buttonCnt', align: 'center', width: '20%', sortable: false },
        { text: '침묵(건)', value: 'silenceCnt', align: 'center', class: 'text-center', width: '20%', sortable: false },
        { text: '전체(건)', value: 'totalCnt', align: 'center', class: 'text-center', width: '20%', sortable: false }
      ],
      subHeaders: [
        { text: '중분류코드', value: 'typeCode', align: 'center', class: 'text-center', width: '25%' },
        { text: '중분류명', value: 'typeName', align: 'center', class: 'text-center', width: '30%' },
        { text: '음성(건)', value: 'voiceCnt', align: 'center', class: 'text-center', width: '10%' },
        { text: '버튼(건)', value: 'buttonCnt', align: 'center', class: 'text-center', width: '10%' },
        { text: '침묵(건)', value: 'silenceCnt', align: 'center', class: 'text-center', width: '10%' },
        { text: '전체(건)', value: 'totalCnt', align: 'center', class: 'text-center', width: '15%' }
      ],
      aiConciergeHistoryList: [],
      digitalUsageViewList: [],
      digitalUsageViewDetailList: [],
      digitalUsageChart: [],
      chartBgColor: ['#A684B7', '#DD7445', '#DE9D11', '#E0D295', '#B1D166', '#78BAA1', '#ffb0c1', '#ffe6aa', '#9ad0f5', '#a4dfdf', '#ccb2ff', '#ffb0c1', '#81f7f3', '#f5a9e1', '#bcf5a9', '#f3e2a9'],
      deviceKindList: [],
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
      searchForm: {
        itemsTenantList: [],
        tenant: '',
        branchNm: '',
        codeIdArr: [],
        commYn: '',
        dates: [this.$moment().add(-7, 'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
        deviceNo: '',
        deviceKind: '',
        testType: ''
      },
      chats: [],
      chkList: [],
      totChkList: [],
      popup: {
        screenMinorPopup: false
      },
      testTypeList: [],
      rowkey: '',
      pieChartJSData: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: []
          }
        ]
      },
      digitalUsageViewTotalCnt: [],
      initSuccess: true,
      selectedDate: { startDt: '', endDt: '' },
      itemObj: [],
      itemMiddleObj: [],
      betweenTxt: '',
      isChart: false
    }
  },

  computed: {
    dialogView: function () {
      // console.log(' dialogStatiaticsView ')
      return (this.popup.screenMinorPopup === true)
    },
    pieChartJSOptions: function () {
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
          text: '업무분류별 현황'
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
          this.fnc_getScreenCategoryStatiaticsList()
        }
      }
    },
    optionDetailSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          // this.fnc_getScreenCategoryStatiaticsList()
          this.detailRow(this.itemObj, this.selectedDate)
        }
      }
    }
  },

  watch: {
  },

  methods: {
    toComma: function (x) {
      return (x) ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
    },
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
    async initAiConciergeView (first) {
      this.fnc_getScreenCategoryStatiaticsList(first)
      this.fnc_getScreenCategoryStatiaticsChart()
    },
    dialog: function () {
      return (this.popup.screenMinorPopup === true)
    },
    // 검색버튼
    searchBtn: function () {
      const isSuccess = this.betweenConfirm(this.searchForm)
      if (isSuccess) {
        this.initSuccess = true
        this.fnc_getScreenCategoryStatiaticsList(this.initSuccess)
        this.fnc_getScreenCategoryStatiaticsChart()
      }
    },
    fnc_getScreenCategoryStatiaticsList: function (first) {
      /* datepicker open */
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })

      // param setting
      const searchCondition = {
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      // console.log(' searchCondition ' + JSON.stringify(searchCondition))
      // this.pagination.loading = true
      getScreenCategoryStatiaticsList(searchCondition).then(
        response => {
          this.digitalUsageViewList = response.data.result.digitalUsageViewList ? response.data.result.digitalUsageViewList : []
          // console.log('fnc_getScreenCategoryStatiaticsList' + JSON.stringify(this.digitalUsageViewList))
          const totSum = (txt) => {
            let totSum = 0
            for (let i = 0; i < this.digitalUsageViewList.length; i++) {
              if (txt === 'V') {
                totSum = totSum + Number(this.digitalUsageViewList[i].voiceCnt)
              } else if (txt === 'B') {
                totSum = totSum + Number(this.digitalUsageViewList[i].buttonCnt)
              } else if (txt === 'S') {
                totSum = totSum + Number(this.digitalUsageViewList[i].silenceCnt)
              } else if (txt === 'T') {
                totSum = totSum + Number(this.digitalUsageViewList[i].totalCnt)
              }
            }
            return totSum
          }
          this.digitalUsageViewTotalCnt.voiceCnt = totSum('V')
          this.digitalUsageViewTotalCnt.buttonCnt = totSum('B')
          this.digitalUsageViewTotalCnt.silenceCnt = totSum('S')
          this.digitalUsageViewTotalCnt.totalCnt = totSum('T')
          // response.data.result.digitalUsageViewTotalCnt
          // paging setting
          // this.pagination.totalRows = response.data.result.digitalUsageViewListCount
          // const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          // this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
          if (this.digitalUsageViewList.length > 0) {
            if (first) {
              this.initSuccess = !first
              this.selectedDate.startDt = dateRange[0]
              this.selectedDate.endDt = dateRange[1]
              // this.fnc_getScreenCategoryStatiaticsDetailList(this.digitalUsageViewList[0], this.selectedDate)
              this.detailRow(this.digitalUsageViewList[0], this.selectedDate)
            }
          } else {
            this.digitalUsageViewDetailList = []
          }
          this.betweenTxt = dateRange[0] + '~' + dateRange[1]
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
        // this.pagination.loading = false
      })
    },

    fnc_getScreenCategoryStatiaticsChart: function () {
      this.isChart = false
      /* datepicker open */
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })

      // param setting
      const searchCondition = {
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      // console.log(' searchCondition 1' + JSON.stringify(searchCondition))
      getScreenCategoryStatiaticsChart(searchCondition).then(
        response => {
          // console.log(' response.data.result 1' + JSON.stringify(response.data.result))
          this.digitalUsageChart = response.data.result.digitalUsageChart ? response.data.result.digitalUsageChart : []
          // console.log(' this.digitalUsageChart.length' + this.digitalUsageChart.length)
          this.pieChartJSData.labels = []
          this.pieChartJSData.datasets[0].backgroundColor = []
          this.pieChartJSData.datasets[0].data = []
          if (this.digitalUsageChart.length > 0) {
            for (let i = 0; i < this.digitalUsageChart.length; i++) {
              // labelList.push(this.digitalUsageChart[i].typeName)
              this.pieChartJSData.labels[i] = this.digitalUsageChart[i].typeName
              // dataList.push(Number(this.digitalUsageChart[i].ratio))
              this.pieChartJSData.datasets[0].data[i] = Number(this.digitalUsageChart[i].ratio)
              this.pieChartJSData.datasets[0].backgroundColor[i] = this.chartBgColor[i]
            }
            this.isChart = true
          }
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
      })
    },
    fnc_getScreenCategoryStatiaticsDetailList: function (obj, dt) {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy && this.options.sortBy.length ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc && this.options.sortDesc.length ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        paramCode: obj.typeCode,
        startDate: dt.startDt,
        endDate: dt.endDt
      }
      this.pagination.loading = true
      // console.log(this.initSuccess + ' fnc_getScreenCategoryStatiaticsDetailList : ', JSON.stringify(searchCondition))
      getScreenCategoryStatiaticsDetailList(searchCondition).then(
        response => {
          // console.log(' response.data.result : 2222', JSON.stringify(response.data.result))
          this.digitalUsageViewDetailList = response.data.result.digitalUsageViewList ? response.data.result.digitalUsageViewList : []
          // paging setting
          this.pagination.totalRows = response.data.result.digitalUsageViewCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
        }
      ).finally(() => {
        this.pagination.loading = false
      })
    },
    detailStatiatics: function (itemRow, selectDt) {
      // console.log(JSON.stringify(itemRow) + '====' + JSON.stringify(selectDt))
      this.itemMiddleObj = itemRow
      this.itemMiddleObj.betweenTxt = this.betweenTxt
      this.popup.screenMinorPopup = true
    },
    // 상세버튼
    detailRow: function (itemRow, selectDt) {
      // console.log(' detailRow ' + JSON.stringify(itemRow))
      this.rowkey = itemRow.typeCode
      this.itemObj = itemRow
      this.fnc_getScreenCategoryStatiaticsDetailList(this.itemObj, selectDt)
    },
    excelDown: function () {
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        paramCode: this.itemObj.typeCode,
        startDate: this.selectedDate.startDt,
        endDate: this.selectedDate.endDt
      }
      reqScreenCategoryStatiaticsExcelDown(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_AIconcierge_처리이력.xlsx'

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
    isEmpty: function (x) {
      return (x === null || x === undefined || x === '')
    },
    popupAction: function (type, obj) {
      this.popup[`${type}`] = !this.popup[`${type}`]
    }
  }
}
</script>
