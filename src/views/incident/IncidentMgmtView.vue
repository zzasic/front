<template>
  <div class="process userGroupView">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
        :hasNoSearchGroup="true"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenantId"
              :items="cptdItemsTenant"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenantId ? undefined : '전체'"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.systemId"
              :items="cptdItemsSystem"
              label="시스템"
              :placeholder="searchForm.systemId ? undefined : '전체'"
            ></v-select>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.dateType"
              :items="dateTypes"
              label="검색구분"
              :placeholder="searchForm.dateType ? undefined : '발생일시'"
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
          <v-col cols="3" class="pl-3">
            <v-text-field
              class="default search"
              v-model="searchForm.incidentDtl"
              label="장애내용, 조치내용"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
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
      <v-container class="transaction wrapAdminPermitMgmt incident-mgmt">
        <v-row>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll clickable incident-mgmt__grid" :style="{ height: colMaxHeight + 'px' }">
              <v-data-table
                v-model="selectIncidents"
                :headers="headers"
                :items="desserts"
                hide-default-footer
                show-select
                item-key="incidentId"
                :fixed-header="true"
                class="user-group-table"
                @click:row="gridRowClick"
                :server-items-length="pagination.totalRows"
                :options.sync="optionSync"
                :no-data-text="$t('message.noData')"
                :loading-text="$t('message.loading')"
              >
                <template v-slot:item.incidentStat="{ item }">
                  {{ (incidentStats.find(s => s.value === item.incidentStat) || { text: '' }).text }}
                </template>
                <template v-slot:item.incidentDtl="{ item }">
                  {{ item.incidentStat === '01' ? $moment(item.occurDtm, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') : item.incidentStat === '05' ? $moment(item.failoverDtm, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') : $moment(item.lastUpdTime || item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') }}
                </template>
                <template v-slot:item.incidentDtl="{ item }">
                  {{ item.incidentDtl.length > 30 ? item.incidentDtl.substr(0,30)+'....' : item.incidentDtl }}
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
                @input="getIncidentList"
                :total-visible="10"
              ></v-pagination>
            </div>
            <div class="btn-group align-right incident-mgmt__btn-group">
              <v-btn color="btn-secondary" text @click.stop="newBtn">신규</v-btn>
              <v-btn color="btn-primary" text @click.stop="deleteIncident">삭제</v-btn>
            </div>
          </v-col>
          <v-col>
            <v-form
              ref="form"
              v-model="valid"
            >
            <v-card class="default has-scroll clickable incident-mgmt__form" :style="{ height: colMaxHeight + 'px' }">
              <vuescroll>
                <v-container class="addUserDefaultData">
                  <v-row v-if="!!inputForm.incidentId">
                    <v-col cols="1">
                      <span class="label">장애 ID</span>
                    </v-col>
                    <v-col>
                      <span class="label">
                      {{ inputForm.incidentId }} ( {{ (incidentStats.find(s => s.value === curIncidentStat) || { text: '' }).text }} )
                      </span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1">
                      <span class="label must">장애발생일시</span>
                    </v-col>
                    <v-col cols="4">
                      <v-menu
                        content-class="date-picker"
                        ref="pickerEndMenu"
                        v-model="pickerEndMenu"
                        :close-on-content-click="false"
                        :return-value.sync="inputForm.occurDt"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            class="default text-field-date pr-0"
                            style="margin-top: 0px; padding: 0px 15px 0 0; width: 130px; display:inline-block;"
                            placeholder="YYYY-MM-DD"
                            v-model="inputForm.occurDt"
                            v-on="on"
                            readonly
                            clearable
                            @click="clickPicker"
                          >
                          </v-text-field>
                        </template>
                        <div @click="clickPicker">
                          <v-date-picker
                            class="single-date"
                            v-model="inputForm.occurDt"
                            no-title
                            scrollable
                            :date-format="date => new Date(date).toDateString()"
                            :locale="$i18n.locale"
                            :picker-date.sync="pickerEndDate"
                            @click:date="dateClick"
                          >
                            <v-spacer></v-spacer>
                            <v-btn text :ripple="false" color="pink" @click="pickerEndMenu = false">{{ $t('button.close')}}</v-btn>
                            <v-btn text :ripple="false" color="pink" @click="$refs.pickerEndMenu.save(inputForm.occurDt)">{{ $t('button.confirm')}}</v-btn>
                          </v-date-picker>
                        </div>
                      </v-menu>
                      <div class="time-wrap ml-2" style="display:inline-block;">
                        <vue-timepicker
                          v-model="inputForm.occurHm"
                          format="HH:mm"
                          lazy
                          manual-input
                        ></vue-timepicker>
                      </div>
                    </v-col>
                    <v-col></v-col>
                    <v-col cols="1">
                      <span class="label must">상태</span>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        class="default mt-0 pt-0"
                        :menu-props="{ offsetY: true }"
                        :placeholder="inputForm.incidentStat ? undefined : '선택'"
                        hide-details="auto"
                        single-line
                        v-model="inputForm.incidentStat"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '장애상태를 선택해주세요'
                        ]"
                        :items="incidentStats"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1">
                      <span class="label must">장애분류</span>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        class="default mt-0 pt-0"
                        :menu-props="{ offsetY: true }"
                        :placeholder="inputForm.incidentClass ? undefined : '선택'"
                        hide-details="auto"
                        single-line
                        v-model="inputForm.incidentClass"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '장애분류를 선택해주세요'
                        ]"
                        :items="incidentClasses"
                      ></v-select>
                    </v-col>
                    <v-col></v-col>
                     <v-col cols="1">
                      <span class="label must">장애대상</span>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        class="default mt-0 pt-0"
                        :menu-props="{ offsetY: true }"
                        :placeholder="inputForm.incidentPosition ? undefined : '선택'"
                        hide-details="auto"
                        single-line
                        v-model="inputForm.incidentPosition"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '장애대상을 선택해주세요'
                        ]"
                        :items="incidentPositions"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1">
                      <span class="label must">테넌트</span>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        class="default mt-0 pt-0"
                        :menu-props="{ offsetY: true }"
                        :placeholder="inputForm.tenantId ? undefined : '선택'"
                        hide-details="auto"
                        single-line
                        v-model="inputForm.tenantId"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '테넌트를 선택해주세요'
                        ]"
                        :items="tenants"
                      ></v-select>
                    </v-col>
                    <v-col></v-col>
                    <v-col cols="1">
                      <span class="label must">시스템</span>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        class="default mt-0 pt-0"
                        :menu-props="{ offsetY: true }"
                        :placeholder="inputForm.systemId ? undefined : '선택'"
                        hide-details="auto"
                        single-line
                        v-model="inputForm.systemId"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '시스템을 선택해주세요'
                        ]"
                        :items="systems"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1">
                      <span class="label must">세부 시스템</span>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="inputForm.incidentSystemDtl"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '세부 시스템을 입력해주세요'
                        ]"
                        class="default pt-0 mt-0 pr-0"
                        hide-details="auto"
                        label=" "
                        placeholder="세부 시스템을 입력해 주세요"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1">
                      <span class="label must">장애내용</span>
                    </v-col>
                    <v-col>
                      <v-textarea
                        v-model="inputForm.incidentDtl"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '장애내용을 입력해주세요'
                        ]"
                        class="default pt-0 mt-0 pr-0"
                        hide-details="auto"
                        label=" "
                        placeholder="장애내용을 입력해 주세요"
                        rows="4"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row v-if="inputForm.incidentStat !== '01'">
                    <v-col cols="1">
                      <span class="label must">장애원인</span>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        class="default mt-0 pt-0"
                        :menu-props="{ offsetY: true }"
                        :placeholder="inputForm.incidentCause ? undefined : '선택'"
                        hide-details="auto"
                        single-line
                        v-model="inputForm.incidentCause"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '장애원인을 선택해주세요'
                        ]"
                        :items="incidentCauses"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row v-if="inputForm.incidentStat !== '01'">
                    <v-col cols="1">
                      <span class="label must">세부 원인</span>
                    </v-col>
                    <v-col>
                      <v-textarea
                        v-model="inputForm.incidentCauseDtl"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '세부 원인을 입력해주세요'
                        ]"
                        class="default pt-0 mt-0 pr-0"
                        hide-details="auto"
                        label=" "
                        placeholder="세부 원인을 입력해 주세요"
                        rows="4"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row v-if="inputForm.incidentStat === '05'">
                    <v-col cols="1">
                      <span class="label must">장애조치일시</span>
                    </v-col>
                    <v-col cols="4">
                      <v-menu
                        content-class="date-picker"
                        ref="pickerStartMenu"
                        v-model="pickerStartMenu"
                        :close-on-content-click="false"
                        :return-value.sync="inputForm.failoverDt"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            class="default text-field-date pr-0"
                            style="margin-top: 0px; padding: 0px 15px 0 0; width: 130px; display:inline-block;"
                            placeholder="YYYY-MM-DD"
                            v-model="inputForm.failoverDt"
                            v-on="on"
                            readonly
                            clearable
                            @click="clickPicker"
                          >
                          </v-text-field>
                        </template>
                        <div @click="clickPicker">
                          <v-date-picker
                            class="single-date"
                            v-model="inputForm.failoverDt"
                            no-title
                            scrollable
                            :date-format="date => new Date(date).toDateString()"
                            :locale="$i18n.locale"
                            :picker-date.sync="pickerStartDate"
                            @click:date="dateClick"
                          >
                            <v-spacer></v-spacer>
                            <v-btn text :ripple="false" color="pink" @click="pickerStartMenu = false">{{ $t('button.close')}}</v-btn>
                            <v-btn text :ripple="false" color="pink" @click="$refs.pickerStartMenu.save(inputForm.failoverDt)">{{ $t('button.confirm')}}</v-btn>
                          </v-date-picker>
                        </div>
                      </v-menu>
                      <div class="time-wrap ml-2" style="display:inline-block;">
                        <vue-timepicker
                          v-model="inputForm.failoverHm"
                          format="HH:mm"
                          lazy
                          manual-input
                        ></vue-timepicker>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row v-if="inputForm.incidentStat === '05'">
                    <v-col cols="1">
                      <span class="label must">조치내용</span>
                    </v-col>
                    <v-col>
                      <v-textarea
                        v-model="inputForm.failoverDtl"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '조치내용을 입력해주세요'
                        ]"
                        class="default pt-0 mt-0 pr-0"
                        hide-details="auto"
                        label=" "
                        placeholder="조치내용을 입력해 주세요"
                        rows="6"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </vuescroll>
            </v-card>
            <div class="btn-group align-right mt-0">
              <v-btn color="btn-primary" text @click.stop="setIncident">저장</v-btn>
              <v-btn color="btn-secondary" text @click.stop="resetBtn">초기화</v-btn>
            </div>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </vuescroll>
  </div>
