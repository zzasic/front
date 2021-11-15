
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
            <v-text-field
              class="default search"
              v-model="searchForm.title"
              label="제목"
              placeholder=" "
              v-on:keyup.enter="searchBtn"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.aiClass"
              :items="aiClassList"
              label="분류"
              :placeholder="searchForm.aiClass ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col> -->
          <v-col cols="1">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.dateType"
              :items="dateTypes"
              label="검색일"
              :placeholder="searchForm.dateType ? undefined : '수정일'"
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
                  v-model="dateRangeText"
                  :label="(dateTypes.find(d => d.value === searchForm.dateType) || { text: '' }).text"
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
          :item-key="`noticeId`"
          :options.sync="optionSync"
          :server-items-length="pagination.totalRows"
          :loading="pagination.loading"
          @click:row="detailRow"
          show-select
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item.title="{ item }">
            {{ item.title }}
          </template>
          <template v-slot:item.boardYn="{ item }">
            {{ 'Y' === item.boardYn ? '사용' : '미사용'}}
          </template>
          <template v-slot:item.popupYn="{ item }">
            {{ 'Y' === item.popupYn ? '사용' : '미사용'}}
          </template>
          <template v-slot:item.lastUpdTime="{ item }">
            {{ $moment.parseZone(item.lastUpdTime ? item.lastUpdTime : item.firstRegTime).format('YYYY-MM-DD HH:mm') }}
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
          @input="getNoticeList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click.stop="newBtn">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="deleteBtn">{{ $t('button.delete')}}</v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="920"
        scrollable
        >
        <PopupCreateNoticeView
          @popupAction="popupAction"
          v-if="popup.createView === true"
          />
        <PopupUpdateNoticeView
          @popupAction="popupAction"
          :noticeId="popup.noticeId"
          v-if="popup.updateView === true && popup.noticeId !== null"
          />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import { getSearchCondition, getNoticeList, deleteNotice } from '@/api/notice'

import PopupCreateNoticeView from '@/views/notice/PopupCreateNoticeView'
import PopupUpdateNoticeView from '@/views/notice/PopupUpdateNoticeView'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'ListNoticeView',
  components: {
    PopupCreateNoticeView,
    PopupUpdateNoticeView
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
    aiClassList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.aiClasses)
      return its
    },
    dialog: function () {
      return (this.popup.createView === true || this.popup.updateView === true)
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getNoticeList()
        }
      }
    }
  },
  data () {
    return {
      popup: {
        createView: false,
        updateView: false,
        noticeId: null
      },
      // 검색영역 시작
      // AI분류
      aiClasses: [],
      // 일자검색조건
      dateTypes: [
        {
          text: '수정일',
          value: 'REG'
        },
        {
          text: '게시일',
          value: 'BOARD'
        }
      ],
      // 검색조건
      searchForm: {
        title: '',
        boardYn: '',
        delYn: '',
        hpYn: '',
        popupYn: '',
        dateType: 'REG',
        dates: [
          this.$moment().add(-90, 'days').format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ]
      },
      // 검색영역 끝
      // 그리드영역 시작
      // 선택데이터
      selected: [],
      // 헤더정보
      headers: [
        // { text: '분류', value: 'aiClassNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '게시기간', value: 'boardDate', align: 'center', class: 'text-center', width: '250px' },
        { text: '제목', value: 'title', align: 'left', class: 'text-center' },
        { text: '게시여부', value: 'boardYn', align: 'center', width: '120px' },
        { text: '팝업여부', value: 'popupYn', align: 'center', width: '120px' },
        { text: '수정자', value: 'lastUpdUserNm', align: 'center', width: '120px' },
        { text: '수정일시', value: 'lastUpdTime', align: 'center', width: '180px' }
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
      this.getNoticeList()
    },
    // 조회조건 조회
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.aiClasses = response.data.result.aiClassList // AI분류
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
      )
    },
    // 공지사항목록조회
    getNoticeList: function () {
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
        title: this.searchForm.title, // 제목
        // aiClass: this.searchForm.aiClass, // AI분류
        dateType: this.searchForm.dateType, // 검색조건
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '', // 검색시작일
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : '' // 검색종료일
      }
      this.pagination.loading = true
      getNoticeList(searchCondition).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            this.desserts = response.data.result.noticeList ? response.data.result.noticeList : []
            // paging setting
            this.pagination.totalRows = response.data.result.noticeListCount
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
    deleteNotice: function () {
      const notices = this.selected
      deleteNotice(notices).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.getNoticeList()
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
      this.getNoticeList()
    },
    // 신규버튼
    newBtn: function () {
      this.popup.createView = true
      this.popup.updateView = false
    },
    // 상세버튼
    detailRow: function (notice) {
      this.popup.createView = false
      this.popup.updateView = true
      this.popup.noticeId = notice.noticeId
    },
    // 삭제버튼
    deleteBtn: function () {
      if (this.selected && this.selected.length > 0) {
        if (confirm(this.selected.length + '건을 삭제하시겠습니까?')) {
          this.deleteNotice()
        }
      } else {
        alert('삭제할 대상을 선택해주세요.')
      }
    },
    popupAction: function (popup) {
      this.popup = popup
      this.getNoticeList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
