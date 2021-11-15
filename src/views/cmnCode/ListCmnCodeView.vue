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
              v-model="searchForm.codeValue"
              label="공통코드 ID, 공통코드 명"
              placeholder=" "
              hide-details
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.codeType"
              :items="cptdItemsCodeType"
              :placeholder="searchForm.codeType ? undefined : $t('label.all')"
              label="공통코드 유형"
              return-object
              clearable
            ></v-select>
          </v-col>
          <v-col cols="1">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.useYn"
              :items="cptdUseYns"
              label="사용 여부"
              :placeholder="searchForm.useYn ? undefined : $t('label.all')"
              return-object
              clearable
            ></v-select>
          </v-col>
          <v-col class="text-right">
            <!-- <v-btn
              text
              color="btn-secondary"
              class="btn-reset"
              :ripple="false"
              @click="srchInit"
            >
              초기화
            </v-btn> -->
            <v-btn
              text
              color="btn-tertiary"
              class="btn-search"
              :ripple="false"
              @click="searchBtn"
            >{{ $t('button.search') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <PageSectionTitle
        :title="pagination.sectionTitle"
        :totalRows="pagination.totalRows"
        :subtitle="pagination.sectionSubTitle"
      >
      </PageSectionTitle>
      <div class="btn-wrap align-right">
        <v-btn class="btn-naked-primary btn-excel-download" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div>
      <v-card class="data-grid-wrap default clickable">
        <v-data-table
          v-model="selected"
          :item-key="`itemKey`"
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
          <template v-slot:item.codeTypeNm="{ item }">
            {{ item.codeTypeNm }}
          </template>
          <template v-slot:item.codeId="{ item }">
            {{ item.codeId }}
          </template>
          <template v-slot:item.codeValue="{ item }">
            {{ item.codeValue.length > 40 ? item.codeValue.substr(0, 40) + '....' : item.codeValue }}
          </template>
          <template v-slot:item.codeOrder="{ item }">
            {{ item.codeOrder }}
          </template>
          <template v-slot:item.useYn="{ item }">
            {{ item.useYn === 'Y' ? '사용' : '미사용' }}
          </template>
          <template v-slot:item.lastUpdUserNm="{ item }">
            {{ item.lastUpdUserNm }}
          </template>
          <template v-slot:item.lastUpdTime="{ item }">
            {{
              $moment(item.lastUpdTime || item.firstRegTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('YYYY-MM-DD HH:mm')
            }}
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
          @input="getCmnCodeList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="createCmnCode">{{ $t('button.new') }}</v-btn>
        <v-btn color="btn-secondary" text @click="delCmnCodes">{{ $t('button.delete') }}</v-btn>
        <!-- <v-btn class="btn-naked-primary" text :ripple="false">공통코드 유형 조회</v-btn> -->
        <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div>
      <!-- popup start -->
      <v-dialog
        v-model="dialogLookupCmnCode.popupCreateCmnCodeView"
        width="800"
        persistent
      >
        <!-- ######### popup ######### -->
        <popup-create-cmn-code-view
          @close-dialog="closeDialogCmnCode"
          @refresh-list="getCmnCodeList"
          v-if="dialogLookupCmnCode.popupCreateCmnCodeView"
        />
      </v-dialog>
      <v-dialog
        v-model="dialogLookupCmnCode.popupUpdateCmnCodeView"
        width="800"
        persistent
        scrollable
      >
        <!-- ######### popup ######### -->
        <popup-update-cmn-code-view
          @close-dialog="closeDialogCmnCodeUpdate"
          @refresh-list="getCmnCodeList"
          :editedItem="editedItem"
          v-if="dialogLookupCmnCode.popupUpdateCmnCodeView"
        />
      </v-dialog>
      <!-- popup end -->
    </vuescroll>
  </div>
</template>

<script>
import {
  deleteCmnCodes,
  getChildrenCmnCodes,
  getCmnCodeList,
  getSearchCondition,
  reqExcelDown
} from '../../api/cmnCode'

import popupCreateCmnCodeView from '@/views/cmnCode/PopupCreateCmnCodeView'
import popupUpdateCmnCodeView from '@/views/cmnCode/PopupUpdateCmnCodeView'

import lodash from 'lodash'

export default {
  name: 'listCmnCodeView',
  components: {
    popupCreateCmnCodeView,
    popupUpdateCmnCodeView
  },
  created () {
    this.getSearchCondition()
  },
  mounted () {
    this.getCmnCodeList()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsCodeType: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.searchForm.itemsCodeType)
      return its
    },
    cptdUseYns: function () {
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
          this.getCmnCodeList()
        }
      }
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupCmnCode: {
        popupCreateCmnCodeView: false,
        popupUpdateCmnCodeView: false
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
        codeValue: '',
        itemsCodeType: [],
        codeType: '',
        useYn: ''
      },

      // 테이블  데이터
      headers: [
        { text: '코드유형', value: 'codeTypeNm', align: 'left', class: 'text-center', width: '200px' },
        { text: 'ID', value: 'codeId', align: 'left', class: 'text-center', width: '100px' },
        { text: '코드명', value: 'codeValue', align: 'left', class: 'text-center' },
        { text: '상위코드유형', value: 'upperCodeTypeNm', align: 'center' },
        { text: '상위코드명', value: 'upperCodeValue', align: 'center' },
        { text: '옵션코드', value: 'optCode', align: 'center' },
        { text: '순서', value: 'codeOrder', align: 'center', width: '80px' },
        { text: '사용여부', value: 'useYn', align: 'center', width: '80px' },
        { text: '등록자', value: 'lastUpdUserNm', align: 'center', width: '100px' },
        { text: '등록일시', value: 'lastUpdTime', align: 'center', width: '120px' }
      ],
      desserts: [],
      selected: [],
      editedItem: {},
      childrenList: [],
      hasChild: false,
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
    closeDialogCmnCode: function () {
      this.dialogLookupCmnCode.popupCreateCmnCodeView = false
    },
    closeDialogCmnCodeUpdate: function () {
      this.dialogLookupCmnCode.popupUpdateCmnCodeView = false
    },
    /* popup end */
    createCmnCode () {
      this.dialogLookupCmnCode.popupCreateCmnCodeView = true
    },
    sortClick: function (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getCmnCodeList()
      }
    },
    gridRowClick (item) {
      this.editedItem.codeType = Object.assign(item.codeType)
      this.editedItem.codeId = Object.assign(item.codeId)
      this.dialogLookupCmnCode.popupUpdateCmnCodeView = true
    },
    // 조회조건 조회
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          this.searchForm.itemsCodeType = response.data.result.codeTypeList // 공통코드유형
        }
      )
    },

    // 공통코드유형 정보 조회
    getCmnCodeList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        codeValue: this.searchForm.codeValue, // 공통코드명
        codeType: this.searchForm.codeType ? this.searchForm.codeType.value : '', // 공통코드 유형
        useYn: this.searchForm.useYn ? this.searchForm.useYn.value : ''
      }

      // retrieve
      this.pagination.loading = true
      getCmnCodeList(searchCondition).then(
        response => {
          this.desserts = response.data.result.cmnCodeList ? response.data.result.cmnCodeList : []
          // paging setting
          this.pagination.totalRows = response.data.result.cmnCodeListCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
        },
        error => {
          console.error(error)
          const status = error.data.status
          if (status === 403) {
            this.$router.push({
              name: '403',
              query: { t: new Date().getTime() }
            })
          } else {
            delete sessionStorage.accessToken
            this.$router.push({
              name: 'Login',
              query: { t: new Date().getTime() }
            })
          }
        }
      ).finally(() => {
        this.pagination.loading = false
      })
    },
    delCmnCodes: lodash.debounce(function () {
      if (this.selected.length === 0) {
        alert('삭제대상을 선택해 주세요.')
      } else {
        if (confirm('삭제하시겠습니까?')) {
          getChildrenCmnCodes(this.selected).then(checkResponse => {
            if (checkResponse.data.result === false) {
              deleteCmnCodes(this.selected).then(
                response => {
                  if (response.data.status === 200) {
                    alert('삭제되었습니다.')
                    this.getCmnCodeList()
                  }
                },
                error => {
                  console.error(error)
                  delete sessionStorage.accessToken
                  this.$router.push({
                    name: 'Login',
                    query: { t: new Date().getTime() }
                  })
                }
              )
            } else {
              alert('하위코드가 존재하여 삭제할 수 없습니다!')
            }
          })
        }
      }
      this.hasChild = false
    },
    300
    ),
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.selected = []
      this.getCmnCodeList()
    },
    excelDown: function () {
      const searchCondition = {
        codeValue: this.searchForm.codeValue, // 공통코드명
        codeType: this.searchForm.codeType ? this.searchForm.codeType.value : '', // 공통코드 유형
        useYn: this.searchForm.useYn ? this.searchForm.useYn.value : ''
      }
      reqExcelDown(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_공통코드.xlsx'

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: response.headers['content-type']
          })
        )
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
      },
      error => {
        console.error(error)
        const status = error.data.status
        if (status === 403) {
          this.$router.push({
            name: '403',
            query: { t: new Date().getTime() }
          })
        } else {
          delete sessionStorage.accessToken
          this.$router.push({
            name: 'Login',
            query: { t: new Date().getTime() }
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
