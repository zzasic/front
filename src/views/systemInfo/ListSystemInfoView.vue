
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
              v-model="searchForm.systemNm"
              label="System ID, 명"
              placeholder=" "
              hide-details
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
          :item-key="`systemId`"
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
        >
          <template v-slot:item.systemNm="{ item }">
            {{ item.systemNm.length > 40 ? item.systemNm.substr(0,40)+'....' : item.systemNm}}
          </template>
          <template v-slot:item.systemUrl="{ item }">
            {{ item.systemUrl.length > 50 ? item.systemUrl.substr(0,50)+'....' : item.systemUrl}}
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
          @input="getSystemInfoList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="createSystemInfo">{{ $t('button.new')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupSystemInfo.popupCreateSystemInfoView"
        width="1000"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-systemInfo-view
          @close-dialog="closeDialogSystemInfo"
          @refresh-list="getSystemInfoList"
          v-if="dialogLookupSystemInfo.popupCreateSystemInfoView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupSystemInfo.popupUpdateSystemInfoView"
          width="1000"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-systemInfo-view
            @close-dialog="closeDialogSystemInfoUpdate"
            @refresh-list="getSystemInfoList"
            :editedItem="editedItem"
            v-if="dialogLookupSystemInfo.popupUpdateSystemInfoView"
          />
        </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  getSearchCondition,
  getSystemInfoList
} from '../../api/systemInfo'

import popupCreateSystemInfoView from '@/views/systemInfo/PopupCreateSystemInfoView'
import popupUpdateSystemInfoView from '@/views/systemInfo/PopupUpdateSystemInfoView'

export default {
  name: 'ListSystemInfoView',
  components: {
    popupCreateSystemInfoView,
    popupUpdateSystemInfoView
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
          this.getSystemInfoList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupSystemInfo: {
        popupCreateSystemInfoView: false,
        popupUpdateSystemInfoView: false
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
        systemNm: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: 'ID', value: 'systemId', align: 'center', class: 'text-center', width: '150px' },
        { text: '시스템명', value: 'systemNm', align: 'center', class: 'text-center', width: '200px' },
        { text: 'STT 사용', value: 'sttUseYn', align: 'center', class: 'text-center', width: '100px' },
        { text: 'ChatBot 사용', value: 'chatbotUseYn', align: 'center', class: 'text-center', width: '100px' },
        { text: 'TTS 사용', value: 'ttsUseYn', align: 'center', class: 'text-center', width: '100px' },
        { text: 'TA 사용', value: 'taUseYn', align: 'center', class: 'text-center', width: '100px' },
        { text: 'URL', value: 'systemUrl', align: 'left', class: 'text-center' },
        { text: '메인화면명', value: 'menuNm', align: 'center', class: 'text-center', width: '200px' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '80px' },
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
    closeDialogSystemInfo: function () {
      this.dialogLookupSystemInfo.popupCreateSystemInfoView = false
    },
    closeDialogSystemInfoUpdate: function () {
      this.dialogLookupSystemInfo.popupUpdateSystemInfoView = false
    },
    /* popup end */
    createSystemInfo () {
      this.dialogLookupSystemInfo.popupCreateSystemInfoView = true
    },
    gridRowClick (item) {
      this.editedItem.systemId = Object.assign(item.systemId)
      this.dialogLookupSystemInfo.popupUpdateSystemInfoView = true
    },
    init: async function () {
      await this.getSearchCondition()
      this.getSystemInfoList()
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          // this.taEngines = response.data.result.taEngineList
        }
      )
    },
    getSystemInfoList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        systemNm: this.searchForm.systemNm,
        useYn: this.searchForm.useYn
      }

      this.pagination.loading = true
      getSystemInfoList(searchCondition).then(
        response => {
          this.desserts = response.data.result.systemInfoList || []
          // paging setting
          this.pagination.totalRows = response.data.result.systemInfoListCount
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
      this.getSystemInfoList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
