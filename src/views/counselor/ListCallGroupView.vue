<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-text-field
              class="default search"
              v-model="searchForm.callGroupNo"
              label="Call Group No."
              placeholder=" "
              hide-details
              clearable
              v-on:keyup.enter="searchBtn"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.callType"
              :items="cptdItemsCallTypeList"
              :label="$t('label.callType')"
              :placeholder="searchForm.callType ? undefined : $t('label.all')"
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
          :headers="headers"
          :items="results"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr @click="gridRowClick(props.item), selected = props.item.callGroupId">
              <td class="text-center">{{ props.item.nodeNumberNm }}</td>
              <td class="text-center">{{ props.item.callGroupId }}</td>
              <td class="text-center">{{ props.item.callGroupNo }}</td>
              <td class="text-center">{{ props.item.callType === 'IN' ? '인바운드' : '아웃바운드' }}</td>
              <td class="text-center">{{ props.item.startExtension }}</td>
              <td class="text-center">{{ props.item.endExtension }}</td>
              <td class="text-left">{{ props.item.groupDesc }}</td>
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
          @input="getCallGroupList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click.stop="newBtn">{{ $t('button.new')}}</v-btn>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        :max-width="popup.batchView ? 1024 : 600"
        scrollable
        >
        <PopupCreateCallGroupView
          @popupAction="popupAction"
          v-if="popup.createView === true" />
        <PopupUpdateCallGroupView
          @popupAction="popupAction"
          :callGroupId="popup.callGroupId"
          v-if="popup.updateView === true && popup.callGroupId" />
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import {
  getCallGroupSearchCondition,
  getCallGroupList
} from '../../api/counselor'

import PopupCreateCallGroupView from '@/views/counselor/PopupCreateCallGroupView'
import PopupUpdateCallGroupView from '@/views/counselor/PopupUpdateCallGroupView'

export default {

  name: 'ListCallGroupView',

  components: {
    PopupCreateCallGroupView,
    PopupUpdateCallGroupView
  },

  created () {
    this.getCallGroupSearchCondition()
  },

  mounted () {
    this.getCallGroupList()
  },

  data () {
    return {
      popup: {
        callGroupId: '',
        createView: false,
        readView: false,
        updateView: false
      },
      search: '',
      headers: [
        { text: '노드번호', value: 'nodeNumberNm', align: 'center', width: '150px' },
        { text: 'ID', value: 'callGroupId', align: 'center', width: '120px' },
        { text: 'Call Group No.', value: 'callGroupNo', align: 'center', width: '150px' },
        { text: '통화유형', value: 'callType', align: 'center', width: '120px' },
        { text: '시작 내선번호', value: 'startExtension', align: 'center', width: '150px' },
        { text: '종료 내선번호', value: 'endExtension', align: 'center', width: '150px' },
        { text: '설명', value: 'groupDesc', align: 'center' }
      ],
      results: [],
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
      options: {},
      searchForm: {
        callGroupNo: '',
        itemsCallTypeList: [],
        callType: ''
      }
    }
  },

  watch: {},

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsCallTypeList () {
      const callTypeList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      callTypeList.push(...this.searchForm.itemsCallTypeList)
      return callTypeList
    },
    dialog: function () {
      return (this.popup.createView === true || this.popup.updateView === true)
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getCallGroupList()
        }
      }
    }
  },

  methods: {
    updateOptions (value) {
      if (this.pagination && this.pagination.totalRows > 0) {
        this.getCallGroupList()
      }
    },
    getCallGroupSearchCondition: function () {
      getCallGroupSearchCondition().then(
        response => {
          this.searchForm.itemsCallTypeList = response.data.result.callTypeList
        }
      )
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.getCallGroupList()
    },
    getCallGroupList: function () {
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        callGroupNo: this.searchForm.callGroupNo,
        callType: this.searchForm.callType
      }

      this.pagination.loading = true
      getCallGroupList(searchCondition).then(
        response => {
          this.results = response.data.result.callGroupList ? response.data.result.callGroupList : []
          // paging setting
          this.pagination.totalRows = response.data.result.callGroupListCount
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
      this.popup.createView = false
      this.popup.updateView = true
      this.popup.readView = false
      this.popup.callGroupId = item.callGroupId
    },
    // 신규버튼
    newBtn: function () {
      this.popup.createView = true
      this.popup.updateView = false
      this.popup.readView = false
    },
    popupAction: function (popup) {
      this.popup = popup
      this.getCallGroupList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
