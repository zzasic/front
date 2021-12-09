<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :hasNoSearchGroup="true"
      ></PageTitle>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container class="addUserDefaultData">
        <v-row>
          <v-col cols="1">
            <span class="label must">이름</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userNm"
              :rules="userNmRules"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">이메일</span>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default mt-0 pt-0"
              placeholder="lg@lgcns.com"
              hide-details="auto"
              single-line
              v-model="inputForm.userEmail"
              :rules="userEmailRules"
              @blur="trimUserEmail" @focus="trimUserEmail" @keydown="trimUserEmail"
              oninput="javascript: if (this.value.length > 50) this.value = this.value.substring(0, 50)"
            ></v-text-field>
          </v-col>
          <v-col cols="1" class="btn-col">
            <v-card-actions class="submit-btns-group ml-2">
              <v-btn class="btn-naked-primary" text :ripple="false" @click="emailDupCheck">중복확인</v-btn>
            </v-card-actions>
          </v-col>
          <v-col cols="1">
            <span class="info-msg" ref="userEmailMsg">{{inputFormMsg.userEmailMsg}}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">테넌트</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.tenant ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.tenant"
              :rules="tenantRules"
              :items="itemsTenant"
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label">부서</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userDeptNm"
              :rules="userDeptNmRules"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">직급</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userPosition"
              :rules="userPositionRules"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">연락처</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              placeholder="010-0000-0000"
              hide-details="auto"
              single-line
              v-model="inputForm.userPhone"
              :rules="userPhoneRules"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">권한</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.userAuth ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.userAuth"
              :rules="userAuthRules"
              :items="itemsUserAuth"
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">시스템 권한</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.systemIdList && inputForm.systemIdList.length > 0 ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.systemIdList"
              :items="itemsSystem"
              :rules="systemIdRules"
              multiple
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="itemsLocale && itemsLocale.length > 1">
          <v-col cols="1">
            <span class="label must">언어</span>
          </v-col>
          <v-col cols="3">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.locale ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.locale"
              :rules="localeRules"
              :items="itemsLocale"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">사용 여부</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-0 pt-0"
              v-model="inputForm.useYn"
              :mandatory="false"
              row>
              <v-radio
                :ripple="false"
                v-for="(use, idx) in useYns"
                :key="idx"
                :label="use.text"
                :value="use.value"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">SSO 사용자ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.ssoUserId"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label">SSO 회사코드</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.ssoCompanyCd"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">SSO 부서코드</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.ssoDeptCd"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <PageSectionTitle
              :title="sectionTitle2"
            >
            </PageSectionTitle>
            <v-card-actions class="btn-group align-right">
              <v-spacer></v-spacer>
              <v-btn class="btn-plus" @click="servicePlus"><v-icon dark>mdi-plus</v-icon></v-btn>
              <v-btn class="btn-minus" @click="serviceMinus"><v-icon dark>mdi-minus</v-icon></v-btn>
            </v-card-actions>
            <v-card class="data-grid-wrap default has-scroll">
              <vuescroll>
                <v-data-table
                  v-model="selectedContract"
                  :headers="headersContract"
                  :items="inputForm.authUserList"
                  class="users-data-table"
                  item-key="serviceTenantNo"
                  :fixed-header="true"
                  :disable-pagination="true"
                  :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                  hide-default-footer
                  show-select
                  :no-data-text="$t('message.noData')"
                  :loading-text="$t('message.loading')"
                >
                  <template v-slot:item.chatbotIdList="{ item }">
                    <v-select
                      v-if="existsChatbot(item)"
                      class="default mt-0 pt-0"
                      :menu-props="{ offsetY: true }"
                      v-model="item.chatbotIdList"
                      :items="filterChatbot(item)"
                      hide-details="auto"
                      multiple
                      outlined
                      dense
                    ></v-select>
                  </template>
                  <template v-slot:item.userAuthCd="{ item }">
                    <v-select
                      class="default mt-0 pt-0"
                      :menu-props="{ offsetY: true }"
                      v-model="item.userAuthCd"
                      :items="itemsAuthType[`AUTHTYPE|${item.serviceAuthCd}`]"
                      :rules="[
                        value => !!value || '서비스권한을 선택하세요'
                      ]"
                      hide-details="auto"
                      outlined
                      dense
                    ></v-select>
                  </template>
                </v-data-table>
              </vuescroll>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
      <v-card-actions class="submit-btns-group">
        <v-spacer></v-spacer>
        <v-btn color="btn-secondary" text @click="cancelUserInfo()">{{ $t('button.cancel')}}</v-btn>
        <v-btn color="btn-primary" text @click="setUserInfo()">{{ $t('button.save')}}</v-btn>
      </v-card-actions>
      <v-dialog
        v-model="popupServiceAddView"
        width="490"
        persistent>
        <v-card v-if="popupServiceAddView === true" class="dialog-del-reason">
          <v-card-title>
            <span class="headline">서비스 추가</span>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="addForm"
              v-model="addServiceValid"
            >
              <v-container>
                <v-row>
                  <v-col cols="2">
                    <span class="label must">서비스</span>
                  </v-col>
                  <v-col>
                    <v-select
                      class="default mt-0 pt-0"
                      :menu-props="{ offsetY: true }"
                      v-model="inputForm.sserviceId"
                      :items="serviceListForAdd"
                      :rules="[
                        v => (!!v && v.length > 0) || '서비스를 선택하세요'
                      ]"
                      hide-details="auto"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2">
                    <span class="label must">테넌트</span>
                  </v-col>
                  <v-col>
                    <v-select
                      class="default mt-0 pt-0"
                      :menu-props="{ offsetY: true }"
                      v-model="inputForm.stenantId"
                      :items="tenantListForAdd"
                      :rules="[
                        v => (!!v && v.length > 0) || '테넌트를 선택하세요'
                      ]"
                      hide-details="auto"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions class="submit-btns-group">
            <v-spacer></v-spacer>
            <v-btn color="btn-secondary" text @click="popupServiceAddView = false">{{ $t('button.cancel')}}</v-btn>
            <v-btn color="btn-primary" text @click="addServiceInfo">{{ $t('button.add')}}</v-btn>
            <v-btn color="btn-primary" text @click="addServiceInfoNext">{{ $t('button.addNext')}}</v-btn>
          </v-card-actions>
          <v-btn
            class="default dialogclose"
            text
            @click="popupServiceAddView = false"
            :ripple="false"
          >
            <span class="hide">팝업 닫기</span>
          </v-btn>
        </v-card>
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import {
  getSelectOption,
  createUser,
  reqEmailDupCheck
} from '../../api/user'

