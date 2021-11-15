
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
              v-model="searchForm.batchNm"
              label="배치ID, 배치명"
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
              :placeholder="$t('label.all')"
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
          :item-key="`batchId`"
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
          <template v-slot:item.batchId="{ item }">
            {{ item.batchId }}
          </template>
          <template v-slot:item.batchNm="{ item }">
            {{ item.batchNm }}
          </template>
          <template v-slot:item.classNm="{ item }">
            {{ item.classNm }}
          </template>
          <template v-slot:item.serverIp="{ item }">
            {{ item.serverIp }}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'N' ? '미사용' : '사용' }}
          </template>
          <template v-slot:item.firstRegUserNm="{ item }">
            {{ item.firstRegUserNm }}
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
          @input="getBatchList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="createBatch">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="delBatchs">{{ $t('button.delete')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupBatch.popupCreateBatchView"
        width="490"
        persistent
      >
      <!-- ######### popup ######### -->
        <popup-create-batch-view
          @close-dialog="closeDialogBatch"
          @refresh-list="getBatchList"
          v-if="dialogLookupBatch.popupCreateBatchView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupBatch.popupUpdateBatchView"
          width="490"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-batch-view
            @close-dialog="closeDialogBatchUpdate"
            @refresh-list="getBatchList"
            :editedItem="editedItem"
            v-if="dialogLookupBatch.popupUpdateBatchView"
          />
        </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  getBatchList,
  deleteBatchs
} from '../../api/batch'

import popupCreateBatchView from '@/views/batch/PopupCreateBatchView'
import popupUpdateBatchView from '@/views/batch/PopupUpdateBatchView'

import lodash from 'lodash'

export default {
  name: 'listBatchView',
  components: {
    popupCreateBatchView,
    popupUpdateBatchView
  },
  created () {
  },
  mounted () {
    this.getBatchList()
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
          this.getBatchList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupBatch: {
        popupCreateBatchView: false,
        popupUpdateBatchView: false
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

      // 검색조건
      searchForm: {
        batchNm: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: 'ID', value: 'batchId', align: 'center', class: 'text-center', width: '100px' },
        { text: '배치명', value: 'batchNm', align: 'left', class: 'text-center' },
        { text: 'Class경로', value: 'classNm', align: 'left', class: 'text-center' },
        { text: '배치수행IP', value: 'serverIp', align: 'center', class: 'text-center' },
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
    closeDialogBatch: function () {
      this.dialogLookupBatch.popupCreateBatchView = false
    },
    closeDialogBatchUpdate: function () {
      this.dialogLookupBatch.popupUpdateBatchView = false
    },
    /* popup end */
    createBatch () {
      this.dialogLookupBatch.popupCreateBatchView = true
    },
    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getBatchList()
      }
    },
    gridRowClick (item) {
      this.editedItem.batchId = Object.assign(item.batchId)
      this.dialogLookupBatch.popupUpdateBatchView = true
    },
    getBatchList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,

        batchNm: this.searchForm.batchNm,
        useYn: this.searchForm.useYn.value
      }

      this.pagination.loading = true
      getBatchList(searchCondition).then(
        response => {
          this.desserts = response.data.result.batchList ? response.data.result.batchList : []
          // paging setting
          this.pagination.totalRows = response.data.result.batchListCount
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
    delBatchs: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
      } else {
        if (confirm('삭제하시겠습니까?')) {
          deleteBatchs(this.selected).then(
            response => {
              if (response.data.status === 200) {
                this.getBatchList()
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
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getBatchList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
