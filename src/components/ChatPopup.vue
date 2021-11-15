
<template>
  <div :id="`${'chatpopup_' + chat.callId}`">
    <chat-popup-cust v-if="custVisible === true" :call="call" :chat="chat" :counselor="counselor" @closecust="closecust" />
    <chat-popup-iframe v-if="iframeVisible === true" :url="url" :call="call" :chat="chat" :counselor="counselor" @closeiframe="closeiframe" />
    <chat-popup-hist :call.sync="call" :chat="chat" :counselor="counselor" @closechat="closechat" @opencust="opencust" @openiframe="openiframe" />
  </div>
</template>

<script>
import ChatPopupHist from '@/components/ChatPopupHist'
import ChatPopupCust from '@/components/ChatPopupCust'
import ChatPopupIframe from '@/components/ChatPopupIframe'

export default {
  name: 'ChatPopup',
  components: {
    ChatPopupHist,
    ChatPopupCust,
    ChatPopupIframe
  },
  props: {
    chat: Object,
    counselor: Object
  },
  computed: {
  },
  data () {
    return {
      call: {},
      custVisible: false,
      url: '',
      iframeVisible: false
    }
  },
  watch: {
  },
  updated () {
  },
  methods: {
    closechat (chat) {
      this.$emit('closechat', chat)
    },
    opencust (call) {
      this.call = call
      this.custVisible = true
    },
    closecust () {
      this.custVisible = false
    },
    openiframe (url) {
      // console.log(url)
      this.url = url
      this.iframeVisible = true
    },
    closeiframe () {
      this.iframeVisible = false
    }
  },
  created () {
  },
  mounted () {
  },
  destroyed () {
  }
}
</script>

<style lang="scss">
</style>