</template>

<script>
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'
import datepicker from '@/plugins/datepicker'
import {
  initIncident,
  getIncidentList,
  createIncident,
  selectIncidentForUpdate,
  updateIncident,
  deleteIncidents
} from '@/api/incident'

export default {
  name: 'IncidentMgmtView',
  components: {
    VueTimepicker
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.initIncident()
  },
  data () {
    return {
      valid: false,
      colMaxHeight: (window.innerHeight - 412),
      selectIncidents: [],
      headers: [
        { text: '시스템', value: 'systemNm', align: 'center', class: 'text-center', width: '180px' },
        { text: '테넌트', value: 'tenantNm', align: 'center', class: 'text-center', width: '180px' },
        { text: '상태', value: 'incidentStat', align: 'center', class: 'text-center', width: '150px' },
        { text: '발생일시', value: 'occurDtm', align: 'center', class: 'text-left' }
      ],
      desserts: [],
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
      /* init */
      tenants: [],
      incidentClasses: [],
      incidentPositions: [],
      incidentStats: [],
      incidentCauses: [],
      systems: [],
      // 일자검색조건
      dateTypes: [
        {
          text: '발생일시',
          value: 'OCC'
        },
        {
          text: '조치일시',
          value: 'FAI'
        }
      ],
      searchForm: {
        tenantId: '',
        systemId: '',
        incidentDtl: '',
        dateType: 'OCC', // FAI
        dates: [this.$moment().add(-1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      },
      curIncidentStat: '01',
      /* input start */
      inputForm: {
        incidentId: '',
        tenantId: '',
        systemId: '',
        incidentSystemDtl: '',
        incidentClass: '',
        incidentPosition: '',
        occurDt: this.$moment().format('YYYY-MM-DD'),
        occurHm: this.$moment().format('HH:mm'),
        incidentStat: '01', // 장애접수
        incidentDtl: '',
        incidentCause: '',
        incidentCauseDtl: '',
        failoverDt: this.$moment().format('YYYY-MM-DD'),
        failoverHm: this.$moment().format('HH:mm'),
        failoverDtl: ''
      },
      newForm: {
        incidentId: '',
        tenantId: '',
        systemId: '',
        incidentSystemDtl: '',
        incidentClass: '',
        incidentPosition: '',
        occurDt: this.$moment().format('YYYY-MM-DD'),
        occurHm: this.$moment().format('HH:mm'),
        incidentStat: '01', // 장애접수
        incidentDtl: '',
        incidentCause: '',
        incidentCauseDtl: '',
        failoverDt: this.$moment().format('YYYY-MM-DD'),
        failoverHm: this.$moment().format('HH:mm'),
        failoverDtl: ''
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
    cptdItemsTenant () {
      const tenantList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      tenantList.push(...this.tenants)
      return tenantList
    },
    cptdItemsSystem () {
      const systemList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      systemList.push(...this.systems)
      return systemList
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
          // TODO : 목록조회
        }
      }
    }
  },
  watch: {
  },
  methods: {
    initIncident () {
      initIncident().then(
        response => {
          this.tenants = response.data.result.tenantList
          this.incidentClasses = response.data.result.incidentClassList
          this.incidentPositions = response.data.result.incidentPositionList
          this.incidentStats = response.data.result.incidentStatList
          this.incidentCauses = response.data.result.incidentCauseList
          this.systems = response.data.result.systemInfoList
          this.searchBtn()
        }
      )
    },
    getIncidentList () {
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        tenantId: this.searchForm.tenantId,
        systemId: this.searchForm.systemId,
        incidentDtl: this.searchForm.incidentDtl,
        dateType: this.searchForm.dateType, // 검색조건
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '', // 검색시작일
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : '' // 검색종료일
      }
      this.pagination.loading = true
      getIncidentList(searchCondition).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            this.desserts = response.data.result.incidentList || []
            // paging setting
            this.pagination.totalRows = response.data.result.incidentListCount
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
    searchBtn () {
      this.pagination.page = 1
      this.selectIncidents = []
      this.getIncidentList()
    },
    newBtn () {
      Object.assign(this.inputForm, {}, this.newForm, {
        occurDt: this.$moment().format('YYYY-MM-DD'),
        occurHm: this.$moment().format('HH:mm'),
        failoverDt: this.$moment().format('YYYY-MM-DD'),
        failoverHm: this.$moment().format('HH:mm')
      })
      this.$refs.form.resetValidation()
    },
    resetBtn () {
      if (!this.inputForm.incidentId) {
        this.newBtn()
      } else {
        this.selectIncident(this.inputForm.incidentId)
        this.$refs.form.resetValidation()
      }
    },
    setIncident () {
      if (!this.$refs.form.validate()) {
        return
      }
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const input = {
        incidentId: this.inputForm.incidentId,
        tenantId: this.inputForm.tenantId,
        systemId: this.inputForm.systemId,
        incidentSystemDtl: this.inputForm.incidentSystemDtl,
        incidentClass: this.inputForm.incidentClass,
        incidentPosition: this.inputForm.incidentPosition,
        occurDt: this.inputForm.occurDt,
        occurHm: this.inputForm.occurHm,
        incidentStat: this.inputForm.incidentStat,
        incidentDtl: this.inputForm.incidentDtl,
        incidentCause: this.inputForm.incidentCause,
        incidentCauseDtl: this.inputForm.incidentCauseDtl,
        failoverDt: this.inputForm.failoverDt,
        failoverHm: this.inputForm.failoverHm,
        failoverDtl: this.inputForm.failoverDtl
      }
      if (!this.inputForm.incidentId) {
        // create
        createIncident(input).then(
          response => {
            if (response.data.status === 200) {
              this.searchBtn()
              this.selectIncident(response.data.result.incident.incidentId)
            }
          },
          error => {
            console.error(error)
            delete sessionStorage.accessToken
            this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
          }
        )
      } else {
        // update
        updateIncident(input).then(
          response => {
            if (response.data.status === 200) {
              this.searchBtn()
              this.selectIncident(response.data.result.incident.incidentId)
            }
          },
          error => {
            console.error(error)
            delete sessionStorage.accessToken
            this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
          }
        )
      }
    },
    gridRowClick (item) {
      this.selectIncident(item.incidentId)
    },
    selectIncident (incidentId) {
      const input = {
        incidentId: incidentId
      }
      selectIncidentForUpdate(input).then(
        response => {
          this.inputForm.incidentId = response.data.result.incident.incidentId
          this.inputForm.tenantId = response.data.result.incident.tenantId
          this.inputForm.systemId = response.data.result.incident.systemId
          this.inputForm.tenant = response.data.result.incident.tenantId
          this.inputForm.incidentSystemDtl = response.data.result.incident.incidentSystemDtl
          this.inputForm.incidentClass = response.data.result.incident.incidentClass
          this.inputForm.incidentPosition = response.data.result.incident.incidentPosition
          this.inputForm.occurDt = response.data.result.incident.occurDt
          this.inputForm.occurHm = response.data.result.incident.occurHm
          this.inputForm.incidentDtl = response.data.result.incident.incidentDtl
          this.curIncidentStat = response.data.result.incident.incidentStat
          if (response.data.result.incident.incidentStat === '01') {
            this.inputForm.incidentStat = '02'
          } else if (response.data.result.incident.incidentStat === '02') {
            this.inputForm.incidentStat = '05'
            this.inputForm.failoverDt = this.$moment().format('YYYY-MM-DD')
            this.inputForm.failoverHm = this.$moment().format('HH:mm')
            this.inputForm.incidentCause = response.data.result.incident.incidentCause
            this.inputForm.incidentCauseDtl = response.data.result.incident.incidentCauseDtl
          } else {
            this.inputForm.incidentStat = response.data.result.incident.incidentStat
            this.inputForm.incidentCause = response.data.result.incident.incidentCause
            this.inputForm.incidentCauseDtl = response.data.result.incident.incidentCauseDtl
            this.inputForm.failoverDt = response.data.result.incident.failoverDt
            this.inputForm.failoverHm = response.data.result.incident.failoverHm
            this.inputForm.failoverDtl = response.data.result.incident.failoverDtl
          }
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    deleteIncident () {
      if (!this.selectIncidents || this.selectIncidents.length === 0) {
        alert('삭제할 대상을 선택해주세요.')
        return
      }
      const selected = this.selectIncidents
      deleteIncidents(selected).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.selectIncidents = []
            this.getIncidentList()
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
