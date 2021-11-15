<template>
  <v-card class="dialog-stt">
    <v-card-title>
    <span class="headline">STT 등록</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col cols="2">
            <span class="label must">ID</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.sttId"
              :rules="sttIdRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">STT명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.sttNm"
              :rules="sttNmRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">통신방식</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.apiType"
              :items="apiTypes"
              :rules="apiTypeRules"
              :placeholder="inputForm.apiType ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">URL</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.sttUrl"
              :rules="sttUrlRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">STT엔진</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.sttEngine"
              :items="sttEngines"
              :rules="sttEngineRules"
              :placeholder="inputForm.sttEngine ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
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
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="setStt">{{ $t('button.save')}}</v-btn>
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
  initSttView,
  createStt
} from '../../api/stt'

import lodash from 'lodash'

export default {

  name: 'PopupCreateSttView',

  components: {
  },

  data () {
    return {
      valid: true,
      /* input start */
      inputForm: {
        sttId: '',
        sttNm: '',
        sttUrl: '',
        sttEngine: '',
        apiType: '',
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
      sttEngines: [],
      apiTypes: [],

      /* validate start */
      sttIdRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        v => (!!v && v.length <= 36) || 'ID는 36자리 이내로 입력해 주세요'
      ],
      sttNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'STT명를 입력하세요',
        v => (!!v && v.length <= 200) || 'STT명은 200자리 이내로 입력해 주세요'
      ],
      sttUrlRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'URL을 입력하세요',
        v => (!!v && v.length <= 300) || 'URL은 300자리 이내로 입력해 주세요'
      ],
      sttEngineRules: [
        v => !!v || 'STT엔진을 선택하세요'
      ],
      apiTypeRules: [
        v => !!v || '통신방식을 선택하세요'
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    initSttView () {
      initSttView().then(
        response => {
          this.sttEngines = response.data.result.sttEngineList
          this.apiTypes = response.data.result.apiTypeList
        }
      )
    },
    setStt: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          sttId: this.inputForm.sttId,
          sttNm: this.inputForm.sttNm,
          sttUrl: this.inputForm.sttUrl,
          sttEngine: this.inputForm.sttEngine,
          apiType: this.inputForm.apiType,
          useYn: this.inputForm.useYn
        }
        createStt(input).then(
          response => {
            if (response.data.status === 200) {
              this.$emit('refresh-list')
              this.$emit('close-dialog')
            }
          }
        )
      }
    }, 300)
  },

  watch: {},

  created () {
    this.initSttView()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
