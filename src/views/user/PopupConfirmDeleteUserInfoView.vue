<template>
  <v-card class="dialogConfirm">
    <v-card-title>
      <span class="headline small">
        {{ $t('message.withdrawConfirm1')}}
        <br>
        {{ $t('message.withdrawConfirm2')}}
      </span>
    </v-card-title>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn
        color="btn-secondary"
        class="naked"
        :ripple="false"
        text
        @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn
        color="btn-primary"
        class="naked"
        :ripple="false"
        text
        @click="delConfirm">{{ $t('button.confirm')}}</v-btn>
    </v-card-actions>
    <!-- popup start -->
    <v-dialog
      v-model="dialogLookupPassword.popupConfirmPasswordView"
      width="490"
      persistent
    >
    <!-- ######### popup ######### -->
      <popup-confirm-password-view
        @close-dialog="closeDialogPassword"
        v-if="dialogLookupPassword.popupConfirmPasswordView"
      />
    </v-dialog>
    <!-- popup end -->
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
import popupConfirmPasswordView from '@/views/user/PopupConfirmPasswordView'

import {
} from '../../api/user'

export default {

  name: 'AuUserGroupPopupList',

  components: {
    popupConfirmPasswordView
  },

  data () {
    return {
      /* popup start */
      dialogLookupPassword: {
        popupConfirmPasswordView: false
      }
      /* popup end */
    }
  },

  computed: {
  },

  methods: {
    /* popup start */
    closeDialogPassword: function () {
      this.dialogLookupPassword.popupConfirmPasswordView = false
    },
    /* popup end */
    delConfirm: function () {
      this.dialogLookupPassword.popupConfirmPasswordView = true
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
