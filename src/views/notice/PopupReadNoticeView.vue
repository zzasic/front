<template>
<div class="customoverlay">
  <v-overlay></v-overlay>
  <!-- <div class="admin system-popup-status">
    <div class="process">
      <div class="v-dialog"> -->
        <!-- 팝업 컨텐츠 -->
        <v-card class="dialogNoticeView">
          <v-card-title>
            <v-btn
              text
              class="default btn-historyback"
              :ripple="false"
              @click="listBtn"
            >
              <span class="hide">back</span>
            </v-btn>
            <span class="headline">공지사항 상세</span>
          </v-card-title>
          <v-card-text>
            <h2>
              <span class="notice-title">{{notice.title}}</span>
              <span class="date">{{notice.boardStartDate}}~{{notice.boardEndDate}}</span>
            </h2>
            <vuescroll>
              <v-container>
                <v-row>
                  <v-col v-if="isHtml(notice.contents)" v-html="notice.contents">
                  </v-col>
                  <v-col v-else v-html="`<pre>${notice.contents}</pre>`">
                  </v-col>
                </v-row>
              </v-container>
            </vuescroll>
          </v-card-text>
          <v-card-actions class="submit-btns-group">
            <!-- <v-icon
              large
              :disabled="noticeIdx === 0"
              @click="prev"
            >
              mdi-chevron-left
            </v-icon>
            <v-spacer></v-spacer>
            <v-icon
              large
              :disabled="noticeIdx === (noticeList.length - 1)"
              @click="next"
            >
              mdi-chevron-right
            </v-icon> -->
            <v-spacer></v-spacer>
            <v-btn
              text
              class="btn-secondary"
              :disabled="noticeIdx === 0"
              @click="prev"
            >이전</v-btn>
            <v-btn
              text
              class="btn-primary"
              :disabled="noticeIdx === (noticeList.length - 1)"
              @click="next"
            >다음</v-btn>
          </v-card-actions>
          <v-btn
            class="default dialogclose"
            text
            @click.stop="closeBtn"
            :ripple="false"
          >
            <span class="hide">팝업 닫기</span>
          </v-btn>
        </v-card> <!-- 팝업 컨텐츠 끝 -->
      <!-- </div>
    </div>
  </div> -->
</div>
</template>

<script>
import { currentNotice } from '@/api/notice'

export default {
  name: 'PopupReadNoticeView',
  props: {
    pnIdx: Number,
    noticeList: Array
  },
  components: {
  },
  computed: {
    notice: function () {
      if (this.noticeList && this.noticeList.length) {
        this.currentNotice(this.noticeList[this.noticeIdx].noticeId)
        return this.noticeList[this.noticeIdx]
      } else {
        return { title: '', contents: '' }
      }
    }
  },
  data () {
    return {
      noticeIdx: -1
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init: function () {
      this.noticeIdx = this.pnIdx
    },
    prev: function () {
      if (this.noticeIdx > 0) {
        this.noticeIdx = this.noticeIdx - 1
      }
    },
    next: function () {
      if (this.noticeIdx < (this.noticeList.length - 1)) {
        this.noticeIdx = this.noticeIdx + 1
      }
    },
    isHtml: function (v) {
      return /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/.test(v)
    },
    listBtn: function () {
      this.$emit('popupAction', {
        listNoticeView: true,
        readNoticeView: false,
        pnIdx: null,
        noticeList: []
      })
    },
    currentNotice: function (noticeId) {
      currentNotice(noticeId)
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
html, body {
  overflow: auto !important;
}
html, body, .v-application, .admin {
  min-width: auto !important;
}
h2 {
  font-size: 16px !important;
  line-height: 1.2 !important;
  color: #424952 !important;
  letter-spacing: -0.2px;
  background: url('~@/assets/image/ic_noti.png') left top 2px no-repeat;
  border-bottom: 1px solid #E9EFF5;
  padding-left: 22px !important;
  padding-bottom: 24px;
  > .notice-title {
    display: inline-block;
    max-width: 540px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.container {
  font-weight: normal;
  font-size: 13px;
  line-height: 22px;
  color: #56606B;
}
.btn-historyback {
  background: url('~@/assets/image/ic_history_back.png') center center no-repeat;
  width: 16px;
  height: 16px !important;
  min-width: 16px !important;
  margin-right: 4px;
  margin-top: 0;
  margin-left: -5px;
}
.dialogNoticeView {
    z-index: 10;
    width: 840px;
    left: calc(100% - 845px);
    top: 5px;
    .__vuescroll.hasHBar {
      -ms-overflow-style: none;
    }
    .v-card__text {
      min-height: 462px;
      max-height: 462px;
      .date {
        float: right;
        font-size: 11px;
        font-weight: 400;
        color: #8996A3;
        font-family: "Spoqa Han Sans" !important;
        text-align: right;
        width: 200px;
      }
      .container {
        padding: 20px 5px;
        max-width: 780px !important;
        max-height: 470px;
        pre {
          font-family: 'Noto Sans KR', 'Spoqa Han Sans', '맑은 고딕', 'Malgun Gothic' !important;
          overflow: hidden;
          width: 770px;
        }
      }
    }
}
</style>
