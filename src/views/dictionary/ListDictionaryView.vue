
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
              v-model="searchForm.lableNm"
              label="단어명"
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.lang"
              :items="langList"
              label="언어"
              :placeholder="searchForm.lang ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col> -->
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.useYn"
              :items="useYnList"
              label="사용 여부"
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
          :headers="headers"
          :items="desserts"
          :item-key="`itemKey`"
          :options.sync="optionSync"
          :server-items-length="pagination.totalRows"
          :loading="pagination.loading"
          @click:row="detailRow"
          show-select
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <!-- <template v-slot:item.langNm="{ item }">
            {{ item.langNm }}
          </template> -->
          <template v-slot:item.lableNm="{ item }">
            {{ item.lableNm.length > 100 ? item.lableNm.substr(0,100)+'....' : item.lableNm}}
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
          @change="searchBtn"
          solo
        ></v-select>
        <v-pagination
          v-model="pagination.page"
          :page="pagination.page"
          :length="pagination.length"
          @input="getDictionaryList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <!-- <v-btn color="btn-primary" text @click.stop="batchBtn">{{ $t('button.batch')}}</v-btn> -->
        <v-btn color="btn-primary" text @click.stop="newBtn">{{ $t('button.new')}}</v-btn>
        <v-btn color="btn-secondary" text @click="deleteBtn">{{ $t('button.delete')}}</v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        :max-width="popup.batchView ? 1024 : 600"
        scrollable
        >
        <PopupCreateDictionaryView
          @popupAction="popupAction"
          v-if="popup.createView === true"
          />
        <PopupReadDictionaryView
          @popupAction="popupAction"
          :dctnrCode="popup.dctnrCode"
          :lang="popup.lang"
          v-if="popup.readView === true && popup.dctnrCode !== null && popup.lang !== null"
          />
        <PopupUpdateDictionaryView
          @popupAction="popupAction"
          :dctnrCode="popup.dctnrCode"
          :lang="popup.lang"
          v-if="popup.updateView === true && popup.dctnrCode !== null && popup.lang !== null"
          />
        <PopupExcelUploadView
            @popupAction="popupAction"
            :code="`dictionary`"
            v-if="popup.batchView === true"
            />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import { getSearchCondition, getDictionaryList, deleteDictionary } from '@/api/dictionary'

import PopupCreateDictionaryView from '@/views/dictionary/PopupCreateDictionaryView'
import PopupReadDictionaryView from '@/views/dictionary/PopupReadDictionaryView'
import PopupUpdateDictionaryView from '@/views/dictionary/PopupUpdateDictionaryView'
import PopupExcelUploadView from '@/views/PopupExcelUploadView'

export default {
  name: 'ListDictionaryView',
  components: {
    PopupCreateDictionaryView,
    PopupReadDictionaryView,
    PopupUpdateDictionaryView,
    PopupExcelUploadView
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
    langList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.langs)
      return its
    },
    useYnList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.useYns)
      return its
    },
    dialog: function () {
      return (this.popup.createView === true || this.popup.batchView === true || this.popup.readView === true || this.popup.updateView === true)
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getDictionaryList()
        }
      }
    }
  },
  data () {
    return {
      popup: {
        createView: false,
        batchView: false,
        readView: false,
        updateView: false,
        dctnrCode: null,
        lang: null
      },
      // 검색영역 시작
      // 언어
      langs: [],
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
        lableNm: '',
        // lang: '',
        useYn: ''
      },
      // 그리드영역 시작
      // 선택데이터
      selected: [],
      // 헤더정보
      headers: [
        // { text: '언어', value: 'langNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '단어명', value: 'lableNm', align: 'left', class: 'text-center' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록자', value: 'lastUpdUserNm', align: 'center', class: 'text-center', width: '100px' },
        { text: '등록일시', value: 'lastUpdTime', align: 'center', class: 'text-center', width: '150px' }
      ],
      // 데이터
      desserts: [],
      // 정렬
      options: null,
      // 페이징
      pagination: {
        page: 1, // 현재페이지
        length: 1, // 페이징숫자 갯수
        itemsPerPage: 10, // table row view 갯수
        itemsPerPages: [10, 20, 30], // 왼쪽하단 selectbox
        totalRows: 0,
        sectionTitle: this.$t('label.totalCnt'),
        sectionSubTitle: '',
        loading: false
      }
      // 그리드영역 끝
    }
  },
  methods: {
    init: async function () {
      await this.getSearchCondition()
      this.getDictionaryList()
    },
    // 조회조건 조회
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.langs = response.data.result.langList // 언어유형
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    // 사전목록조회
    getDictionaryList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy && this.options.sortBy.length ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc && this.options.sortDesc.length ? this.options.sortDesc[0] === false ? 'DESC' : 'ASC' : '',
        itemsPerPage: this.pagination.itemsPerPage,
        lableNm: this.searchForm.lableNm, // 레이블명
        lang: this.searchForm.lang, // 언어유형
        useYn: this.searchForm.useYn // 사용여부
      }
      // retrieve
      this.pagination.loading = true
      getDictionaryList(searchCondition).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과에 인덱시 추가
            this.desserts = response.data.result.dictionaryList ? response.data.result.dictionaryList.map(function (v, index) { return { ...v, itemKey: `${v.dctnrCode}_${v.lang}` } }) : []
            // paging setting
            this.pagination.totalRows = response.data.result.dictionaryListCount
            this.pagination.length = parseInt((this.pagination.totalRows - 1) / this.pagination.itemsPerPage) + 1
          }
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
    deleteDictionary: function () {
      const dictionarys = this.selected
      deleteDictionary(dictionarys).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            alert('삭제되었습니다.')
            this.getDictionaryList()
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getDictionaryList()
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
    // 상세버튼
    detailRow: function (dictionary) {
      this.popup.createView = false
      this.popup.updateView = true
      this.popup.readView = false
      this.popup.batchView = false
      this.popup.dctnrCode = dictionary.dctnrCode
      this.popup.lang = dictionary.lang
    },
    // 삭제버튼
    deleteBtn: function () {
      if (this.selected && this.selected.length > 0) {
        if (confirm(this.selected.length + '건을 삭제하시겠습니까?')) {
          this.deleteDictionary()
        }
      } else {
        alert('삭제할 대상을 선택해주세요.')
      }
    },
    popupAction: function (popup) {
      this.popup = popup
      this.getDictionaryList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
