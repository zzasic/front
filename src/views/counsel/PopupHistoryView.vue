<template>
  <div>
      <inbound-history-popup v-if="chat.callType === 'IN'" :chat="chat" :counselor="chat.counselor" @resizePopup="resizePopup" @clickClose="clickClose" />
      <outbound-history-popup v-else-if="chat.callType === 'OUT'" :chat="chat" :counselor="chat.counselor" @resizePopup="resizePopup" @clickClose="clickClose" />
      <systemCall-history-popup v-else-if="chat.callType === 'SYS'" :chat="chat" :counselor="chat.counselor" @resizePopup="resizePopup" @clickClose="clickClose"  />
  </div>
</template>

<script>
import { getCallInfo } from '@/api/counsel'
import InboundHistoryPopup from '@/components/InboundHistoryPopup'
import OutboundHistoryPopup from '@/components/OutboundHistoryPopup'
import SystemCallHistoryPopup from '@/components/SystemCallHistoryPopup'

export default {
  name: 'PopupHistoryView',
  components: {
    InboundHistoryPopup,
    OutboundHistoryPopup,
    SystemCallHistoryPopup
  },
  data () {
    return {
      callId: this.$route.params.callId,
      chat: {}
    }
  },
  created () {
    this.getCallInfo()
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    resizePopup (resize) {
      // console.log(resize)
      window.resizeTo(Number(resize.width.replace(/px$/, '')) + 14, Number(resize.height.replace(/px$/, '')) + 74)
    },
    clickClose () {
      window.close()
    },
    getCallInfo () {
      alert(this.callId)
      alert(this.chatId)
      getCallInfo(this.callId).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            this.chat = response.data.result
            if (this.chat.callType) {
              this.chat.systempopup = true
            }
          }
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
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
