<template>
  <v-card class="dialog-cmnCode addCode">
    <v-card-title>
    <span class="headline">공통코드 타입 신규 등록</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col cols="2">
            <span class="label must">코드유형</span>
          </v-col>
          <v-col cols="6" class="code-type">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.codeType"
              :rules="codeTypeRules"
            ></v-text-field>
          </v-col>
          <v-col cols="1" class="ml-2">
            <v-card-actions class="btn-add-code-type">
              <v-btn class="btn-naked-primary" text :ripple="false" @click="codeTypeDupCheck">중복확인</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">코드 유형명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.codeValue"
              :rules="codeValueRules"
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
              hide-details="auto"
              single-line
              v-model="inputForm.codeDesc"
              :rules="codeDescRules"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">취소</v-btn>
      <v-btn color="btn-primary" text @click="setCodeType">저장</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="$emit('close-dialog')"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import {
  createCodeType,
  codeTypeDupCheck
} from '../../api/cmnCode'

import lodash from 'lodash'

export default {

  name: 'AuUserGroupPopupList',

  components: {
  },

  data () {
    return {
      valid: true,
      /* input start */
      inputForm: {
        codeType: '',
        codeValue: '',
        codeDesc: ''
      },
      /* input end */

      /* validate start */
      codeTypeRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '코드유형을 입력하세요',
        /* eslint-disable */
        v => /^[A-Z_0-9]*$/.test(v) || '코드유형은 영문 대문자/숫자/특수문자(_)로만 입력해 주세요',
        /* eslint-disable */
        v => v.length <= 32 || '코드유형은 32자리 이내로 입력해 주세요'
      ],
      codeValueRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '공통코드 유형 명을 입력하세요',
        v => v.length <= 64 || '코드유형명은 64자리 이내로 입력해 주세요'
      ],
      codeDescRules: [
        v => !!v && v.length <= 128 || !v || '코드유형 설명은 128자리 이내로 입력해 주세요'
      ],
      codeTypeDupStat: false
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    setCodeType: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (this.codeTypeDupStat === true) {
          const input = {
            codeType: this.inputForm.codeType,
            codeValue: this.inputForm.codeValue,
            codeDesc: this.inputForm.codeDesc
          }
          createCodeType(input).then(
            response => {
              if (response.data.status === 200) {
                this.$emit('close-dialog')
                this.$emit('refresh-type')
              }
            },
            error => {
              console.error(error)
              delete sessionStorage.accessToken
              this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
            }
          )
        } else {
          alert('코드유형에 대한 중복확인이 필요합니다.')
        }
      }
    }, 300),
    codeTypeDupCheck: function () {
      if(this.inputForm.codeType === '') {
        alert('코드유형을 입력하세요')
      } else {
        const input = {
          codeType: this.inputForm.codeType
        }

        codeTypeDupCheck(input).then(
          response => {
            if (response.data.result) {
              alert('이미 등록된 코드유형 입니다.')
              this.codeTypeDupStat = false
            } else {
              alert('사용할 수 있는 코드유형 입니다.')
              this.codeTypeDupStat = true
            }
          }
        )
      }
    },
  },

  watch: {
    ['inputForm.codeType'] : function () {
      this.codeTypeDupStat = false
    }
  },

  created () {
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
