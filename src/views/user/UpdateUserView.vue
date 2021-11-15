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
            <span class="label">ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.userId"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
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
              :disabled="inputForm.delYn === 'Y'"

            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">이메일</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              placeholder="lg@lgcns.com"
              hide-details="auto"
              single-line
              :value="`${inputForm.userEmail.replace(/.(?=.{1,3}@)/gi, '*')}`"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">테넌트</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              hide-details="auto"
              single-line
              v-model="inputForm.tenant"
              :placeholder="inputForm.tenant ? undefined : '선택'"
              :rules="tenantRules"
              :items="itemsTenant"
              :disabled="inputForm.delYn === 'Y'"

            ></v-select>
          </v-col>
        </v-row>
        <v-row>
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
              :disabled="inputForm.delYn === 'Y'"

            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
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
        </v-row>
        <v-row>
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
              :disabled="inputForm.delYn === 'Y'"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="itemsLocale && itemsLocale.length > 1">
          <v-col cols="1">
            <span class="label must">언어</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              hide-details="auto"
              single-line
              :disabled="inputForm.delYn === 'Y'"
              v-model="inputForm.locale"
              :rules="localeRules"
              :placeholder="inputForm.locale ? undefined : '선택'"
              :items="itemsLocale"
            ></v-select>
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
              hide-details="auto"
              single-line
              v-model="inputForm.userAuth"
              :rules="userAuthRules"
              :items="itemsUserAuth"
              :placeholder="inputForm.userAuth ? undefined : '선택'"
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
        <v-row>
          <v-col cols="1">
            <span class="label must">사용 여부</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-0 pt-0"
              v-model="inputForm.useYn"
              :mandatory="false"
              :disabled="inputForm.delYn === 'Y'"
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
          <v-col cols="2"></v-col>
          <v-col cols="1" v-if="inputForm.delYn === 'Y'">
            <span class="label">삭제사유</span>
          </v-col>
          <v-col cols="4" v-if="inputForm.delYn === 'Y'">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.delReason"
              :disabled="inputForm.delYn === 'Y'"
            ></v-text-field>
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
      </v-container>
      <v-container class="transaction pt-12">
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
      </v-container>
      </v-form>
      <v-card-actions class="submit-btns-group">
        <v-spacer></v-spacer>
        <v-btn color="btn-secondary" text v-if="inputForm.delYn === 'N'" @click="resetPassword()">비밀번호 초기화</v-btn>
        <!-- <v-btn color="btn-secondary" text v-if="inputForm.orgUseYn === 'N' && inputForm.delYn === 'N'" @click="userUnLock()">잠김햬제</v-btn> -->
        <v-btn color="btn-secondary" text @click="cancelUserInfo()">{{ $t('button.cancel')}}</v-btn>
        <v-btn color="btn-secondary" text v-if="inputForm.delYn === 'N'" @click="delReasonInfo()">{{ $t('button.delete')}}</v-btn>
        <v-btn color="btn-primary" text v-if="inputForm.delYn === 'N'" @click="setUserInfo()">{{ $t('button.save')}}</v-btn>
      </v-card-actions>
      <v-dialog
        v-model="popupDelReasonView"
        width="490"
        persistent
      >
        <v-card v-if="popupDelReasonView === true" class="dialog-del-reason">
          <v-card-title>
            <span class="headline">삭제 사유 입력</span>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="delForm"
              v-model="delValid"
            >
              <v-container>
                <v-row>
                  <v-col cols="2">
                    <span class="label must">{{ $t('label.delReason')}}</span>
                  </v-col>
                  <v-col>
                    <v-text-field
                      class="default mt-0 pt-0"
                      :type="'text'"
                      hide-details="auto"
                      single-line
                      v-model="inputForm.delReason"
                      :rules="[
                        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '삭제사유를 입력하세요',
                        v => (!!v && v.length < 300) || $t('message.inputMaxLength', ['300'])
                      ]"
                      oninput="javascript: if (this.value.length > 300) this.value = this.value.substring(0, 300)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions class="submit-btns-group">
            <v-spacer></v-spacer>
            <v-btn color="btn-secondary" text @click="popupDelReasonView = false">{{ $t('button.cancel')}}</v-btn>
            <v-btn color="btn-primary" text @click="delUserInfo">{{ $t('button.save')}}</v-btn>
          </v-card-actions>
          <v-btn
            class="default dialogclose"
            text
            @click="popupDelReasonView = false"
            :ripple="false"
          >
            <span class="hide">팝업 닫기</span>
          </v-btn>
        </v-card>
      </v-dialog>
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
  reqDeleteUser,
  updateUser,
  reqUpdateView,
  reqUpdateUserUnLock,
  reqUpdateUserPswBySau
} from '../../api/user'

