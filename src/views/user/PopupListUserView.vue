<template>
  <v-card>
    <v-card-title>
      <span class="headline">사용자 정보</span>
    </v-card-title>
    <v-card-text>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="4">
            <v-text-field
              class="default search"
              v-model="searchForm.userNm"
              label="이름, 부서명"
              placeholder=" "
              v-on:keyup.enter="searchBtn"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenantId"
              :items="cptdItemsTenantList"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenantId ? undefined : $t('label.all')"
              return-object
              outlined
              dense
              v-bind:readonly="searchForm.tenantReadOnly"
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
          :headers="headers"
          :items="results"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalRows"
          :options.sync="pagination.options"
          :loading="pagination.loading"
          hide-default-footer
          show-select
          item-key="userId"
          v-model="selectedData"
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item.userNm="{ item }">
            {{ item.userNm }}
          </template>
          <template v-slot:item.userEmail="{ item }">
            {{ item.userEmail }}
          </template>
          <template v-slot:item.userPhone="{ item }">
            {{ item.userPhone }}
          </template>
          <template v-slot:item.serviceNm="{ item }">
            {{ item.userDeptNm }}
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
          <v-select
            :menu-props="{ top: true, offsetY: true }"
            v-model="pagination.itemsPerPage"
            :items="pagination.itemsPerPages"
            @change="getUserList"
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
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="comfirmClick">{{ $t('button.confirm')}}</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="$emit('close-dialog')"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import {
  reqPopupUserList,
  reqPopupSrchCondition
} from '../../api/user'

import lodash from 'lodash'

export default {

  name: 'AuUserPopupList',

  props: {
    popupListUserViewParam: Object
  },

  components: {
  },

  created () {
    this.getSearchCondition()
  },

  mounted () {
    this.getUserList()
    this.userAuthCdType = this.popupListUserViewParam.userAuthCdType
  },

  data () {
    return {
      username: '김연아',
      pageTitle: '사용자 정보',
      pageDescription: '사용자 리스트를 조회.',
      // 테이블 샘플 데이터
      search: '',
      headers: [
        { text: '이름', value: 'userNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '이메일', value: 'userEmail', align: 'left', class: 'text-center', width: '200px' },
        { text: '전화번호', value: 'userPhone', align: 'center', class: 'text-center', width: '150px' },
        { text: '고객사', value: 'tenantNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '부서', value: 'userDeptNm', align: 'left', class: 'text-center' }
      ],
      results: [],
      selectedData: [],
      pagination: {
        page: 1, // 현재페이지
        length: 2, // 페이징숫자 갯수
        itemsPerPage: 10, // table row view 갯수
        itemsPerPages: [10, 20, 30], // 왼쪽하단 selectbox
        totalRows: 0,
        sectionTitle: this.$t('label.totalCnt'),
        sectionSubTitle: '',
        options: {},
        loading: false
      },
      searchForm: {
        userNm: '',
        itemsTenant: [],
        tenantId: ''
      },
      listUserViewReturn: {
        flag: false,
        selectedData: []
      },
      userAuthCdType: ''
    }
  },

  watch: {},

  computed: {
    cptdItemsTenantList () {
      const its = [
        {
          text: '전체',
          value: ''
        }
      ]
      its.push(...this.searchForm.itemsTenant)
      return its
    }
  },

  methods: {
    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.reqPopupUserList()
      }
    },
    itemPerPageChange (itemPerPage) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.pagination.page = 1
        this.pagination.itemPerPage = itemPerPage
        Object.assign(this.pagination.options, {
          page: 1,
          itemsPerPage: itemPerPage,
          sortBy: [],
          sortDesc: []
        })
      }
    },
    getSearchCondition: function () {
      reqPopupSrchCondition().then(
        response => {
          this.searchForm.itemsTenant = response.data.result.tenantList
        }
      )
    },
    getUserList: lodash.debounce(function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.pagination.options.sortBy[0] ? this.pagination.options.sortBy[0] : '',
        sortDesc: this.pagination.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        userNm: this.searchForm.userNm,
        tenantId: this.searchForm.tenantId ? this.searchForm.tenantId.value : '',
        userAuthCdType: this.userAuthCdType
      }

      this.pagination.loading = true
      reqPopupUserList(searchCondition).then(
        response => {
          // 조회결과
          this.results = response.data.result.userList ? response.data.result.userList : []

          this.pagination.totalRows = response.data.result.userListCount
          this.pagination.length = parseInt((this.pagination.totalRows - 1) / this.pagination.itemsPerPage) + 1
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      ).finally(() => {
        this.pagination.loading = false
      })
    }, 300),
    srchInit: function () {
      this.searchForm.userNm = ''
      this.searchForm.useService = ''
    },
    comfirmClick: function () {
      this.listUserViewReturn.flag = true
      this.listUserViewReturn.selectedData = this.selectedData
      this.$emit('close-dialog', this.listUserViewReturn)
    },
    searchBtn: function () {
      this.pagination.page = 1
      this.getUserList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
