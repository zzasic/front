
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
              v-model="searchForm.tenantId"
              :items="tenantList"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenantId ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default search"
              v-model="searchForm.holidayNm"
              label="휴무일명"
              placeholder=" "
              v-on:keyup.enter="searchBtn"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.useYn"
              :items="useYnList"
              label="사용여부"
              :placeholder="searchForm.useYn ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.repeateYn"
              :items="repeateYnList"
              label="반복여부"
              :placeholder="searchForm.repeateYn ? undefined : $t('label.all')"
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
                  class="default text-field-date pr-0"
                  v-model='dateRangeText'
                  label="휴무일"
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
      <v-card class="data-grid-wrap default clickable">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="desserts"
          item-key="holidayId"
          :options.sync="optionSync"
          :server-items-length="pagination.totalRows"
          :loading="pagination.loading"
          @click:row="detailRow"
          show-select
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item.holidayDate="{ item }">
            {{ $moment(item.holidayDate, 'YYYYMMDD').format('YYYY-MM-DD') }}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'Y' ? '사용' : '미사용' }}
          </template>
          <template v-slot:item.repeateYn="{ item }">
            {{ item.repeateYn === 'Y' ? '반복' : '미반복' }}
          </template>
          <template v-slot:item.lastUpdUserNm="{ item }">
            {{ item.lastUpdUserNm }}
          </template>
          <template v-slot:item.lastUpdTime="{ item }">
            {{ $moment(item.lastUpdTime || item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') }}
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
          @input="getHolidayList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <!-- <v-btn color="btn-primary" text @click.stop="batchBtn">{{ $t('button.batch')}}</v-btn> -->
        <v-btn color="btn-primary" text @click.stop="newBtn">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="deleteBtn">{{ $t('button.delete')}}</v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        :max-width="popup.batchView ? 1024 : 600"
        scrollable
        >
        <PopupCreateHolidayView
          @popupAction="popupAction"
          v-if="popup.createView === true"
          />
        <PopupUpdateHolidayView
          @popupAction="popupAction"
          :holidayId="popup.holidayId"
          v-if="popup.updateView === true && popup.holidayId !== null"
          />
        <PopupExcelUploadView
          @popupAction="popupAction"
          :code="`holiday`"
          v-if="popup.batchView === true"
          />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import { getSearchCondition, getHolidayList, deleteHolidaies } from '@/api/holiday'

import PopupCreateHolidayView from '@/views/holiday/PopupCreateHolidayView'
import PopupUpdateHolidayView from '@/views/holiday/PopupUpdateHolidayView'
import PopupExcelUploadView from '@/views/PopupExcelUploadView'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'ListHolidayView',
  components: {
    PopupCreateHolidayView,
    PopupUpdateHolidayView,
    PopupExcelUploadView
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.init()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    useYnList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.useYns)
      return its
    },
    repeateYnList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.repeateYns)
      return its
    },
    tenantList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.tenants)
      return its
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
    dialog: function () {
      return (this.popup.createView === true || this.popup.batchView === true || this.popup.updateView === true)
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getHolidayList()
        }
      }
    }
  },
  data () {
    return {
      popup: {
        createView: false,
        updateView: false,
        batchView: false,
        holidayId: null
      },
      // 검색영역 시작
      // 사용여부
      useYns: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ],
      // 반복여부
      repeateYns: [
        {
          text: '반복',
          value: 'Y'
        },
        {
          text: '미반복',
          value: 'N'
        }
      ],
      // 고객사
      tenants: [],
      // 검색조건
      searchForm: {
        holidayNm: '',
        tenantId: '',
        useYn: '',
        repeateYn: '',
        dates: []
      },
      // 그리드영역 시작
      // 선택데이터
      selected: [],
      // 헤더정보
      headers: [
        { text: '테넌트', value: 'tenantNm', align: 'center', class: 'text-center' },
        { text: '휴무일', value: 'holidayDate', align: 'center', class: 'text-center', width: '150px' },
        { text: '휴무일명', value: 'holidayNm', align: 'center', class: 'text-center' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '100px' },
        { text: '반복여부', value: 'repeateYn', align: 'center', class: 'text-center', width: '100px' },
        { text: '수정자', value: 'lastUpdUserNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '수정일시', value: 'lastUpdTime', align: 'center', class: 'text-center', width: '150px' }
      ],
      // 데이터
      desserts: [],
      // 정렬
      options: null,
      // 페이징
      pagination: {
        page: 1, // 현재페이지
        length: 1, // 페이징숫자 갯수
        itemsPerPage: 10, // table row view 갯수
        itemsPerPages: [10, 20, 30], // 왼쪽하단 selectbox
        totalRows: 0,
        sectionTitle: this.$t('label.totalCnt'),
        sectionSubTitle: '',
        loading: false
      }
      // 그리드영역 끝
    }
  },
  watch: {
  },
  methods: {
    init: async function () {
      await this.getSearchCondition()
      this.getHolidayList()
    },
    // 조회조건 조회
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.tenants = response.data.result.tenantList
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    // 사전목록조회
    getHolidayList: function () {
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy && this.options.sortBy.length ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc && this.options.sortDesc.length ? this.options.sortDesc[0] === false ? 'DESC' : 'ASC' : '',
        itemsPerPage: this.pagination.itemsPerPage,
        tenantId: this.searchForm.tenantId,
        holidayNm: this.searchForm.holidayNm,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '', // 검색시작일
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : '', // 검색종료일
        useYn: this.searchForm.useYn, // 사용여부
        repeateYn: this.searchForm.repeateYn // 반복여부
      }
      // retrieve
      this.pagination.loading = true
      getHolidayList(searchCondition).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과에 인덱시 추가
            this.desserts = response.data.result.holidayList ? response.data.result.holidayList : []
            // paging setting
            this.pagination.totalRows = response.data.result.holidayListCount
            this.pagination.length = parseInt((this.pagination.totalRows - 1) / this.pagination.itemsPerPage) + 1
          }
        },
        error => {
          console.error(error)
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
    deleteHolidaies: function () {
      const holidaies = this.selected
      deleteHolidaies(holidaies).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            alert('삭제되었습니다.')
            this.getHolidayList()
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getHolidayList()
    },
    // 일괄등록버튼
    batchBtn: function () {
      this.popup.createView = false
      this.popup.updateView = false
      this.popup.batchView = true
    },
    // 신규버튼
    newBtn: function () {
      this.popup.createView = true
      this.popup.updateView = false
      this.popup.batchView = false
    },
    // 상세버튼
    detailRow: function (holiday) {
      this.popup.createView = false
      this.popup.updateView = true
      this.popup.batchView = false
      this.popup.holidayId = holiday.holidayId
    },
    // 삭제버튼
    deleteBtn: function () {
      if (this.selected && this.selected.length > 0) {
        if (confirm(this.selected.length + '건을 삭제하시겠습니까?')) {
          this.deleteHolidaies()
        }
      } else {
        alert('삭제할 대상을 선택해주세요.')
      }
    },
    popupAction: function (popup) {
      this.popup = popup
      this.getHolidayList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
