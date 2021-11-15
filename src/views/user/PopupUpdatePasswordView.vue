<template>
  <v-card class="dialog-pw">
    <v-card-title>
    <span class="headline">{{ $t('pageInfo.pageTitle102')}}</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('label.currPassword')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              :type="show1 ? 'text' : 'password'"
              hide-details="auto"
              single-line
              v-model="inputForm.currentPass"
              :rules="[rules.requiredOld]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('label.newPassword')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              :type="show2 ? 'text' : 'password'"
              hide-details="auto"
              single-line
              v-model="inputForm.newPass"
              :rules="[rules.required, rules.minLength, rules.alphanumber, rules.specialchar, rules.oldPwdEqual]"
            ></v-text-field>
          </v-col>
        </v-row>
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
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="setPassword">{{ $t('button.save')}}</v-btn>
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
  reqBeforeSetUserPassword,
  reqSetUserPassword,
  reqSelectAccountPolicy
} from '../../api/user'

import lodash from 'lodash'

export default {

  name: 'AuUserGroupPopupList',

  components: {
  },

  data () {
    return {
      valid: true,
      show1: false,
      show2: false,
      show3: false,
      password: 'Password',
      rules: {
        requiredOld: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '비밀번호를 입력해 주세요.',
        required: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '신규 비밀번호를 입력해 주세요.',
        requiredConfirm: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '신규 비밀번호 확인을 입력해 주세요.',
        /* eslint-disable */
        minLength: v => v.length >= this.accountPolicy.pswMinLength || this.accountPolicy.pswMinLength + '자리 이상 입력해 주세요.',
        alphanumber: v => (this.accountPolicy.pswIsAlphanumber === 1 ? /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(v) : true) || '영문, 숫자 조합으로 입력해 주세요.',
        specialchar: v => (this.accountPolicy.pswIsSpecialchar === 1 ? /^(?=.*[$@$!%*#?&]).+$/.test(v) : true) || '특수기호 포함하여 입력해 주세요.',
        /* eslint-disable */
        oldPwdEqual: value => this.inputForm.currentPass !== value || '신규 비밀번호와 현재 비밀번호가 동일합니다.',
        pwdEqual: value => this.inputForm.newPass === value || '신규 비밀번호와 일치하지 않습니다.'
      },

      /* input start */
      inputForm: {
        currentPass: '',
        newPass: '',
        newPassConfirm: ''
      },
      /* input end */
      accountPolicy: []
    }
  },

  computed: {
  },

  methods: {
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
    setPassword: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        const input = {
          currentPass: this.inputForm.currentPass,
          newPass: CryptoUtil.encrypt(this.inputForm.newPass),
          newPassConfirm: CryptoUtil.encrypt(this.inputForm.newPassConfirm)
        }
        reqBeforeSetUserPassword(input).then(
          response => {
            if (response.data.status === 200) {
              if (!confirm('저장하시겠습니까?')) {
                return
              }
              reqSetUserPassword(input).then(
                response1 => {
                  if (response1.data.status === 200) {
                    this.$store.commit('LOGOUT')
                    this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
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
</style>
