<template>
  <v-card class="dialog-pw">
    <v-card-title>
    <span class="headline">{{ $t('shinhan.sso.useApprovalReq')}}</span>
    </v-card-title>
    <v-card-text>
      <v-container>

        <!-- SSO ID -->
        <v-form
          ref="ssoUserId"
          v-model="valid1"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.ssoId')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              :rules="ssoUserIdRules"
              v-model="inputForm.ssoUserId"
              :disabled="ssoInfoShow"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form>

        <!-- SSO PW -->
        <v-form
          ref="ssoUserPwd"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.ssoPw')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              :type="show1 ? 'text' : 'password'"
              hide-details="auto"
              single-line
              v-model="inputForm.ssoUserPwd"
              readonly
              :rules="passwordRules"
              :disabled="ssoInfoShow"
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <template v-if="!inputForm.ssoInfoConfirm">
              <v-card-actions class="btn-add-code-type">
                <v-btn class="btn-naked-primary" text :ripple="false" @click="fnc_ssoLoginConfirm"> {{ $t('shinhan.sso.ssoLoginCheck') }} </v-btn>
              </v-card-actions>
            </template>
          </v-col>
        </v-row>
        </v-form>

        <!-- 이름 -->
        <v-form
          ref="userNm"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.userNm')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userNm"
              readonly
              :rules="userNmRule"
              :disabled="!ssoInfoShow"
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form>

        <!-- 사용 시스템 정보 selectbox로 바꿔야함 -->
        <!-- <v-form
          ref="systemId"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.systemIds')}}</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.systemIds"
              :items="cptdSystemIds"
              :disabled="!ssoInfoShow"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form> -->

        <!-- 메일 -->
        <!-- <v-form
          ref="userEmail"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.userEmail')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userEmail"
              readonly
              :disabled="!ssoInfoShow"
              :rules="userEmailRules"
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form> -->

        <!-- 연락처 -->
        <!-- <v-form
          ref="userPhone"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.phoneNo')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userPhone"
              readonly
              :rules="userPhoneRules"
              :disabled="!ssoInfoShow"
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form> -->

        <!-- 부서 -->
        <v-form
          ref="userDeptNm"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.userDeptNm')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userDeptNm"
              readonly
              :rules="userDeptNmRules"
              :disabled="!ssoInfoShow"
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form>

        <!-- 직급 -->
        <v-form
          ref="userPosition"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.userPosition')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userPosition"
              :rules="userPositionRules"
              readonly
              :disabled="!ssoInfoShow"
              @focus.prevent.stop="acFocus($event)"
              @blur.prevent.stop="acBlur($event)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form>

        <!-- 권한 -->
        <!-- <v-form
          ref="userAuthCd"
          v-model="valid2"
        >
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.userAuthCd')}}</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.userAuthCd"
              :items="cptdUserAuthCdList"
              :disabled="!ssoInfoShow"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-row>
        </v-form> -->
      </v-container>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="fnc_sendUseApprovalReq">{{ $t('button.confirm')}}</v-btn>
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
  getSsoLoginInit,
  getSsoLoginConfirm,
  sendSsoUseApprovalReq
} from '../../../api/shinhan/sso'

