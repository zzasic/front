
<template>
  <v-card @keydown.esc="abc" class="dialogListContract">
      <v-card-title>
        <span class="headline" >{{ pageTitle }}</span>
      </v-card-title>
      <v-card-text>
        <PageSectionTitle
          :title="pagination.sectionTitle"
          :totalRows="pagination.totalRows"
          :subtitle="pagination.sectionSubTitle"
        >
        </PageSectionTitle>
        <v-card class="data-grid-wrap default clickable">
          <vuescroll>
            <v-data-table
              :headers="headers"
              :fixed-header="true"
              :items="result"
              :server-items-length="pagination.totalRows"
              :options.sync="optionSync"
              :loading="pagination.loading"
              hide-default-footer
              :no-data-text="$t('message.noData')"
              :loading-text="$t('message.loading')"
            >
              <template v-slot:item="props">
                <tr @click="detailRow(props.item), selected = props.item.callId">
                  <td class="text-center">{{ props.item.custNum.replace(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/, '$1****$3') }}</td>
                  <td class="text-center">{{ props.item.startDt ? $moment.parseZone(props.item.startDt).format('MM-DD HH:mm:ss') : '' }}</td>
                  <td class="text-center">{{ props.item.timeDiff }}</td>
                  <td class="text-left">{{ props.item.campaignNm }}</td>
                  <td class="text-left">{{ props.item.scenarioNm }}</td>
                  <td class="text-center">{{ props.item.isSpeech == 1 ? 'Y' : 'N' }}</td>
                  <td class="text-center">{{ props.item.abnormalCount == 0 ? '-' : 'Y' }}</td>
                  <td class="text-center">{{ props.item.isTransfer == 1 ? 'Y' : '-' }}</td>
                  <td class="text-center"><v-btn @click="detailRow(props.item)" text class="default" color="btn-secondary" >{{ $t('button.detail')}}</v-btn></td>
                </tr>
              </template>
            </v-data-table>
          </vuescroll>
          <div v-for="chat in chats" :key="chat.chatId">
            <inbound-history-popup v-if="chat.visible === true && chat.callType === 'IN'" :chat="chat" :counselor="chat.counselor" @clickClose="chat.visible = false" />
            <outbound-history-popup v-if="chat.visible === true && chat.callType === 'OUT'" :chat="chat" :counselor="chat.counselor" @clickClose="chat.visible = false" />
          </div>
        </v-card>
        <div class="pagination-group">
          <v-pagination
            v-model="pagination.page"
            :page="pagination.page"
            :length="pagination.length"
            @input="getScenarioStartFailList"
            :total-visible="10"
          ></v-pagination>
        </div>
        <div class="btn-group align-right">
          <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel')}}</v-btn>
        </div>
      </v-card-text>
      <v-btn
      class="default dialogclose"
      text
      @click.stop="cancelBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import InboundHistoryPopup from '@/components/InboundHistoryPopup'
import OutboundHistoryPopup from '@/components/OutboundHistoryPopup'
import { getScenarioStartFailList } from '../../api/statistics'
export default {
  name: 'PopupScenarioStartFailHistoryView',
  props: {
    popup: Object
  },
  components: {
    InboundHistoryPopup,
    OutboundHistoryPopup
  },
  created () {
    // this.init()
  },
  mounted () {
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
          this.getScenarioStartFailList()
        }
      }
    }
  },
  watch: {
  },
  data () {
    return {
      // 페이지 타이틀과 디스크립션
      pageTitle: '단선 이력',
      pageDescription: '단선 대화이력',
      // 테이블  데이터
      headers: [
        { text: '고객전화번호', value: 'custNum', align: 'center', class: 'text-center', width: '120px' },
        { text: '통화시작일시', value: 'startDt', align: 'center', class: 'text-center', width: '120px' },
        { text: '통화시간', value: 'timeDiff', align: 'center', class: 'text-center', width: '90px' },
        { text: '켐페인', value: 'campaignNm', align: 'left', class: 'text-center', width: '200px' },
        { text: '시나리오', value: 'scenarioNm', align: 'left', class: 'text-center', width: '200px' },
        { text: '고객발화', value: 'isSpeech', align: 'left', class: 'text-center', width: '80px' },
        { text: '이상감지', value: 'abnormalCount', align: 'center', class: 'text-center', width: '80px' },
        { text: '호전환', value: 'isTransfer', align: 'center', class: 'text-center', width: '80px' },
        { text: '대화이력', value: 'buttonhere', align: 'center', class: 'text-center', width: '80px', sortable: false }
      ],
      result: [],
      // 페이지 네이션 설정
      pagination: {
        page: 1, // 현재페이지
        length: 1, // 페이징숫자 갯수
        itemsPerPage: 10, // table row view 갯수
        itemsPerPages: ['10', '20', '30'], // 왼쪽하단 selectbox
        totalRows: 0,
        sectionTitle: this.$t('label.totalCnt'),
        sectionSubTitle: '',
        loading: false,
        options: {}
      },
      options: {},
      chats: []
    }
  },
  methods: {
    init: async function () {
      await this.getScenarioStartFailList()
    },
    // 이력 조회
    getScenarioStartFailList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy && this.options.sortBy.length ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc && this.options.sortDesc.length ? this.options.sortDesc[0] === false ? 'DESC' : 'ASC' : '',
        itemsPerPage: this.pagination.itemsPerPage,
        type: this.popup.type,
        scenarioId: this.popup.scenarioId,
        callDate: this.popup.callDate,
        timeType: this.popup.timeType,
        startMonth: this.popup.startMonth,
        endMonth: this.popup.endMonth
      }
      // retrieve
      this.pagination.loading = true
      getScenarioStartFailList(searchCondition).then(
        response => {
          // 조회결과
          this.result = response.data.result.inboundCallList ? response.data.result.inboundCallList : []
          // paging setting
          this.pagination.totalRows = response.data.result.inboundCallListCount
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
    // 상세버튼
    detailRow: function (inboundCall) {
      const chat = {
        callId: inboundCall.callId,
        extension: inboundCall.extension,
        callType: inboundCall.callType,
        counselor: {
          callYn: inboundCall.commYn,
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
    // 취소버튼
    cancelBtn: function () {
      this.$emit('update:popup', {
        type: null,
        scenarioId: null,
        callDate: null,
        timeType: null,
        startMonth: null,
        endMonth: null
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .dialogListContract {
      > .v-card__text {
        padding-bottom: 12px !important;
        @media only screen and (max-height:819px){
          height: 600px !important;
        }
        .data-grid-wrap {
          .v-data-table--fixed-header .v-data-table__wrapper {
            max-height: 450px;
          }
        }
      }
      > .v-card__actions.submit-btns-group {
        .btn-group {
          width: 180px;
        }
      }
    }
</style>
