
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
                  <td class="text-center">{{ props.item.startDt ? $moment(props.item.startDt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('MM-DD HH:mm:ss') : '' }}</td>
                  <td class="text-center">{{ props.item.categoryNm }}</td>
                  <td class="text-left">{{ props.item.scenarioNm }}</td>
                  <td class="text-left">{{ props.item.nodeNm }}</td>
                  <td class="text-left">{{ props.item.sourceContents}}</td>
                  <td class="text-center"><v-btn @click="detailRow(props.item)" text class="default" color="btn-secondary" >{{ $t('button.detail')}}</v-btn></td>
                </tr>
              </template>
            </v-data-table>
          </vuescroll>
          <div v-for="chat in chats" :key="chat.chatId">
            <inbound-history-popup v-if="chat.visible === true" :chat="chat" :counselor="chat.counselor" @clickClose="chat.visible = false" />
          </div>
        </v-card>
        <div class="pagination-group">
          <v-pagination
            v-model="pagination.page"
            :page="pagination.page"
            :length="pagination.length"
            @input="getInboundTransferList"
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
import { getInboundTransferList } from '../../api/statistics'
export default {
  name: 'PopupTransferHistoryView',
  props: {
    popup: Object
  },
  components: {
    InboundHistoryPopup
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
          this.getInboundTransferList()
        }
      }
    }
  },
  watch: {
  },
  data () {
    return {
      // 페이지 타이틀과 디스크립션
      pageTitle: '호전환 이력',
      pageDescription: '호전환 대화이력',
      // 테이블  데이터
      headers: [
        { text: '고객전화번호', value: 'custNum', align: 'center', width: '120px' },
        { text: '통화시작일시', value: 'startDt', align: 'center', width: '120px' },
        { text: '카테고리', value: 'categoryNm', align: 'center', width: '200px' },
        { text: '시나리오', value: 'scenarioNm', align: 'center', width: '200px' },
        { text: '대화단계', value: 'nodeNm', align: 'left', class: 'text-center', width: '150px' },
        { text: '고객발화', value: 'sourceContents', align: 'center' },
        { text: '대화이력', value: 'buttonhere', align: 'center', width: '80px', sortable: false }
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
      await this.getInboundTransferList()
    },
    // 이력 조회
    getInboundTransferList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy && this.options.sortBy.length ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc && this.options.sortDesc.length ? this.options.sortDesc[0] === false ? 'DESC' : 'ASC' : '',
        itemsPerPage: this.pagination.itemsPerPage,
        type: this.popup.type,
        tenantId: this.popup.tenantId,
        callDate: this.popup.callDate,
        timeType: this.popup.timeType,
        startMonth: this.popup.startMonth,
        endMonth: this.popup.endMonth
      }

      // retrieve
      this.pagination.loading = true
      getInboundTransferList(searchCondition).then(
        response => {
          // 조회결과
          this.result = response.data.result.transferList ? response.data.result.transferList : []
          // paging setting
          this.pagination.totalRows = response.data.result.transferListCount
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
    // 취소버튼
    cancelBtn: function () {
      this.$emit('update:popup', {
        type: null,
        tenantId: null,
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
  .v-card__text {
      padding: 0 30px 20px;
      > .__vuescroll.hasVBar {
        width: calc(100% + 28px) !important;
        > .__panel > .__view > {
          .v-form, .row, div {
            width: calc(100% - 28px) !important;
          }
        }
      }
      .data-grid-wrap.default {
        margin-bottom: 0;
        .v-data-table--fixed-header .v-data-table__wrapper {
          min-height: inherit;
          max-height: 490px;
          overflow: unset;
          table {
            border-color: #A5B3C2;
            tbody {
              tr {
                &.v-data-table__empty-wrapper {
                  td {
                    height: 250px;
                    border-bottom: 0 !important;
                    &:hover {
                      background-color: #fff;
                    }
                  }
                }
              }
            }
          }
        }
        > .__vuescroll.hasVBar {
          width: 100% !important;
          > .__panel > .__view > .v-data-table {
            width: 100% !important;
          }
          >.__rail-is-vertical {
            right: 3px !important;
          }
        }
      }
      .v-input--radio-group.v-input--radio-group--row {
        .v-input__slot {
          margin-bottom: 0;
        }
        .v-radio {
          margin-right: 100px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
</style>
