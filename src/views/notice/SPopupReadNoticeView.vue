<template>
  <div class="admin system-popup-status">
    <div class="process">
      <div class="v-dialog">
        <!-- 팝업 컨텐츠 -->
        <v-card>
          <v-card-title>
            <span class="headline">공지사항</span>
          </v-card-title>
          <v-card-text>
            <h2>{{popupNotice.title}}</h2>
            <vuescroll>
              <v-container>
                <v-row>
                  <v-col v-if="isHtml(popupNotice.contents)" v-html="popupNotice.contents">
                  </v-col>
                  <v-col v-else v-html="`<pre>${popupNotice.contents}</pre>`">
                  </v-col>
                </v-row>
              </v-container>
            </vuescroll>
          </v-card-text>
          <v-card-actions class="submit-btns-group">
            <v-spacer></v-spacer>
            <label for="showChk">
              <v-checkbox
                id="showChk"
                class="mr-3"
                color="primary"
                v-model="popupNotice.noshow" @change="noshowChange" label="하루동안 다시 보지 않습니다 "
              ></v-checkbox>
            </label>
            <v-btn
              text
              class="btn-secondary"
              :disabled="pnIdx === 0"
              @click="prev"
            >이전</v-btn>
            <v-btn
              text
              color="btn-primary"
              @click.stop="closeBtn"
              v-if="pnIdx === (popupNoticeList.length - 1)"
            >닫기</v-btn>
            <v-btn
              text
              class="btn-primary"
              v-else
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
      </div>
    </div>
  </div>
</template>

<script>
import { getPopupNoticeList, currentNotice } from '@/api/notice'

export default {
  name: 'SPopupReadNoticeView',
  components: {
  },
  computed: {
    popupNotice: function () {
      if (this.popupNoticeList && this.popupNoticeList.length) {
        this.currentNotice(this.popupNoticeList[this.pnIdx].noticeId)
        return this.popupNoticeList[this.pnIdx]
      } else {
        return { title: '', contents: '', noshow: false }
      }
    }
  },
  data () {
    return {
      tabPopupNotice: null,
      popupNoticeList: [],
      pnIdx: 0
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init: async function () {
      await this.getPopupNoticeList()
    },
    getPopupNoticeList: function () {
      getPopupNoticeList().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            if (response.data.result.popupNoticeListCount > 0) {
              const tPopupNoticeList = response.data.result.popupNoticeList

              this.popupNoticeList = tPopupNoticeList.filter((p) => { return !this.$cookies.isKey(p.noticeId) })
            }
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    },
    currentNotice: function (noticeId) {
      currentNotice(noticeId)
    },
    prev: function () {
      if (this.pnIdx > 0) {
        this.pnIdx = this.pnIdx - 1
      }
    },
    next: function () {
      if (this.pnIdx < (this.popupNoticeList.length - 1)) {
        this.pnIdx = this.pnIdx + 1
      }
    },
    isHtml: function (v) {
      return /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/.test(v)
    },
    noshowChange: function () {
      if (this.popupNotice.noshow === true) {
        this.$cookies.set(this.popupNotice.noticeId, 'Y', '1d', '/')
      } else {
        this.$cookies.remove(this.popupNotice.noticeId)
      }
    },
    close: function () {
      window.close()
    },
    // 닫기
    closeBtn: function () {
      this.$emit('popupAction', {
        noticeDialog: false
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
  background: url('~@/assets/image/ic_noti.png') left top 2px no-repeat;
  padding-left: 22px !important;
  border-bottom: 1px solid #E9EFF5;
  padding-bottom: 24px;
}
.container {
  font-weight: normal;
  font-size: 13px;
  line-height: 22px;
  color: #56606B;
  padding: 20px 0;
}
</style>
