
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
              v-model="searchForm.chatbotNm"
              label="챗봇ID, 챗봇명"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenant"
              :items="cptdItemsTenantList"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenant ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col> -->
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
          :item-key="`chatbotId`"
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
         <template v-slot:item.callType="{ item }">
            {{ item.callType === 'IN' ? '인바운드' : '아웃바운드' }}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'N' ? '미사용' : '사용' }}
          </template>
          <template v-slot:item.firstRegTime="{ item }">
            {{  $moment(item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm')  }}
          </template>
          <template v-slot:item.chatbotNm="{ item }">
            {{ item.chatbotNm.length > 30 ? item.chatbotNm.substr(0,30)+'....' : item.chatbotNm}}
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
          @input="getChatbotList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <!-- <v-btn color="btn-primary" text @click="syncDapChatbotPopup" v-auth="['SAU']">{{ $t('button.dapChatbotSync')}}</v-btn> -->
        <v-btn color="btn-primary" text @click="createChatbot">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="deleteChatbots">{{ $t('button.delete')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupChatbot.popupCreateChatbotView"
        width="1000"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-chatbot-view
          @close-dialog="closeDialogChatbot"
          @refresh-list="getChatbotList"
          v-if="dialogLookupChatbot.popupCreateChatbotView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupChatbot.popupUpdateChatbotView"
          width="1000"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-chatbot-view
            @close-dialog="closeDialogChatbotUpdate"
            @refresh-list="getChatbotList"
            :editedItem="editedItem"
            v-if="dialogLookupChatbot.popupUpdateChatbotView"
          />
        </v-dialog>
      <!-- popup end -->
      <v-dialog
        v-model="popupSelectServiceTenantView"
        width="800"
        persistent>
        <v-card v-if="popupSelectServiceTenantView === true" class="dialog-tenant">
          <v-card-title>
            <span class="headline">서비스 테넌트 선택</span>
          </v-card-title>
          <v-card-text>
            <v-card class="data-grid-wrap default has-scroll">
              <vuescroll>
                <v-data-table
                  v-model="selectServiceTenants"
                  :headers="serviceTenantHeaders"
                  :items="serviceTenantList"
                  item-key="serviceTenantNo"
                  :fixed-header="true"
                  :disable-pagination="true"
                  show-select
                  :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                  hide-default-footer
                  :loading="serviceTenantLoading"
                  :no-data-text="$t('message.noData')"
                  :loading-text="$t('message.loading')"
                >
                </v-data-table>
              </vuescroll>
            </v-card>
          </v-card-text>
          <v-card-actions class="submit-btns-group">
            <v-spacer></v-spacer>
            <v-btn color="btn-secondary" :disabled="serviceTenantLoading" text @click="popupSelectServiceTenantView = false">{{ $t('button.cancel')}}</v-btn>
            <v-btn color="btn-primary" :disabled="serviceTenantLoading" text @click="syncDapChatbot" v-auth="['SAU']">{{ $t('button.dapChatbotSync')}}</v-btn>
          </v-card-actions>
          <v-btn
            class="default dialogclose"
            text
            :disabled="serviceTenantLoading"
            @click="popupSelectServiceTenantView = false"
            :ripple="false"
          >
            <span class="hide">팝업 닫기</span>
          </v-btn>
        </v-card>
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import {
  getSearchCondition,
  getChatbotList,
  deleteChatbots,
  syncDapChatbot
} from '../../api/chatbot'

import popupCreateChatbotView from '@/views/chatbot/PopupCreateChatbotView'
import popupUpdateChatbotView from '@/views/chatbot/PopupUpdateChatbotView'

import lodash from 'lodash'

export default {
  name: 'ListChatbotView',
  components: {
    popupCreateChatbotView,
    popupUpdateChatbotView
  },
  created () {
  },
  mounted () {
    this.init()
  },
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
      its.push(...this.tenants)
      return its
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
    cptdChatbotEngineList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.chatbotEngines)
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
          this.getChatbotList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupChatbot: {
        popupCreateChatbotView: false,
        popupUpdateChatbotView: false
      },
      /* popup end */

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
      tenants: [],
      chatbotEngines: [],

      // 검색조건
      searchForm: {
        chatbotNm: '',
        tenant: '',
        chatbotEngine: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: '챗봇명', value: 'chatbotNm', align: 'left', class: 'text-center', width: '250px' },
        { text: 'URL', value: 'chatbotUrl', align: 'left', class: 'text-center' },
        { text: '챗봇엔진', value: 'chatbotEngine', align: 'center', class: 'text-center', width: '150px' },
        { text: '서비스', value: 'serviceNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '서비스 테넌트', value: 'serviceTenantNm', align: 'left', class: 'text-center', width: '200px' },
        { text: '통화유형', value: 'callType', align: 'center', class: 'text-center', width: '100px' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록자', value: 'firstRegUserNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록일시', value: 'firstRegTime', align: 'center', class: 'text-center', width: '120px' }
      ],
      desserts: [],
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
      options: {},
      popupSelectServiceTenantView: false,
      serviceTenantLoading: false,
      selectServiceTenants: [],
      serviceTenantHeaders: [
        { text: '서비스', value: 'serviceNm', align: 'center', class: 'text-center' },
        { text: '서비스 테넌트', value: 'serviceTenantNm', align: 'left', class: 'text-center' }
      ],
      serviceTenantList: []
    }
  },
  methods: {
    /* popup start */
    closeDialogChatbot: function () {
      this.dialogLookupChatbot.popupCreateChatbotView = false
    },
    closeDialogChatbotUpdate: function () {
      this.dialogLookupChatbot.popupUpdateChatbotView = false
    },
    /* popup end */
    createChatbot () {
      this.dialogLookupChatbot.popupCreateChatbotView = true
    },
    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getChatbotList()
      }
    },
    gridRowClick (item) {
      this.editedItem.chatbotId = Object.assign(item.chatbotId)
      this.dialogLookupChatbot.popupUpdateChatbotView = true
    },
    init: async function () {
      await this.getSearchCondition()
      this.getChatbotList()
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.tenants = response.data.result.tenantList
          this.chatbotEngines = response.data.result.chatbotEngineList
          this.serviceTenantList = response.data.result.serviceTenantList
          this.selectServiceTenants = this.serviceTenantList
        }
      )
    },
    getChatbotList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,

        chatbotNm: this.searchForm.chatbotNm,
        tenantId: this.searchForm.tenant,
        chatbotEngine: this.searchForm.chatbotEngine,
        useYn: this.searchForm.useYn
      }

      this.pagination.loading = true
      getChatbotList(searchCondition).then(
        response => {
          this.desserts = response.data.result.chatbotList || []
          // paging setting
          this.pagination.totalRows = response.data.result.chatbotListCount
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
    syncDapChatbotPopup: function () {
      this.popupSelectServiceTenantView = true
    },
    syncDapChatbot: lodash.debounce(function () {
      if (!this.selectServiceTenants || this.selectServiceTenants.length === 0) {
        alert('동기화할 서비스 테넌트 정보를 선택하세요.')
        return
      }
      if (!confirm('DAP 챗봇정보 동기화하시겠습니까?')) {
        return
      }
      // useYn: 'N'일 경우 조회한 챗봇 목록에 없을 경우, 사용불가 처리
      const syncCondition = {
        serviceTenantList: this.selectServiceTenants,
        useYn: 'Y'
      }
      this.serviceTenantLoading = true
      syncDapChatbot(syncCondition).then(
        response => {
          this.getChatbotList()
          this.popupSelectServiceTenantView = false
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      ).finally(() => {
        this.serviceTenantLoading = false
      })
    }, 300),
    deleteChatbots: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
        return
      }
      if (this.selected.some((ch) => ch.chatbotEngine === 'daptalk')) {
        alert('DAP 챗봇이 포함되어 있습니다.\nDAP 챗봇은 삭제가 불가합니다.\n(DAP 챗봇은 동기화 작업만 가능합니다.)')
        return
      }
      if (!confirm('삭제하시겠습니까?')) {
        return
      }
      deleteChatbots(this.selected).then(
        response => {
          this.getChatbotList()
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    }, 300),
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getChatbotList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
