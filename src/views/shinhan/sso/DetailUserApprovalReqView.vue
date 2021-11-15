<template>
  <v-card class="dialog-userinfo">
    <v-card-title>
    <span class="headline">AI Connect 사용 정보 등록</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>

        <!-- SSO ID -->
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.ssoUserId')}}</span>
          </v-col>
          <v-col>
            {{inputForm.ssoUserId}}
          </v-col>
        </v-row>

        <!-- 이름 -->
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.userNm')}}</span>
          </v-col>
          <v-col>
            {{inputForm.userNm}}
          </v-col>
        </v-row>

        <!-- 시스템 -->
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.systemIds')}}</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.systemIdsList && inputForm.systemIdsList.length > 0 ? undefined : '선택'"
              hide-details="auto"
              v-model="inputForm.systemIdsList"
              single-line
              :items="itemSystemList"
              :rules="systemIdRules"
              clearable
              multiple
            ></v-select>
          </v-col>
        </v-row>

        <!-- 메일 -->
        <v-row>
          <v-col class="col-head">
            <span class="label">{{ $t('shinhan.sso.userEmail')}}</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              placeholder="010-0000-0000"
              hide-details="auto"
              single-line
              v-model="inputForm.userEmail"
              :rules="userEmailRules"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- 연락처 -->
        <v-row>
          <v-col class="col-head">
            <span class="label">{{ $t('shinhan.sso.userPhone')}}</span>
          </v-col>
          <v-col>
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

        <!-- 부서 -->
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
              :rules="userDeptNmRules"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- 직급 -->
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
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- 권한 -->
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
              clearable
            ></v-select>
          </v-col>
        </v-row>

        <!-- 처리상태 -->
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('shinhan.sso.reqStatus')}}</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.reqStatus"
              :items="status"
              clearable
            ></v-select>
          </v-col>
        </v-row>

      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="fnc_useApprovalPermit">{{ $t('button.save')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  getSsoUseApprovalReqDetailInfo,
  setSsoUseApprovalReqPermit
} from '../../../api/shinhan/sso'

import lodash from 'lodash'

export default {

  components: {
  },
  props: {
    editedItem: Object
  },
  data () {
    return {
      valid: true,
      status: [
        {
          text: '승인 대기중',
          value: 'REQ'
        },
        {
          text: '처리완료',
          value: 'APL'
        },
        {
          text: '반려',
          value: 'REJ'
        }
      ],
      userAuthCdList: [],
      dialogLookupDeleteUserInfo: {
        popupConfirmDeleteUserInfoView: false
      },
      itemSystemList: [],
      inputForm: {
        reqNo: '',
        ssoUserId: '',
        userEmail: '',
        systemIds: '',
        systemIdsList: [],
        userNm: '',
        userDeptNm: '',
        userPosition: '',
        userPhone: '',
        reqStatus: '',
        userAuthCd: ''
      },
      userNmRule: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이름을 입력해주세요'
      ],
      userEmailRules: [
        // v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이메일을 입력하세요',
        v => /^[0-9a-zA-Z-_.]*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,5}$/i.test(v) || '이메일 형식을 확인해 주세요',
        v => (!!v && v.length < 50) || this.$t('message.inputMaxLength', ['50'])
      ],
      userPhoneRules: [
        /* eslint-disable */
        v => /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/.test(v) || '연락처 형식을 확인해 주세요'
        /* eslint-disable */
      ],
      userDeptNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '부서를 입력해주세요',
        v => (!!v && v.length < 20) || this.$t('message.inputMaxLength', ['20'])
      ],
      userPositionRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '직급을 입력해주세요',
        v => ((!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) && v.length <= 64) || !v || '직급은 64자리 이내로 입력해 주세요'
      ],
      systemIdRules: [
        v => !!v || '시스템권한을 선택하세요'
      ],
    }
  },

  computed: {
    cptdUserAuthCdList () {
      const userAuthCdList = []
      userAuthCdList.push(...this.userAuthCdList)
      return userAuthCdList
    }
  },

  methods: {
    fnc_getUseApprovalReqDetail: function () {
      const searchForm = {
        reqNo: this.inputForm.reqNo
      }
      getSsoUseApprovalReqDetailInfo(searchForm).then(
        response => {
          this.userAuthCdList = response.data.result.userAuthList ? response.data.result.userAuthList : []
          this.itemSystemList = response.data.result.systemInfoList ? response.data.result.systemInfoList : [] // 전체 사용 가능 시스템
          this.inputForm.systemIds = response.data.result.ssoDetailInfo.systemIds // 초반 사용 시스템 default : aicc
          this.inputForm.systemIdsList = response.data.result.ssoDetailInfo.systemIdList // 선택된 사용 시스템
          this.inputForm.ssoUserId = response.data.result.ssoDetailInfo.ssoUserId
          this.inputForm.userEmail = response.data.result.ssoDetailInfo.userEmail
          this.inputForm.userNm = response.data.result.ssoDetailInfo.userNm
          this.inputForm.userDeptNm = response.data.result.ssoDetailInfo.userDeptNm
          this.inputForm.userPosition = response.data.result.ssoDetailInfo.userPosition
          this.inputForm.userPhone = response.data.result.ssoDetailInfo.userPhone
          this.inputForm.reqStatus = response.data.result.ssoDetailInfo.reqStatus
          this.inputForm.userAuthCd = response.data.result.ssoDetailInfo.userAuthCd
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
    },
    fnc_useApprovalPermit: lodash.debounce(function () { // 중복 클릭 방지를 위해 lodash.debounce 사용
      if (this.inputForm.reqStatus == 'REQ') {
        alert('저장 상태를 변경해주세요.')
        return
      }
      if (this.$refs.form.validate()) {
        if (!confirm('처리상태를 변경하시겠습니까?')){
          return
        }
        const input = {
          reqNo: this.inputForm.reqNo,
          ssoUserId: this.inputForm.ssoUserId,
          userNm: this.inputForm.userNm,
          systemIds: this.inputForm.systemIds,
          systemIdList: this.inputForm.systemIdsList,
          userDeptNm: this.inputForm.userDeptNm,
          userPosition: this.inputForm.userPosition,
          userPhone: this.inputForm.userPhone,
          userEmail: this.inputForm.userEmail,
          reqStatus: this.inputForm.reqStatus,
          userAuthCd: this.inputForm.userAuthCd
        }
        setSsoUseApprovalReqPermit(input).then(
          response => {
            if (response.data.status === 200) {
              alert('처리가 완료되었습니다.')
              this.$emit('refresh-list')
              this.$emit('close-dialog')
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
  },

  watch: {},

  created () {
    this.inputForm.reqNo = this.editedItem.reqNo
    // this.getSelectOption()
  },

  mounted () {
    this.fnc_getUseApprovalReqDetail()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .transaction {
    margin-top: -24px;
  }
  .dialog-userinfo {
    .col {
      font-size: 12px;
      color: #2C3238;
    }
  }

</style>
