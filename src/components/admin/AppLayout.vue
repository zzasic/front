<template>
  <div class="admin">
    <Header @toggle-menu="toggleSidebar" />
    <LNB @toggle-menu="toggleSidebar" />
    <transition>
      <keep-alive>
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </transition>
    <div v-for="chat in getchats" :key="chat.chatId">
      <ChatPopup v-if="chat.visible === true" :chat="chat" :counselor="chat.counselor" @closechat="closechat" />
    </div>
    <v-dialog
      v-model="popup.noticeDialog"
      persistent
      max-width="840"
      scrollable
      >
        <SPopupReadNoticeView
          @popupAction="popupNoticeAction"
          v-if="popup.noticeDialog === true" />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPopupNoticeList } from '@/api/notice'
import SPopupReadNoticeView from '@/views/notice/SPopupReadNoticeView'

export default {
  name: 'AppLayout',
  components: {
    SPopupReadNoticeView
  },
  data () {
    return {
      opened: true,
      popup: {
        noticeDialog: false
      }
    }
  },
  created () {
    // console.log('App Layout created...')
    this.$store.dispatch('CREATE')
    if (this.$route.params.home === true) {
      // console.log('gohome')
      this.getPopupNoticeList()
      this.$route.params.home = false
    }
  },
  mounted () {
    // console.log('App Layout mounted...')
  },
  beforeUpdate () {
    // console.log('App Layout beforeUpdate...')
  },
  updated () {
    if (this.$route.params.home === true) {
      // console.log('gohome')
      this.getPopupNoticeList()
      this.$route.params.home = false
    }
    // console.log('App Layout updated...')
  },
  destroyed () {
    // console.log('App Layout destroyed....')
    // this.getclient.deactivate()
    // console.log(this.getsubs)
    // console.log(this.getclient)
    this.$store.dispatch('DESTORY')
    // console.log(this.getsubs)
    // console.log(this.getclient)
  },
  methods: {
    toggleSidebar (opened) {
      this.opened = opened
    },
    closechat (chat) {
      this.$nextTick(() => {
        this.$store.commit('REM_CHAT', chat)
      })
    },
    getPopupNoticeList () {
      getPopupNoticeList().then(response => {
        if (response.data.result.popupNoticeListCount && response.data.result.popupNoticeList && response.data.result.popupNoticeList.length > 0) {
          const popupNoticeList = response.data.result.popupNoticeList
          // 오늘하루 열지않음.
          if (popupNoticeList.filter((p) => { return !this.$cookies.isKey(p.noticeId) }).length > 0) {
            this.popup.noticeDialog = true
          }
        }
      })
    },
    popupNoticeAction: function (popup) {
      this.popup = Object.assign({}, this.popup, popup)
    }
  },
  computed: {
    ...mapGetters([
      'isLoading'
    ]),
    getchats: function () {
      // console.log('..............', this.$store.getters.getchats)
      return this.$store.getters.getchats
    }
  }
}
</script>
