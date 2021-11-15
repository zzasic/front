<template>
  <v-card class="dialog-counselor">
    <v-card-title>
    <span class="headline">AI 상담원 등록</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
      <v-container>
        <v-row>
          <v-col cols="2">
            <span class="label must">ID</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.counselorId"
              :rules="counselorIdRules"
              hide-details="auto"
              outlined
              dense
              oninput="javascript: if (this.value.length > 32) this.value = this.value.substring(0, 32)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">내선번호</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.extension"
              :valid="valid"
              ref="extension"
              :error-messages="errorMessages"
              :success-messages="successMessages"
              :rules="extensionRules"
              hide-details="auto"
              required
              outlined
              dense
              oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
            ></v-text-field>
          </v-col>
           <v-col>
            <v-card-actions class="btn-add-code-type ml-2 pt-0">
              <v-btn class="btn-naked-primary" text :ripple="false" @click="extensionDupCheck">중복확인</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label ">패스워드</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.password"
              :rules="passwordRules"
              hide-details="auto"
              outlined
              dense
              oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label ">CTI ID</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.ctiId"
              hide-details="auto"
              outlined
              dense
              oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">Call Group</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.callGroupId ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.callGroupId"
              :rules="callGroupNoRules"
              :items="itemCallGroups"
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
              v-model="inputForm.tenantId"
              :items="tenants"
              :rules="tenantIdRules"
              :placeholder="inputForm.tenantId ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label ">UDP 포트</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.port"
              :rules="portRules"
              hide-details="auto"
              outlined
              dense
              oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">사용 여부</span>
          </v-col>
          <v-col>
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.useYn"
              :mandatory="false"
              row>
              <v-radio
                :ripple="false"
                v-for="(use, idx) in useYns" :key="idx"
                :label="use.text"
                :value="use.value"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="saveBtn">{{ $t('button.save')}}</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="closeBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import {
  createCounselorView,
  extensionDupCheck,
  createCounselor
} from '@/api/counselor'

export default {

  name: 'PopupCreateCounselorView',

  components: {
  },

  data () {
    return {
      valid: true,
      lazy: true,
      /* input start */
      bExtensionDupCheck: false,
      errorMessages: [],
      successMessages: [],
      callGroups: [],
      inputForm: {
        counselorId: '', // ID
        tenantId: '', // 테넌트 ID
        extension: '', // 내선번호
        password: '', // 패스워드
        ctiId: '', // CTI ID
        port: '', // UDP 포트
        useYn: 'Y', // 사용여부
        callGroupId: ''
      },
      /* input end */
      tenants: [], // 테넌트 목록
      useYns: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ], // 사용여부

      /* validate start */
      counselorIdRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        value => value.length <= 32 || '32자리를 넘을 수 없습니다.'
      ],
      tenantIdRules: [
        value => !!value || '테넌트를 선택해주세요'
      ],
      extensionRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || '내선번호를 입력하세요',
        value => /^[0-9]+$/.test(value) || '숫자만 입력하세요.',
        value => value.length <= 6 || '5자리를 넘을 수 없습니다.'
      ],
      callGroupNoRules: [
        v => !!v || 'Call Group을 선택하세요'
      ],
      portRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || '포트를 입력하세요',
        value => value.length <= 5 || '5자리를 넘을 수 없습니다.',
        value => /^[0-9]+$/.test(value) || '숫자만 입력하세요.'
      ],
      passwordRules: [
        value => value.length <= 5 || '5자리를 넘을 수 없습니다.',
        value => /^[0-9]+$/.test(value) || '숫자만 입력하세요.'
      ]
      /* validate end */
    }
  },

  watch: {
    'inputForm.extension': function (newVal, oldVal) {
      this.bExtensionDupCheck = false
      this.successMessages = []
      this.errorMessages = []
    }
  },

  computed: {
    itemCallGroups: function () {
      return (this.callGroups || [])
    }
  },

  methods: {
    createCounselorView: function () {
      createCounselorView().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.tenants = response.data.result.tenantList // 테넌트 목록
            this.useYns = response.data.result.useYnList // 사용여부
            this.callGroups = response.data.result.callGroupList
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
    },
    extensionDupCheck: function () {
      const valid = this.$refs.extension.validate()
      this.errorMessages = valid ? [] : this.$refs.extension.errorBucket
      if (!valid) {
        this.bExtensionDupCheck = false
        return
      }
      this.errorMessages = []
      const input = {
        extension: this.inputForm.extension
      }
      extensionDupCheck(input).then(
        response => {
          if (response.data.status === 200) {
            this.bExtensionDupCheck = response.data.result
            if (this.bExtensionDupCheck === true) {
              // this.successMessages = ['사용가능한 내선번호입니다.']
              alert('사용가능한 내선번호입니다.')
              const context = this
              setTimeout(function () {
                context.successMessages = []
              }, 1500)
              this.errorMessages = []
            } else {
              this.successMessages = []
              // this.errorMessages = ['내선번호가 중복입니다.']
              alert('내선번호가 중복입니다.')
            }
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
    },
    createCounselor: function () {
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const input = {
        counselorId: this.inputForm.counselorId,
        tenantId: this.inputForm.tenantId,
        extension: this.inputForm.extension,
        password: this.inputForm.password,
        ctiId: this.inputForm.ctiId,
        port: this.inputForm.port,
        useYn: this.inputForm.useYn,
        callGroupId: this.inputForm.callGroupId
      }
      createCounselor(input).then(
        response => {
          if (response.data.status === 200) {
            this.closeBtn()
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
    },
    closeBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        updateView: false,
        batchView: false
      })
    },
    cancelBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        updateView: false,
        batchView: false
      })
    },
    saveBtn: function () {
      const valid = this.$refs.form.validate() && this.bExtensionDupCheck
      if (this.$refs.extension.validate() === true && !this.errorMessage && this.bExtensionDupCheck === false) {
        this.errorMessages = ['내선번호 중복확인을 하세요']
      }
      if (valid === true) {
        this.createCounselor()
      }
    }
  },
  created () {
    this.createCounselorView()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
