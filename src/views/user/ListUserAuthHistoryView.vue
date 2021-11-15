<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.userTp"
              :items="userTpList"
              :label="$t('label.userTp')"
              :placeholder="searchForm.userTp ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default search"
              v-model="searchForm.userNm"
              :label="$t('label.userName')"
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="getSearchUserAuthHistoryList"
            ></v-text-field>
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
              @click="getSearchUserAuthHistoryList"
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
          :headers="headers"
          :items="results"
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
              <td class="text-center">{{ $moment(props.item.userHistoryTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') }}</td>
              <td class="text-center">{{ props.item.lastUpdUserNm }}</td>
              <td class="text-center">{{ props.item.userAccessIp }}</td>
              <td class="text-center">{{ getChangeUserAccessType(props.item.userAccessType) }}</td>
              <td class="text-left">{{ props.item.userNm }}</td>
              <td class="text-left">{{ props.item.userDeptNm }}</td>
              <td class="text-left">{{ props.item.changeReason }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          @change="getSearchUserAuthHistoryList"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="getUserAuthHistoryList"
          :total-visible="10"
        ></v-pagination>
      </div>
    </vuescroll>
  </div>
</template>

<script>
import {
  getUserAuthHistorySearchCondition,
  selectUserAuthHistoryList
} from '../../api/user'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'ListUserAuthHistoryView',
  components: {
  },
  mixins: [datepicker],
  created () {
    this.getSearchCondition()
  },

  mounted () {
    this.getUserAuthHistoryList()
  },

  data () {
    return {
      popup: {
      },
      search: '',
      headers: [
        { text: '접근일자', value: 'userHistoryTime', align: 'center', width: '150px' },
        { text: '접근자명', value: 'lastUpdUserNm', align: 'center', width: '120px' },
        { text: '접근자IP', value: 'userAccessIp', align: 'center', width: '120px' },
        { text: '수행업무', value: 'userAccessType', align: 'center', width: '120px' },
        { text: '대상자명', value: 'userNm', align: 'center', width: '120px' },
        { text: '부서명', value: 'userDeptNm', align: 'center', width: '180px' },
        { text: '사유', value: 'changeReason', align: 'center' }
      ],
      results: [],
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
      searchForm: {
        userNm: '',
        itemsTenantList: [],
        tenant: '',
        userTp: '',
        dates: [this.$moment().add(-1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      },
      userTps: [
        {
          text: '접근자명',
          value: 'U'
        },
        {
          text: '대상자명',
          value: 'R'
        }
      ]
    }
  },

  watch: {},

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsTenantList () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.searchForm.itemsTenantList)
      return its
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getUserAuthHistoryList()
        }
      }
    },
    userTpList () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.userTps)
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
    }
  },

  methods: {
    updateOptions (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getUserAuthHistoryList()
      }
    },
    getSearchCondition: function () {
      getUserAuthHistorySearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
        }
      )
    },
    getSearchUserAuthHistoryList: function () {
      this.pagination.page = 1
      this.getUserAuthHistoryList()
    },
    getUserAuthHistoryList: function () {
      /* datepicker open */
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })

      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        userNm: this.searchForm.userNm,
        tenantId: this.searchForm.tenant,
        userTp: this.searchForm.userTp,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }

      this.pagination.loading = true
      selectUserAuthHistoryList(searchCondition).then(
        response => {
          this.results = response.data.result.userAuthHistoryList ? response.data.result.userAuthHistoryList : []
          // paging setting
          this.pagination.totalRows = response.data.result.userAuthHistoryListCount
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
    getChangeUserAccessType: function (type) {
      if (type === 'C') {
        return '생성'
      } else if (type === 'R') {
        return '조회'
      } else if (type === 'U') {
        return '수정'
      } else {
        return '삭제'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