export default {

  name: 'UseApprovalReqView',
  components: {
  },

  data () {
    return {
      valid1: true,
      valid2: true,
      valid3: true,
      show1: false,
      ssoInfoShow: false,
      password: 'Password',
      systemIdList: [],
      userAuthCdList: [],
      ssoUserInfo: [],
      /* input start */
      inputForm: {
        ssoUserId: '',
        ssoUserPwd: '',
        userAuthCd: '',
        userEmail: '',
        userNm: '',
        userDeptNm: '',
        userPosition: '',
        userPhone: '',
        systemIds: '',
        ssoInfoConfirm: false // sso 계정 체크를 하면 true로 변경
      },
      ssoUserIdRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '행번을 입력해주세요'
      ],
      passwordRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'canvas 비밀번호를 입력해주세요'
      ],
      userNmRule: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이름을 입력해주세요'
      ],
      // userEmailRules: [
      //   v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이메일을 입력하세요',
      //   v => /^[0-9a-zA-Z-_.]*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,5}$/i.test(v) || '이메일 형식을 확인해 주세요',
      //   v => (!!v && v.length < 50) || this.$t('message.inputMaxLength', ['50'])
      // ],
      // userPhoneRules: [
      //   v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '연락처를 입력하세요',
      //   /* eslint-disable */
      //   v => /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/.test(v) || '연락처 형식을 확인해 주세요'
      //   /* eslint-disable */
      // ],
      userDeptNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '부서를 입력해주세요'
      ],
      userPositionRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '직급을 입력해주세요',
        v => ((!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) && v.length <= 64) || !v || '직급은 64자리 이내로 입력해 주세요'
      ]
    }
  },

  computed: {
    cptdSystemIds () {
      const systemIdList = []
      systemIdList.push(...this.systemIdList)
      return systemIdList
    },
    cptdUserAuthCdList () {
      const userAuthCdList = []
      userAuthCdList.push(...this.userAuthCdList)
      return userAuthCdList
    }
  },

  methods: {
    fnc_getSsoLoginInit: function () {
      getSsoLoginInit().then(
        response => {
          this.userAuthCdList = response.data.result.userAuthList ? response.data.result.userAuthList : []
          this.inputForm.userAuthCd = this.userAuthCdList[0].value
          this.systemIdList = response.data.result.systemInfoList ? response.data.result.systemInfoList : []
          this.inputForm.systemIds = this.systemIdList[0].value
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    acFocus: function (event) {
      const _this = event.target
      _this.removeAttribute('readonly')
    },
    acBlur: function (event) {
      const _this = event.target
      _this.readOnly = true
    },
    fnc_ssoLoginConfirm: function () {
      const inputForm = {
        ssoUserId: this.inputForm.ssoUserId,
        ssoUserPwd: CryptoUtil.encrypt(this.inputForm.ssoUserPwd)
      }
      getSsoLoginConfirm(inputForm).then(
        response => {
          if (response.data.result.ssoLoginResult !== 'true' && response.data.result.ssoUseApprovalStatus !== 'NEW') { // TODO - 로그인 결과에 대해 분기처리
            alert('사용자 정보가 없습니다.')
          } else if (response.data.result.ssoLoginResult === 'true' && response.data.result.ssoUseApprovalStatus === 'APL') {
            alert(this.$t('shinhan.sso.login.useApprovalReqReturnMsg_APL'))
          } else if (response.data.result.ssoLoginResult === 'true' && response.data.result.ssoUseApprovalStatus === 'REQ') {
            alert(this.$t('shinhan.sso.login.useApprovalReqReturnMsg_REQ'))
          } else {
            this.ssoInfoShow = true
            this.inputForm.ssoInfoConfirm = true
            this.ssoUserInfo = response.data.result.ssoUserInfo ? response.data.result.ssoUserInfo : []
            this.inputForm.userNm = this.ssoUserInfo.userNm
            this.inputForm.userDeptNm = this.ssoUserInfo.userDeptNm
            this.inputForm.userPosition = this.ssoUserInfo.userPosition
            alert('사원 정보가 확인이 되었습니다.\n변경 사항이 있으면 수정 후 신청 바랍니다.')
          }
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
      /* REAL CODE END */
    },
    fnc_sendUseApprovalReq: function () { // TODO - validation check
      if (this.$refs.ssoUserId.validate() && this.$refs.ssoUserPwd.validate()) {
        if (this.inputForm.ssoInfoConfirm === false) {
          alert('로그인 후 승인 요청 가능합니다.')
          return
        }
        if (this.$refs.userNm.validate() && this.$refs.userDeptNm.validate() && this.$refs.userPosition.validate()) {
          if (!confirm('승인 요청하시겠습니까?')) {
            return
          }
          const inputForm = {
            ssoUserId: this.inputForm.ssoUserId,
            ssoUserPwd: this.inputForm.ssoUserPwd,
            userNm: this.inputForm.userNm,
            userDeptNm: this.inputForm.userDeptNm,
            userPosition: this.inputForm.userPosition
            // userEmail: this.inputForm.userEmail,
            // userPhone: this.inputForm.userPhone,
            // systemIds: this.inputForm.systemIds,
            // userAuthCd: this.inputForm.userAuthCd
          }
          sendSsoUseApprovalReq(inputForm).then( // TODO - 우리쪽 DB 정보 CHECK(REQ, APL, REJ, NEW)
            response => {
              if (response.data.status === 200) {
                alert(this.$t('shinhan.sso.login.useApprovalReqReturnMsg_' + response.data.result.ssoUseApprovalInsert))
                this.$emit('close-dialog')
              }
            },
            error => {
              console.error(error)
              delete sessionStorage.accessToken
              this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
            }
          )
          /* SSO APPROVAL END */
          /* REAL CODE END */
        }
      }
    }
  },

  watch: {},

  created () {
  },

  mounted () {
    this.fnc_getSsoLoginInit()
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
