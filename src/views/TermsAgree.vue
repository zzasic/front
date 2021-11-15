
<template>
<v-container fill-height fluid class="terms">
  <div class="terms-container">
    <v-row>
      <h1>
        <v-btn
          text
          class="btn-logo"
          :ripple="false"
          :to="{ name: 'Index' }"
        >
          <span class="hide">AI Connect</span>
        </v-btn>
      </h1>
    </v-row>
    <v-row align="center"
      justify="center"
    >
      <v-col>
        <v-card class="msg-box">
          <h2 class="msg-title">{{ $t('pageInfo.confirmTerms')}}</h2>
          <div class="msg-content" :style="{ height: maxHeight + 'px' }">
            <vuescroll>
              <v-form
                ref="form"
                v-model="valid"
                :lazy-validation="lazy"
              >
                <v-card
                  v-for="(terms, idx) in termsNeedList" :key="idx"
                >
                  <v-card-title>{{terms.termsTitle}}</v-card-title>
                  <v-card-text v-html="terms.termsContents"></v-card-text>
                  <v-card-actions>
                    <v-checkbox
                      v-model="terms.agree"
                      :ripple="false"
                      :label="$t('label.agree')"
                      @change="termsAgreeChange"
                      :rules="[v => (!!v || terms.necessaryFlag !== 'Y' )|| `${terms.termsTitle + '에 동의하세요'}`]"
                      hide-details="auto"
                      required
                    ></v-checkbox>
                  </v-card-actions>
                </v-card>
              </v-form>
            </vuescroll>
          </div>
          <v-card-actions class="submit-btns-group pr-0">
            <v-spacer></v-spacer>
            <label>
              <v-checkbox
                v-model="allTermsAgree"
                :ripple="false"
                :label="$t('label.allAgree')"
                @change="allTermsAgreeChange"
                hide-details="auto"
              ></v-checkbox>
            </label>
            <v-btn color="btn-primary" text @click="agreeBtn">{{ $t('button.confirm')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div class="bg-topleft"></div>
  <div class="bg-bottomright"></div>
</v-container>
</template>

<script>
import { getTermsNeedList, postTermsAgree } from '@/api/terms'

export default {
  name: 'TermsAgree',
  components: {
  },
  data: () => ({
    maxHeight: (window.innerHeight - 252),
    pageTitle: '약관 동의',
    pageDescription: '약관동의 화면입니다',
    termsNeedList: [],
    valid: true,
    lazy: true,
    allTermsAgree: false
  }),
  computed: {
  },
  mounted: function () {
    this.getTermsNeedList()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      this.maxHeight = (window.innerHeight - 252)
    },
    termsAgreeChange: function () {
      this.allTermsAgree = this.termsNeedList.filter(t => {
        return !t.agree
      }).length === 0
    },
    allTermsAgreeChange: function () {
      this.termsNeedList.forEach(t => {
        t.agree = this.allTermsAgree
      })
    },
    noBtn: function () {
    },
    agreeBtn: function () {
      if (this.$refs.form.validate()) {
        this.postTermsAgree()
      }
    },
    getTermsNeedList: function () {
      getTermsNeedList().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            if (response.data.result.termsNeedList && response.data.result.termsNeedList.length > 0) {
              this.termsNeedList = response.data.result.termsNeedList
              this.termsNeedList.forEach((v, i) => {
                v.agree = false
                v.agreeYn = 'N'
              })
            }
          }
        },
        error => {
          console.terms(error)
        }
      )
    },
    postTermsAgree: function () {
      this.termsNeedList.forEach(t => {
        t.agreeYn = t.agree && t.agree === true ? 'Y' : 'N'
      })
      const termsAgrees = this.termsNeedList
      postTermsAgree(termsAgrees).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            sessionStorage.needAgree = 'N'
            const _referer = sessionStorage.referer
            delete sessionStorage.referer
            if (_referer) {
              location.replace(_referer)
            } else {
              this.$router.push({ name: 'Index' })
            }
          }
        }
      )
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
  .terms {
    background: #9499F6 !important; /* Old browsers */
    background: -moz-linear-gradient(left,  #8f93f5 0%, #93b4ff 0%, #FBA3B6 100%) !important; /* FF3.6-15 */
    background: -webkit-linear-gradient(left,  #8f93f5 0%,#93b4ff 0%,#FBA3B6 100%) !important; /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right,  #8f93f5 0%,#93b4ff 0%,#FBA3B6 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8f93f5', endColorstr='#FBA3B6',GradientType=1 ) !important; /* IE6-9 */
    background-image: url('~@/assets/image/login-bg-lefttop.png'), url('~@/assets/image/login-bg-bottomright.png');
    background-repeat: no-repeat, no-repeat;
    background-position: bottom right, top left;
    .terms-container {
      width: 850px;
      margin: auto;
      position: relative;
      z-index: 2;
      .btn-logo {
        background: url('../assets/image/error-header-logo-01.png') center center no-repeat;
        width: 316px;
        height: 59px !important;
        background-color: rgba(255, 255, 255, 0) !important;
        box-shadow: none;
        margin: 0 0 5px 0;
        display: block;
      }
      .msg-box {
        padding: 30px;
        clear: both;
        background: #ffffff;
        filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.11)),
                drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.08));
        border-radius: 8px;
        width: 100%;
        padding: 35px 30px 30px;
        h2.msg-title {
          font-size: 24px;
          letter-spacing: -0.4px;
        }
        .msg-content {
          font-size: 13px;
          line-height: 22px;
          letter-spacing: 0.1px;
          color: #56606b;
          padding: 24px 0;
          min-height: 120px;
          > .__vuescroll.hasVBar {
            width: calc(100% + 30px) !important;
            > .__panel > .__view > form {
              width: calc(100% - 30px) !important;
            }
          }
          .v-card {
            box-shadow: none !important;
            margin-bottom: 20px;
            &:last-child {
              margin-bottom: 0;
            }
            .v-card__title {
              font-size: 15px;
              font-weight: 600;
              padding: 0 0 20px 0;
            }
            .v-card__text {
              padding: 0;
              color: #2C3238;
              ol, ul {
                padding-left: 0;
                font-size: 13px;
                line-height: 1.3;
              }
              table.bordered {
                width: 100%;
                border-spacing: 1px;
                border: 1px solid #A5B3C2;
                background: #E9EFF5;
                -moz-border-radius: 3px;
                -webkit-border-radius: 3px;
                border-radius: 3px;
                margin-bottom: 10px;
                th {
                  height: 40px;
                  box-shadow: none;
                  padding: 5px 8px;
                  background-color: #E9EFF5;
                }
                td {
                  font-size: 13px;
                  color: #2C3238;
                  height: 40px;
                  padding: 5px 8px;
                  word-break: keep-all;
                  background-color: #FFFFFF;
                }
              }
            }
            .v-card__actions {
              margin-top: 12px;
              padding-left: 0;
              .v-input--checkbox {
                float: right;
                margin-top: 0;
                margin-right: 10px;
                padding-top: 0;
                .v-input--selection-controls__input {
                  margin-top: 2px;
                  margin-right: 5px;
                  width: 16px;
                  height: 16px;
                  & + .v-label {
                    font-size: 13px;
                    font-weight: 500;
                  }
                }
              }
            }
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
    .v-text-field {
      input {
        line-height: 22px;
      }
    }
    .v-list-item .v-list-item__title {
      line-height: 1.4;
    }
    .v-select__selection {
      line-height: 22px;
    }
    .submit-btns-group {
      .v-input--selection-controls__input {
        margin-top: 2px;
        margin-right: 5px;
        width: 16px;
        height: 16px;
        & + label {
          font-size: 13px;
        }
      }
      .v-input--selection-controls {
        margin-top: 0;
        margin-right: 10px;
        padding-top: 0;
      }
    }
  }
}
/* IE10+ hack */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  h2.msg-title {
    font-weight: 600;
  }
  body .terms .terms-container .msg-box .msg-content {
    > .__vuescroll.hasVBar {
      width: calc(100% + 30px) !important;
      > .__panel > .__view > form {
        width: calc(100% - 44px) !important;
      }
    }
    .v-card {
      box-shadow: none !important;
      .v-card__title {
        font-size: 15px;
        font-weight: 500;
      }
      .v-card__actions {
        .v-input--checkbox {
          font-size: 13px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
