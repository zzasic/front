
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
              v-model="searchForm.serviceNm"
              label="서비스ID, 서비스명"
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
          :item-key="`serviceId`"
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
          <template v-slot:item.serviceType="{ item }">
            {{ (serviceTypes.find((s) => s.value === item.serviceType) || { text: '' }).text }}
          </template>
          <template v-slot:item.firstRegTime="{ item }">
            {{  $moment(item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm')  }}
          </template>
          <template v-slot:item.serviceNm="{ item }">
            {{ item.serviceNm.length > 30 ? item.serviceNm.substr(0,30)+'....' : item.serviceNm}}
          </template>
          <template v-slot:item.serviceUrl="{ item }">
            {{ (item.serviceUrl || '').length > 80 ? item.serviceUrl.substr(0,80)+'....' : item.serviceUrl}}
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
          @input="getCatalogList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="createCatalog">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="deleteCatalogs">{{ $t('button.delete')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupCatalog.popupCreateCatalogView"
        width="490"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-catalog-view
          @close-dialog="closeDialogCatalog"
          @refresh-list="getCatalogList"
          v-if="dialogLookupCatalog.popupCreateCatalogView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupCatalog.popupUpdateCatalogView"
          width="490"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-catalog-view
            @close-dialog="closeDialogCatalogUpdate"
            @refresh-list="getCatalogList"
            :editedItem="editedItem"
            v-if="dialogLookupCatalog.popupUpdateCatalogView"
          />
        </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  getSearchCondition,
  getCatalogList,
  deleteCatalogs
} from '../../api/catalog'

import popupCreateCatalogView from '@/views/catalog/PopupCreateCatalogView'
import popupUpdateCatalogView from '@/views/catalog/PopupUpdateCatalogView'

import lodash from 'lodash'

export default {
  name: 'ListCatalogView',
  components: {
    popupCreateCatalogView,
    popupUpdateCatalogView
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
          this.getCatalogList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupCatalog: {
        popupCreateCatalogView: false,
        popupUpdateCatalogView: false
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
      serviceTypes: [],

      // 검색조건
      searchForm: {
        serviceNm: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: 'ID', value: 'serviceId', align: 'center', class: 'text-center', width: '150px' },
        { text: '서비스유형', value: 'serviceType', align: 'center', class: 'text-center', width: '180px' },
        { text: '서비스명', value: 'serviceNm', align: 'center', class: 'text-center', width: '180px' },
        { text: 'URL', value: 'serviceUrl', align: 'left', class: 'text-center' },
        { text: '사용 여부', value: 'useYn', align: 'center', class: 'text-center', width: '100px' },
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
    closeDialogCatalog: function () {
      this.dialogLookupCatalog.popupCreateCatalogView = false
    },
    closeDialogCatalogUpdate: function () {
      this.dialogLookupCatalog.popupUpdateCatalogView = false
    },
    /* popup end */
    createCatalog () {
      // this.dialogLookupCatalog.popupCreateCatalogView = true
      this.$router.push({ name: 'CreateCatalogView', query: { t: new Date().getTime() } })
    },
    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getCatalogList()
      }
    },
    gridRowClick (item) {
      // this.editedItem.serviceId = Object.assign(item.serviceId)
      // this.dialogLookupCatalog.popupUpdateCatalogView = true
      this.$router.push({ name: 'UpdateCatalogView', query: { t: new Date().getTime() }, params: { serviceId: item.serviceId } })
    },
    init: async function () {
      await this.getSearchCondition()
      this.getCatalogList()
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.useYns = response.data.result.useYnList
          this.serviceTypes = response.data.result.serviceTypeList
        }
      )
    },
    getCatalogList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,

        serviceNm: this.searchForm.serviceNm,
        useYn: this.searchForm.useYn
      }

      this.pagination.loading = true
      getCatalogList(searchCondition).then(
        response => {
          this.desserts = response.data.result.catalogList || []
          // paging setting
          this.pagination.totalRows = response.data.result.catalogListCount
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
    deleteCatalogs: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
      } else {
        if (confirm('삭제하시겠습니까?')) {
          deleteCatalogs(this.selected).then(
            response => {
              this.selected = []
              this.getCatalogList()
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
      this.getCatalogList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
