
<template>
  <div class="catalog-item" :class="statusClass" @click="chatOn">
    <h4>
      {{ counselorTitle }} <span v-if="isCounselorTask !== 'task'">{{ statusText }}</span>
      <span
        class="icon-d-open">
        <span class="hide">타입</span>
      </span>
    </h4>
    <div class="catalog-item-content">
      <div class="item-circle">
        <i class="icon" :class="statusIconClass"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CounselorStatus',
  props: {
    counselor: Object
  },
  computed: {
    isCounselorTask: function () {
      return !this.counselor || !this.counselor.counselorId ? '' : !this.counselor.taskNm ? '' : 'task'
    },
    counselorTitle: function () {
      return !this.counselor || !this.counselor.counselorId ? '' : !this.counselor.taskNm ? `${this.counselor.extension}` : `${this.counselor.taskNm}`
    },
    statusText: function () {
      return !this.counselor || !this.counselor.counselorId ? '연결대기' : this.counselor.connectYn === 'N' ? '연결대기' : this.counselor.connectYn === 'C' ? '연결중' : this.counselor.callYn === 'Y' ? '통화중' : '통화대기'
    },
    statusClass: function () {
      // return !this.counselor || !this.counselor.counselorId ? 'fail' : this.counselor.connectYn === 'N' ? 'fail' : this.counselor.connectYn === 'C' ? 'connecting' : this.counselor.callYn === 'Y' ? 'on' : 'wating'
      return !this.counselor || !this.counselor.counselorId ? 'fail' : this.counselor.connectYn === 'N' ? 'fail' : this.counselor.connectYn === 'C' ? 'connecting' : this.counselor.callYn === 'Y' ? (this.counselor.abnormalCount > 0 ? 'abnormal' : 'on') : 'wating'
    },
    statusIconClass: function () {
      return !this.counselor || !this.counselor.counselorId ? 'icon-lg-tabler_phone-off' : this.counselor.connectYn === 'N' ? 'icon-lg-tabler_phone-off' : this.counselor.connectYn === 'C' ? 'icon-lg-tabler_phone-calling' : this.counselor.callYn === 'Y' ? 'icon-lg-teenyicons_headset-outline' : 'icon-lg-tabler_phone-call'
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    chatOn () {
      const chat = {
        callId: this.counselor.callId,
        counselor: this.counselor
      }
      this.$store.commit('ADD_CHAT', chat)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
