<template>
  <v-card class="dialog-pw">
    <v-card-title>
    <span class="headline">비밀번호 확인</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col class="col-head">
            <span class="label must">비밀번호 확인</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              :type="show1 ? 'text' : 'password'"
              hide-details="auto"
              single-line
              v-model="inputForm.currentPass"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="setPassword">{{ $t('button.confirm')}}</v-btn>
    </v-card-actions>
    <!-- popup start -->
    <v-dialog
      v-model="dialogLookupWithdraw.popupWithdrawMessageView"
      width="550"
      persistent
    >
    <!-- ######### popup ######### -->
      <popup-withdraw-message-view
        @close-dialog="closeDialogWithdraw"
        v-if="dialogLookupWithdraw.popupWithdrawMessageView"
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
import popupWithdrawMessageView from '@/views/user/PopupWithdrawMessageView'

import {
  reqWithdrawUser
} from '../../api/user'

import lodash from 'lodash'

export default {

  name: 'AuUserGroupPopupList',

  components: {
    popupWithdrawMessageView
  },

  data () {
    return {
      /* popup start */
      dialogLookupWithdraw: {
        popupWithdrawMessageView: false
      },
      /* popup end */

      show1: false,
      password: 'Password',
      rules: {
        required: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '비밀번호를 입력해 주세요.'
      },

      /* input start */
      inputForm: {
        currentPass: ''
      }
      /* input end */
    }
  },

  computed: {
  },

  methods: {
    /* popup start */
    closeDialogWithdraw: function () {
      this.dialogLookupWithdraw.popupWithdrawMessageView = false
    },
    /* popup end */
    setPassword: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        const input = {
          currentPass: this.inputForm.currentPass
        }
        reqWithdrawUser(input).then(
          response => {
            if (response.data.status === 200) {
              this.dialogLookupWithdraw.popupWithdrawMessageView = true
              // this.$emit('close-dialog')
            }
          },
          error => {
            console.error(error)
            delete sessionStorage.accessToken
            this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
          }
        )
      }
    }, 300)
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
