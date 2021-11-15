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
              v-model="searchForm.apiNm"
              label="API 명"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.system"
              :items="cptdItemsSystemInfoList"
              :label="$t('label.system')"
              :placeholder="searchForm.system ? undefined : $t('label.all')"
              clearable
            ></v-select>
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
          :item-key="`serviceId`"
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
          show-select
        >
          <template v-slot:item.apiNm="{ item }">
            {{ item.apiNm.length > 30 ? item.apiNm.substr(0,30)+'....' : item.apiNm}}
          </template>
          <template v-slot:item.callType="{ item }">
            {{ item.callType === 'IN' ? '인바운드' : item.callType === 'OUT' ? '아웃바운드' : '전체' }}
          </template>
          <template v-slot:item.states="{ item }">
            {{ item.states === 'N' ? '미처리' : '처리' }}
          </template>
          <template v-slot:item.result="{ item }">
            {{ item.result === 'S' ? '완료' : item.result === 'F' ? '실패' : '대기' }}
          </template>
          <template v-slot:item.firstRegTime="{ item }">
            {{  $moment(item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm')  }}
          </template>
          <template v-slot:item.sendTime="{ item }">
            {{  $moment(item.sendTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm')  }}
          </template>
          <template v-slot:item.compTime="{ item }">
            {{  $moment(item.compTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('MM-DD HH:mm')  }}
          </template>
          <template v-slot:item.buttonhere="{ item }">
              <v-btn v-if="item.result === 'F'" @click.stop="popupApiCallHistory(item)" text class="default" color="btn-secondary" >재전송</v-btn>
              <v-btn v-else-if="item.result === 'S'" @click.stop="popupApiCallHistory(item)" text class="default" color="btn-secondary" >로그보기</v-btn>
              <v-btn v-else @click.stop="popupApiCallHistory(item)" text class="default" color="btn-secondary" >전송</v-btn>
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
          @input="getApiCallHistoryList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
      </div>
      <v-dialog
        v-model="dialog.popupApiCallHistoryView"
        width="1000"
        persistent
        scrollable
      >
        <!-- ######### popup ######### -->
        <popup-api-call-history-view
          @close-dialog="closeDialogApiCallHistory"
          @refresh-list="getApiCallHistoryList"
          :editedItem="editedItem"
          v-if="dialog.popupApiCallHistoryView"
        />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import {
  getApiCallHistorySearchCondition,
  getApiCallHistoryList
} from '../../api/inf'
import PopupApiCallHistoryView from '@/views/inf/PopupApiCallHistoryView'

export default {
  name: 'ListApiCallHistoryView',
  components: {
    PopupApiCallHistoryView
  },
  created () {
    this.getApiCallHistorySearchCondition()
    this.$nextTick(() => {
      this.getApiCallHistoryList()
    })
  },
  mounted () {},
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsSystemInfoList () {
      const systemInfoList = []
      systemInfoList.push(...this.searchForm.itemsSystemInfoList)
      return systemInfoList
    },
    cptdItemsTenantList () {
      const tenantList = []
      tenantList.push(...this.searchForm.itemsTenantList)
      return tenantList
    },
    cptdUseYnList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.useYns)
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
          this.getApiCallHistoryList()
        }
      }
    }
  },
  data () {
    return {
      /* searchCondition */
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

      /* searchForm */
      searchForm: {
        itemsTenantList: [],
        tenant: '',
        itemsSystemInfoList: [],
        system: '',
        apiNm: '',
        useYn: ''
      },

      /* data header */
      headers: [
        { text: '시스템', value: 'systemNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '테넌트', value: 'tenantNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '상담유형', value: 'callType', align: 'center', class: 'text-center', width: '80px' },
        { text: '연계시점', value: 'callTimeNm', align: 'center', class: 'text-center', width: '80px' },
        { text: 'API명', value: 'apiNm', align: 'left', class: 'text-center' },
        { text: 'CALL_ID', value: 'callId', align: 'left', class: 'text-center', width: '300px' },
        { text: '처리상태', value: 'states', align: 'center', class: 'text-center', width: '80px' },
        { text: '처리결과', value: 'result', align: 'center', class: 'text-center', width: '80px' },
        { text: '전송일시', value: 'sendTime', align: 'center', class: 'text-center', width: '120px' },
        { text: '', value: 'buttonhere', align: 'center', class: 'text-center', width: '120px' }
      ],
      desserts: [],
      selected: [],
      editedItem: {},

      /* pagination */
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
      options: {},
      dialog: {
        popupApiCallHistoryView: false
      }
    }
  },
  methods: {
    getApiCallHistorySearchCondition: function () {
      getApiCallHistorySearchCondition().then(
        response => {
          this.useYns = response.data.result.useYnList
          this.searchForm.itemsSystemInfoList = response.data.result.systemInfoList
          this.searchForm.itemsTenantList = response.data.result.tenantList
        }
      )
    },
    getApiCallHistoryList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenant,
        apiNm: this.searchForm.apiNm,
        useYn: this.searchForm.useYn
      }
      this.pagination.loading = true
      getApiCallHistoryList(searchCondition).then(
        response => {
          this.desserts = response.data.result.apiCallHistoryList || []
          // paging setting
          this.pagination.totalRows = response.data.result.apiCallHistoryListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      ).finally(() => {
        this.pagination.loading = false
      })
    },
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getApiCallHistoryList()
    },
    popupApiCallHistory: function (item) {
      this.editedItem = item
      this.dialog.popupApiCallHistoryView = true
    },
    closeDialogApiCallHistory: function () {
      this.dialog.popupApiCallHistoryView = false
      this.getApiCallHistoryList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
