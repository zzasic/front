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
              label="API ID, API 명"
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
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.useYn"
              :items="cptdUseYnList"
              label="사용여부"
              :placeholder="searchForm.useYn ? undefined : $t('label.all')"
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
      <v-card class="data-grid-wrap default clickable">
        <v-data-table
          v-model="selected"
          :item-key="`apiCallId`"
          :server-items-length="pagination.totalRows"
          :headers="headers"
          :items="desserts"
          :page.sync="pagination.page"
          :items-per-page.sync="pagination.itemsPerPage"
          :options.sync="optionSync"
          :loading="pagination.loading"
          @click:row="gridRowClick"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
          show-select
        >
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'N' ? '미사용' : '사용' }}
          </template>
          <template v-slot:item.callType="{ item }">
            {{ item.callType === 'IN' ? '인바운드' : item.callType === 'OUT' ? '아웃바운드' : '전체' }}
          </template>
          <template v-slot:item.firstRegTime="{ item }">
            {{  $moment(item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm')  }}
          </template>
          <template v-slot:item.apiNm="{ item }">
            {{ item.apiNm.length > 30 ? item.apiNm.substr(0,30)+'....' : item.apiNm}}
          </template>
          <template v-slot:item.requestUrl="{ item }">
            {{ (item.requestUrl || '').length > 80 ? item.requestUrl.substr(0,80)+'....' : item.requestUrl}}
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
          @input="getApiCallList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="newBtn">{{ $t('button.new')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupApiCall.popupCreateApiCallView"
        width="1000"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-apiCall-view
          @close-dialog="closeDialogApiCall"
          @refresh-list="getApiCallList"
          v-if="dialogLookupApiCall.popupCreateApiCallView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupApiCall.popupUpdateApiCallView"
          width="1000"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-apiCall-view
            @close-dialog="closeDialogApiCallUpdate"
            @refresh-list="getApiCallList"
            :editedItem="editedItem"
            v-if="dialogLookupApiCall.popupUpdateApiCallView"
          />
        </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  getApiCallSearchCondition,
  getApiCallList
} from '../../api/inf'

import popupCreateApiCallView from '@/views/inf/PopupCreateApiCallView'
import popupUpdateApiCallView from '@/views/inf/PopupUpdateApiCallView'

export default {
  name: 'ListApiCallView',
  components: {
    popupCreateApiCallView,
    popupUpdateApiCallView
  },
  created () {
    this.getApiCallSearchCondition()
  },
  mounted () {
    this.getApiCallList()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
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
    cptdItemsSystemInfoList () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.searchForm.itemsSystemInfoList)
      return its
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
          this.getApiCallList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupApiCall: {
        popupCreateApiCallView: false,
        popupUpdateApiCallView: false
      },
      /* popup end */

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
        { text: '상담유형', value: 'callType', align: 'center', class: 'text-center', width: '150px' },
        { text: '연계시점', value: 'callTimeNm', align: 'center', class: 'text-center', width: '150px' },
        { text: 'API명', value: 'apiNm', align: 'left', class: 'text-center' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '80px' },
        { text: '등록자', value: 'firstRegUserNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록일시', value: 'firstRegTime', align: 'center', class: 'text-center', width: '120px' }
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
      options: {}
    }
  },
  methods: {
    /* popup start */
    closeDialogApiCall: function () {
      this.dialogLookupApiCall.popupCreateApiCallView = false
    },
    closeDialogApiCallUpdate: function () {
      this.dialogLookupApiCall.popupUpdateApiCallView = false
    },
    /* popup end */
    newBtn: function () {
      this.dialogLookupApiCall.popupCreateApiCallView = true
    },
    gridRowClick (item) {
      this.editedItem.apiCallId = Object.assign(item.apiCallId)
      this.dialogLookupApiCall.popupUpdateApiCallView = true
    },
    getApiCallSearchCondition: function () {
      getApiCallSearchCondition().then(
        response => {
          this.useYns = response.data.result.useYnList
          this.searchForm.itemsSystemInfoList = response.data.result.systemInfoList
          this.searchForm.itemsTenantList = response.data.result.tenantList
        }
      )
    },
    getApiCallList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        apiNm: this.searchForm.apiNm,
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenant,
        useYn: this.searchForm.useYn
      }
      this.pagination.loading = true
      getApiCallList(searchCondition).then(
        response => {
          this.desserts = response.data.result.apiCallList || []
          // paging setting
          this.pagination.totalRows = response.data.result.apiCallListCount
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
      this.getApiCallList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
