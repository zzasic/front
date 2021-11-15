<template>
  <v-card class="dialog-userinfo">
    <v-card-title>
    <span class="headline">{{ $t('pageInfo.pageTitle101')}}</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col class="col-head">
            <span class="label">{{ $t('label.userNm')}}</span>
          </v-col>
          <v-col>
            {{inputForm.userNm}}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-head">
            <span class="label">{{ $t('label.email')}}</span>
          </v-col>
          <v-col>
            {{inputForm.userEmail}}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-head">
            <span class="label">{{ $t('label.companyNm')}}</span>
          </v-col>
          <v-col>
            {{inputForm.tenant.text}}
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('label.deptNm')}}</span>
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
        <v-row>
          <v-col class="col-head">
            <span class="label">직급</span>
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
        <v-row>
          <v-col class="col-head">
            <span class="label must">{{ $t('label.phoneNo')}}</span>
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
        <v-row v-if="inputForm.itemsLocale && inputForm.itemsLocale.length > 1">
          <v-col class="col-head">
            <span class="label must">{{ $t('label.lang')}}</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.locale ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.locale"
              :rules="localeRules"
              :items="inputForm.itemsLocale"
              return-object
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="setUserInfo">{{ $t('button.save')}}</v-btn>
    </v-card-actions>
    <div class="dialog-info">
      {{ $t('message.withdrawMsg1')}}
      <v-btn
        class="default btn-here"
        text
        @click="deleteUserInfoChkClick"
        :ripple="false"
      >{{ $t('message.withdrawMsg2')}}</v-btn>
      {{ $t('message.withdrawMsg3')}}
    </div>
    <v-btn
      class="default dialogclose"
      text
      @click="$emit('close-dialog')"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
    <!-- popup start -->
    <v-dialog
      v-model="dialogLookupDeleteUserInfo.popupConfirmDeleteUserInfoView"
      width="425"
      persistent
    >
    <!-- ######### popup ######### -->
      <popup-confirm-delete-user-info-view
        @close-dialog="closeDialogDeleteUserInfo"
        v-if="dialogLookupDeleteUserInfo.popupConfirmDeleteUserInfoView"
      />
    </v-dialog>
    <!-- popup end -->
  </v-card>
</template>

<script>
import popupConfirmDeleteUserInfoView from '@/views/user/PopupConfirmDeleteUserInfoView'

import {
  getSelectOption,
  reqSelectProfile,
  reqUpdateProfile
} from '../../api/user'

import lodash from 'lodash'

export default {

  components: {
    popupConfirmDeleteUserInfoView
  },
  data () {
    return {
      valid: true,
      /* popup start */
      dialogLookupDeleteUserInfo: {
        popupConfirmDeleteUserInfoView: false
      },
      /* popup end */

      /* input start */
      inputForm: {
        itemsTenant: [],
        itemsLocale: [],
        userNm: '',
        userEmail: '',
        tenant: '',
        userDeptNm: '',
        userPosition: '',
        userPhone: '',
        locale: ''
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
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이름을 입력하세요'
      ],
      tenantRules: [
        v => !!v || '회사를 선택하세요'
      ],
      userDeptNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '부서를 입력하세요',
        v => (!!v && v.length < 20) || this.$t('message.inputMaxLength', ['20'])
      ],
      userPositionRules: [
        v => ((!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) && v.length <= 64) || !v || '직급은 64자리 이내로 입력해 주세요'
      ],
      userPhoneRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '연락처를 입력하세요',
        /* eslint-disable */
        v => /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/.test(v) || '연락처 형식을 확인해 주세요'
        /* eslint-disable */
      ],
      localeRules: [
        v => !!v || '언어를 선택하세요'
      ],
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    changeLanguage (language) {
      this.$i18n.locale = language.toLowerCase()
      window.localStorage.localeCode = language.toLowerCase()
    },
    /* popup start */
    closeDialogDeleteUserInfo: function () {
      this.dialogLookupDeleteUserInfo.popupConfirmDeleteUserInfoView = false
    },
    /* popup end */
    deleteUserInfoChkClick () {
      this.dialogLookupDeleteUserInfo.popupConfirmDeleteUserInfoView = true
    },
    getSelectOption: function () {
      getSelectOption().then(
        response => {
          this.inputForm.itemsTenant = response.data.result.tenantList
          this.inputForm.itemsLocale = response.data.result.localeList
        }
      );
    },
    updateUserView () {
      reqSelectProfile().then(
        response => {
          this.inputForm.userNm = response.data.result.userNm
          this.inputForm.userEmail = response.data.result.userEmail
          this.inputForm.tenant = {text: response.data.result.tenantNm, value: response.data.result.tenantId}
          this.inputForm.userDeptNm = response.data.result.userDeptNm
          this.inputForm.userPosition = response.data.result.userPosition
          this.inputForm.userPhone = response.data.result.userPhone
          this.inputForm.locale = {text: response.data.result.localeNm, value: response.data.result.localeCd}
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
    setUserInfo: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        const input = {
          userDeptNm: this.inputForm.userDeptNm,
          userPosition: this.inputForm.userPosition,
          userPhone: this.inputForm.userPhone,
          localeCd: this.inputForm.locale.value
        }
        if (!confirm(this.$t('alert.updateUserInfo.save'))) {
          return
        }
        reqUpdateProfile(input).then(
          response => {
            if (response.data.status === 200) {
              this.changeLanguage(this.inputForm.locale.value)
              this.$emit('close-dialog')
              this.$router.go(0)

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
    }, 300)
  },

  watch: {},

  created () {
    this.getSelectOption()
  },

  mounted () {
    this.updateUserView()
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
