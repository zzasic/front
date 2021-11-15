<template>
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
          show-select
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
           class="elevation-1"
        >
        </v-data-table>
      </v-card>
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
</template>

<script>
import {
  getCmnCodeList
} from '../../api/cmnCode'

export default {
  name: 'PopupSearchBranch',
  props: {
  },
  computed: {},
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
      options: null,
      selected: [],
      // 언어
      langs: [],
      // 입력값
      searchForm: {
        codeId: '', // 언어
        codeValue: ''
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
      this.getCmnCodeList()
    },
    // 공통코드유형 정보 조회
    getCmnCodeList: function () {
      // param setting
      const searchCondition = {
        codeType: 'BR',
        codeId: this.searchForm.codeId,
        codeValue: this.searchForm.codeValue,
        useYn: 'Y'
      }

      // retrieve
      // this.pagination.loading = true
      getCmnCodeList(searchCondition).then(
        response => {
          this.branchList = response.data.result.cmnCodeList ? response.data.result.cmnCodeList : []
          // paging setting
          // this.pagination.totalRows = response.data.result.cmnCodeListCount
          // const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          // this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
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
