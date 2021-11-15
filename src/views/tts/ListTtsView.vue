
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
              v-model="searchForm.ttsNm"
              label="TTS ID, TTS명"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.ttsEngine"
              :items="cptdTtsEngineList"
              label="TTS엔진"
              :placeholder="searchForm.ttsEngine ? undefined : $t('label.all')"
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
          :item-key="`ttsId`"
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
          <template v-slot:item.ttsNm="{ item }">
            {{ item.ttsNm.length > 40 ? item.ttsNm.substr(0,40)+'....' : item.ttsNm}}
          </template>
          <template v-slot:item.ttsUrl="{ item }">
            {{ item.ttsUrl.length > 50 ? item.ttsUrl.substr(0,50)+'....' : item.ttsUrl}}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'N' ? '미사용' : '사용' }}
          </template>
          <template v-slot:item.ttsEngine="{ item }">
            {{ (ttsEngines.find((t) => t.value === item.ttsEngine) || { text: '' }).text }}
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
          @input="getTtsList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="createTts">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="deleteTtss">{{ $t('button.delete')}}</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupTts.popupCreateTtsView"
        width="1000"
        persistent
        scrollable
      >
      <!-- ######### popup ######### -->
        <popup-create-tts-view
          @close-dialog="closeDialogTts"
          @refresh-list="getTtsList"
          v-if="dialogLookupTts.popupCreateTtsView"
        />
      </v-dialog>
      <v-dialog
          v-model="dialogLookupTts.popupUpdateTtsView"
          width="1000"
          persistent
          scrollable
        >
          <!-- ######### popup ######### -->
          <popup-update-tts-view
            @close-dialog="closeDialogTtsUpdate"
            @refresh-list="getTtsList"
            :editedItem="editedItem"
            v-if="dialogLookupTts.popupUpdateTtsView"
          />
        </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  getSearchCondition,
  getTtsList,
  deleteTtss
} from '../../api/tts'

import popupCreateTtsView from '@/views/tts/PopupCreateTtsView'
import popupUpdateTtsView from '@/views/tts/PopupUpdateTtsView'

import lodash from 'lodash'

export default {
  name: 'ListTtsView',
  components: {
    popupCreateTtsView,
    popupUpdateTtsView
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
    cptdTtsEngineList () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.ttsEngines)
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
          this.getTtsList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupTts: {
        popupCreateTtsView: false,
        popupUpdateTtsView: false
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
      ttsEngines: [],

      // 검색조건
      searchForm: {
        ttsNm: '',
        ttsEngine: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: 'ID', value: 'ttsId', align: 'center', class: 'text-center' },
        { text: 'TTS명', value: 'ttsNm', align: 'left', class: 'text-center' },
        { text: '통신유형', value: 'apiTypeNm', align: 'center', class: 'text-center' },
        { text: 'URL', value: 'ttsUrl', align: 'left', class: 'text-center' },
        { text: 'TTS엔진', value: 'ttsEngine', align: 'center', class: 'text-center' },
        { text: 'Speed 간격', value: 'speedInterval', align: 'center', class: 'text-center' },
        { text: 'Volume 간격', value: 'volumeInterval', align: 'center', class: 'text-center' },
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
    closeDialogTts: function () {
      this.dialogLookupTts.popupCreateTtsView = false
    },
    closeDialogTtsUpdate: function () {
      this.dialogLookupTts.popupUpdateTtsView = false
    },
    /* popup end */
    createTts () {
      this.dialogLookupTts.popupCreateTtsView = true
    },
    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getTtsList()
      }
    },
    gridRowClick (item) {
      this.editedItem.ttsId = Object.assign(item.ttsId)
      this.dialogLookupTts.popupUpdateTtsView = true
    },
    init: async function () {
      await this.getSearchCondition()
      this.getTtsList()
    },
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.ttsEngines = response.data.result.ttsEngineList
        }
      )
    },
    getTtsList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        ttsNm: this.searchForm.ttsNm,
        ttsEngine: this.searchForm.ttsEngine,
        useYn: this.searchForm.useYn
      }

      this.pagination.loading = true
      getTtsList(searchCondition).then(
        response => {
          this.desserts = response.data.result.ttsList || []
          // paging setting
          this.pagination.totalRows = response.data.result.ttsListCount
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
    deleteTtss: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
      } else {
        if (confirm('삭제하시겠습니까?')) {
          deleteTtss(this.selected).then(
            response => {
              this.getTtsList()
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
      this.getTtsList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
