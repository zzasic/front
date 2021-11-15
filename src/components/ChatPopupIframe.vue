
<template>
  <!-- 1. 상담이력에서는[monitor] class 삭제해주세요.  -->
  <div
    ref="vue-window-modal"
    class="vue-window-modal monitor iframe"
    :class="counselor.callYn === 'Y' && counselor.callId === chat.callId ? 'on' : 'fail'"
    :style="{ width, height }"
    @click="focusPopup()">
    <div
      ref="vue-window-modal-header"
      class="vue-window-modal-header">
      <h2>
        검색({{ `${call.custNum ? call.custNum.replace(/-/g, '').replace(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/, '$1****$3') : ''}` }})
      </h2>
      <button class="close" @mousedown="closeModalPopupBefore($event)" @mouseup="closeModalPopupBefore($event)" @click="closeModalPopup($event)"></button>
    </div>
    <div
      ref="vue-window-modal-body"
      class="vue-window-modal-body"
      :style="{ width: '100%' }">
      <iframe width="100%" height="100%" :src="url"></iframe>
    </div>
  </div>
</template>

<script>
import chatpopup from '@/scripts/chatpopup'

export default {
  name: 'ChatPopupIframe',
  mixins: [chatpopup],
  data () {
    return {
      height: '600px'
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
      this.$emit('closeiframe')
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

<style lang="scss" scoped>
  @import '@/assets/style/chatpopup.scss';
  .vue-window-modal.iframe {
    &.monitor {
      .vue-window-modal-body {
        height: calc(100% - 40px);
      }
    }
    .vue-window-modal-body {
      padding: 0px;
    }
  }
</style>
