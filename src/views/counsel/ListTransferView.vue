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
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenant"
              :items="cptdItemsTenantList"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenant ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.chatbot"
              :items="cptdItemsChatbotList"
              label="챗봇"
              :placeholder="searchForm.chatbot ? undefined : $t('label.choice')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.category"
              :items="cptdItemsCategoryList"
              label="카테고리"
              :placeholder="searchForm.category ? undefined : $t('label.choice')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.scenario"
              :items="cptdItemsScenarioList"
              label="시나리오"
              :placeholder="searchForm.scenario ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-menu
              content-class="date-picker"
              ref="pickerMenu"
              v-model="pickerMenu"
              :return-value.sync="searchForm.dates"
              :close-on-content-click="false"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="default text-field-date pr-0"
                  v-model='dateRangeText'
                  label="검색기간"
                  placeholder="YYYY.MM.DD - YYYY.MM.DD"
                  v-on="on"
                  readonly
                  clearable
                  @click="clickPicker"
                >
                </v-text-field>
              </template>
              <div @click="clickPicker">
                <v-date-picker
                  v-model="searchForm.dates"
                  range
                  no-title
                  scrollable
                  :event-color="
                    date =>
                      date == searchForm.dates[0]
                        ? ['startDate']
                        : date == searchForm.dates[1]
                        ? ['endDate']
                        : ''
                  "
                  :events="searchForm.dates"
                  :date-format="date => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(searchForm.dates)">{{ $t('button.confirm')}}</v-btn>
                </v-date-picker>
              </div>
            </v-menu>
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
          :headers="transferViewHeaders"
          :items="transferList"
          :server-items-length="pagination.totalRows"
          :options.sync="optionSync"
          :loading="pagination.loading"
          hide-default-footer
          :no-data-text="$t('message.noData')"
          :loading-text="$t('message.loading')"
        >
          <template v-slot:item="props">
            <tr @click="detailRow(props.item), selected = props.item.callId">
              <td class="text-center">{{ props.item.tenantNm }}</td>
              <td class="text-center">{{ props.item.startDt ? $moment(props.item.startDt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('MM-DD HH:mm:ss') : '' }}</td>
              <td class="text-center">{{ props.item.categoryNm }}</td>
              <td class="text-left">{{ props.item.scenarioNm }}</td>
              <td class="text-left">{{ props.item.nodeNm }}</td>
              <td class="text-left">{{ props.item.sourceContents}}</td>
              <td class="text-center"><v-btn @click="detailRow(props.item)" text class="default" color="btn-secondary" >{{ $t('button.detail')}}</v-btn></td>
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
          @input="getTransferList"
          :total-visible="10"
        ></v-pagination>
      </div>
      <div class="btn-group align-right">
        <v-btn class="btn-naked-primary ml-1" text :ripple="false" @click="excelDown">엑셀 다운로드</v-btn>
      </div>
    </vuescroll>
    <div v-for="chat in chats" :key="chat.chatId">
      <inbound-history-popup v-if="chat.visible === true" :chat="chat" :counselor="chat.counselor" @clickClose="chat.visible = false" />
    </div>
  </div>
</template>

<script>
import InboundHistoryPopup from '@/components/InboundHistoryPopup'
import {
  getTransferSearchCondition,
  getTransferList,
  reqExcelDownTransferList
} from '../../api/counsel'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'ListTransferView',
  components: {
    InboundHistoryPopup
  },
  mixins: [datepicker],
  created () {
  },
  mounted () {
    this.initTransferView()
  },
  data () {
    return {
      transferViewHeaders: [
        { text: '테넌트', value: 'tenantNm', align: 'center', width: '120px' },
        { text: '통화일시', value: 'startDt', align: 'center', width: '120px' },
        { text: '카테고리', value: 'categoryNm', align: 'center', width: '200px' },
        { text: '시나리오', value: 'scenarioNm', align: 'center', width: '200px' },
        { text: '대화단계', value: 'nodeNm', align: 'center', width: '200px' },
        { text: '고객발화', value: 'sourceContents', align: 'center' },
        { text: '대화이력', value: 'buttonhere', align: 'center', width: '80px', sortable: false }
      ],
      transferList: [],
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
      tenants: [],
      callTypes: [],
      searchForm: {
        itemsTenantList: [],
        tenant: '',
        itemsChatbotList: [],
        chatbot: '',
        itemsCategoryList: [],
        category: '',
        itemsScenarioList: [],
        scenario: '',
        custNum: '',
        callType: '',
        dates: [this.$moment().add(-1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      },
      chats: []
    }
  },

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsTenantList () {
      const tenantList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      tenantList.push(...this.searchForm.itemsTenantList)
      return tenantList
    },
    cptdItemsChatbotList () {
      const chatbotList = [
        {
          text: this.$t('label.choice'),
          value: ''
        }
      ]
      // chatbotList.push(...this.searchForm.itemsChatbotList.filter(s => s.opt1 === this.searchForm.tenant))
      chatbotList.push(...this.searchForm.itemsChatbotList)
      return chatbotList
    },
    cptdItemsCategoryList () {
      const categoryList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      categoryList.push(...this.searchForm.itemsCategoryList.filter(s => s.opt2 === (this.searchForm.chatbot || s.opt2)))
      // categoryList.push(...this.searchForm.itemsCategoryList.filter(s => s.opt4 === (this.searchForm.tenant || s.opt4) && s.opt2 === (this.searchForm.chatbot || s.opt2)))
      return categoryList
    },
    cptdItemsScenarioList () {
      const scenarioList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      // scenarioList.push(...this.searchForm.itemsScenarioList.filter(s => s.opt1 === (this.searchForm.tenant || s.opt1) && s.opt2 === (this.searchForm.chatbot || s.opt2)))
      scenarioList.push(...this.searchForm.itemsScenarioList.filter(s => s.opt2 === (this.searchForm.chatbot || s.opt2)))
      return scenarioList
    },
    cptdItemsCallTypeList () {
      const callTypeList = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      callTypeList.push(...this.callTypes)
      return callTypeList
    },
    dateRangeText: {
      get: function () {
        const dateRange = this.searchForm.dates
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
        return dateRange.join(' ~ ')
      },
      set: function (value) {
        if (!value) {
          this.searchForm.dates = []
        }
      }
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getTransferList()
        }
      }
    }
  },

  watch: {
  },

  methods: {
    async initTransferView () {
      await this.getTransferSearchCondition()
      this.getTransferList()
    },
    getTransferSearchCondition: function () {
      getTransferSearchCondition().then(
        response => {
          this.searchForm.itemsTenantList = response.data.result.tenantList
          this.searchForm.itemsChatbotList = response.data.result.chatbotList
          this.searchForm.itemsScenarioList = response.data.result.scenarioList
          this.searchForm.itemsCategoryList = response.data.result.scenarioCategoryList
          this.callTypes = response.data.result.callTypeList
        }
      )
    },
    // 검색버튼
    searchBtn: function () {
      this.pagination.page = 1
      this.getTransferList()
    },
    getTransferList: function () {
      /* datepicker open */
      if (this.pickerMenu === true) {
        this.$refs.pickerMenu.save(this.searchForm.dates)
      }
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        custNum: this.searchForm.custNum,
        tenantId: this.searchForm.tenant,
        chatbotId: this.searchForm.chatbot,
        categoryId: this.searchForm.category,
        scenarioId: this.searchForm.scenario,
        callType: this.searchForm.callType,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      this.pagination.loading = true
      getTransferList(searchCondition).then(
        response => {
          this.transferList = response.data.result.transferList ? response.data.result.transferList : []
          // paging setting
          this.pagination.totalRows = response.data.result.transferListCount
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
    // 상세버튼
    detailRow: function (inboundCall) {
      const chat = {
        callId: inboundCall.callId,
        extension: inboundCall.extension,
        counselor: {
          tenantNm: inboundCall.tenantNm,
          extension: inboundCall.extension
        },
        visible: true
      }
      let idx = -1
      if ((idx = this.chats.findIndex(ct => ct.callId === chat.callId)) > -1) {
        this.chats.splice(idx, 1, chat)
      } else {
        this.chats.push(chat)
      }
    },
    excelDown: function () {
      const dateRange = this.searchForm.dates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy[0] ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc[0] === false ? 'DESC' : 'ASC',
        itemsPerPage: this.pagination.itemsPerPage,
        custNum: this.searchForm.custNum,
        tenantId: this.searchForm.tenant,
        chatbotId: this.searchForm.chatbot,
        categoryId: this.searchForm.category,
        scenarioId: this.searchForm.scenario,
        callType: this.searchForm.callType,
        startDate: dateRange && dateRange.length > 0 ? dateRange[0] : '',
        endDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : ''
      }
      reqExcelDownTransferList(searchCondition).then(response => {
        const filename = this.$moment().format('YYYY-MM-DD') + '_I/B_호전환_현황.xlsx'

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