import validation from '../../scripts/validation.js'

export default {

  name: 'CreateUserView',

  components: {
  },

  data () {
    return {
      valid: true, // default:true
      addServiceValid: true,

      /* contract info start */
      headersContract: [
        // { text: '서비스 ID', value: 'serviceId', align: 'center', class: 'text-center', width: '250px' },
        { text: '서비스 명', value: 'serviceNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '챗봇 테넌트 명', value: 'serviceTenantNm', align: 'center', class: 'text-center', width: '150px' },
        { text: '챗봇 명', value: 'chatbotIdList', align: 'center', class: 'text-center' },
        { text: '서비스 권한', value: 'userAuthCd', align: 'center', class: 'text-center', width: '210px' }
      ],
      selectedContract: [],
      /* contract info end */

      itemsTenant: [],
      itemsUserAuth: [],
      itemsLocale: [],
      itemsAuthType: {},
      itemsChatbot: [],
      authUserList: [],
      itemsSystem: [],

      /* input start */
      inputForm: {
        userNm: '',
        userEmail: '',
        tenant: '',
        userDeptNm: '',
        userPosition: '',
        userPhone: '',
        userAuth: '',
        locale: 'KO',
        useYn: 'Y',
        authUserList: [],
        systemIds: '',
        systemIdList: [],
        sserviceId: '',
        stenantId: '',
        ssoUserId: '',
        ssoCompanyCd: '',
        ssoDeptCd: ''
      },
      inputFormMsg: {
        userEmailMsg: '',
        contractInfoMsg: ''
      },
      /* input end */

      useYns: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ],

      /* validate start */
      userNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이름을 입력하세요',
        v => (!!v && v.length < 20) || this.$t('message.inputMaxLength', ['20'])
      ],
      userEmailRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이메일을 입력하세요',
        v => /^[0-9a-zA-Z-_.]*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,5}$/i.test(v) || '이메일 형식을 확인해 주세요',
        v => (!!v && v.length < 50) || this.$t('message.inputMaxLength', ['50'])
      ],
      tenantRules: [
        v => !!v || '회사를 선택하세요'
      ],
      userDeptNmRules: [
        v => (!!v && v.length < 20) || this.$t('message.inputMaxLength', ['20'])
      ],
      userPositionRules: [
        v => ((!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) && v.length <= 64) || !v || '직급은 64자리 이내로 입력해 주세요'
      ],
      userPhoneRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '연락처를 입력하세요',
        v => /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/.test(v) || '연락처 형식을 확인해 주세요'
      ],
      userAuthRules: [
        v => !!v || '사용자유형을 선택하세요'
      ],
      localeRules: [
        v => !!v || '언어를 선택하세요'
      ],
      systemIdRules: [
        v => !!v || '시스템권한을 선택하세요'
      ],
      emailDupStat: false,
      /* validate end */

      singleSelect: false,
      sectionTitle: '기본 정보',
      sectionTitle2: '서비스 정보',
      popupServiceAddView: false
    }
  },

  created: async function () {
    await this.getSelectOption()
  },

  mounted: function () {
  },

  watch: {
    'inputForm.userEmail': function () {
      this.emailDupStat = false
      this.inputFormMsg.userEmailMsg = ''
    }
  },

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    serviceListForAdd: function () {
      return Object.values(this.authUserList.filter((au) => {
        return !this.inputForm.authUserList.some((iau) => {
          return iau.serviceId === au.serviceId && iau.serviceTenantId === au.serviceTenantId
        })
      }).reduce((acc, cur) => {
        if (cur.serviceId && cur.serviceNm && !acc[cur.serviceId]) {
          acc[cur.serviceId] = {
            value: cur.serviceId,
            text: cur.serviceNm
          }
        }
        return acc
      }, {}))
    },
    tenantListForAdd: function () {
      return Object.values(this.authUserList.filter((au) => {
        return !this.inputForm.authUserList.some((iau) => {
          return iau.serviceId === au.serviceId && iau.serviceTenantId === au.serviceTenantId
        })
      }).filter((au) => {
        return au.serviceId === this.inputForm.sserviceId
      }).reduce((acc, cur) => {
        if (cur.serviceTenantId && cur.serviceTenantNm && !acc[cur.serviceTenantId]) {
          acc[cur.serviceTenantId] = {
            value: cur.serviceTenantId,
            text: cur.serviceTenantNm
          }
        }
        return acc
      }, {}))
    }
  },

  methods: {
    existsChatbot: function (item) {
      return this.itemsChatbot && this.itemsChatbot.some(c => {
        return c.opt1 === item.tenantId && c.opt2 === item.serviceId
      })
    },
    filterChatbot: function (item) {
      return this.itemsChatbot.filter(c => {
        return c.opt1 === item.tenantId && c.opt2 === item.serviceId
      })
    },
    getSelectOption: function () {
      getSelectOption().then(
        response => {
          this.itemsTenant = response.data.result.tenantList
          this.itemsUserAuth = response.data.result.userAuthList
          this.itemsLocale = response.data.result.localeList
          this.itemsChatbot = response.data.result.chatbotList
          this.authUserList = response.data.result.authUserList
          this.itemsSystem = response.data.result.systemInfoList
          this.itemsAuthType = response.data.result
          console.log('this.authUserList : ', this.authUserList)
        }
      )
    },
    serviceMinus: function () {
      if (!this.selectedContract || this.selectedContract.length === 0) {
        alert('삭제할 서비스정보를 선택하세요.')
        return
      }
      for (const cItem of this.selectedContract) {
        this.inputForm.authUserList.splice(this.inputForm.authUserList.findIndex((c) => c.serviceTenantNo === cItem.serviceTenantNo), 1)
      }
      this.selectedContract = []
    },
    servicePlus: function () {
      this.inputForm.sserviceId = ''
      this.inputForm.stenantId = ''
      this.popupServiceAddView = true
    },
    addServiceInfo: function () {
      if (!this.$refs.addForm.validate()) {
        return false
      }
      this.inputForm.authUserList.push(this.authUserList.find((au) => {
        return au.serviceId === this.inputForm.sserviceId && au.serviceTenantId === this.inputForm.stenantId
      }))
      this.popupServiceAddView = false
    },
    addServiceInfoNext: function () {
      if (!this.$refs.addForm.validate()) {
        return false
      }
      this.inputForm.authUserList.push(this.authUserList.find((au) => {
        return au.serviceId === this.inputForm.sserviceId && au.serviceTenantId === this.inputForm.stenantId
      }))
      this.popupServiceAddView = false
      this.$nextTick(() => {
        this.servicePlus()
      })
    },
    emailDupCheck: function () {
      if (!validation.isEmailCheck(this.inputForm.userEmail)) {
        this.inputFormMsg.userEmailMsg = '이메일을 확인해 주세요.'
      } else {
        const input = {
          userEmail: this.inputForm.userEmail
        }

        reqEmailDupCheck(input).then(
          response => {
            if (response.data.result) {
              // this.inputFormMsg.userEmailMsg = '이미 등록된 이메일 입니다.'
              alert('이미 등록된 이메일 입니다.')
              this.emailDupStat = false
            } else {
              // this.inputFormMsg.userEmailMsg = '사용할 수 있는 이메일 입니다.'
              alert('사용할 수 있는 이메일 입니다.')
              this.emailDupStat = true
            }
          }
        )
      }
    },
    setUserInfo: function () {
      if (this.$refs.form.validate()) {
        if (this.emailDupStat === true) {
          if (!confirm('저장하시겠습니까?')) {
            return
          }
          const input = {
            userNm: this.inputForm.userNm,
            userEmail: this.inputForm.userEmail,
            tenantId: this.inputForm.tenant,
            userDeptNm: this.inputForm.userDeptNm,
            userPosition: this.inputForm.userPosition,
            userPhone: this.inputForm.userPhone,
            userAuthCd: this.inputForm.userAuth,
            useYn: this.inputForm.useYn,
            ssoUserId: this.inputForm.ssoUserId,
            ssoCompanyCd: this.inputForm.ssoCompanyCd,
            ssoDeptCd: this.inputForm.ssoDeptCd,
            localeCd: this.inputForm.locale,
            authUserList: this.inputForm.authUserList,
            systemIds: this.inputForm.systemIds,
            systemIdList: this.inputForm.systemIdList
          }
          createUser(input).then(
            response => {
              if (response.data.status === 200) {
                this.$router.push({ name: 'ListUserView', query: { t: new Date().getTime() } })
              }
            },
            error => {
              console.error(error)
              delete sessionStorage.accessToken
              this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
            }
          )
        } else {
          alert('이메일에 대한 중복확인이 필요합니다.')
        }
      }
    },
    cancelUserInfo: function () {
      this.$router.push({ name: 'ListUserView', query: { t: new Date().getTime() } })
    },
    trimUserEmail: function () {
      if (/ /g.test(this.inputForm.userEmail)) {
        this.inputForm.userEmail = this.inputForm.userEmail.replace(/ /g, '')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .process {
    .users-data-table {
      height: 250px;
    }
  }
</style>
