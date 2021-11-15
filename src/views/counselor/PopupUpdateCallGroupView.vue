<template>
  <v-card class="dialog-callGroup">
    <v-card-title>
    <span class="headline">Call Group 수정</span>
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
              v-model="inputForm.callGroupId"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">Call Group 번호</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.callGroupNo"
              :valid="valid"
              ref="callGroupNo"
              :error-messages="errorMessages"
              :success-messages="successMessages"
              :rules="callGroupNoRules"
              hide-details="auto"
              required
              outlined
              dense
              oninput="javascript: if (this.value.length > 8) this.value = this.value.substring(0, 8)"
            ></v-text-field>
          </v-col>
           <v-col>
            <v-card-actions class="btn-add-code-type ml-2 pt-0">
              <v-btn class="btn-naked-primary" text :ripple="false" @click="callGroupNoDupCheck">중복확인</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">노드번호</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.nodeNumber"
              :items="nodeNumbers"
              :rules="nodeNumberRules"
              :placeholder="inputForm.nodeNumber ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">통화유형</span>
          </v-col>
          <v-col>
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.callType"
              :mandatory="false"
              row>
              <v-radio
                :ripple="false"
                v-for="(use, idx) in callTypes" :key="idx"
                :label="use.text"
                :value="use.value"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
         <v-row>
          <v-col cols="2">
            <span class="label">시작 내선번호</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.startExtension"
              :rules="extensionRules"
              hide-details="auto"
              outlined
              dense
              oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label">종료 내선번호</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.endExtension"
              :rules="extensionRules"
              hide-details="auto"
              outlined
              dense
              oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label">설명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.groupDesc"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-secondary" text @click="deleteBtn">{{ $t('button.delete')}}</v-btn>
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
  updateCallGroupView,
  callGroupNoDupCheck,
  updateCallGroup,
  deleteCallGroup
} from '@/api/counselor'

export default {

  name: 'PopupUpdateCallGroupView',

  components: {
  },
  props: {
    callGroupId: String
  },
  data () {
    return {
      valid: true,
      lazy: true,
      /* input start */
      bCallGroupNoDupCheck: true,
      errorMessages: [],
      successMessages: [],
      nodeNumbers: [], // 노드번호 목록
      callTypes: [
        {
          text: '인바운드',
          value: 'IN'
        },
        {
          text: '아웃바운드',
          value: 'OUT'
        }
      ], // CallType
      inputForm: {
        callGroupId: '', // Call Group ID
        callGroupNo: '', // Call Group 번호
        callType: 'IN', // 통화유형(인바운드(IN),아웃바운드(OUT))
        startExtension: '', // 시작 내선번호
        endExtension: '', // 종료 내선번호
        nodeNumber: '', // 노드번호
        groupDesc: '' // 설명
      },
      /* input end */
      tenants: [], // 테넌트 목록
      /* validate start */
      callGroupIdRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        value => value.length <= 32 || '32자리를 넘을 수 없습니다.'
      ],
      callGroupNoRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || 'Call Group번호를 입력하세요',
        value => /^[0-9]+$/.test(value) || '숫자만 입력하세요.'
      ],
      extensionRules: [
        value => /^[0-9]+$/.test(value) || '숫자만 입력하세요.',
        value => value.length <= 6 || '5자리를 넘을 수 없습니다.'
      ],
      nodeNumberRules: [
        value => !!value || '노드번호를 선택해주세요'
      ]
      /* validate end */
    }
  },

  watch: {
    'inputForm.callGroupNo': function (newVal, oldVal) {
      if (oldVal) {
        this.bCallGroupNoDupCheck = false
        this.successMessages = []
        this.errorMessages = []
      }
    }
  },

  computed: {
  },

  methods: {
    updateCallGroupView: function () {
      updateCallGroupView(this.callGroupId).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.callTypes = response.data.result.callTypeList // 통화유형
            this.nodeNumbers = response.data.result.nodeNumberList // 노드번호 목록
            Object.assign(this.inputForm, response.data.result.callGroup)
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
    callGroupNoDupCheck: function () {
      const valid = this.$refs.callGroupNo.validate()
      this.errorMessages = valid ? [] : this.$refs.callGroupNo.errorBucket
      if (!valid) {
        this.bCallGroupNoDupCheck = false
        return
      }
      this.errorMessages = []
      const input = {
        exceptCallGroupId: this.callGroupId,
        callGroupNo: this.inputForm.callGroupNo
      }
      callGroupNoDupCheck(input).then(
        response => {
          if (response.data.status === 200) {
            this.bCallGroupNoDupCheck = response.data.result
            if (this.bCallGroupNoDupCheck === true) {
              this.successMessages = ['사용가능한 Call Group번호입니다.']
              const context = this
              setTimeout(function () {
                context.successMessages = []
              }, 1500)
              this.errorMessages = []
            } else {
              this.successMessages = []
              this.errorMessages = ['Call Group번호가 중복입니다.']
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
    updateCallGroup: function () {
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const input = {
        callGroupId: this.callGroupId,
        callGroupNo: this.inputForm.callGroupNo,
        callType: this.inputForm.callType,
        startExtension: this.inputForm.startExtension,
        endExtension: this.inputForm.endExtension,
        nodeNumber: this.inputForm.nodeNumber,
        groupDesc: this.inputForm.groupDesc
      }
      updateCallGroup(input).then(
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
        updateView: false
      })
    },
    cancelBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        updateView: false
      })
    },
    saveBtn: function () {
      const valid = this.$refs.form.validate() && this.bCallGroupNoDupCheck
      if (!this.errorMessage && this.bCallGroupNoDupCheck === false) {
        this.errorMessages = ['Call Group번호 중복확인을 하세요']
      }
      if (valid === true) {
        this.updateCallGroup()
      }
    },
    deleteBtn: function () {
      if (confirm('삭제하시겠습니까?')) {
        const input = {
          callGroupId: this.callGroupId
        }
        deleteCallGroup(input).then(
          response => {
            if (response.data.status === 200) {
              this.$emit('popupAction', {
                createView: false,
                updateView: false
              })
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
  },

  created () {
    this.updateCallGroupView()
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
