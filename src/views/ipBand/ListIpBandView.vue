
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
              v-model="searchForm.ipNm"
              label="IP 명"
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
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
          :item-key="`ipBandId`"
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
          <template v-slot:item.ipBandId="{ item }">
            {{ item.ipBandId }}
          </template>
          <template v-slot:item.startAddress="{ item }">
            {{ item.startAddress }}
          </template>
          <template v-slot:item.endAddress="{ item }">
            {{ item.endAddress }}
          </template>
          <template v-slot:item.ipNm="{ item }">
            {{ item.ipNm.length > 40 ? item.ipNm.substr(0,40)+'....' : item.ipNm}}
          </template>
          <template v-slot:item.remark="{ item }">
            {{ item.remark != null && item.remark.length > 50 ? item.remark.substr(0,50)+'....' : item.remark}}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'Y' ? '사용' : '미사용' }}
          </template>
          <template v-slot:item.lastUpdUserNm="{ item }">
            {{ item.lastUpdUserNm }}
          </template>
          <template v-slot:item.lastUpdTime="{ item }">
            {{ $moment(item.lastUpdTime || item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm') }}
          </template>
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          :value="pagination.itemsPerPage"
          v-on:change="searchBtn"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="getIpBandList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click.stop="newBtn">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="delIpBands()">{{ $t('button.delete')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupIpBand.popupCreateIpBandView"
        width="490"
        persistent
        scrollable
      >
        <!-- ######### popup ######### -->
        <popup-create-ip-band-view
          @close-dialog="closeDialogIpBand"
          @refresh-list="getIpBandList"
          v-if="dialogLookupIpBand.popupCreateIpBandView"
        />
      </v-dialog>
      <v-dialog
        v-model="dialogLookupIpBand.popupUpdateIpBandView"
        width="490"
        persistent
        scrollable
      >
        <!-- ######### popup ######### -->
        <popup-update-ip-band-view
          @close-dialog="closeDialogIpBandUpdate"
          @refresh-list="getIpBandList"
          :editedItem="editedItem"
          v-if="dialogLookupIpBand.popupUpdateIpBandView"
        />
      </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  reqIpBandList,
  reqDeleteIpBand
} from '../../api/ipBand'

import popupCreateIpBandView from '@/views/ipBand/PopupCreateIpBandView'
import popupUpdateIpBandView from '@/views/ipBand/PopupUpdateIpBandView'

import lodash from 'lodash'

export default {
  name: 'ListIpBandView',
  components: {
    popupCreateIpBandView,
    popupUpdateIpBandView
  },
  created () {
  },
  mounted () {
    this.getIpBandList()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    dateRangeText () {
      // 달력
      return this.searchForm.dates.join(' ~ ')
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getIpBandList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupIpBand: {
        popupCreateIpBandView: false,
        popupUpdateIpBandView: false
      },
      /* popup end */

      // 사용여부
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
        ipNm: '',
        service: '',
        itemsService: []
      },

      // 테이블  데이터
      headers: [
        { text: 'ID', value: 'ipBandId', align: 'center' },
        { text: '시작 IP주소', value: 'startAddress', align: 'center' },
        { text: '종료 IP주소', value: 'endAddress', align: 'center' },
        { text: 'IP명', value: 'ipNm', align: 'left' },
        { text: '설명', value: 'remark', align: 'left' },
        { text: '사용여부', value: 'useYn', align: 'center', width: '100px' },
        { text: '등록자', value: 'lastUpdUserNm', align: 'center', width: '100px' },
        { text: '등록일시', value: 'lastUpdTime', align: 'center', width: '120px' }
      ],
      desserts: [],
      selected: [],
      editedItem: [],

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
    newBtn: function () {
      this.dialogLookupIpBand.popupCreateIpBandView = true
    },
    /* popup start */
    closeDialogIpBand: function () {
      this.dialogLookupIpBand.popupCreateIpBandView = false
    },
    closeDialogIpBandUpdate: function () {
      this.dialogLookupIpBand.popupUpdateIpBandView = false
    },
    /* popup end */

    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getIpBandList()
      }
    },
    // 서비스사용량정보 조회
    getIpBandList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',

        itemsPerPage: this.pagination.itemsPerPage,
        ipNm: this.searchForm.ipNm // IP명
      }

      // retrieve
      this.pagination.loading = true
      reqIpBandList(searchCondition).then(
        response => {
          // 조회결과
          this.desserts = response.data.result.ipBandList ? response.data.result.ipBandList : []

          // paging setting
          this.pagination.totalRows = response.data.result.ipBandListCount
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
      this.editedItem = Object.assign({}, item)
      this.dialogLookupIpBand.popupUpdateIpBandView = true
    },
    delIpBands: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
      } else {
        if (confirm('삭제하시겠습니까?')) {
          reqDeleteIpBand(this.selected).then(
            response => {
              if (response.data.status === 200) {
                this.getIpBandList()
              }
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
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getIpBandList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
