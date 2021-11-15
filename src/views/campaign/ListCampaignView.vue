<template>
  <div class="process">
    <vuescroll>
      <PageTitle :title="pageTitle" :subtitle="pageDescription"></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenantId"
              :items="tenantList"
              label="테넌트"
              :placeholder="searchForm.useYn ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-text-field
              class="default search"
              v-model="searchForm.campaignNm"
              label="캠페인명"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.campaignStatus"
              :items="campaignStatusList"
              label="캠페인 상태"
              :placeholder="searchForm.useYn ? undefined : $t('label.all')"
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
                  label="캠페인 기간"
                  placeholder="YYYY.MM.DD - YYYY.MM.DD"
                  v-on="on"
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
                    (date) =>
                      date == searchForm.dates[0]
                        ? ['startDate']
                        : date == searchForm.dates[1]
                        ? ['endDate']
                        : ''
                  "
                  :events="searchForm.dates"
                  :date-format="(date) => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    :ripple="false"
                    color="pink"
                    @click="pickerMenu = false"
                    >{{ $t("button.close") }}
                  </v-btn>
                  <v-btn
                    text
                    :ripple="false"
                    color="pink"
                    @click="$refs.pickerMenu.save(searchForm.dates)"
                    >{{ $t("button.confirm") }}
                  </v-btn>
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
              >{{ $t("button.search") }}</v-btn
            >
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
          :item-key="`campaignId`"
          :server-items-length="pagination.totalRows"
          :headers="headers"
          :items="campaignList"
          @click:row="detailRow"
          :page.sync="pagination.page"
          :items-per-page.sync="pagination.itemsPerPage"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:[`item.startDt`]="{ item }">
            {{ `${item.startDt} ${item.startHm}` }}
          </template>
          <template v-slot:[`item.endDt`]="{ item }">
            {{ `${item.endDt} ${item.endHm}` }}
          </template>
          <template v-slot:[`item.square`]="{ item }">
            {{ `${item.square}%` }}
          </template>
          <template v-slot:item.campaignStatus="{ item }">
            {{ (campaignStatus.find((c) => c.value === item.campaignStatus) || { text: ''}).text }}
          </template>
          <template v-slot:item.lastUpdTime="{ item }">
            {{ $moment(item.lastUpdTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD') }}
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
          @input="getList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click.stop="newBtn">{{ $t('button.new')}}</v-btn>
      </div>
    </vuescroll>
  </div>
</template>

<script>
import {
  getCampaignSearchCondition,
  getCampaignList
} from '../../api/campaign'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'ListCampaignView',
  components: {
  },
  mixins: [datepicker],
  created () {
    this.init()
  },
  mounted () {
    this.getList()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
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
    campaignStatusList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.campaignStatus)
      return its
    },
    dateRangeText: {
      get: function () {
        const dateRange = this.searchForm.dates
        dateRange.sort((a, b) => {
          return a >= b ? (a === b ? 0 : 1) : -1
        })
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
          this.getList()
        }
      }
    }
  },
  data () {
    return {
      campaignList: [],
      tenants: [],
      campaignStatus: [],
      // 검색조건
      searchForm: {
        campaignNm: '',
        tenantId: '',
        campaignStatus: '',
        startDt: '',
        endDt: '',
        dates: []
      },

      // 테이블  데이터
      headers: [
        { text: '테넌트', value: 'tenantNm', align: 'center', width: '150px' },
        { text: '캠페인명', value: 'campaignNm', align: 'center' },
        { text: '시나리오명', value: 'scenarioNm', align: 'center', width: '200px' },
        { text: '발신번호', value: 'telNo', align: 'center', width: '120px' },
        { text: '대상자수', value: 'listCnt', align: 'center', width: '100px' },
        { text: '시작일시', value: 'startDt', align: 'center', width: '150px' },
        { text: '종료일시', value: 'endDt', align: 'center', width: '150px' },
        { text: '진행상태', value: 'campaignStatus', align: 'center', width: '100px' },
        { text: '수정일시', value: 'lastUpdTime', align: 'center', width: '120px' }
      ],
      selected: [],
      editedItem: {},

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
  methods: {
    init: function () {
      const now = Date.now()
      this.searchForm.dates[1] = new Date(now).toISOString().substring(0, 10)
      const d = new Date()
      d.setMonth(d.getMonth() - 1)
      this.searchForm.dates[0] = d.toISOString().substring(0, 10)
      this.getSearchCondition()
    },
    getSearchCondition: function () {
      getCampaignSearchCondition().then((response) => {
        this.tenants = response.data.result.tenantList
        this.campaignStatus = response.data.result.campaignStatusList
      })
    },
    getList: function () {
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => {
        return a >= b ? (a === b ? 0 : 1) : -1
      })
      const searchCondition = {
        page: this.pagination.page,
        sortBy:
          this.options.sortBy && this.options.sortBy.length
            ? this.options.sortBy[0]
            : '',
        sortDesc:
          this.options.sortDesc && this.options.sortDesc.length
            ? this.options.sortDesc[0] === false
              ? 'DESC'
              : 'ASC'
            : '',
        itemsPerPage: this.pagination.itemsPerPage,
        campaignNm: this.searchForm.campaignNm,
        tenantId: this.searchForm.tenantId,
        campaignStatus: this.searchForm.campaignStatus,
        startDt: dateRange && dateRange.length > 0 ? dateRange[0] : '', // 검색시작일
        endDt:
          dateRange && dateRange.length > 0
            ? dateRange.length > 1
              ? dateRange[1]
              : dateRange[0]
            : '' // 검색종료일
      }
      this.pagination.loading = true
      getCampaignList(searchCondition).then(
        (response) => {
          this.campaignList = response.data.result.campaignList
            ? response.data.result.campaignList
            : []
          // paging setting
          this.pagination.totalRows = response.data.result.campaignListCount
          const pageLength = parseInt(
            this.pagination.totalRows / this.pagination.itemsPerPage
          )
          this.pagination.length =
            parseInt(
              this.pagination.totalRows % this.pagination.itemsPerPage
            ) === 0
              ? pageLength
              : pageLength + 1
        },
        (error) => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({
            name: 'Login',
            query: { t: new Date().getTime() }
          })
        }
      )
      this.pagination.loading = false
    },
    detailRow (item) {
      this.$router.push({ name: 'UpdateCampaignView', query: { t: new Date().getTime() }, params: { campaignId: item.campaignId } })
    },
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getList()
    },
    newBtn: function () {
      this.$router.push({ name: 'CreateCampaignView', query: { t: new Date().getTime() } })
    }
  }
}
</script>

<style scoped>
</style>
