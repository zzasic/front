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
              v-model="searchForm.basePath"
              label="Base Path"
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
          :item-key="`routingId`"
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
          <template v-slot:item.lastUpdTime="{ item }">
            {{  $moment(item.lastUpdTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm')  }}
          </template>
          <template v-slot:item.apiNm="{ item }">
            {{ item.basePath.length > 30 ? item.basePath.substr(0,30)+'....' : item.basePath}}
          </template>
          <template v-slot:item.proxyUrl="{ item }">
            {{ (item.proxyUrl || '').length > 80 ? item.proxyUrl.substr(0,80)+'....' : item.proxyUrl}}
          </template>
          <template v-slot:item.targetUrl="{ item }">
            {{ (item.targetUrl || '').length > 80 ? item.targetUrl.substr(0,80)+'....' : item.targetUrl}}
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
          @input="getApiRoutingList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="newBtn">{{ $t('button.new')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupApiRouting.popupCreateApiRoutingView"
        width="1000"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-apiRouting-view
          @close-dialog="closeDialogApiRouting"
          @refresh-list="getApiRoutingList"
          v-if="dialogLookupApiRouting.popupCreateApiRoutingView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupApiRouting.popupUpdateApiRoutingView"
          width="1000"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-apiRouting-view
            @close-dialog="closeDialogApiRoutingUpdate"
            @refresh-list="getApiRoutingList"
            :editedItem="editedItem"
            v-if="dialogLookupApiRouting.popupUpdateApiRoutingView"
          />
        </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  getApiRoutingSearchCondition,
  getApiRoutingList
} from '../../api/inf'

import popupCreateApiRoutingView from '@/views/inf/PopupCreateApiRoutingView'
import popupUpdateApiRoutingView from '@/views/inf/PopupUpdateApiRoutingView'

export default {
  name: 'ListApiRoutingView',
  components: {
    popupCreateApiRoutingView,
    popupUpdateApiRoutingView
  },
  created () {
    this.getApiRoutingSearchCondition()
  },
  mounted () {
    this.getApiRoutingList()
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
          this.getApiRoutingList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupApiRouting: {
        popupCreateApiRoutingView: false,
        popupUpdateApiRoutingView: false
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
        basePath: '',
        useYn: ''
      },

      /* data header */
      headers: [
        { text: '시스템', value: 'systemNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '테넌트', value: 'tenantNm', align: 'center', class: 'text-center', width: '150px' },
        { text: 'BasePath', value: 'basePath', align: 'left', class: 'text-center', width: '150px' },
        { text: 'ProxyUrl', value: 'proxyUrl', align: 'left', class: 'text-center' },
        { text: 'TargetUrl', value: 'targetUrl', align: 'left', class: 'text-center' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '80px' },
        { text: '등록자', value: 'lastUpdUserNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록일시', value: 'lastUpdTime', align: 'center', class: 'text-center', width: '120px' }
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
    closeDialogApiRouting: function () {
      this.dialogLookupApiRouting.popupCreateApiRoutingView = false
    },
    closeDialogApiRoutingUpdate: function () {
      this.dialogLookupApiRouting.popupUpdateApiRoutingView = false
    },
    /* popup end */
    newBtn: function () {
      this.dialogLookupApiRouting.popupCreateApiRoutingView = true
    },
    gridRowClick (item) {
      this.editedItem.routingId = Object.assign(item.routingId)
      this.dialogLookupApiRouting.popupUpdateApiRoutingView = true
    },
    getApiRoutingSearchCondition: function () {
      getApiRoutingSearchCondition().then(
        response => {
          this.useYns = response.data.result.useYnList
          this.searchForm.itemsSystemInfoList = response.data.result.systemInfoList
          this.searchForm.itemsTenantList = response.data.result.tenantList
        }
      )
    },
    getApiRoutingList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        basePath: this.searchForm.basePath,
        systemId: this.searchForm.system,
        tenantId: this.searchForm.tenant,
        useYn: this.searchForm.useYn
      }
      this.pagination.loading = true
      getApiRoutingList(searchCondition).then(
        response => {
          this.desserts = response.data.result.apiRoutingList || []
          // paging setting
          this.pagination.totalRows = response.data.result.apiRoutingListCount
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
      this.getApiRoutingList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
