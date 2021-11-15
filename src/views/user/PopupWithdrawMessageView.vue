<template>
  <v-card class="dialogConfirm">
    <v-card-title>
      <span class="headline small">
        회원탈퇴가 완료되었습니다.
      </span>
    </v-card-title>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn
        color="btn-primary"
        class="naked"
        :ripple="false"
        text
        @click="delConfirm">{{ $t('button.confirm')}}</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="$emit('close-dialog')"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import axios from 'axios'

import {
} from '../../api/user'

export default {

  name: 'AuUserGroupPopupList',

  components: {
  },

  data () {
    return {
    }
  },

  computed: {
  },

  methods: {
    delConfirm: function () {
      axios.defaults.headers.common.Authorization = undefined

      delete sessionStorage.accessToken
      delete sessionStorage.userId
      delete sessionStorage.userEmail
      delete sessionStorage.userName
      delete sessionStorage.userAuthCode
      delete sessionStorage.userDeptName
      delete sessionStorage.tenantId

      this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
    }
  },

  watch: {},

  created () {
  },

  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
