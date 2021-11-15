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
              label="API ID, API 명"
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
          :item-key="`apiId`"
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
          <template v-slot:item.method="{ item }">
            {{ item.method === 'P' ? 'POST' : item.method === 'U' ? 'PUT' : item.method === 'D' ? 'DELETE' :'GET' }}
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
          @input="getApiList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="createApi">{{ $t('button.new')}}</v-btn>
      </div>
    </vuescroll>
  </div>
</template>

<script>
import {
  getSearchCondition,
  getApiList
} from '../../api/inf'

export default {
  name: 'ListApiView',
  components: {},
  created () {
    this.getSearchCondition()
    this.$nextTick(() => {
      this.getApiList()
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
          this.getApiList()
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
        apiNm: '',
        useYn: ''
      },

      /* data header */
      headers: [
        { text: 'ID', value: 'apiId', align: 'left', class: 'text-center', width: '280px' },
        { text: 'API명', value: 'apiNm', align: 'left', class: 'text-center', width: '250px' },
        { text: 'METHOD', value: 'method', align: 'center', class: 'text-center', width: '80px' },
        { text: 'URL', value: 'requestUrl', align: 'left', class: 'text-center' },
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
    createApi () {
      this.$router.push({ name: 'CreateApiView', query: { t: new Date().getTime() } })
    },
    gridRowClick (item) {
      this.$router.push({ name: 'UpdateApiView', query: { t: new Date().getTime() }, params: { apiId: item.apiId } })
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.useYns = response.data.result.useYnList
        }
      )
    },
    getApiList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,

        apiNm: this.searchForm.apiNm,
        useYn: this.searchForm.useYn
      }
      this.pagination.loading = true
      getApiList(searchCondition).then(
        response => {
          this.desserts = response.data.result.apiList || []
          // paging setting
          this.pagination.totalRows = response.data.result.apiListCount
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
      this.getApiList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
