
<template>
  <!-- 1. 상담이력에서는[monitor] class 삭제해주세요.  -->
  <div
    ref="vue-window-modal"
    class="vue-window-modal monitor cust"
    :class="counselor.callYn === 'Y' && counselor.callId === chat.callId ? 'on' : 'fail'"
    :style="{ width, height }"
    @click="focusPopup()">
    <div
      ref="vue-window-modal-header"
      class="vue-window-modal-header">
      <h2>
        최근 통화이력
      </h2>
      <button class="close" @mousedown="closeModalPopupBefore($event)" @mouseup="closeModalPopupBefore($event)" @click="closeModalPopup($event)"></button>
    </div>
    <div
      ref="vue-window-modal-body"
      class="vue-window-modal-body"
      :style="{ width: '100%' }">
      <vuescroll ref='vs'>
        <!-- <v-card class="dialog data-grid-wrap default clickable">
          <v-card-text>
            <PageSectionTitle title="기본정보" />
            <v-container>
              <v-row>
                <v-col cols="2">
                  <span class="label">이름</span>
                </v-col>
                <v-col>
                  <span class="label">{{ custInfo.custNm }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2">
                  <span class="label">계정/ID</span>
                </v-col>
                <v-col>
                  <span class="label">{{ custInfo.custId }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2">
                  <span class="label">연락처</span>
                </v-col>
                <v-col>
                  <span class="label">{{ custInfo.custHp }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2">
                  <span class="label">이메일</span>
                </v-col>
                <v-col>
                  <span class="label">{{ custInfo.custEmail }}</span>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card> -->
        <v-card class="dialog data-grid-wrap default clickable">
          <v-card-text>
            <!-- <PageSectionTitle title="상담이력" /> -->
            <v-data-table
              :headers="headers"
              :items="results"
              :server-items-length="pagination.totalRows"
              :loading="pagination.loading"
              hide-default-footer
              :no-data-text="$t('message.noData')"
              :loading-text="$t('message.loading')"
            >
              <template v-slot:item="props">
                <tr @click="detailRow(props.item), selected = props.item.callId">
                  <td class="text-center">
                    {{ (props.item.startDt ? $moment(props.item.startDt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('MM-DD HH:mm') : '') }}
                  </td>
                  <td class="text-left">{{ props.item.scenarioNm }}</td>
                  <td class="text-center">{{ props.item.abnormalCount == 0 ? '-' : 'Y' }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </vuescroll>
    </div>
    <div v-for="chat in chats" :key="chat.chatId">
      <inbound-history-popup v-if="chat.visible === true" :chat="chat" :counselor="chat.counselor" @clickClose="chat.visible = false" />
    </div>
  </div>
</template>

<script>
import chatpopup from '@/scripts/chatpopup'
import { custInfoView, getUserCallList } from '@/api/counsel'
import InboundHistoryPopup from '@/components/InboundHistoryPopup'

export default {
  name: 'ChatPopupCust',
  mixins: [chatpopup],
  components: {
    InboundHistoryPopup
  },
  data () {
    return {
      height: '600px',
      custInfo: {
      },
      headers: [
        { text: '통화시작일시', value: 'startDt', align: 'center', sortable: false, width: '120px' },
        { text: '시나리오', value: 'scenarioNm', align: 'center', sortable: false },
        { text: '이상감지', value: 'abnormalCount', align: 'center', sortable: false, width: '80px' }
      ],
      results: [],
      chats: [],
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
      options: null
    }
  },
  computed: {
  },
  props: {
  },
  watch: {
  },
  updated () {
  },
  methods: {
    closeModalPopup (e) {
      e.stopPropagation()
      // this.$store.commit('REM_CHAT', this.chat)
      this.$emit('closecust')
    },
    custInfoView () {
      const input = {
        custHp: this.call.custNum
      }
      custInfoView(input).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.custInfo = response.data.result.custInfo
          }
        }
      )
    },
    getUserCallList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: 'startDt',
        sortDesc: 'DESC',
        itemsPerPage: 10,
        custNum: this.call.custNum,
        commYn: 'Y'
      }
      this.pagination.loading = true
      getUserCallList(searchCondition).then(
        response => {
          this.results = response.data.result.inboundCallList ? response.data.result.inboundCallList : []
          // paging setting
          this.pagination.totalRows = response.data.result.inboundCallListCount
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
    }
  },
  created () {
  },
  mounted () {
    this.custInfoView()
    this.getUserCallList()
  },
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/style/chatpopup.scss';
  .vue-window-modal.cust {
    &.monitor {
      .vue-window-modal-body {
        height: calc(100% - 40px);
      }
    }
    .vue-window-modal-body {
      padding: 15px 20px 15px 15px;
    }
  }
</style>
