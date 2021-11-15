<template>
  <v-card class="dialog-tenant">
    <v-card-title>
    <span class="headline">테넌트 등록</span>
    </v-card-title>
    <v-card-text>
      <vuescroll>
        <v-form
          ref="form"
          v-model="valid"
        >
        <v-container>
          <v-row>
            <v-col cols="1">
              <span class="label must">ID</span>
            </v-col>
            <v-col cols="4">
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.tenantId"
                :rules="[tenantIdRules.required, tenantIdRules.minLength, tenantIdRules.alphanumber]"
                hide-details="auto"
                outlined
                dense
                oninput="javascript: if (this.value.length > 12) this.value = this.value.substring(0, 12)"
              ></v-text-field>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label must">테넌트명</span>
            </v-col>
            <v-col cols="4">
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.tenantNm"
                :rules="[tenantNmRules.required, tenantNmRules.minLength]"
                hide-details="auto"
                outlined
                dense
                oninput="javascript: if (this.value.length > 64) this.value = this.value.substring(0, 64)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1">
              <span class="label must">STT</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.sttId"
                :items="stts"
                :rules="sttIdRules"
                :placeholder="inputForm.sttId ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label ">TA</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.taId"
                :items="tas"
                :placeholder="inputForm.taId ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1">
              <span class="label must">TTS</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.ttsId"
                :items="ttss"
                :rules="ttsIdRules"
                :placeholder="inputForm.ttsId ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label must">화자 구분</span>
            </v-col>
            <v-col cols="4">
              <v-radio-group
                class="default mt-1 pt-0"
                v-model="inputForm.speakerGenderYn"
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
          <v-row>
            <v-col cols="1">
              <span class="label">기본 화자</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.speaker"
                :items="ttsSpeakers"
                :placeholder="inputForm.speaker ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label">화자2</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.speaker2"
                :items="ttsSpeakers"
                :placeholder="inputForm.speaker2 ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1">
              <span class="label must">DTMF 종료</span>
            </v-col>
            <v-col cols="4">
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.dtmfEndDigit"
                :rules="dtmfEndDigitRules"
                placeholder="'#' 또는 '*'를 입력하세요"
                clearable
                hide-details="auto"
                required
                oninput="javascript: if (this.value.length > 1) this.value = this.value.substring(0, 1)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1">
              <span class="label must">순서</span>
            </v-col>
            <v-col cols="4">
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.sortOrder"
                :rules="sortOrderRules"
                placeholder="숫자로 입력하세요"
                clearable
                hide-details="auto"
                required
                oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
              ></v-text-field>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label must">사용 여부</span>
            </v-col>
            <v-col cols="4">
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
      </vuescroll>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="setTenant">{{ $t('button.save')}}</v-btn>
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
  reqInitTenantView,
  reqCreateTenant
} from '../../api/tenant'

import lodash from 'lodash'

export default {

  name: 'PopupCreateTenantView',

  components: {
  },

  data () {
    return {
      valid: true,
      /* input start */
      inputForm: {
        tenantId: '',
        tenantNm: '',
        tenantEngNm: '',
        sortName: '',
        sortOrder: '',
        useYn: 'Y',
        sttId: '',
        sttModel: '0',
        ttsId: '',
        taId: '',
        speakerGenderYn: 'N',
        speaker: '',
        speaker2: '',
        ttsStopYn: 'N',
        sttSkipYn: 'Y',
        dtmfEndDigit: '',
        tenantTelList: [],
        tenantSystemList: []
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
      stts: [],
      ttss: [],
      tas: [],
      ttsSpeakers: [],
      chatbots: [],
      /* validate start */
      tenantIdRules: {
        required: value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        /* eslint-disable */
        minLength: v => v.length < 12 || '12자리가 넘을 수 없습니다.',
        alphanumber: v => /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(v) || '영문, 숫자 조합으로 입력해 주세요.'
        /* eslint-disable */
      },
      tenantNmRules: {
        // v => !!v || '테넌트명를 입력하세요'
        required: value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || '테넌트 명을 입력하세요',
        /* eslint-disable */
        minLength: v => v.length < 64 || '64자리가 넘을 수 없습니다.',
      },
      sttIdRules: [
        value => !!value || 'STT를 선택하세요'
      ],
      sttModelRules: [
        value => !!value || 'STT모델을 선택하세요'
      ],
      ttsIdRules: [
        value => !!value || 'TTS를 선택하세요'
      ],
      speakerRules: [
        value => !!value || 'TTS화자를 선택하세요'
      ],
      sortOrderRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '순서를 입력하세요',
        /* eslint-disable */
        v => /^[0-9]*$/.test(v) || '순서를 숫자로 입력해 주세요',
        /* eslint-disable */
        v => (!!v && v.length <= 5) || '순서를 5자리 이내로 입력해 주세요'
      ],
      dtmfEndDigitRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '가변길이 DTMF 종료문자를 입력하세요',
        /* eslint-disable */
        v => (!!v && v.length <= 1) || '가변길이 DTMF 종료문자를 1자리 이내로 입력해 주세요'
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    initTenantView () {
      reqInitTenantView().then(
        response => {
          this.stts = response.data.result.sttList // STT 목록
          this.ttss = response.data.result.ttsList // TTS 목록
          this.tas = response.data.result.taList // TA 목록
          this.ttsSpeakers = response.data.result.ttsSpeakerList // TTS 화자목록
          this.chatbots = response.data.result.chatbotList // 챗봇 목록
        }
      )
    },
    setTenant: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          tenantId: this.inputForm.tenantId,
          tenantNm: this.inputForm.tenantNm,
          tenantEngNm: this.inputForm.tenantEngNm,
          sortName: this.inputForm.sortName,
          sortOrder: this.inputForm.sortOrder,
          useYn: this.inputForm.useYn,
          sttId: this.inputForm.sttId,
          sttModel: '0',
          ttsId: this.inputForm.ttsId,
          taId: this.inputForm.taId,
          speakerGenderYn: this.inputForm.speakerGenderYn,
          speaker: this.inputForm.speaker,
          speaker2: this.inputForm.speaker2,
          ttsStopYn: 'N',
          sttSkipYn: 'Y',
          dtmfEndDigit: this.inputForm.dtmfEndDigit,
          tenantTelList: this.inputForm.tenantTelList,
          tenantSystemList: this.inputForm.tenantSystemList
        }
        reqCreateTenant(input).then(
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
    this.initTenantView()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
