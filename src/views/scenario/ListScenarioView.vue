
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
              v-model="searchForm.scenarioNm"
              label="시나리오명"
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
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.chatbot"
              :items="cptdItemsChatbotList"
              label="챗봇"
              :placeholder="searchForm.chatbot ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.category"
              :items="cptdItemsCategoryList"
              label="카테고리"
              :placeholder="searchForm.category ? undefined : $t('label.choice')"
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
          :item-key="`scenarioId`"
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
          <template v-slot:item.monitoringYn="{ item }">
            {{ item.monitoringYn === 'N' ? '비대상' : '대상' }}
          </template>
          <template v-slot:item.abnormalYn="{ item }">
            {{ item.abnormalYn === 'N' ? '비대상' : '대상' }}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'N' ? '미사용' : '사용' }}
          </template>
          <template v-slot:item.firstRegTime="{ item }">
            {{ $moment(item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') }}
          </template>
          <template v-slot:item.scenarioNm="{ item }">
            {{ item.scenarioNm.length > 60 ? item.scenarioNm.substr(0,60)+'....' : item.scenarioNm}}
          </template>
          <template v-slot:item.buttonhere="{ item }">
              <v-btn @click.stop="nodeManagementDetail(item)" text class="default" color="btn-secondary" >노드 관리</v-btn>
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
          @input="getScenarioList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="syncDapChatbotPopup('')">{{ $t('button.dapChatbotScenarioSync')}}</v-btn>
        <v-btn color="btn-primary" text @click="syncDapChatbotPopup('sn')">{{ $t('button.dapChatbotScenarioNodeSync')}}</v-btn>
        <v-btn color="btn-primary" text @click="createScenario">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="deleteScenarios">{{ $t('button.delete')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupScenario.popupCreateScenarioView"
        width="1000"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-scenario-view
          @close-dialog="closeDialogScenario"
          @refresh-list="getScenarioList"
          v-if="dialogLookupScenario.popupCreateScenarioView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupScenario.popupUpdateScenarioView"
          width="1000"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-scenario-view
            @close-dialog="closeDialogScenarioUpdate"
            @refresh-list="getScenarioList"
            :editedItem="editedItem"
            v-if="dialogLookupScenario.popupUpdateScenarioView"
          />
        </v-dialog>
      <v-dialog
          v-model="dialogLookupScenario.popupUpdateScenarioNodeView"
          width="900"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-scenario-node-view
            @close-dialog="closeDialogScenarioUpdateNode"
            @refresh-list="getScenarioList"
            :editedItem="editedItem"
            v-if="dialogLookupScenario.popupUpdateScenarioNodeView"
          />
      </v-dialog>
      <!-- popup end -->
      <v-dialog
        v-model="popupSelectScChatbotView"
        width="800"
        persistent>
        <v-card v-if="popupSelectScChatbotView === true" class="dialog-tenant">
          <v-card-title>
            <span class="headline">챗봇 선택</span>
          </v-card-title>
          <v-card-text>
            <v-card class="data-grid-wrap default has-scroll">
              <vuescroll>
                <v-data-table
                  v-model="selectScChatbots"
                  :headers="scChatbotHeaders"
                  :items="scChatbotList"
                  item-key="chatbotId"
                  :fixed-header="true"
                  :disable-pagination="true"
                  :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                  hide-default-footer
                  show-select
                  :loading="scChatbotLoading"
                  :no-data-text="$t('message.noData')"
                  :loading-text="$t('message.loading')"
                >
                </v-data-table>
              </vuescroll>
            </v-card>
          </v-card-text>
          <v-card-actions class="submit-btns-group">
            <v-spacer></v-spacer>
            <v-btn color="btn-secondary" :disabled="scChatbotLoading" text @click="popupSelectScChatbotView = false">{{ $t('button.cancel')}}</v-btn>
            <v-btn color="btn-primary" :disabled="scChatbotLoading" text @click="syncDapChatbotScenarioNode" v-if="popupSelectScChatbotType === 'sn'"  v-auth="['SAU']">{{ $t('button.dapChatbotScenarioNodeSync')}}</v-btn>
            <v-btn color="btn-primary" :disabled="scChatbotLoading" text @click="syncDapChatbotScenario" v-else v-auth="['SAU']">{{ $t('button.dapChatbotScenarioSync')}}</v-btn>
          </v-card-actions>
          <v-btn
            class="default dialogclose"
            text
            :disabled="scChatbotLoading"
            @click="popupSelectScChatbotView = false"
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
  getScenarioList,
  deleteScenarios,
  syncDapChatbotScenario,
  syncDapChatbotScenarioNode
} from '../../api/scenario'

import popupCreateScenarioView from '@/views/scenario/PopupCreateScenarioView'
import popupUpdateScenarioView from '@/views/scenario/PopupUpdateScenarioView'
import popupUpdateScenarioNodeView from '@/views/scenario/PopupUpdateScenarioNodeView'

import lodash from 'lodash'

export default {
  name: 'ListScenarioView',
  components: {
    popupCreateScenarioView,
    popupUpdateScenarioView,
    popupUpdateScenarioNodeView
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
      const tenantList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      tenantList.push(...this.searchForm.itemsTenantList)
      return tenantList
    },
    cptdItemsChatbotList () {
      const chatbotList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      chatbotList.push(...this.searchForm.itemsChatbotList)
      return chatbotList
    },
    cptdItemsCategoryList () {
      const categoryList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      categoryList.push(...this.searchForm.itemsCategoryList.filter(s => s.opt2 === (this.searchForm.chatbot || s.opt2)))
      return categoryList
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
          this.getScenarioList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupScenario: {
        popupCreateScenarioView: false,
        popupUpdateScenarioView: false,
        popupUpdateScenarioNodeView: false
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

      // 검색조건
      searchForm: {
        itemsTenantList: [],
        tenant: '',
        itemsChatbotList: [],
        chatbot: '',
        itemsCategoryList: [],
        category: '',
        scenarioNm: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: '챗봇', value: 'chatbotNm', align: 'left', class: 'text-center', width: '180px' },
        { text: '카테고리', value: 'categoryNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '시나리오명', value: 'scenarioNm', align: 'left', class: 'text-center' },
        { text: '통계수집대상', value: 'monitoringYn', align: 'center', class: 'text-center', width: '110px' },
        { text: '이상감지대상', value: 'abnormalYn', align: 'center', class: 'text-center', width: '110px' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록일시', value: 'firstRegTime', align: 'center', class: 'text-center', width: '120px' },
        { text: '노드정보', value: 'buttonhere', align: 'center', class: 'text-center', width: '100px', sortable: false }
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
      popupSelectScChatbotType: '',
      scChatbotLoading: false,
      popupSelectScChatbotView: false,
      selectScChatbots: [],
      scChatbotHeaders: [
        { text: '서비스', value: 'serviceNm', align: 'center', class: 'text-center' },
        { text: '서비스 테넌트', value: 'serviceTenantNm', align: 'left', class: 'text-center' },
        { text: '챗봇', value: 'chatbotNm', align: 'left', class: 'text-center' }
      ],
      scChatbotList: []
    }
  },
  methods: {
    /* popup start */
    closeDialogScenario: function () {
      this.dialogLookupScenario.popupCreateScenarioView = false
    },
    closeDialogScenarioUpdate: function () {
      this.dialogLookupScenario.popupUpdateScenarioView = false
    },
    closeDialogScenarioUpdateNode: function () {
      this.dialogLookupScenario.popupUpdateScenarioNodeView = false
    },
    /* popup end */
    createScenario () {
      this.dialogLookupScenario.popupCreateScenarioView = true
    },
    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getScenarioList()
      }
    },
    gridRowClick (item) {
      this.editedItem.scenarioId = Object.assign(item.scenarioId)
      this.dialogLookupScenario.popupUpdateScenarioView = true
    },
    init: async function () {
      await this.getSearchCondition()
      this.getScenarioList()
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
          this.searchForm.itemsChatbotList = response.data.result.chatbotList
          this.scChatbotList = response.data.result.scChatbotList
          this.selectScChatbots = this.scChatbotList
          this.searchForm.itemsCategoryList = response.data.result.scenarioCategoryList
        }
      )
    },
    getScenarioList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        scenarioNm: this.searchForm.scenarioNm,
        tenantId: this.searchForm.tenant,
        chatbotId: this.searchForm.chatbot,
        categoryId: this.searchForm.category,
        useYn: this.searchForm.useYn
      }

      this.pagination.loading = true
      getScenarioList(searchCondition).then(
        response => {
          this.desserts = response.data.result.scenarioList || []
          // paging setting
          this.pagination.totalRows = response.data.result.scenarioListCount
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
    syncDapChatbotPopup: function (popupSelectScChatbotType) {
      this.popupSelectScChatbotType = popupSelectScChatbotType
      this.popupSelectScChatbotView = true
    },
    syncDapChatbotScenario: lodash.debounce(function () {
      if (!this.selectScChatbots || this.selectScChatbots.length === 0) {
        alert('동기화 대상 챗봇을 선택하세요')
        return
      }
      if (!confirm('DAP 챗봇 시나리오정보 동기화하시겠습니까?')) {
        return
      }
      // useYn: 'N'일 경우 조회한 시나리오 목록에 없을 경우, 사용불가 처리
      const syncCondition = {
        chatbotEngine: 'daptalk', // DAP 챗봇
        chatbotList: this.selectScChatbots,
        useYn: 'Y'
      }
      this.scChatbotLoading = true
      syncDapChatbotScenario(syncCondition).then(
        response => {
          this.getScenarioList()
          this.popupSelectScChatbotView = false
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      ).finally(() => {
        this.scChatbotLoading = false
      })
    }, 300),
    syncDapChatbotScenarioNode: lodash.debounce(function () {
      if (!this.selectScChatbots || this.selectScChatbots.length === 0) {
        alert('동기화 대상 챗봇을 선택하세요')
        return
      }
      if (!confirm('DAP 챗봇 시나리오 노드정보 동기화하시겠습니까?')) {
        return
      }
      // useYn: 'N'일 경우 조회한 시나리오 목록에 없을 경우, 사용불가 처리
      const syncCondition = {
        chatbotEngine: 'daptalk', // DAP 챗봇
        chatbotList: this.selectScChatbots,
        useYn: 'Y'
      }
      this.scChatbotLoading = true
      syncDapChatbotScenarioNode(syncCondition).then(
        response => {
          this.getScenarioList()
          this.popupSelectScChatbotView = false
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      ).finally(() => {
        this.scChatbotLoading = false
      })
    }, 300),
    deleteScenarios: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
        return
      }
      if (this.selected.some((ch) => ch.chatbotEngine === 'daptalk')) {
        alert('DAP 챗봇 시나리오가 포함되어 있습니다.\nDAP 챗봇 시나리오는 삭제가 불가합니다.\n(DAP 챗봇 시나리오는 동기화 작업만 가능합니다.)')
        return
      }
      if (!confirm('삭제하시겠습니까?')) {
        return
      }
      deleteScenarios(this.selected).then(
        response => {
          if (response.data.status === 200) {
            this.getScenarioList()
          }
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
      this.getScenarioList()
    },
    nodeManagementDetail: function (item) {
      this.editedItem.scenarioId = Object.assign(item.scenarioId)
      this.dialogLookupScenario.popupUpdateScenarioNodeView = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
