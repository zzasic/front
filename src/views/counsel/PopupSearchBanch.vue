<template>
<div>
  <v-card>
    <v-card-title>
      <span class="headline">지점명 검색</span>
    </v-card-title>
    <v-card-text>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-text-field
              class="default"
              v-model='searchForm.codeId'
              label="지점코드"
              placeholder=" "
              hide-details
              clearable
              outlined
              dense
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default"
              v-model='searchForm.codeValue'
              label="지점명"
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
      <v-card class="data-grid-wrap default clickable">
        <v-data-table
          v-model="selected"
          :headers="searchBranchHeaders"
          :items="branchList"
          :single-select="singleSelect"
          item-key="codeId"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          show-select
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
          class="elevation-1"
        >
        </v-data-table>
      </v-card>
      <div class="pagination-group">
        <v-select
          :menu-props="{ top: true, offsetY: true }"
          v-model="pagination.itemsPerPage"
          :items="pagination.itemsPerPages"
          @change="getCmnCodeList"
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
    </v-card-text>
      <v-card-actions class="submit-btns-group">
        <v-spacer></v-spacer>
        <v-btn color="btn-secondary" text @click="confirmBtn">확인</v-btn>
      </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="closeBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</div>
</template>

<script>
import {
  getBranchInitList
} from '../../api/shinhan/shbkCmnCode'

export default {
  name: 'PopupSearchBranch',
  props: {
  },
  computed: {
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
  created () {
    this.init()
  },
  mounted () {
  },
  data () {
    return {
      searchBranchHeaders: [
        { text: '지점코드', value: 'codeId', align: 'center', class: 'text-center', width: '100px' },
        { text: '지점명', value: 'codeValue', align: 'center', class: 'text-center', width: '100px' }
      ],
      branchList: [],
      options: {},
      selected: [],
      // 언어
      langs: [],
      // 입력값
      searchForm: {
        codeId: '', // 언어
        codeValue: ''
      },
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
      singleSelect: false
    }
  },
  methods: {
    init: async function () {
      this.getCmnCodeList()
    },
    // 취소버튼
    closeBtn: function () {
      this.$emit('popupAction', {
        branchPopup: false
      })
    },
    confirmBtn: function () {
      this.$emit('popupAction', {
        branchPopup: false
      },
      this.selected)
    },
    searchBtn: function () {
      this.pagination.page = 1
      this.getCmnCodeList()
    },
    // 공통코드유형 정보 조회
    getCmnCodeList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        // sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        // sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        codeType: 'BR',
        codeId: this.searchForm.codeId,
        codeValue: this.searchForm.codeValue,
        useYn: 'Y'
      }

      // retrieve
      // this.pagination.loading = true
      getBranchInitList(searchCondition).then(
        response => {
          this.branchList = response.data.result.cmnCodeList ? response.data.result.cmnCodeList : []
          console.log(' response.data.result.cmnCodeListCount ' + JSON.stringify(response.data.result.cmnCodeListCount))
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
        // this.pagination.loading = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
