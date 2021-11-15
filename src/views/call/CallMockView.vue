
<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenant"
              :items="tenantList"
              label="테넌트"
              :placeholder="searchForm.tenant ? undefined : '선택'"
              hide-details="auto"
              :rules="[v => !!v || '테넌트를 선택하세요']"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.scenario"
              :items="scenarioList"
              label="시나리오"
              :placeholder="searchForm.scenario ? undefined : '선택'"
              hide-details="auto"
              :rules="[v => !!v || '시나리오를 선택하세요']"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field
            class="default"
            v-model="searchForm.custNum"
            label="고객전화번호"
            placeholder="고객전화번호"
            hide-details="auto"
            :rules="[
              v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '고객전화번호를 입력하세요',
              v => /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/.test(v) || '연락처 형식을 확인해 주세요'
            ]"
            clearable
          ></v-text-field>
          </v-col>
          <v-col class="text-right">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-start"
              :class="isActive == true ? 'inActive' : ''"
              :ripple="false"
              @click="btnMockCall"
            >
            <i class="icon icon-lg-power"></i>
            {{ isActive ? '상담종료': '상담시작'}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
      </v-form>

      <v-container class="mock-call" no-gutters fluid>
        <v-row class="mock-call__status-wrap" align="center" justify="center">
          <!-- 상담 대기 -->
          <v-col class="mock-call__status">
            <div class="mock-call__status-item">
                <i class="icon icon-lg-tabler_phone-call"></i>
                <div class="icon-cover"></div>
            </div>
            <div class="mock-call__status-text">상담시작 버튼을 누르면 모의상담이 시작됩니다.</div>
          </v-col>
          <!-- //상담 대기 -->
          <!-- 상담 중 -->
          <v-col class="mock-call__status" style="display: none;">
            <div class="mock-call__status-item isactive">
                <i class="icon icon-lg-teenyicons_headset-outline"></i>
                <div class="icon-cover"></div>
            </div>
            <div class="mock-call__status-text">상담종료 버튼을 누르면 모의상담이 종료됩니다.</div>
          </v-col>
          <!-- //상담 중 -->
        </v-row>
        <v-row class="mock-call__info">
          <v-col class="cust-result mock-call__info-col" :style="{ height: mockItemMaxHeight }">
            <h4 class="col-title">기본정보</h4>
            <div class="col-wrap">
              <vuescroll>
                <v-row>
                  <v-col cols="3" class="col-th">
                    <span class="label">모의상담일시</span>
                  </v-col>
                  <v-col class="col-td">
                    2021-07-15 09:03
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3" class="col-th">
                    <span class="label">시나리오</span>
                  </v-col>
                  <v-col class="col-td">
                    <v-row>
                      <v-col class="pa-0">인터넷뱅킹 문의</v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3" class="col-th">
                    <span class="label">최종 대화단계</span>
                  </v-col>
                  <v-col class="col-td">
                    인터넷뱅킹신청방법
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3" class="col-th">
                    <span class="label">이상감지</span>
                  </v-col>
                  <v-col class="col-td">
                    0 건
                  </v-col>
                </v-row>
              </vuescroll>
            </div>
          </v-col>
          <v-col class="mock-chat mock-call__info-col" :style="{ height: mockItemMaxHeight }">
            <h4 class="col-title">상담결과보기</h4>
            <div class="col-wrap">
              <vuescroll>
              <div class="chat-discussion">
                <!-- message :: left-->
                <div class="chat-message left">
                  <div class="profile">
                    <div class="bg-circle">
                      <i class="icon icon-lg-chatbot-fill"></i>
                    </div>
                    <span>AI상담원</span>
                  </div>
                  <div class="message">
                    <div class="message-content">
                    안녕하세요 AI상담원입니다. 무엇을도와드릴까요?
                    </div>
                  </div>
                </div>
                <!-- //message :: left-->
                <!-- message :: right-->
                <div class="chat-message right">
                  <div class="message-content">
                    <div class="profile active" @click="chatResult($event, 1)">
                      <div class="bg-circle">
                        <i class="icon icon-lg-ic_my_28_s_900"></i>
                      </div>
                      <span>고객</span>
                    </div>
                    <div class="message">
                      <div class="message-content">
                        수고하십니다! 이번달 사용한 소액결제 내역 좀 알려주세요?
                      </div>
                    </div>
                  </div>
                </div>
                <!-- //message :: right-->
                <!-- message :: left-->
                <div class="chat-message left">
                  <div class="profile">
                    <div class="bg-circle">
                      <i class="icon icon-lg-chatbot-fill"></i>
                    </div>
                    <span>AI상담원</span>
                  </div>
                  <div class="message">
                    <div class="message-content">
                    고객님의 지난달 소액결재 내역은 89,000원 입니다.
                    </div>
                  </div>
                </div>
                <!-- //message :: left-->
                <!-- message :: right-->
                <div class="chat-message right">
                  <div class="message-content">
                    <div class="profile" @click="chatResult($event, 2)">
                      <div class="bg-circle">
                        <i class="icon icon-lg-ic_my_28_s_900"></i>
                      </div>
                      <span>고객</span>
                    </div>
                    <div class="message">
                      <div class="message-content">
                        결제일이 언제인가요?
                      </div>
                    </div>
                  </div>
                </div>
                <!-- //message :: right-->
                <!-- message :: left-->
                <div class="chat-message left">
                  <div class="profile">
                    <div class="bg-circle">
                      <i class="icon icon-lg-chatbot-fill"></i>
                    </div>
                    <span>AI상담원</span>
                  </div>
                  <div class="message">
                    <div class="message-content">
                    고객님의 결재일은 매달 25일 입니다.
                    </div>
                  </div>
                </div>
                <!-- //message :: left-->
              </div>
              </vuescroll>
            </div>
          </v-col>
          <v-col class="mock-result mock-call__info-col" :style="{ height: mockItemMaxHeight }">
            <h4 class="col-title">단계별 처리결과</h4>
            <div class="col-wrap">
              <vuescroll>

                <!-- 첫번째 row 에 first 클래스 넣어야함 -->
                <v-row class="mock-result__item first">
                  <v-col class="mock-result__left">
                    <div>
                      <i class="mock-result__point"></i>
                      <div class="mock-result__title">TTS</div>
                      <div class="mock-result__time">12:34:25.123</div>
                    </div>
                  </v-col>
                  <v-col class="mock-result__right">
                    <div class="mock-result__history">
                      <p>{{ chatNum == 1 ? '수고하십니다 이번달 사용한 소액결제 내역 좀 알려주세요': '결제일이 언제인가요?'}}</p>
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mock-result__item">
                  <v-col class="mock-result__left">
                    <div>
                      <i class="mock-result__point"></i>
                      <div class="mock-result__title">Filter</div>
                      <div class="mock-result__time">12:34:25.123</div>
                    </div>
                  </v-col>
                  <v-col class="mock-result__right">
                    <div class="mock-result__history">
                      <p>{{ chatNum == 1 ? '이번달 사용한 소액결제 내역 좀 알려주세요' : '이번달 결제일이 언제인가요'}}</p>
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mock-result__item">
                  <v-col class="mock-result__left">
                    <div>
                      <i class="mock-result__point"></i>
                      <div class="mock-result__title">CHATBOT</div>
                      <div class="mock-result__time">12:34:25.123</div>
                    </div>
                  </v-col>
                  <v-col class="mock-result__right">
                    <!-- 시나리오가 필요하면 쓰세요 -->
                    <ul class="mock-result__scenario">
                      <li>시나리오 : 시나리오</li>
                      <li>진행단계 : 진행단계</li>
                    </ul>
                    <div class="mock-result__history">
                      <p>{{ chatNum == 1 ? '고객님의 지난달 소액결재 내역은 89,000원 입니다.' : '고객님의 결재일은 매달 25일 입니다.'}}</p>
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mock-result__item">
                  <v-col class="mock-result__left">
                    <div>
                      <i class="mock-result__point"></i>
                      <div class="mock-result__title">TTS</div>
                      <div class="mock-result__time">12:34:25.123</div>
                    </div>
                  </v-col>
                  <v-col class="mock-result__right">
                    <div class="mock-result__history">
                      <p>{{ chatNum == 1 ? '고객님의 지난달 소액결재 내역은 89,000원 입니다.' : '고객님의 결재일은 매달 25일 입니다. 이번달 결제일이 공휴일이라 26일 결제 됩니다.' }}</p>
                    </div>
                  </v-col>
                </v-row>
              </vuescroll>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </vuescroll>
  </div>
</template>

<script>
import { initCallMockView, mockCall } from '@/api/counsel'

export default {
  name: 'CallMockView',
  components: {
  },
  data () {
    return {
      valid: true,
      mockItemMaxHeight: (window.innerHeight - 443) + 'px',
      isActive: false,
      // 검색영역 시작
      // 테넌트
      tenants: [],
      // 시나리오
      scenarios: [],
      // 검색조건
      searchForm: {
        tenant: '',
        scenario: '',
        custNum: ''
      },
      // 검색영역 끝
      dialogs: [],
      dialogId: null,
      styles: [
        { options: { width: 400, buttonPin: false } }
      ],
      style: null,
      selected: null,
      dialogWidth: 400,
      droppeds: [],
      chatNum: '1'
    }
  },
  created: function () {
  },
  mounted: function () {
    this.initCallMockView()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    'searchForm.tenant': function () {
      this.searchForm.scenario = undefined
    }
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    tenantList: function () {
      const its = []
      its.push(...this.tenants)
      return its
    },
    scenarioList: function () {
      const its = []
      its.push(...this.scenarios.filter(s => s.opt1 === this.searchForm.tenant))
      return its
    }
  },
  methods: {
    handleResize () {
      this.mockItemMaxHeight = (window.innerHeight - 443) + 'px'
    },
    btnMockCall: function () {
      if (!this.isActive) {
        if (!this.$refs.form.validate()) {
          return
        }
        if (!confirm('상담시작 하시겠습니까?')) {
          return
        }
        const input = {
          tenantId: this.searchForm.tenant,
          scenarioId: this.searchForm.scenario,
          custNum: this.searchForm.custNum
        }
        mockCall(input)
        // console.log('call start')
      } else {
        // console.log('call end')
      }
      this.isActive = !this.isActive
    },
    chatResult: function (e, i) {
      this.chatNum = i
      // console.log(this.chatNum)
    },
    initCallMockView: function () {
      initCallMockView().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.tenants = response.data.result.tenantList // 테넌트
            this.scenarios = response.data.result.scenarioList // 시나리오
          }
        },
        error => {
          console.error(error)
          const status = error.data.status
          if (status === 403) {
            this.$router.push({ name: '403', query: { t: new Date().getTime() } })
          } else {
            delete sessionStorage.accessToken
            this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
          }
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.mock-call {
  &__status-wrap {
    padding: 20px;
    border: 1px solid #DAE3ED;
    background: #ffffff;
  }
  &__status {
    width: auto;
    display: inline-flex;
    flex-basis: auto;
    flex-grow: initial;
    align-items: center;
  }
  &__status-item {
    position: relative;
    display: inline-block;
    border-radius: 50%;
    background: #ffffff;
    filter: drop-shadow(0px 0px 8px rgba(0,0,0,.23));
    i.icon {
      position: absolute;
      z-index: 99999;
      font-size: 42px;
      color: #fff;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .icon-cover {
      position: relative;
      width: 70px;
      height: 70px;
      border: 0;
      border-radius: 50%;
      font-size: 10px;
      background: #01BEDB;
      // &.spin {
      //   background: -moz-linear-gradient(left, #fff 10%, rgba(143,147,245, 0.3) 95%);
      //   background: -webkit-linear-gradient(left, #fff 10%, rgba(143,147,245, 0.3) 95%);
      //   background: -o-linear-gradient(left, #fff 10%, rgba(143,147,245, 0.3) 95%);
      //   background: -ms-linear-gradient(left, #fff 10%, rgba(143,147,245, 0.3) 95%);
      //   background: linear-gradient(to right, rgba(143, 147, 245, 0.8) 50%, rgba(143, 147, 245, 0.3) 95%);
      //   -webkit-animation: spin 1.8s infinite linear;
      //   animation: spin 1.8s infinite linear;
      //   -webkit-transform: translateZ(0);
      //   -ms-transform: translateZ(0);
      //   transform: translateZ(0);
      //   &:before {
      //     content: '';
      //     width: 50%;
      //     height: 50%;
      //     background: #FFA3B2;
      //     border-radius: 100% 0 0 0;
      //     position: absolute;
      //     top: 0;
      //     left: 0;
      //   }
      //   &:after {
      //     content: '';
      //     background: #ffffff;
      //     width: 85%;
      //     height: 85%;
      //     border-radius: 50%;
      //     margin: auto;
      //     position: absolute;
      //     top: 0;
      //     left: 0;
      //     bottom: 0;
      //     right: 0;
      //   }
      // }
    }
    &.isactive {
      i.icon {
        font-size: 52px;
        color: #000;
        }
      .icon-cover {
        background: #ffe812;
      }
    }
  }
  &__status-text {
    margin-left: 20px;
  }
  &__info {
    margin-top: 16px !important;
  }
  &__info-col {
    max-width: calc(66.6666666667% - 16px);
    padding: 20px !important;
    border: 1px solid #DAE3ED;
    border-radius: 3px;
    background: #ffffff;
    &:not(:first-child) {
      margin-left: 16px;
    }
    .__vuescroll {
      &.hasVBar {
        width: calc(100% + 22px) !important;
      }
    }
  }
  .col-title {
    height: 34px;
    font-size: 15px;
  }
  .col-wrap {
    height: calc(100% - 34px);
    padding-right: 5px;
  }
  .cust-result {
    .row {
      .col-th {
        display: inline-block;
        width: 120px;
        min-width: 80px;
        max-width: 120px;
        border-bottom: 1px solid #BEC9D4;
        border-right: 1px solid #BEC9D4;
        border-left: 1px solid #BEC9D4;
        padding: 12px 0 !important;
        text-align: center;
        background: #E9EFF5;
        .label {
          font-size: 13px;
        }
      }
      .col-td {
        border-right: 1px solid #BEC9D4;
        border-bottom: 1px solid #BEC9D4;
        padding: 12px 0 12px 12px !important;
      }
      &:first-child {
        .col-th, .col-td {
          border-top: 1px solid #BEC9D4;
        }
      }
    }
  }
  .mock-result {
    .col-wrap {
      position: relative;
      overflow: hidden;
      &:before {
        content: '';
        position: absolute;
        left: 82px;
        top: 2px;
        width: 2px;
        height: 100%;
        background-color: #FFBF6B;
      }
    }
    &__item {
      margin-top: 20px !important;
      border-radius: 5px;
      &.first {
        margin-top: 0 !important;
      }
    }
    &__left {
      position: relative;
      flex: 0 0 auto;
      width: 90px;
      padding: 0;
      text-align: right;
    }
    &__point {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #FFBF6B;
    }
    &__title {
      position: absolute;
      right: 21px;
      top: -1px;
      font-size: 13px;
      font-weight: 500;
    }
    &__time {
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 11px;
      font-weight: 300;
      letter-spacing: 0.3px;
      color: #56606B;
      opacity: 0.8;
    }
    &__right {
      position: relative;
      margin-left: 14px;
      padding: 10px !important;
      border-radius: 5px;
      background-color: #e9eff5;
      &:before {
        content: '';
        position: absolute;
        left: -13px;
        top: 5px;
        border: 5px solid transparent;
        border-right: 8px solid #e9eff5;
      }
    }
    &__scenario {
      margin-bottom: 10px;
      padding: 0 !important;
      font-size: 13px;
      font-weight: 500;
      li {
        position: relative;
        padding-left: 7px;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 9px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #333;
        }
      }
    }
    &__history {
      p {
        margin: 0;
      }
    }
  }
  .mock-chat .chat-discussion {
    .chat-message {
      &.right {
        .profile {
          cursor: pointer;
          &.active {
            .bg-circle {
              background: #12a6be;
              border-radius: 18px 18px 1px 19px;
              transform: rotate(-45deg);
              > .icon {
                transform: rotate(45deg);
              }
            }
          }
        }
      }
      .message {
        max-width: 415px;
      }
    }
  }
}
@-webkit-keyframes spin {
  0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
  }
  100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
  }
  100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
  }
}

/* IE10+ hack */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .mock-status {
    .btn-chat-wrap {
      left: 46%;
      transform: translateX(-50%);
    }
    .status-text {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .__vuescroll.hasVBar {
    > .__panel > .__view > div,
    > .__panel > .__view > .row {
      width: calc(100% - 38px)!important;
    }
  }
  .process > .__vuescroll.hasVBar {
    width: calc(100% + 30px) !important;
    > .__panel > .__view > .search-group,
    > .__panel > .__view > .container,
    > .__panel > .__view > .data-grid-wrap,
    > .__panel > .__view > div {
      width: calc(100% - 50px) !important;
    }
  }
  .v-application .mock-chat.mr-4 {
    max-width: calc(33.33% - 1px);
  }
}
</style>
