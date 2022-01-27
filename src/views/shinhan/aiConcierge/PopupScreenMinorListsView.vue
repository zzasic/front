<template>
<div>
  <v-card>
    <v-card-title>
      <span class="headline">상세내역</span>
    </v-card-title>
    <v-card-text>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="auto">
            <v-text-field
              class="default"
              v-model="item.betweenTxt"
              label="검색기간"
              placeholder=" "
              hide-details
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              class="default"
              v-model="item.typeCode"
              label="중분류코드"
              placeholder=" "
              hide-details
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              class="default"
              v-model="item.typeName"
              label="중분류명"
              placeholder=" "
              hide-details
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default"
              v-model="item.voiceCnt"
              label="음성(건)"
              placeholder=" "
              hide-details
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default"
              v-model="item.buttonCnt"
              label="버튼(건)"
              placeholder=" "
              hide-details
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default"
              v-model="item.silenceCnt"
              label="침묵(건)"
              placeholder=" "
              hide-details
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default"
              v-model="item.totalCnt"
              label="전체(건)"
              placeholder=" "
              hide-details
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
       <v-card class="data-grid-wrap default clickable">
        <v-data-table
          :headers="headers"
          :items="digitalUsageViewList"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr @click="detailStatiatics(props.item)" :title="convertContents(props.item.contents)">
              <td class="text-center">{{ props.item.typeCode }}</td>
              <td class="text-center">{{ props.item.typeName }}</td>
              <td class="text-center">{{ props.item.voiceCnt }}</td>
              <td class="text-center">{{ props.item.buttonCnt }}</td>
              <td class="text-center">{{ props.item.silenceCnt }}</td>
              <td class="text-center">{{ props.item.totalCnt }}</td>
            </tr>
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
          @input="fnc_getScreenCategoryStatiaticsMinorList"
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
<v-dialog
        v-model="dialogStatiaticsView"
        persistent
        hide-overlay
        scrollable
        :max-width="'100%'"
        >
      <PopupScreenTypeDetailView
      @popupAction="popupAction" :item="itemObj" v-if="popup.screenDetailPopup === true"
      />
    </v-dialog>
</div>
</template>

<script>
import {
  getScreenCategoryStatiaticsMinorList
} from '../../../api/shinhan/aiConcierge' // solutionHistory'
import PopupScreenTypeDetailView from '@/views/shinhan/aiConcierge/PopupScreenTypeDetailView'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'PopupScreenMinorListsView',
  components: {
    PopupScreenTypeDetailView
  },
  props: ['item'],
  mixins: [datepicker],
  created () {
    if (sessionStorage.userAuthCode === 'CU' || sessionStorage.userAuthCode === 'CAU') {
      this.authOpt = false
      this.searchForm.system = sessionStorage.systemIds
    }
  },
  mounted () {
    this.fnc_getScreenCategoryStatiaticsMinorList()
  },
  data () {
    return {
      headers: [
        { text: '소분류코드', value: 'typeCode', align: 'center', class: 'text-center', width: '20%' },
        { text: '소분류명', value: 'typeName', align: 'center', class: 'text-center', width: '30%' },
        { text: '음성(건)', value: 'voiceCnt', align: 'center', class: 'text-center', width: '10%' },
        { text: '버튼(건)', value: 'buttonCnt', align: 'center', class: 'text-center', width: '10%' },
        { text: '침묵(건)', value: 'silenceCnt', align: 'center', class: 'text-center', width: '10%' },
        { text: '전체(건)', value: 'totalCnt', align: 'center', class: 'text-center', width: '10%' }
      ],
      digitalUsageViewList: [],
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
      options: null,
      callTypes: [],
      chats: [],
      authOpt: true,
      popup: {
        screenDetailPopup: false
      },
      itemObj: []
    }
  },

  computed: {
    dialogStatiaticsView: function () {
      // console.log(' dialogStatiaticsView ')
      return (this.popup.screenDetailPopup === true)
    },
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.fnc_getScreenCategoryStatiaticsMinorList()
        }
      }
    }
  },

  watch: {
  },

  methods: {
    detailStatiatics: function (itemRow) {
      // console.log(JSON.stringify(itemRow))
      this.itemObj = itemRow
      this.itemObj.betweenTxt = this.item.betweenTxt
      this.popup.screenDetailPopup = true
    },
    getContents (str) {
      let content
      let setStr
      if (str === null || str === undefined || str === '') {
        content = ''
      } else {
        setStr = str // .replace('\\n', '')
        // console.log(' setStr ' + setStr)
        if (setStr.length > 10) {
          content = setStr.substring(0, 9) + '...'
        } else {
          content = setStr
        }
      }
      return content
    },
    convertContents (str) {
      return str === null || str === '' ? '' : str // .replaceAll('\\n', '\n') //  setStr = str.replace('\\n', '&lt;br&gt;') .replace('\n', '<br>')
    },
    fnc_getScreenCategoryStatiaticsMinorList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        paramCode: this.item.typeCode,
        startDate: this.item.betweenTxt.split('~')[0],
        endDate: this.item.betweenTxt.split('~')[1]
      }
      console.log(' searchCondition pop' + JSON.stringify(searchCondition))
      this.pagination.loading = true
      getScreenCategoryStatiaticsMinorList(searchCondition).then(
        response => {
          console.log(JSON.stringify(response.data.result))
          this.digitalUsageViewList = response.data.result.digitalUsageViewList ? response.data.result.digitalUsageViewList : []
          // paging setting
          this.pagination.totalRows = response.data.result.digitalUsageViewCount
          const pageLength = parseInt(this.pagination.totalRows / this.pagination.itemsPerPage)
          this.pagination.length = parseInt(this.pagination.totalRows % this.pagination.itemsPerPage) === 0 ? pageLength : pageLength + 1
        },
        error => {
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
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.fnc_getScreenCategoryStatiaticsMinorList()
    },
    // 취소버튼
    closeBtn: function () {
      this.$emit('popupAction', 'screenMinorPopup')
    },
    confirmBtn: function () {
      this.$emit('popupAction', 'screenMinorPopup', this.selected)
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    },
    popupAction: function (type, obj) {
      this.popup[`${type}`] = !this.popup[`${type}`]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
