<template>
  <v-container name="login" fill-height fluid class="login">
    <div class="login-container">
      <div class="bg-brain">
        <h1 class="text-logo"><strong>AI</strong>Connect</h1>
        <h2 class="hide"></h2>
      </div>
      <v-row
        class="form-container"
        align="center"
        justify="center"
      >
        <v-col>
          <v-card
            elevation="0"
          >
            <h2>{{ $t('login.button')}}</h2>
            <v-form
              ref="form"
              v-model="valid"
              :lazy-validation="lazy"
            >
              <v-text-field
                class="default login-field pr-0 pt-0 mt-0"
                placeholder="행번"
                :rules="emailRules"
                v-model="email"
                hide-details="auto"
                required
              ></v-text-field>
              <v-text-field
                class="default password-field pr-0 pt-0 mt-0"
                placeholder="canvas password"
                v-model="password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                hide-details="auto"
                required
                v-on:keyup.enter="login"
              ></v-text-field>
              <v-select
                v-if="languages.length > 1"
                class="default slt-language pr-0 pt-0 mt-0"
                :menu-props="{ offsetY: true }"
                v-model="localeCode"
                :items="languages"
                :rules="selectRules"
                text="한국어"
                value="ko"
                hide-details="auto"
                required
                v-on:change="changeLanguage"
              ></v-select>
              <v-btn
                block
                color="#2C3238"
                :ripple="false"
                class="btn-login"
                @click="login"
                hide-details="auto"
                elevation="0"
              >
                {{ $t('login.button')}}
              </v-btn>
              <v-container fluid class="container-login-option">
                <v-row>
                  <v-col cols="4" class="pl-0 col-saveid">
                    <label>
                      <v-checkbox
                        class="chk-saveid"
                        v-model="chkSaveId"
                        :label="$t('login.saveId')"
                        color="#26B9D1"
                        :ripple="false"
                      ></v-checkbox>
                    </label>
                  </v-col>
                  <v-col cols="8" class="pr-0 col-reset">
                    <v-btn v-if="getppolicy.termsUse === 'true'" text class="btn-reset btn-privacy-policy" @click="terms" :ripple="false">
                      {{ $t('login.privacyPolicy')}}
                    </v-btn>
                    <!-- 비밀번호 초기화 -->
                    <!-- <v-btn text class="btn-reset" @click="resetPassword" :ripple="false">
                      {{ $t('login.resetPassword')}}
                    </v-btn> -->
                    <!-- 사용승인요청 -->
                    <v-btn text class="btn-reset" @click="useApprovalReq" :ripple="false">
                      {{ $t('shinhan.sso.useApprovalReq')}}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div class="bg-topleft"></div>
    <div class="bg-bottomright"></div>
    <!-- 비밀번호 초기화 팝업 시작 -->
    <!-- popup start -->
    <!-- <v-dialog
      v-model="dialogLookupInitPassword.popupCreateInitPasswordView"
      width="570"
      persistent
    > -->
    <!-- ######### popup ######### -->
      <!-- <popup-create-init-password-view
        @close-dialog="closeDialogInitPassword"
        v-if="dialogLookupInitPassword.popupCreateInitPasswordView"
      />
    </v-dialog> -->

    <!-- 사용승인요청 팝업 시작 -->
    <v-dialog
      v-model="dialogLookupUseApprovalReq.useApprovalReqView"
      width="570"
      persistent
    >
    <!-- ######### popup ######### -->
      <use-approval-req-view
        @close-dialog="closeDialogUseApprovalReq"
        v-if="dialogLookupUseApprovalReq.useApprovalReqView"
      />
    </v-dialog>
    <!-- 사용승인요청 팝업 종료 -->

    <div v-if="locale==='en'">
      <v-dialog
        v-model="dialogLookupTerms.popupTermsViewEn"
        width="700"
        persistent
      >
        <!-- ######### popup ######### -->
        <popup-terms-view-en
          @close-dialog="closeDialogTerms"
          v-scroll
          v-if="dialogLookupTerms.popupTermsViewEn"
        />
      </v-dialog>
    </div>
    <div v-else>
      <v-dialog
        v-model="dialogLookupTerms.popupTermsView"
        width="700"
        persistent
      >
        <!-- ######### popup ######### -->
        <popup-terms-view
          @close-dialog="closeDialogTerms"
          v-scroll
          v-if="dialogLookupTerms.popupTermsView"
        />
      </v-dialog>
    </div>
    <!-- popup end -->
  </v-container>
</template>

<script>
import CryptoUtil from '@/plugins/CryptoUtil'
// import popupCreateInitPasswordView from '@/views/user/PopupCreateInitPasswordView'
import popupTermsView from '@/views/PopupTermsView'
import popupTermsViewEn from '@/views/PopupTermsViewEn'
import useApprovalReqView from '@/views/shinhan/sso/UseApprovalReqView'

