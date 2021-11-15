
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
              v-model="searchForm.batchNm"
              label="배치ID, 배치명"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.result"
              :items="cptdResultStat"
              label="처리결과"
              :placeholder="$t('label.all')"
              return-object
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-menu
              content-class="date-picker"
              ref="pickerMenu"
              v-model="pickerMenu"
              :return-value.sync="searchForm.batchStartDate"
              :close-on-content-click="false"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="default text-field-date pr-0"
                  v-model='dateRangeText'
                  label="처리일"
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
                  v-model="searchForm.batchStartDate"
                  range
                  no-title
                  scrollable
                  :event-color="
                    date =>
                      date == searchForm.batchStartDate[0]
                        ? ['startDate']
                        : date == searchForm.batchStartDate[1]
                        ? ['endDate']
                        : ''
                  "
                  :events="searchForm.batchStartDate"
                  :date-format="date => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(searchForm.batchStartDate)">{{ $t('button.confirm')}}</v-btn>
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
      <v-card class="data-grid-wrap default">
        <v-data-table
          v-model="selected"
          :server-items-length="pagination.totalRows"
          :headers="headers"
          :items="desserts"
          :page.sync="pagination.page"
          :items-per-page.sync="pagination.itemsPerPage"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item.firstRegTime="{ item }">
            {{ $moment(item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD') }}
          </template>
          <template v-slot:item.batchNm="{ item }">
            {{ item.batchNm }}
          </template>
          <template v-slot:item.result="{ item }">
            <span :style="{ color: item.result === 'fail' ? 'red' : '' }">
              {{ item.result === 'fail' ? '실패' : '성공' }}
            </span>
          </template>
          <template v-slot:item.message="{ item }">
            {{ item.message }}
          </template>
          <template v-slot:item.batchStartTime="{ item }">
            {{ item.batchStartTime ? $moment(item.batchStartTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') : '' }}
          </template>
          <template v-slot:item.batchEndTime="{ item }">
            {{ item.batchEndTime ? $moment(item.batchEndTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') : '' }}
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
          :total-visible="10"
          @input="getBatchLogList"
        ></v-pagination>
      </div>
    </vuescroll>
  </div>
</template>

<script>
import {
  getBatchLogList
} from '../../api/batch'
import datepicker from '@/plugins/datepicker'

// import lodash from 'lodash'

export default {
  name: 'listBatchLogView',
  components: {
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.getBatchLogList()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdResultStat: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.resultStat)
      return its
    },
    dateRangeText: {
      get: function () {
        const dateRange = this.searchForm.batchStartDate
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
        return dateRange.join(' ~ ')
      },
      set: function (value) {
        if (!value) {
          this.searchForm.batchStartDate = []
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
          this.getBatchLogList()
        }
      }
    }
  },
  data () {
    return {
      resultStat: [
        {
          text: '성공',
          value: 'success'
        },
        {
          text: '실패',
          value: 'fail'
        }
      ],

      // 검색조건
      searchForm: {
        batchNm: '',
        result: '',
        batchStartDate: [
          this.$moment().add(-90, 'days').format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ]
      },

      // 테이블  데이터
      headers: [
        { text: '처리일', value: 'firstRegTime', align: 'center', class: 'text-center', width: '120px' },
        { text: '배치ID', value: 'batchId', align: 'center', class: 'text-center', width: '150px' },
        { text: '배치명', value: 'batchNm', align: 'left', class: 'text-center', width: '300px' },
        { text: '처리결과', value: 'result', align: 'center', class: 'text-center', width: '100px' },
        { text: '메시지', value: 'message', align: 'left', class: 'text-center' },
        { text: '시작일시', value: 'batchStartTime', align: 'center', class: 'text-center', width: '120px' },
        { text: '종료일시', value: 'batchEndTime', align: 'center', class: 'text-center', width: '120px' }
      ],
      desserts: [],
      selected: [],

      // 페이지 네이션 설정
      pagination: {
        page: 1, // 현재페이지
        length: 2, // 페이징숫자 갯수
        itemsPerPage: 10, // table row view 갯수
        itemsPerPages: [10, 20, 30], // 왼쪽하단 selectbox
        totalRows: 0,
        sectionTitle: this.$t('label.totalCnt'),
        sectionSubTitle: '',
        loading: false
      },
      options: {}
    }
  },
  watch: {
  },
  methods: {
    getBatchLogList: function () {
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.batchStartDate)
      }
      const dateRange = this.searchForm.batchStartDate
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })

      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,

        batchNm: this.searchForm.batchNm,
        result: this.searchForm.result.value,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }

      this.pagination.loading = true
      getBatchLogList(searchCondition).then(
        response => {
          this.desserts = response.data.result.batchLogList ? response.data.result.batchLogList : []
          // paging setting
          this.pagination.totalRows = response.data.result.batchLogListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
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
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getBatchLogList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
