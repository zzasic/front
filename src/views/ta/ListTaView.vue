
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
              v-model="searchForm.taNm"
              label="TA ID, TA명"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.taEngine"
              :items="cptdTaEngineList"
              label="TA엔진"
              :placeholder="searchForm.taEngine ? undefined : $t('label.all')"
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
          :item-key="`taId`"
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
          <template v-slot:item.taNm="{ item }">
            {{ item.taNm.length > 40 ? item.taNm.substr(0,40)+'....' : item.taNm}}
          </template>
          <template v-slot:item.taUrl="{ item }">
            {{ item.taUrl.length > 50 ? item.taUrl.substr(0,50)+'....' : item.taUrl}}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'N' ? '미사용' : '사용' }}
          </template>
          <template v-slot:item.taEngine="{ item }">
            {{ (taEngines.find((t) => t.value === item.taEngine) || { text: '' }).text }}
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
          @input="getTaList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="createTa">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="deleteTas">{{ $t('button.delete')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupTa.popupCreateTaView"
        width="490"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-ta-view
          @close-dialog="closeDialogTa"
          @refresh-list="getTaList"
          v-if="dialogLookupTa.popupCreateTaView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupTa.popupUpdateTaView"
          width="490"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-ta-view
            @close-dialog="closeDialogTaUpdate"
            @refresh-list="getTaList"
            :editedItem="editedItem"
            v-if="dialogLookupTa.popupUpdateTaView"
          />
        </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  getSearchCondition,
  getTaList,
  deleteTas
} from '../../api/ta'

import popupCreateTaView from '@/views/ta/PopupCreateTaView'
import popupUpdateTaView from '@/views/ta/PopupUpdateTaView'

import lodash from 'lodash'

export default {
  name: 'ListTaView',
  components: {
    popupCreateTaView,
    popupUpdateTaView
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
    cptdTaEngineList () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.taEngines)
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
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getTaList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupTa: {
        popupCreateTaView: false,
        popupUpdateTaView: false
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
      taEngines: [],

      // 검색조건
      searchForm: {
        taNm: '',
        taEngine: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: 'ID', value: 'taId', align: 'center', class: 'text-center' },
        { text: 'TA명', value: 'taNm', align: 'left', class: 'text-center' },
        { text: '통신유형', value: 'apiTypeNm', align: 'center', class: 'text-center' },
        { text: 'URL', value: 'taUrl', align: 'left', class: 'text-center' },
        { text: 'TA엔진', value: 'taEngine', align: 'center', class: 'text-center' },
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
    closeDialogTa: function () {
      this.dialogLookupTa.popupCreateTaView = false
    },
    closeDialogTaUpdate: function () {
      this.dialogLookupTa.popupUpdateTaView = false
    },
    /* popup end */
    createTa () {
      this.dialogLookupTa.popupCreateTaView = true
    },
    gridRowClick (item) {
      this.editedItem.taId = Object.assign(item.taId)
      this.dialogLookupTa.popupUpdateTaView = true
    },
    init: async function () {
      await this.getSearchCondition()
      this.getTaList()
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.taEngines = response.data.result.taEngineList
        }
      )
    },
    getTaList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        taNm: this.searchForm.taNm,
        taEngine: this.searchForm.taEngine,
        useYn: this.searchForm.useYn
      }

      this.pagination.loading = true
      getTaList(searchCondition).then(
        response => {
          this.desserts = response.data.result.taList || []
          // paging setting
          this.pagination.totalRows = response.data.result.taListCount
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
    deleteTas: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
      } else {
        if (confirm('삭제하시겠습니까?')) {
          deleteTas(this.selected).then(
            response => {
              this.getTaList()
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
      this.getTaList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
