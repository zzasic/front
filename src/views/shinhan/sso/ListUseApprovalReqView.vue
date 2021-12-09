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
              v-model="searchForm.userInfo"
              :label="$t('label.userName')+', '+$t('label.userId')"
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.reqStatus"
              :items="cptdStatusList"
              label="처리 상태"
              :placeholder="searchForm.status ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.systemIds"
              :items="cptdSystemIds"
              label="시스템 정보"
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
          :item-key="`reqNo`"
          :server-items-length="pagination.totalRows"
          :items="ssoUseApprovalReqList"
          :options.sync="optionSync"
          :page.sync="pagination.page"
          :items-per-page.sync="pagination.itemsPerPage"
          :loading="pagination.loading"
          hide-default-footer
          @click:row="getDetailInfo"
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
        <template v-slot:item.ssoUserId="{ item }">
          {{ item.ssoUserId }}
        </template>
        <template v-slot:item.systemIds="{ item }">
          <!-- {{ item.systemIds.indexOf(',') == '-1' ? item.systemIdsNm : item.system0Ids.split(',').map(val => { val }) }} -->
          {{ item.systemIdsNm }}
        </template>
        <template v-slot:item.userEmail="{ item }">
          {{ item.userEmail }}
        </template>
        <template v-slot:item.userNm="{ item }">
          {{ item.userNm }}
        </template>
        <template v-slot:item.userDeptNm="{ item }">
          {{ item.userDeptNm }}
        </template>
        <template v-slot:item.userAuthCd="{ item }">
          {{ item.userAuthCdNm }}
        </template>
        <template v-slot:item.userPosition="{ item }">
          {{ item.userPosition }}
        </template>
        <template v-slot:item.userPhone="{ item }">
          {{ item.userPhone == null || item.userPhone === '' ? '' : item.userPhone }}
        </template>
        <template v-slot:item.approvalId="{ item }">
          {{ item.approvalId }}
        </template>
        <template v-slot:item.reqStatus="{ item }">
          {{ item.reqStatus === 'REQ' ? '승인 대기중' : item.reqStatus === 'APL' ? '승인 완료' : item.reqStatus === 'REJ' ? '반려' : '삭제' }}
        </template>
        <template v-slot:item.firstRegTime="{ item }">
          {{ $moment(item.lastUpdTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-slot:item.lastUpdTime="{ item }">
          {{ $moment(item.lastUpdTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm:ss') }}
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
          @input="fnc_getSsoUseApprovalList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <!-- <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn> -->
        <!-- <v-btn color="btn-primary" text @click="fnc_useApprovalReqPermits">{{ $t('shinhan.sso.approvalReq')}}</v-btn> -->
      </div>

      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupDetailInfo.detailUserApprovalReqView"
        width="500"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <detail-user-approval-req-view
          @close-dialog="closeDialogDetailInfo"
          @refresh-list="fnc_getSsoUseApprovalList"
          :editedItem="editedItem"
          v-if="dialogLookupDetailInfo.detailUserApprovalReqView"
        />
      </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import detailUserApprovalReqView from '@/views/shinhan/sso/DetailUserApprovalReqView'
import {
  getSsoUseApprovalInit,
  getSsoUseApprovalReqList
  // ,setSsoUseApprovalReqPermits
} from '../../../api/shinhan/sso'
// import { // 엑셀 다운로드
//   reqAiConciergeHistoryExcelDown
// } from '../../../api/shinhan/aiConcierge'

import datepicker from '@/plugins/datepicker'
// import lodash from 'lodash'

export default {
  name: 'ListUseApprovalReqView',
  components: {
    detailUserApprovalReqView
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.InitUseApprovalReq()
  },
  data () {
    return {
      headers: [
        { text: '행번', value: 'ssoUserId', align: 'center', class: 'text-center', width: '100px' },
        { text: '이름', value: 'userNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '사용 시스템', value: 'systemIds', align: 'center', class: 'text-center', width: '120px' },
        { text: '이메일', value: 'userEmail', align: 'center', class: 'text-center', width: '120px' },
        { text: '부서', value: 'userDeptNm', align: 'center', class: 'text-center', width: '120px' },
        { text: '권한', value: 'userAuthCdNm', align: 'center', class: 'text-center', width: '120px' },
        { text: '직급', value: 'userPosition', align: 'center', class: 'text-center', width: '120px' },
        { text: '연락처', value: 'userPhone', align: 'center', class: 'text-center', width: '120px' },
        { text: '처리자', value: 'approvalId', align: 'center', class: 'text-center', width: '120px' },
        { text: '처리상태', value: 'reqStatus', align: 'center', class: 'text-center', width: '120px' },
        { text: '신청일시', value: 'firstRegTime', align: 'center', class: 'text-center', width: '120px' },
        { text: '처리일시', value: 'lastUpdTime', align: 'center', class: 'text-center', width: '150px' }
      ],
      ssoUseApprovalReqList: [],
      selected: [],
      systemIdList: [],
      systemIdListDict: {},
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
      status: [
        {
          text: '승인 대기중',
          value: 'REQ'
        },
        {
          text: '승인 완료',
          value: 'APL'
        },
        {
          text: '반려',
          value: 'REJ'
        },
        {
          text: '삭제',
          value: 'DEL'
        }
      ],
      searchForm: {
        userInfo: '',
        reqStatus: 'REQ',
        systemIds: '',
        dates: [this.$moment().add(-1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      },
      dialogLookupDetailInfo: {
        detailUserApprovalReqView: false
      },
      editedItem: {}
    }
  },

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdSystemIds () {
      const systemIdList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      if (this.searchForm.reqStatus !== 'REQ') {
        systemIdList.push(...this.systemIdList)
      }
      return systemIdList
    },
    cptdStatusList () {
      const statusList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      statusList.push(...this.status)
      return statusList
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
          this.fnc_getSsoUseApprovalList()
        }
      }
    }
  },

  watch: {
  },

  methods: {
    async InitUseApprovalReq () {
      await this.fnc_getSsoUseApprovalInit() // 검색 조건 조회
      this.fnc_getSsoUseApprovalList() // 목록 조회
    },
    fnc_getSsoUseApprovalInit: function () {
      getSsoUseApprovalInit().then(
        response => {
          this.systemIdList = response.data.result.systemInfoList ? response.data.result.systemInfoList : []
          // ############### systemIdList > key : value
          for (let i = 0; i < this.systemIdList.length; i++) {
            this.systemIdListDict[this.systemIdList[i].value] = this.systemIdList[i].text
          }
        }
      )
    },
    getDetailInfo (item) {
      if (item.reqStatus === 'APL') {
        alert('이미 처리 완료된 사용자 입니다.\n 사용자 정보에서 확인해주세요.')
        return
      } else if (item.reqStatus === 'REJ') {
        alert('승인요청이 반려된 사용자는 상세정보를 확인할 수 없습니다.')
        return
      } else if (item.reqStatus === 'DEL') {
        alert('삭제된 사용자는 상세정보를 확인할 수 없습니다.')
        return
      }
      this.editedItem.reqNo = Object.assign(item.reqNo)
      this.dialogLookupDetailInfo.detailUserApprovalReqView = true
    },
    closeDialogDetailInfo: function () {
      this.dialogLookupDetailInfo.detailUserApprovalReqView = false
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.fnc_getSsoUseApprovalList()
    },
    fnc_getSsoUseApprovalList: function () {
      /* datepicker open */
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
        userInfo: this.searchForm.userInfo,
        status: this.searchForm.status,
        systemIds: this.searchForm.systemIds,
        reqStatus: this.searchForm.reqStatus,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getSsoUseApprovalReqList(searchCondition).then(
        response => {
          this.ssoUseApprovalReqList = response.data.result.ssoUseApprovalReqList ? response.data.result.ssoUseApprovalReqList : []
          // paging setting
          this.pagination.totalRows = response.data.result.ssoUseApprovalReqListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1

          // ############### systemIdList concat ###############
          for (let i = 0; i < this.ssoUseApprovalReqList.length; i++) {
            if (this.ssoUseApprovalReqList[i].systemIdsNm == null && this.ssoUseApprovalReqList[i].systemIds != null) {
              let systemNms = ''
              this.ssoUseApprovalReqList[i].systemIds.split(',').map(val => { systemNms += this.systemIdListDict[val] + ',' })
              systemNms = systemNms.slice(0, -1)
              this.ssoUseApprovalReqList[i].systemIdsNm = systemNms
            }
          }
        }
      ).finally(() => {
        this.pagination.loading = false
      })
    }
  }
}
</script>
