<template>
<div class="customoverlay">
    <v-overlay></v-overlay>

    <v-card class="dialogNoticeList">
      <v-card-title class="pb-2">
      <span class="headline pb-0">{{ $t('pageInfo.readNotiView')}}</span>
      </v-card-title>
      <v-card-text>
        <v-card class="data-grid-wrap default clickable">
          <v-data-table
            :headers="headers"
            :items="desserts"
            :item-key="`noticeId`"
            :server-items-length="totalRows"
            @click:row="detailNotice"
            hide-default-footer
            hide-default-header
            :no-data-text="'등록 된 공지사항이 없습니다.'"
            :loading-text="$t('message.loading')"
          >
            <template v-slot:item.data="{ item }">
              <v-row>
                <v-col><span class="headline">{{item.title}}</span></v-col>
                <v-col class="text-right date" cols="4">{{item.boardStartDate}}~{{item.boardEndDate}}</v-col>
              </v-row>
              <v-row>
                <v-col class="contens">{{ tagReplace(item.contents) }}</v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-card>
      </v-card-text>
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
import { currentNoticeList } from '@/api/notice'

export default {
  name: 'PopupListNoticeView',
  props: {
  },
  computed: {
  },
  created () {
    this.init()
  },
  mounted () {
  },
  data () {
    return {
      totalRows: 0,
      // 헤더정보
      headers: [
        { text: '', value: 'data', align: 'left' }
      ],
      // 데이터
      desserts: []
    }
  },
  methods: {
    init: function () {
      this.currentNoticeList()
    },
    currentNoticeList: function () {
      currentNoticeList().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            this.desserts = response.data.result.noticeList ? response.data.result.noticeList : []
            // paging setting
            this.totalRows = response.data.result.noticeListCount
            // console.log(this.desserts, this.totalRows)
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    },
    isBlank: function (x) {
      return (!x || x.trim().length === 0)
    },
    // 숫자에 콤마
    comma: function (n) {
      return Number(n).toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
    // tag
    tagReplace: function (s) {
      return s.replace(/(<([^>]+)>)/g, '')
    },
    // 상세
    detailNotice: function (item) {
      let pnIdx = 0
      for (; pnIdx < this.desserts.length; pnIdx++) {
        if (this.desserts[pnIdx].noticeId === item.noticeId) {
          break
        }
      }
      this.$emit('popupAction', {
        listNoticeView: false,
        readNoticeView: true,
        pnIdx: pnIdx,
        noticeList: this.desserts
      })
    },
    // 닫기
    closeBtn: function () {
      this.$emit('popupAction', {
        listNoticeView: false,
        readNoticeView: false,
        pnIdx: null,
        noticeList: []
      })
      // this.$router.push({ name: 'listApiInfoView' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .transaction {
    margin-top: -24px;
  }
  .dialogNoticeList::v-deep {
    z-index: 10;
    width: 840px;
    left: calc(100% - 845px);
    top: 5px;
    .v-card__text {
      min-height: 550px;
      max-height: 550px;
      .data-grid-wrap.default .v-data-table {
        .v-data-table__wrapper  {
          .v-data-table__empty-wrapper {
            cursor: default;
            &:hover {
              background-color: #fff !important;
              border-bottom: 0 !important;
            }
            td {
              height: 550px;
              border-bottom: 0 !important;
              cursor: default;
            }
          }
          table {
            tbody {
              tr {
                &:hover {
                  cursor: pointer;
                  background-color: #F5F8FA !important;
                }
                td {
                  padding: 20px 10px 18px 10px !important;
                  .headline {
                    display: inline-block;
                    max-width: 540px;
                    font-size: 16px !important;
                    line-height: 1.2 !important;
                    font-weight: 700;
                    letter-spacing: -0.2px;
                    color: #424952 !important;
                    background: url('~@/assets/image/ic_noti.png') left center no-repeat;
                    padding-left: 22px !important;
                    font-family: 'Noto Sans KR', 'Spoqa Han Sans', '맑은 고딕', 'Malgun Gothic' !important;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .date {
                    font-family: 'Spoqa Han Sans' !important;
                    font-weight: 400;
                    font-size: 12px;
                    color: #8996A3;
                    max-width: 200px;
                  }
                  .contens {
                    width: 586px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .row {
                    //padding: 12px;
                    margin: 0;
                    &:first-child {
                      //padding-top: 24px;
                      padding-bottom: 0;
                    }
                    &:last-child {
                      padding: 3px 12px 0 24px;
                    }
                    .col {
                      padding: 0;
                    }
                  }
                  .theme--light.v-card {
                    background: none !important;
                    box-shadow: none !important;
                  }
                  .v-card__text {
                    font-weight: 200 !important;
                    font-size: 13px !important;
                    line-height: 13px !important;
                    color: #56606B !important;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    height: 13px;
                    // width: 822px !important;
                    padding-bottom: 34px;
                    padding-left: 22px;
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .data-grid-wrap.default {
    border: none;
    border-radius: 0 !important;
  }
</style>
