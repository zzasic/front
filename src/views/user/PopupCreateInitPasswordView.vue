<template>
  <v-card class="dialog-pw">
    <v-card-title>
    <span class="headline">{{ $t('login.resetPassword')}}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form
          ref="email"
          v-model="valid1"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('label.email')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userEmail"
              :rules="userEmailRules"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <template>
              <v-card-actions class="btn-add-code-type">
                <v-btn class="btn-naked-primary" text :ripple="false" @click="sendAuthCode">{{ $t('label.authentiCode')}}</v-btn>
              </v-card-actions>
            </template>
          </v-col>
        </v-row>
        </v-form>
        <v-form
          ref="authCode"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('label.authentiCode')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.authCode"
              :rules="authCodeRules"
              readonly
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form>
        <v-form
          ref="newPass"
          v-model="valid3"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('label.newPassword')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0 secure"
              :type="show2 ? 'text' : 'password'"
              hide-details="auto"
              single-line
              v-model="inputForm.newPass"
              :rules="[rules.required, rules.minLength, rules.alphanumber, rules.specialchar]"
              readonly
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form>
        <v-form
          ref="newPassConfirm"
          v-model="valid3"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('label.confirmPassword')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              :type="show3 ? 'text' : 'password'"
              hide-details="auto"
              single-line
              v-model="inputForm.newPassConfirm"
              :rules="[rules.requiredConfirm, rules.minLength, rules.alphanumber, rules.specialchar, rules.pwdEqual]"
              readonly
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="resetPassword">{{ $t('button.confirm')}}</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click="$emit('close-dialog')"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import CryptoUtil from '@/plugins/CryptoUtil'
import {
  reqBeforeResetUserPassword,
  reqResetUserPassword,
  reqSelectAccountPolicy,
  reqMailSendForAuthCode
} from '../../api/user'

import lodash from 'lodash'

export default {

  name: 'PopupCreateInitPasswordView',
  components: {
  },

  data () {
    return {
      valid1: true,
      valid2: true,
      valid3: true,
      show1: false,
      show2: false,
      show3: false,
      password: 'Password',
      rules: {
        required: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || this.$t('validation.inputNewPassword'),
        requiredConfirm: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || this.$t('validation.inputConfirmPassword'),
        /* eslint-disable */
        minLength: v => v.length >= this.accountPolicy.pswMinLength || this.$t('validation.minLength1') + this.accountPolicy.pswMinLength + this.$t('validation.minLength2'),
        alphanumber: v => (this.accountPolicy.pswIsAlphanumber === 1 ? /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(v) : true) || this.$t('validation.alphaNumber'),
        specialchar: v => (this.accountPolicy.pswIsSpecialchar === 1 ? /^(?=.*[$@$!%*#?&]).+$/.test(v) : true) || this.$t('validation.specialChar'),
        /* eslint-disable */
        pwdEqual: value => this.inputForm.newPass === value || this.$t('validation.equalPassword'),
      },
      userEmailRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) ||  this.$t('validation.inputEmail'),
        /* eslint-disable */
        v => /^[0-9a-zA-Z-_\.]*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,5}$/i.test(v) || this.$t('validation.emailFormat')
        /* eslint-disable */
      ],
      authCodeRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || this.$t('validation.inputAuthCode')
      ],

      /* input start */
      inputForm: {
        userEmail: '',
        authCode: '',
        newPass: '',
        newPassConfirm: ''
      },
      /* input end */
      accountPolicy: [],
      authKey: ''
    }
  },

  computed: {
  },

  methods: {
    acFocus: function (event) {
      const _this = event.target
      _this.removeAttribute('readonly')
    },
    acBlur: function (event) {
      const _this = event.target
      _this.readOnly = true
    },
    getAccountPolicy: function () {
      reqSelectAccountPolicy().then(
        response => {
          if (response.data.status === 200) {
            this.accountPolicy = response.data.result
          }
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    sendAuthCode: lodash.debounce(function () {
      if (this.$refs.email.validate()) {
        const input = {
          userEmail: this.inputForm.userEmail
        }
        reqMailSendForAuthCode(input).then(
          response => {
            if (response.data.status === 200) {
              // this.authKey = response.data.result
              alert(this.$t('alert.resetPassword.checkVerificationCode'))
            }
          },
          error => {
            console.error(error)
            delete sessionStorage.accessToken
            this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
          }
        )
      }
    }, 300),
    resetPassword: lodash.debounce(function () {
      if (this.$refs.email.validate() && this.$refs.authCode.validate() && this.$refs.newPass.validate() && this.$refs.newPassConfirm.validate()) {
        const input = {
          userEmail: this.inputForm.userEmail,
          newPass: CryptoUtil.encrypt(this.inputForm.newPass),
          newPassConfirm: CryptoUtil.encrypt(this.inputForm.newPassConfirm),
          verificationCode: this.inputForm.authCode
        }
        reqBeforeResetUserPassword(input).then(
          response => {
            if (response.data.status === 200) {
              reqResetUserPassword(input).then(
                response1 => {
                  if (response1.data.status === 200) {
                    alert(this.$t('alert.resetPassword.ok'))
                    this.$emit('close-dialog')
                  }
                },
                error1 => {
                  console.error(error1)
                  delete sessionStorage.accessToken
                  this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
                }
              )
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
    this.getAccountPolicy()
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
  .btn-add-code-type {
    padding: 0px;
  }
  input[type=password] {
    text-security: disc;
    -webkit-text-security: disc;
  }
  .dialog-pw {
    form {
      &:last-child {
        .row {
          margin-bottom: 0;
        }
      }
      .row {
        padding: 9px 0 !important;
        margin-bottom: 10px;
        .col-2 {
          &:last-child {
            min-width: 65px !important;
            max-width: 65px !important;
          }
        }
        .col-8 {
          flex: 0 0 52%;
          max-width: 52%;
          margin-right: 4px;
        }
      }
    }
  }
</style>
