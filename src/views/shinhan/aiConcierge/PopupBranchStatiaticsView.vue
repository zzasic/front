<template>
<div>
  <v-card>
    <v-card-title>
      <span class="headline">상세내역</span>
    </v-card-title>
    <v-card-text>
       <v-card class="data-grid-wrap default clickable">
        <v-data-table
          :headers="headers"
          :items="branchStatisticsList"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr :title="convertContents(props.item.contents)">
              <td class="text-center">{{ props.item.systemNm }}</td>
              <td class="text-center">{{ props.item.tenantNm }}</td>
              <td class="text-center">{{ props.item.callId }}</td>
              <td class="text-center">{{ props.item.branchCd }}</td>
              <td class="text-center">{{ props.item.branchNm }}</td>
              <td class="text-center">{{ props.item.deviceNo }}</td>
              <td class="text-center">{{ props.item.moudule }}</td>
              <td class="text-center">{{ props.item.tranId }}</td>
              <td class="text-center">{{ getContents(props.item.contents) }}</td>
              <td class="text-center">{{ props.item.startDt }}</td>
              <td class="text-center" >{{ props.item.endDt }}</td>
            </tr>
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
          @input="fnc_getBranchStatisticsList"
          :total-visible="10"
        ></v-pagination>
      </div>
    </v-card-text>
      <v-card-actions class="submit-btns-group">
        <v-spacer></v-spacer>
        <v-btn color="btn-secondary" text @click="confirmBtn">확인</v-btn>
      </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="closeBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</div>
</template>

<script>
import {
  getBranchStatisticsList
} from '../../../api/shinhan/aiConcierge' // solutionHistory'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'BranchStatiaticsView',
  components: {
  },
  props: ['item'],
  mixins: [datepicker],
  created () {
    if (sessionStorage.userAuthCode === 'CU' || sessionStorage.userAuthCode === 'CAU') {
      this.authOpt = false
      this.searchForm.system = sessionStorage.systemIds
    }
  },
  mounted () {
    this.fnc_getBranchStatisticsList()
  },
  data () {
    return {
      moudules: [
        { opt1: 'AIH', opt2: null, opt3: null, opt4: null, text: '음성', value: 'VO' },
        { opt1: 'AIH', opt2: null, opt3: null, opt4: null, text: '버튼', value: 'BT' },
        { opt1: 'AIH', opt2: null, opt3: null, opt4: null, text: '침묵', value: 'SL' }
      ],
      headers: [
        { text: '시스템', value: 'systemNm', align: 'center', class: 'text-center', width: '120px' },
        { text: '테넌트', value: 'tenantNm', align: 'center', class: 'text-center', width: '120px' },
        { text: 'CALL ID', value: 'callId', align: 'center', class: 'text-center', width: '240px' },
        { text: '지점코드', value: 'branchCd', align: 'center', class: 'text-center', width: '70px' },
        { text: '지점명', value: 'branchNm', align: 'center', width: '100px' },
        { text: '단말번호', value: 'deviceNo', align: 'center', class: 'text-center', width: '100px' },
        { text: '인식구분', value: 'moudule', align: 'center', class: 'text-center', width: '120px' },
        { text: '트랜잭션ID', value: 'tranId', align: 'center', class: 'text-center', width: '120px' },
        { text: '컨텐츠', value: 'contents', align: 'center', class: 'text-center', width: '120px' },
        { text: '사용시작', value: 'startDt', align: 'center', class: 'text-center', width: '120px' },
        { text: '사용종료', value: 'endDt', align: 'center', class: 'text-center', width: '120px' }
      ],
      branchStatisticsList: [],
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
      callTypes: [],
      searchForm: {
        itemsSystemInfoList: [],
        system: '',
        solutionId: '',
        itemsTenantList: [],
        tenant: '',
        branchNm: '',
        branchCd: this.item.branchCd,
        moudule: '',
        deviceNo: '',
        status: '',
        callType: '',
        timeType: this.item.timeType,
        searchDate: this.item.timeValue,
        pageType: 'P',
        dates: [this.item.startDate, this.item.endDate],
        tenantId: this.item.tenantId
      },
      chats: [],
      authOpt: true,
      popup: {
        branchPopup: false
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
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.fnc_getBranchStatisticsList()
        }
      }
    }
  },

  watch: {
  },

  methods: {
    getContents (str) {
      let content
      let setStr
      if (str === null || str === undefined || str === '') {
        content = ''
      } else {
        setStr = str // .replace('\\n', '')
        // console.log(' setStr ' + setStr)
        if (setStr.length > 10) {
          content = setStr.substring(0, 9) + '...'
        } else {
          content = setStr
        }
      }
      return content
    },
    convertContents (str) {
      return str === null || str === '' ? '' : str // .replaceAll('\\n', '\n') //  setStr = str.replace('\\n', '&lt;br&gt;') .replace('\n', '<br>')
    },
    fnc_getBranchStatisticsList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenantId,
        branchCd: this.searchForm.branchCd, // 지점명 배열
        status: this.searchForm.status,
        timeType: this.searchForm.timeType,
        searchDate: this.searchForm.searchDate,
        pageType: this.searchForm.pageType,
        startMonth: this.searchForm.dates[0],
        endMonth: this.searchForm.dates[1]
      }
      console.log(' searchCondition pop' + JSON.stringify(searchCondition))
      this.pagination.loading = true
      getBranchStatisticsList(searchCondition).then(
        response => {
          this.branchStatisticsList = response.data.result.branchStatisticsList ? response.data.result.branchStatisticsList : []
          console.log(this.branchStatisticsList)
          // paging setting
          this.pagination.totalRows = response.data.result.branchStatisticsListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
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
        this.pagination.loading = false
      })
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.fnc_getBranchStatisticsList()
    },
    // 취소버튼
    closeBtn: function () {
      this.$emit('popupAction', {
        statisticPopup: false
      })
    },
    confirmBtn: function () {
      this.$emit('popupAction', {
        statisticPopup: false
      },
      this.selected)
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