export default {

  name: 'UpdateUserView',

  components: {},

  data () {
    return {
      userId: this.$route.params.userId,
      delValid: true,
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
      itemsSystem: [],
      authUserList: [],
      /* input start */
      inputForm: {
        userId: '',
        userNm: '',
        userEmail: '',
        tenant: '',
        userDeptNm: '',
        userPosition: '',
        userPhone: '',
        userAuth: '',
        locale: 'KO',
        useYn: '',
        delYn: '',
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
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이메일ID를 입력하세요',
        v => /^[0-9a-zA-Z-_.]*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,5}$/i.test(v) || '이메일 형식을 확인해 주세요'
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
      /* validate end */

      valid: true,
      singleSelect: false,
      sectionTitle: '기본 정보',
      sectionTitle2: '서비스 정보',
      popupDelReasonView: false,
      popupServiceAddView: false
    }
  },

  created: function () {
  },
  mounted: async function () {
    await this.getSelectOption()
    await this.updateUserView()
  },
  watch: {
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
        return c.opt1 === item.serviceTenantId && c.opt2 === item.serviceId
      })
    },
    filterChatbot: function (item) {
      return this.itemsChatbot ? this.itemsChatbot.filter(c => {
        return c.opt1 === item.serviceTenantId && c.opt2 === item.serviceId
      }) : []
    },
    getSelectOption: function () {
      getSelectOption().then(
        response => {
          this.itemsTenant = response.data.result.tenantList
          this.itemsUserAuth = response.data.result.userAuthList
          this.itemsLocale = response.data.result.localeList
          this.itemsChatbot = response.data.result.chatbotList
          this.itemsAuthType = response.data.result
          this.authUserList = response.data.result.authUserList
          this.itemsSystem = response.data.result.systemInfoList
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
    updateUserView () {
      const searchCondition = {
        userId: this.userId
      }
      reqUpdateView(searchCondition).then(
        response => {
          this.inputForm.userId = response.data.result.userId
          this.inputForm.userNm = response.data.result.userNm
          this.inputForm.userEmail = response.data.result.userEmail
          this.inputForm.tenant = response.data.result.tenantId
          this.inputForm.userDeptNm = response.data.result.userDeptNm
          this.inputForm.userPosition = response.data.result.userPosition
          this.inputForm.userPhone = response.data.result.userPhone
          this.inputForm.userAuth = response.data.result.userAuthCd
          this.inputForm.locale = response.data.result.localeCd
          this.inputForm.useYn = response.data.result.useYn
          this.inputForm.ssoUserId = response.data.result.ssoUserId
          this.inputForm.ssoCompanyCd = response.data.result.ssoCompanyCd
          this.inputForm.ssoDeptCd = response.data.result.ssoDeptCd
          this.inputForm.orgUseYn = response.data.result.useYn
          this.inputForm.delYn = response.data.result.delYn
          this.inputForm.delReason = response.data.result.delReason
          this.inputForm.authUserList = response.data.result.authUserList
          this.inputForm.systemIds = response.data.result.systemIds
          this.inputForm.systemIdList = response.data.result.systemIdList
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    setUserInfo: function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          userId: this.inputForm.userId,
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
        updateUser(input).then(
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
      }
    },
    delReasonInfo: function () {
      this.inputForm.delReason = ''
      this.popupDelReasonView = true
    },
    delUserInfo: function () {
      if (this.$refs.delForm.validate() && confirm('삭제하시겠습니까?')) {
        const input = {
          userId: this.inputForm.userId,
          userNm: this.inputForm.userNm,
          userEmail: this.inputForm.userEmail,
          tenantId: this.inputForm.tenant,
          userDeptNm: this.inputForm.userDeptNm,
          userPosition: this.inputForm.userPosition,
          userPhone: this.inputForm.userPhone,
          userAuthCd: this.inputForm.userAuth,
          useYn: this.inputForm.useYn,
          delReason: this.inputForm.delReason
        }
        reqDeleteUser(input).then(
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
      }
    },
    cancelUserInfo: function () {
      this.$router.push({ name: 'ListUserView', query: { t: new Date().getTime() } })
    },
    userUnLock: function () {
      if (confirm('잠김해제 하시겠습니까?')) {
        const input = {
          userId: this.inputForm.userId,
          userNm: this.inputForm.userNm,
          userEmail: this.inputForm.userEmail,
          tenantId: this.inputForm.tenant,
          userDeptNm: this.inputForm.userDeptNm,
          userPosition: this.inputForm.userPosition,
          userPhone: this.inputForm.userPhone,
          userAuthCd: this.inputForm.userAuth,
          useYn: this.inputForm.useYn
        }
        reqUpdateUserUnLock(input).then(
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
      }
    },
    resetPassword: function () {
      const input = {
        userId: this.inputForm.userId,
        userNm: this.inputForm.userNm,
        userEmail: this.inputForm.userEmail,
        tenantId: this.inputForm.tenant,
        userDeptNm: this.inputForm.userDeptNm,
        userPosition: this.inputForm.userPosition,
        userPhone: this.inputForm.userPhone,
        userAuthCd: this.inputForm.userAuth,
        useYn: this.inputForm.useYn,
        localeCd: this.inputForm.locale
      }
      reqUpdateUserPswBySau(input).then(
        response => {
          if (response.data.status === 200) {
            alert('비밀번호가 초기화 되었습니다.')
          }
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
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
    .submit-btns-group {
      margin-top: -4px;
    }
  }
</style>