export default {
  name: 'Login',
  components: {
    // popupCreateInitPasswordView,
    popupTermsView,
    popupTermsViewEn,
    useApprovalReqView
  },
  updated () {
    this.locale = window.localStorage.localeCode
  },
  data: () => {
    return {
      locale: '',
      /* popup start */
      // dialogLookupInitPassword: {
      //   popupCreateInitPasswordView: false
      // },
      dialogLookupUseApprovalReq: {
        useApprovalReqView: false
      },
      dialogLookupTerms: {
        popupTermsView: false,
        popupTermsViewEn: false
      },
      /* popup end */
      valid: true,
      lazy: true,
      showPassword: false,
      password: '',
      passwordRules: [
      ],
      email: '',
      emailRules: [
        // v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '행번을 입력해주세요'
      ],
      select: { text: '한국어', value: 'ko' },
      languages: [
        { text: '한국어', value: 'ko' }
        /* { text: 'English', value: 'en' } */
      ],
      saveId: false
    }
  },
  computed: {
    getppolicy: function () {
      return this.$store.getters.getppolicy || {}
    },
    localeCode: {
      get: function () {
        return this.$i18n.locale
      },
      set: function (localeCode) {
        window.localStorage.localeCode = localeCode
      }
    },
    chkSaveId: {
      get: function () {
        return !!this.$cookies.get('saveId')
      },
      set: function (value) {
        this.saveId = value
        if (value === true) {
          if (this.email) {
            this.$cookies.set('saveId', this.email, '30d', '/')
          }
        } else {
          this.$cookies.remove('saveId', '/')
        }
      }
    }
  },
  created () {
    this.selectRules = [v => !!v || this.$t('login.text.select.check')]

    this.emailRules = [
      v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || this.$t('행번을 입력해주세요')
      // v => /.+@.+\..+/.test(v) || this.$t('login.text.email.format')
    ]

    this.passwordRules = [
      v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || this.$t('canvas 비밀번호를 입력해주세요')
      // v => (v && v.length >= 10) || '비밀번호는 최소 10자 이상입니다'
    ]

    if (this.$cookies.get('saveId')) {
      this.email = this.$cookies.get('saveId')
    }
  },
  methods: {
    /* 사용승인요청 팝업 시작 */
    useApprovalReq: function () {
      this.dialogLookupUseApprovalReq.useApprovalReqView = true
    },
    /* 사용승인요청 팝업 종료 */
    closeDialogUseApprovalReq: function () {
      this.dialogLookupUseApprovalReq.useApprovalReqView = false
    },
    /* popup start */
    // resetPassword () {
    //   this.dialogLookupInitPassword.popupCreateInitPasswordView = true
    // },
    /* popup end */
    // closeDialogInitPassword: function () {
    //   this.dialogLookupInitPassword.popupCreateInitPasswordView = false
    // },
    terms () {
      this.dialogLookupTerms.popupTermsViewEn = true
      this.dialogLookupTerms.popupTermsView = true
    },
    closeDialogTerms: function () {
      this.dialogLookupTerms.popupTermsViewEn = false
      this.dialogLookupTerms.popupTermsView = false
    },
    redirect () {
      const { search } = window.location
      const tokens = search.replace(/^\?/, '').split('&')
      const { returnPath } = tokens.reduce((qs, tkn) => {
        const pair = tkn.split('=')
        qs[pair[0]] = decodeURIComponent(pair[1])
        return qs
      }, {})

      // 리다이렉트 처리
      this.$router.push(returnPath)
    },
    login () {
      if (this.saveId === true) {
        this.$cookies.set('saveId', this.email, '30d', '/')
      }
      if (this.$refs.form.validate()) { // 폼 밸리데이트 통과 후 회원db 검증
        const email = this.email
        const password = CryptoUtil.encrypt(this.password)
        const localeCode = this.$i18n.locale
        this.$store.dispatch('LOGIN', { email, password, localeCode })
          .then(() => {
            const _referer = sessionStorage.referer
            delete sessionStorage.referer
            if (_referer) {
              location.replace(_referer)
            } else {
              this.$router.push({ name: 'Index' })
            }
          })
          .catch(({ message }) => {
            this.msg = message
          })
      }
    },
    changeLanguage (language) {
      this.$i18n.locale = language
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import "../assets/style/common.scss";
  html, body, .v-application, .admin {
    min-width: 854px;
  }
  body {
    .theme--light.v-application {
      background: none;
    }
    .login {
      padding: 0;
      overflow: hidden;
      background: #1e5799 !important; /* Old browsers */
      background: -moz-radial-gradient(50% 50% at 50% 50%, rgba(240, 47, 82, 0.2) 0%, rgba(255, 255, 255, 0) 100%), -moz-linear-gradient(90deg, rgba(143, 147, 244, 0.5) 0%, rgba(181, 187, 235, 0.5) 35.42%), -moz-linear-gradient(left,  #1e5799 0%, #93d1ff 0%, #ffa6ad 100%) !important; /* FF3.6-15 */
      background: -webkit-radial-gradient(50% 50% at 50% 50%, rgba(240, 47, 82, 0.2) 0%, rgba(255, 255, 255, 0) 100%), -webkit-linear-gradient(90deg, rgba(143, 147, 244, 0.5) 0%, rgba(181, 187, 235, 0.5) 35.42%), -webkit-linear-gradient(left,  #1e5799 0%,#93d1ff 0%,#ffa6ad 100%) !important; /* Chrome10-25,Safari5.1-6 */
      background: radial-gradient(50% 50% at 50% 50%, rgba(240, 47, 82, 0.2) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(90deg, rgba(143, 147, 244, 0.5) 0%, rgba(181, 187, 235, 0.5) 35.42%, rgba(255, 163, 178, 0.5) 100%), linear-gradient(90deg, #93D1FF 0%, #FFA6AD 100%), #FFFFFF !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#93D1FF', endColorstr='#FFA6AD',GradientType=1 ) !important; /* IE6-9 */
      background-image: url('~@/assets/image/login-bg-lefttop.png'), url('~@/assets/image/login-bg-bottomright.png');
      background-repeat: no-repeat, no-repeat;
      background-position: bottom right, top left;
      .login-container {
        width: 854px;
        height: 540px;
        margin: auto;
        position: relative;
        .bg-brain {
          width: 421px;
          height: 542px;
          background: url('~@/assets/image/bg-login-01.png') center center no-repeat;
          background-size: cover;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
          .text-logo {
            position: absolute;
            left: 50px;
            bottom: 15px;
            font-size: 40px;
            color: #fff;
            font-weight: 700;
            line-height: 1.1;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            strong {
              display: block;
              font-size: 58px;
              font-weight: 700;
            }
          }
        }
        .form-container {
          position: absolute;
          top: 106px;
          right: 3px;
          z-index: 2;
          width: 500px;
          height: 428px;
          h2 {
            font-size: 24px;
            color: #56606B;
            font-weight: bold;
            margin-bottom: 20px;
          }
          >.col {
            padding: 0;
          }
          .v-card {
            height: 429px;
            padding: 35px 44px 0 38px;
            margin-left: 68px;
            border-radius: 0 3px 3px 0;
            .login-field {
              position: relative;
              margin-bottom: 12px;
              .v-input__slot {
                height: 40px;
                position: relative;
                input {
                  padding-left: 36px;
                }
              }
              &:after {
                content: ' ';
                display: block;
                width: 18px;
                height: 18px;
                background: url('~@/assets/image/ic_man.png') center center no-repeat;
                position: absolute;
                top: 11px;
                left: 10px;
              }
            }
            .password-field {
              position: relative;
              margin-bottom: 22px;
              .v-input__slot {
                height: 40px;
                input {
                  padding-left: 36px;
                }
              }
              &:after {
                content: ' ';
                display: block;
                width: 18px;
                height: 18px;
                background: url('~@/assets/image/ic_lock.png') center center no-repeat;
                position: absolute;
                top: 11px;
                left: 11px;
              }
            }
            .login-field, .password-field {
              &.error--text {
                .v-input__slot:after {
                  top: calc(100% - 23px);
                }
              }
            }
            .slt-language {
              margin-bottom: 36px;
            }
            .btn-login {
              color: $white;
              font-size: 15px;
              font-weight: bold;
              text-transform: capitalize;
              font-size: 15px;
              font-weight: normal;
              height: 48px;
              letter-spacing: 0;
              .v-btn__content {
                background: url('~@/assets/image/ic_arrow.png') center right 115px no-repeat;
              }
            }
            .btn-reset {
              color: $gray700;
              font-size: 12px;
              text-decoration: underline;
              text-transform: capitalize;
              letter-spacing: 0;
              margin-top: -10px;
              height: inherit;
            }
            .chk-saveid {
              .v-input--selection-controls__input {
                margin-right: 4px;
                width: 15px;
                height: 14px;
              }
              label {
                text-transform: capitalize;
                font-size: 12px;
                color: $gray900;
                letter-spacing: 0;
              }
            }
            .container-login-option {
              margin-top: 20px;
              padding: 0;
              > .row {
                margin: 0 -4px;
              }
              .col {
                height: 20px;
              }
              .col-saveid {
                padding-left: 0;
              }
              .col-reset {
                text-align: right;
                padding-right: 0;
                > button {
                  padding: 0 5px;
                }
                > button.btn-privacy-policy {
                  padding: 0 5px;
                  > span.v-btn__content {
                    font-weight: bold;
                  }
                }
              }
              .v-input--selection-controls {
                margin-top: 0;
                padding: 0;
              }
            }
            .v-input.v-input--is-focused.v-text-field.default .v-input__slot {
              border: 1px solid #04b395;
            }
            .v-input.v-input--is-focused.v-text-field.default.error--text .v-input__slot {
              border: 1px solid #F94B50;
            }
            .v-input.v-input--is-focused.v-text-field.default.success--text .v-input__slot {
              border: 1px solid #04b395;
            }
          }
        }
      }
      .bg-topleft {
        width: 337px;
        height: 401px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        background:url('~@/assets/image/login-bg-lefttop.png') center center no-repeat;
      }
      .bg-bottomright {
        width: 494px;
        height: 710px;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 1;
        background:url('~@/assets/image/login-bg-bottomright.png') center center no-repeat;
      }
    }
  }
</style>
