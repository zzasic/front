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
              v-model="searchForm.nameNcontract"
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
              v-model="searchForm.userType"
              :items="cptdItemsUserTypeList"
              :label="$t('label.userTp')"
              :placeholder="searchForm.userType ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="1">
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
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.delYn"
              :items="cptdItemsDelYnList"
              :label="$t('label.delYn')"
              :placeholder="searchForm.delYn ? undefined : $t('label.all')"
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
            <tr @click="gridRowClick(props.item), selected = props.item.userId">
              <td class="text-center">{{ props.item.userNm }}</td>
              <!-- <td class="text-left">{{ props.item.userId }}</td> -->
              <td class="text-left">{{ props.item.ssoUserId }}</td>
              <td class="text-left">{{ props.item.userEmail != null ? props.item.userEmail.replace(/.(?=.{1,5}@)/gi, '*') : ''}}</td>
              <td class="text-center">{{ props.item.tenantNm }}</td>
              <td class="text-left">{{ props.item.userAuthNm }}</td>
              <td class="text-center">{{ props.item.useYn === 'Y' ? $t('label.useY') : $t('label.useN') }}</td>
              <td class="text-center">{{ props.item.delYn === 'Y' ? 'Y' : 'N' }}</td>
              <td class="text-center">{{ props.item.lastUpdUserNm }}</td>
              <td class="text-center">{{ $moment(props.item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') }}</td>
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
          @input="getUserList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <!-- <v-btn color="btn-primary" text @click.stop="batchBtn">{{ $t('button.batch')}}</v-btn> -->
        <v-btn color="btn-primary" text @click.stop="setUserList">{{ $t('button.new')}}</v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        :max-width="popup.batchView ? 1024 : 600"
        scrollable
        >
        <PopupExcelUploadView
          @popupAction="popupAction"
          :code="`user`"
          v-if="popup.batchView === true"
          />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import {
  getSearchCondition,
  selectUserList
} from '../../api/user'

import PopupExcelUploadView from '@/views/PopupExcelUploadView'

export default {

  name: 'ListUserView',

  components: {
    PopupExcelUploadView
  },

  created () {
    this.getSearchCondition()
  },

  mounted () {
    this.getUserList()
  },

  data () {
    return {
      popup: {
        createView: false,
        readView: false,
        updateView: false,
        batchView: false
      },
      search: '',
      headers: [
        { text: '사용자명', value: 'userNm', align: 'center' },
        // { text: '사용자ID', value: 'userId', align: 'center', width: '100px' },
        { text: '행번', value: 'ssoUserId', align: 'center', width: '100px' },
        { text: '이메일', value: 'userEmail', align: 'center' },
        { text: '테넌트', value: 'tenantNm', align: 'center' },
        { text: '사용자 유형', value: 'userAuthNm', align: 'center', width: '150px' },
        { text: '사용여부', value: 'useYn', align: 'center', width: '100px' },
        { text: '삭제여부', value: 'delYn', align: 'center', width: '100px' },
        { text: '처리자', value: 'lastUpdUserNm', align: 'center', width: '100px' },
        { text: '등록일시', value: 'firstRegTime', align: 'center', width: '120px' },
        { text: '수정일시', value: 'lastUpdTime', align: 'center', width: '120px' }
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
        nameNcontract: '',
        itemsTenantList: [],
        itemsUserTypeList: [],
        itemsUseYnList: [],
        tenant: '',
        userType: '',
        useYn: '',
        delYn: ''
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
    cptdItemsUserTypeList () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.searchForm.itemsUserTypeList)
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
      return (this.popup.batchView === true)
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getUserList()
        }
      }
    }
  },

  methods: {
    updateOptions (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getUserList()
      }
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
          this.searchForm.itemsUserTypeList = response.data.result.userTypeList
          this.searchForm.itemsUseYnList = response.data.result.useYnList
        }
      )
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.getUserList()
    },
    getUserList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        nameNcontract: this.searchForm.nameNcontract,
        tenantId: this.searchForm.tenant,
        userAuthCd: this.searchForm.userType,
        useYn: this.searchForm.useYn,
        delYn: this.searchForm.delYn
      }

      this.pagination.loading = true
      selectUserList(searchCondition).then(
        response => {
          this.results = response.data.result.userList ? response.data.result.userList : []
          // paging setting
          this.pagination.totalRows = response.data.result.userListCount
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
    setUserList: function () {
      this.$router.push({ name: 'CreateUserView', query: { t: new Date().getTime() } })
    },
    gridRowClick (item) {
      this.$router.push({ name: 'UpdateUserView', query: { t: new Date().getTime() }, params: { userId: item.userId } })
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
      this.getUserList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
