
<template>
  <v-card @keydown.esc="abc">
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
                <tr @click="detailRow(props.item), selected = props.item.meteringId">
                  <td class="text-center">{{ props.item.meteringDate ? $moment.parseZone(props.item.meteringDate).format('MM-DD') : '' }}</td>
                  <td class="text-center">{{ props.item.chatbotCount }}</td>
                </tr>
              </template>
            </v-data-table>
          </vuescroll>
        </v-card>
        <div class="pagination-group">
          <v-pagination
            v-model="pagination.page"
            :page="pagination.page"
            :length="pagination.length"
            @input="getChatbotHistoryList"
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
import { getChatbotHistoryList } from '../../api/usage'
export default {
  name: 'PopupChatbotHistoryView',
  props: {
    popup: Object
  },
  components: {
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
          this.getChatbotHistoryList()
        }
      }
    }
  },
  watch: {
  },
  data () {
    return {
      // 페이지 타이틀과 디스크립션
      pageTitle: '챗봇 일별 서비스 사용량',
      pageDescription: '챗봇 일별 서비스 사용량',
      // 테이블  데이터
      headers: [
        { text: '사용일', value: 'meteringDate', align: 'center', class: 'text-center', width: '120px' },
        { text: '사용량', value: 'chatbotCount', align: 'center', class: 'text-center', width: '250px' },
        { text: '상세', value: 'buttonhere', align: 'center', class: 'text-center', width: '80px', sortable: false }
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
      await this.getChatbotHistoryList()
    },
    // 이력 조회
    getChatbotHistoryList: function () {
      // param setting
      const searchCondition = {
        page: this.pagination.page,
        sortBy: this.options.sortBy && this.options.sortBy.length ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc && this.options.sortDesc.length ? this.options.sortDesc[0] === false ? 'DESC' : 'ASC' : '',
        itemsPerPage: this.pagination.itemsPerPage,
        type: this.popup.type,
        tenantId: this.popup.tenantId,
        meteringDate: this.popup.meteringDate,
        startMonth: this.popup.startMonth,
        endMonth: this.popup.endMonth
      }
      // retrieve
      this.pagination.loading = true
      getChatbotHistoryList(searchCondition).then(
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
    // 취소버튼
    cancelBtn: function () {
      this.$emit('update:popup', {
        type: null,
        tenantId: null,
        meteringDate: null,
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
