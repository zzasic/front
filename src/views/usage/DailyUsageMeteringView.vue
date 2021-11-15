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
              <td class="text-center">{{ item.tenantNm }}</td>
              <td class="text-right"><v-btn @click="sttDetailRow(item)" text class="default">{{ comma(item.sttCount) }}</v-btn></td>
              <td class="text-right"><v-btn @click="chatbotDetailRow(item)" text class="default">{{ comma(item.chatbotCount) }}</v-btn></td>
              <td class="text-right"><v-btn @click="ttsDetailRow(item)" text class="default">{{ comma(item.ttsCount) }}</v-btn></td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          @change="getDailyUsageMeteringList"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="getDailyUsageMeteringList"
          :total-visible="10"
        ></v-pagination>
      </div>
    </vuescroll>
  </div>
</template>

<script>
import {
  getDailyUsageMeteringSearchCondition,
  getDailyUsageMeteringList
} from '../../api/usage'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'DailyUsageMeteringView',
  components: {
    // GChart,
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.getDailyUsageMeteringSearchCondition()
  },
  data () {
    return {
      pickerYearMenu: false,
      drawChart: false,
      headers: [
        { text: '사용일', value: 'meteringDate', align: 'center', width: '200px' },
        { text: '테넌트', value: 'tenantNm', align: 'center' },
        { text: 'STT 사용량', value: 'sttCount', align: 'center', width: '300px' },
        { text: '챗봇 사용량', value: 'chatbotCount', align: 'center', width: '300px' },
        { text: 'TTS 사용량', value: 'ttsCount', align: 'center', width: '300px' }
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
        tenantId: null,
        meteringDate: null,
        startMonth: null,
        endMonth: null
      }
    }
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsTenantList () {
      const tenantList = []
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
          this.getDailyUsageMeteringList()
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
    }
  },
  methods: {
    getDailyUsageMeteringSearchCondition: function () {
      getDailyUsageMeteringSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
          this.searchForm.tenant = this.searchForm.itemsTenantList[0].value
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
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.months)
      }
      dateRange.push(...this.searchForm.months)
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      // const searchCondition = {
      //   tenantId: this.searchForm.tenant,
      //   startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
      //   endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      // }
      this.pagination.loading = true
    },
    getDailyUsageMeteringList: function () {
      const dateRange = []
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.months)
      }
      dateRange.push(...this.searchForm.months)
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        tenantId: this.searchForm.tenant,
        startMonth: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endMonth: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getDailyUsageMeteringList(searchCondition).then(
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
    },
    comma: function (n) {
      return Number(n).toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
    popupAction: function (popup) {
      this.popup = popup
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
