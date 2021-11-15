
<template>
  <div class="process">
    <PageTitle
      :title="pageTitle"
      :subtitle="pageDescription"
    ></PageTitle>
    <v-container class="search-group" no-gutters fluid>
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field
            class="default search"
            v-model="searchForm.termsTitle"
            label="약관 ID, 약관 명"
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
            v-model="searchForm.privacyYn"
            :items="privacyYnList"
            label="개인정보처리방침"
            :placeholder="searchForm.privacyYn ? undefined : $t('label.all')"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="1">
          <v-select
            class="default search"
            :menu-props="{ offsetY: true }"
            v-model="searchForm.necessaryFlag"
            :items="necessaryFlagList"
            label="필수여부"
            :placeholder="searchForm.necessaryFlag ? undefined : $t('label.all')"
            clearable
          ></v-select>
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
            class="default"
            :menu-props="{ offsetY: true }"
            v-model="searchForm.dateType"
            :items="dateTypes"
            label="검색구분"
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
                v-model='dateRangeText'
                :label="$t('label.searchDate')"
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
        :items="dessertList"
        item-key="idx"
        :options.sync="optionSync"
        :server-items-length="pagination.totalRows"
        :loading="pagination.loading"
        @click:row="detailRow"
        show-select
        hide-default-footer
        :no-data-text="$t('message.noData')"
        :loading-text="$t('message.loading')"
      >
        <template v-slot:item.termsTitle="{ item }">
          {{ item.termsTitle.length > 40 ? item.termsTitle.substr(0,40)+'....' : item.termsTitle}}
        </template>
        <template v-slot:item.privacyYn="{ item }">
          {{ 'Y' === item.privacyYn ? 'Y' : 'N'}}
        </template>
        <template v-slot:item.termsVer="{ item }">
          {{ item.termsVer.length > 20 ? item.termsVer.substr(0,20)+'....' : item.termsVer}}
        </template>
        <template v-slot:item.useYn="{ item }">
          {{ 'Y' === item.useYn ? '사용' : '미사용'}}
        </template>
        <template v-slot:item.necessaryFlag="{ item }">
          {{ 'Y' === item.necessaryFlag ? '필수' : '선택'}}
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
        @input="getTermsList"
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
      max-width="1200"
      scrollable
      >
      <PopupCreateTermsView
        @popupAction="popupAction"
        v-if="popup.createView === true"
        />
      <PopupUpdateTermsView
        @popupAction="popupAction"
        :termsId="popup.termsId"
        :termsVer="popup.termsVer"
        v-if="popup.updateView === true && popup.termsId !== null && popup.termsVer !== null"
        />
    </v-dialog>
  </div>
</template>

<script>
import { getSearchCondition, getTermsList, deleteTerms } from '@/api/terms'
import PopupCreateTermsView from '@/views/terms/PopupCreateTermsView'
import PopupUpdateTermsView from '@/views/terms/PopupUpdateTermsView'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'ListTermsView',
  components: {
    PopupCreateTermsView,
    PopupUpdateTermsView
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
    necessaryFlagList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.necessaryFlags)
      return its
    },
    privacyYnList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.privacyYns)
      return its
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
    dessertList: function () {
      return this.desserts.map((item, index) => ({
        ...item,
        idx: `${item.termsId}_${item.termsVer}`
      }))
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
          this.getTermsList()
        }
      }
    }
  },
  data () {
    return {
      popup: {
        createView: false,
        updateView: false,
        termsId: null,
        termsVer: null
      },
      // 검색영역 시작
      // 필수여부
      necessaryFlags: [
        {
          text: '필수',
          value: 'Y'
        },
        {
          text: '선택',
          value: 'N'
        }
      ],
      // 사용여부
      privacyYns: [
        {
          text: 'Y',
          value: 'Y'
        },
        {
          text: 'N',
          value: 'N'
        }
      ],
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
      // 일자검색조건
      dateTypes: [
        {
          text: '수정일',
          value: 'REG'
        },
        {
          text: '적용기간',
          value: 'TERMS'
        }
      ],
      // 검색조건
      searchForm: {
        termsTitle: '',
        privacyYn: '',
        necessaryFlag: '',
        useYn: '',
        dateType: 'REG',
        dates: []
      },
      // 검색영역 끝
      // 그리드영역 시작
      // 선택데이터
      selected: [],
      // 헤더정보
      headers: [
        { text: 'ID', value: 'termsId', align: 'center', class: 'text-center' },
        { text: '약관명', value: 'termsTitle', align: 'left', class: 'text-center' },
        { text: '개인정보처리방침', value: 'privacyYn', align: 'center', class: 'text-center' },
        { text: '버전', value: 'termsVer', align: 'center', class: 'text-center', width: '100px' },
        { text: '적용기간', value: 'termsTime', align: 'center', class: 'text-center', width: '220px' },
        { text: '필수여부', value: 'necessaryFlag', align: 'center', class: 'text-center', width: '100px' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록자', value: 'lastUpdUserNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록일시', value: 'lastUpdTime', align: 'center', class: 'text-center', width: '120px' }
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
      this.getTermsList()
    },
    // 조회조건 조회
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // NOTHING TO DO
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
    // 개인정보 활용 동의 약관 조회
    getTermsList: function () {
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
        termsTitle: this.searchForm.termsTitle, // 약관명
        privacyYn: this.searchForm.privacyYn, // 개인정보처리방침
        necessaryFlag: this.searchForm.necessaryFlag, // 필수여부
        useYn: this.searchForm.useYn, // 사용여부
        dateType: this.searchForm.dateType, // 검색조건
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '', // 검색시작일
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : '' // 검색종료일
      }
      this.pagination.loading = true
      // console.log(searchCondition)
      getTermsList(searchCondition).then(
        response => {
          // console.log(response.data)
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            this.desserts = response.data.result.termsList ? response.data.result.termsList : []
            // paging setting
            this.pagination.totalRows = response.data.result.termsListCount
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
    deleteTerms: function () {
      const termses = this.selected
      deleteTerms(termses).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.selected = []
            this.getTermsList()
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getTermsList()
    },
    // 신규버튼
    newBtn: function () {
      this.popup.createView = true
      this.popup.updateView = false
    },
    // 상세버튼
    detailRow: function (terms) {
      this.popup.createView = false
      this.popup.updateView = true
      this.popup.termsId = terms.termsId
      this.popup.termsVer = terms.termsVer
    },
    // 삭제버튼
    deleteBtn: function () {
      if (this.selected && this.selected.length > 0) {
        if (confirm(this.selected.length + '건을 삭제하시겠습니까?')) {
          this.deleteTerms()
        }
      } else {
        alert('삭제할 대상을 선택해주세요.')
      }
    },
    popupAction: function (popup) {
      this.popup = popup
      this.getTermsList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
