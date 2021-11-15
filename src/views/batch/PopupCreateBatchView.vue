<template>
  <v-card class="dialog-batch">
    <v-card-title>
    <span class="headline">배치 등록</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col cols="2">
            <span class="label must">배치명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.batchNm"
              :rules="batchNmRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">Class 경로</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.classNm"
              :rules="classNmRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">배치수행 서버IP</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.serverIp"
              :rules="serverIpRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">설명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.batchDesc"
              :rules="batchDescRules"
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
            <v-radio-group v-model="inputForm.useYn" :mandatory="false" class="default mt-1 pt-0" row>
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
      <v-btn color="btn-primary" text @click="setBatch">{{ $t('button.save')}}</v-btn>
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
  createBatch
} from '../../api/batch'

import lodash from 'lodash'

export default {

  name: 'PopupCarateBatchView',

  components: {
  },

  data () {
    return {
      valid: true,
      /* input start */
      inputForm: {
        batchId: '',
        batchNm: '',
        classNm: '',
        serverIp: '',
        batchDesc: '',
        useYn: 'Y'
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
      batchIdRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '배치ID를 입력하세요',
        v => (!!v && v.length < 30) || this.$t('message.inputMaxLength', ['30'])
      ],
      batchNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '배치명을 입력하세요',
        v => (!!v && v.length < 30) || this.$t('message.inputMaxLength', ['30'])
      ],
      classNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'Class 경로를 입력하세요',
        v => (!!v && v.length < 80) || this.$t('message.inputMaxLength', ['80'])
      ],
      serverIpRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '배치수행 서버IP를 입력하세요',
        /* eslint-disable */
        v => /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/i.test(v) || 'IP주소 형식을 확인해 주세요'
        /* eslint-disable */
      ],
      batchDescRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '설명을 입력하세요',
        v => (!!v && v.length < 200) || this.$t('message.inputMaxLength', ['200'])
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    setBatch: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          batchId: this.inputForm.batchId,
          batchNm: this.inputForm.batchNm,
          classNm: this.inputForm.classNm,
          serverIp: this.inputForm.serverIp,
          batchDesc: this.inputForm.batchDesc,
          useYn: this.inputForm.useYn
        }
        createBatch(input).then(
          response => {
            if (response.data.status === 200) {
              this.$emit('refresh-list')
              this.$emit('close-dialog')
            }
          }//,
          // error => {
          //  console.error(error)
          //  delete sessionStorage.accessToken
          //  this.$router.push('/Login')
          // }
        )
      }
    }, 300)
  },

  watch: {},

  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
