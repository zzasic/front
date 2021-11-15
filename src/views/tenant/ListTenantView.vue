
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
              v-model="searchForm.tenantNm"
              label="테넌트ID, 테넌트명"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.useYn"
              :items="cptdUseYn"
              label="사용여부"
              :placeholder="searchForm.useYn ? undefined : $t('label.all')"
              return-object
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
          :item-key="`tenantId`"
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
          <template v-slot:item.tenantId="{ item }">
            {{ item.tenantId }}
          </template>
          <template v-slot:item.tenantNm="{ item }">
            {{ item.tenantNm }}
          </template>
          <!-- <template v-slot:item.sttModel="{ item }">
            {{ (sttModels.find(t => t.value === item.sttModel) || { text: '' }).text }}
          </template> -->
          <template v-slot:item.speaker="{ item }">
            {{ (ttsSpeakers.find(t => t.value === item.speaker) || { text: '' }).text }}
          </template>
          <template v-slot:item.sttNm="{ item }">
            {{ item.sttNm.length > 40 ? item.sttNm.substr(0,40)+'....' : item.sttNm}}
          </template>
          <template v-slot:item.ttsNm="{ item }">
            {{ item.ttsNm.length > 50 ? item.ttsNm.substr(0,50)+'....' : item.ttsNm}}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'N' ? '미사용' : '사용' }}
          </template>
          <template v-slot:item.firstRegTime="{ item }">
            {{ $moment(item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') }}
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
          @input="getTenantList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="createTenant">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="delTenants">{{ $t('button.delete')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupTenant.popupCreateTenantView"
        width="1000"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-tenant-view
          @close-dialog="closeDialogTenant"
          @refresh-list="getTenantList"
          v-if="dialogLookupTenant.popupCreateTenantView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupTenant.popupUpdateTenantView"
          width="1000"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-tenant-view
            @close-dialog="closeDialogTenantUpdate"
            @refresh-list="getTenantList"
            :editedItem="editedItem"
            v-if="dialogLookupTenant.popupUpdateTenantView"
          />
        </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  reqTenantSearchCondition,
  reqTenantList,
  reqDeleteTenants
} from '../../api/tenant'

import popupCreateTenantView from '@/views/tenant/PopupCreateTenantView'
import popupUpdateTenantView from '@/views/tenant/PopupUpdateTenantView'

import lodash from 'lodash'

export default {
  name: 'ListTenantView',
  components: {
    popupCreateTenantView,
    popupUpdateTenantView
  },
  created () {
    this.getSearchCondition()
  },
  mounted () {
    this.getTenantList()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdUseYn: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.useYn)
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
          this.getTenantList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupTenant: {
        popupCreateTenantView: false,
        popupUpdateTenantView: false
      },
      /* popup end */

      useYn: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ],
      // sttModels: [],
      ttsSpeakers: [],

      // 검색조건
      searchForm: {
        tenantNm: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: '테넌트명', value: 'tenantNm', align: 'left', class: 'text-center' },
        { text: 'STT', value: 'sttNm', align: 'center', class: 'text-center', width: '200px' },
        { text: 'TTS', value: 'ttsNm', align: 'center', class: 'text-center', width: '200px' },
        { text: '기본화자', value: 'speaker', align: 'center', class: 'text-center', width: '200px' },
        { text: 'TA', value: 'taNm', align: 'center', class: 'text-center', width: '200px' },
        { text: '순서', value: 'sortOrder', align: 'center', class: 'text-center', width: '100px' },
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
      options: {}
    }
  },
  methods: {
    /* popup start */
    closeDialogTenant: function () {
      this.dialogLookupTenant.popupCreateTenantView = false
    },
    closeDialogTenantUpdate: function () {
      this.dialogLookupTenant.popupUpdateTenantView = false
    },
    /* popup end */
    createTenant () {
      this.dialogLookupTenant.popupCreateTenantView = true
    },
    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getTenantList()
      }
    },
    gridRowClick (item) {
      this.editedItem.tenantId = Object.assign(item.tenantId)
      this.dialogLookupTenant.popupUpdateTenantView = true
    },
    getSearchCondition: function () {
      reqTenantSearchCondition().then(
        response => {
          // this.sttModels = response.data.result.sttModelList
          this.ttsSpeakers = response.data.result.ttsSpeakerList
        }
      )
    },
    getTenantList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        tenantNm: this.searchForm.tenantNm,
        useYn: this.searchForm.useYn.value
      }

      this.pagination.loading = true
      reqTenantList(searchCondition).then(
        response => {
          this.desserts = response.data.result.tenantList ? response.data.result.tenantList : []
          // paging setting
          this.pagination.totalRows = response.data.result.tenantListCount
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
    delTenants: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
      } else {
        if (confirm('삭제하시겠습니까?')) {
          reqDeleteTenants(this.selected).then(
            response => {
              this.getTenantList()
            },
            error => {
              console.error(error)
              delete sessionStorage.accessToken
              this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
            }
          )
        }
      }
    }, 300),
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getTenantList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
