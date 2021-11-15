<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-text-field
              class="default search"
              v-model="searchForm.counselorId"
              label="내선번호"
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
              v-model="searchForm.tenant"
              :items="cptdItemsTenantList"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenant ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.useYn"
              :items="cptdItemsUseYnList"
              :label="$t('label.useYn')"
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
          :headers="headers"
          :items="results"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr @click="gridRowClick(props.item), selected = props.item.counselorId">
              <td class="text-center">{{ props.item.tenantNm }}</td>
              <td class="text-center">{{ props.item.callGroupNo }}</td>
              <td class="text-center">{{ props.item.extension }}</td>
              <td class="text-center">{{ props.item.password }}</td>
              <td class="text-center">{{ props.item.callYn === 'Y' ? $t('통화중') : $t('대기중') }}</td>
              <td class="text-center">{{ props.item.useYn === 'Y' ? $t('label.useY') : $t('label.useN') }}</td>
              <td class="text-center">{{ props.item.lastUpdUserNm }}</td>
              <td class="text-center">{{ $moment(props.item.lastUpdTime || props.item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') }}</td>
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
          @input="getCounselorList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <!-- <v-btn color="btn-primary" text @click.stop="batchBtn">{{ $t('button.batch')}}</v-btn> -->
        <v-btn color="btn-primary" text @click.stop="newBtn">{{ $t('button.new')}}</v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        :max-width="popup.batchView ? 1024 : 600"
        scrollable
        >
        <PopupExcelUploadView
          @popupAction="popupAction"
          :code="`counselor`"
          v-if="popup.batchView === true"
          />
        <PopupCreateCounselorView
          @popupAction="popupAction"
          v-if="popup.createView === true" />
        <PopupUpdateCounselorView
          @popupAction="popupAction"
          :counselorId="popup.counselorId"
          v-if="popup.updateView === true && popup.counselorId" />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import {
  getSearchCondition,
  getCounselorList
} from '../../api/counselor'

import PopupExcelUploadView from '@/views/PopupExcelUploadView'
import PopupCreateCounselorView from '@/views/counselor/PopupCreateCounselorView'
import PopupUpdateCounselorView from '@/views/counselor/PopupUpdateCounselorView'

export default {

  name: 'ListCounselorView',

  components: {
    PopupExcelUploadView,
    PopupCreateCounselorView,
    PopupUpdateCounselorView
  },

  created () {
    this.getSearchCondition()
  },

  mounted () {
    this.getCounselorList()
  },

  data () {
    return {
      popup: {
        counselorId: '',
        createView: false,
        readView: false,
        updateView: false,
        batchView: false
      },
      search: '',
      headers: [
        { text: '테넌트', value: 'tenantNm', align: 'center', width: '150px' },
        { text: 'Call Group No.', value: 'callGroupNo', align: 'center', width: '150px' },
        { text: '내선번호', value: 'extension', align: 'center', width: '150px' },
        { text: '패스워드', value: 'password', align: 'center', width: '150px' },
        { text: '통화여부', value: 'callYn', align: 'center', width: '120px' },
        { text: '사용여부', value: 'useYn', align: 'center', width: '100px' },
        { text: '등록자', value: 'lastUpdUserNm', align: 'center', width: '100px' },
        { text: '등록일시', value: 'lastUpdTime', align: 'center', width: '120px' }
      ],
      results: [],
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
      searchForm: {
        counselorId: '',
        itemsTenantList: [],
        itemsUseYnList: [],
        tenant: '',
        useYn: ''
      }
    }
  },

  watch: {},

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
      its.push(...this.searchForm.itemsTenantList)
      return its
    },
    cptdItemsUseYnList () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.searchForm.itemsUseYnList)
      return its
    },
    cptdItemsDelYnList () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        },
        {
          text: 'Y',
          value: 'Y'
        },
        {
          text: 'N',
          value: 'N'
        }
      ]
      return its
    },
    dialog: function () {
      return (this.popup.batchView === true || this.popup.createView === true || this.popup.updateView === true)
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getCounselorList()
        }
      }
    }
  },

  methods: {
    updateOptions (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getCounselorList()
      }
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
          this.searchForm.itemsUseYnList = response.data.result.useYnList
        }
      )
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.getCounselorList()
    },
    getCounselorList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        counselorId: this.searchForm.counselorId,
        tenantId: this.searchForm.tenant,
        useYn: this.searchForm.useYn
      }

      this.pagination.loading = true
      getCounselorList(searchCondition).then(
        response => {
          this.results = response.data.result.counselorList ? response.data.result.counselorList : []
          // paging setting
          this.pagination.totalRows = response.data.result.counselorListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
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
    gridRowClick (item) {
      this.popup.createView = false
      this.popup.updateView = true
      this.popup.readView = false
      this.popup.batchView = false
      this.popup.counselorId = item.counselorId
    },
    // 신규버튼
    newBtn: function () {
      this.popup.createView = true
      this.popup.updateView = false
      this.popup.readView = false
      this.popup.batchView = false
    },
    // 일괄등록버튼
    batchBtn: function () {
      this.popup.createView = false
      this.popup.updateView = false
      this.popup.readView = false
      this.popup.batchView = true
    },
    popupAction: function (popup) {
      this.popup = popup
      this.getCounselorList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
