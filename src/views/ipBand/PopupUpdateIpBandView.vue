<template>
  <v-card class="dialog-ipBV">
    <v-card-title>
    <span class="headline">IP 대역 수정</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col cols="2">
            <span class="label must">시작 IP주소</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.startAddress"
              :rules="ipRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">종료 IP주소</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.endAddress"
              :rules="ipRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">IP명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.ipNm"
              :rules="ipNmRules"
              hide-details="auto"
              outlined
              dense
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
              v-model="inputForm.remark"
              :rules="remarkRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">사용 여부</span>
          </v-col>
          <v-col>
            <v-radio-group v-model="inputForm.useYn" :mandatory="false" class="default mt-0 pt-0" row>
              <v-radio :ripple="false" v-for="(use, idx) in useYns" :key="idx" :label="use.text" :value="use.value"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-secondary" text @click="delIpBand()">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="setIpBand">{{ $t('button.save')}}</v-btn>
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
  reqUpdateIpBand,
  reqDeleteIpBand
} from '../../api/ipBand'

import lodash from 'lodash'

export default {

  name: 'AuUserGroupPopupList',

  components: {
  },
  props: {
    editedItem: Object
  },
  data () {
    return {
      valid: true,
      /* input start */
      inputForm: [],
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
      ipRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'IP주소를 입력하세요',
        /* eslint-disable */
        v => /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/i.test(v) || 'IP주소 형식을 확인해 주세요'
        /* eslint-disable */
      ],
      ipNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'IP명을 입력하세요',
        v => !!v && v.length <= 128 || 'IP명은 128자리 이내로 입력해 주세요'
      ],
      remarkRules: [
        v => !!v && v.length <= 128 || !v || '설명은 128자리 이내로 입력해 주세요'
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    setIpBand: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          ipBandId: this.inputForm.ipBandId,
          startAddress: this.inputForm.startAddress,
          endAddress: this.inputForm.endAddress,
          ipNm: this.inputForm.ipNm,
          remark: this.inputForm.remark,
          useYn: this.inputForm.useYn
        }
        reqUpdateIpBand(input).then(
          response => {
            if (response.data.status === 200) {
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
    delIpBand: lodash.debounce(function () {
      if (confirm('삭제하시겠습니까?')) {
        const input = [{
          ipBandId: this.inputForm.ipBandId,
          startAddress: this.inputForm.startAddress,
          endAddress: this.inputForm.endAddress,
          ipNm: this.inputForm.ipNm,
          remark: this.inputForm.remark,
          useYn: this.inputForm.useYn
        }]
        reqDeleteIpBand(input).then(
          response => {
            if (response.data.status === 200) {
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
    }, 300)
  },
  watch: {},
  created () {
  },
  mounted () {
    this.inputForm = this.editedItem
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
