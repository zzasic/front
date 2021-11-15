<template>
  <v-card class="dialog-tts">
    <v-card-title>
    <span class="headline">TTS 등록</span>
    </v-card-title>
    <v-card-text>
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
              v-model="inputForm.ttsId"
              :rules="ttsIdRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">TTS명</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.ttsNm"
              :rules="ttsNmRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">통신방식</span>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">URL</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.ttsUrl"
              :rules="ttsUrlRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">TTS엔진</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.ttsEngine"
              :items="ttsEngines"
              :rules="ttsEngineRules"
              :placeholder="inputForm.ttsEngine ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label"></span>
          </v-col>
          <v-col cols="4">
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">기본 Speed</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.basicSpeed"
              :rules="speedRules"
              placeholder="숫자로 입력하세요"
              clearable
              hide-details="auto"
              required
              oninput="javascript: if (this.value.length > 3) this.value = this.value.substring(0, 3)"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">Speed 간격</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.speedInterval"
              :rules="speedRules"
              placeholder="숫자로 입력하세요"
              clearable
              hide-details="auto"
              required
              oninput="javascript: if (this.value.length > 3) this.value = this.value.substring(0, 3)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">최대 Speed</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.maxSpeed"
              :rules="speedRules"
              placeholder="숫자로 입력하세요"
              clearable
              hide-details="auto"
              required
              oninput="javascript: if (this.value.length > 3) this.value = this.value.substring(0, 3)"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label">최소 Speed</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.minSpeed"
              :rules="speedRules"
              placeholder="숫자로 입력하세요"
              clearable
              hide-details="auto"
              required
              oninput="javascript: if (this.value.length > 3) this.value = this.value.substring(0, 3)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">기본 Volume</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.basicVolume"
              :rules="volumeRules"
              placeholder="숫자로 입력하세요"
              clearable
              hide-details="auto"
              required
              oninput="javascript: if (this.value.length > 3) this.value = this.value.substring(0, 3)"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">Volume 간격</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.volumeInterval"
              :rules="volumeRules"
              placeholder="숫자로 입력하세요"
              clearable
              hide-details="auto"
              required
              oninput="javascript: if (this.value.length > 3) this.value = this.value.substring(0, 3)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">최대 Volume</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.maxVolume"
              :rules="volumeRules"
              placeholder="숫자로 입력하세요"
              clearable
              hide-details="auto"
              required
              oninput="javascript: if (this.value.length > 3) this.value = this.value.substring(0, 3)"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label">최소 Volume</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.minVolume"
              :rules="volumeRules"
              placeholder="숫자로 입력하세요"
              clearable
              hide-details="auto"
              required
              oninput="javascript: if (this.value.length > 3) this.value = this.value.substring(0, 3)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
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
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="setTts">{{ $t('button.save')}}</v-btn>
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
  initTtsView,
  createTts
} from '../../api/tts'

import lodash from 'lodash'

export default {

  name: 'PopupCreateTtsView',

  components: {
  },

  data () {
    return {
      valid: true,
      /* input start */
      inputForm: {
        ttsId: '',
        ttsNm: '',
        ttsUrl: '',
        ttsEngine: '',
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
      ttsEngines: [],
      apiTypes: [],

      /* validate start */
      ttsIdRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        v => (!!v && v.length <= 36) || 'ID는 36자리 이내로 입력해 주세요'
        /* eslint-disable */
      ],
      ttsNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'TTS명를 입력하세요',
        v => (!!v && v.length <= 200) || 'TTS명은 200자리 이내로 입력해 주세요'
      ],
      ttsUrlRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'URL을 입력하세요',
        v => (!!v && v.length <= 300) || 'URL은 300자리 이내로 입력해 주세요'
      ],
      ttsEngineRules: [
        v => !!v || 'TTS엔진을 선택하세요'
      ],
      apiTypeRules: [
        v => !!v || '통신방식을 선택하세요'
      ],
      speedRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '음성 속도 정보를 입력하세요',
        /* eslint-disable */
        v => /^[0-9]*$/.test(v) || '음성 속도 정보를 숫자로 입력해 주세요',
        /* eslint-disable */
        v => (!!v && v.length <= 3) || '음성 속도 정보를 3자리 이내로 입력해 주세요'
      ],
      volumeRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '음성 크기 정보를 입력하세요',
        /* eslint-disable */
        v => /^[0-9]*$/.test(v) || '음성 크기 정보를 숫자로 입력해 주세요',
        /* eslint-disable */
        v => (!!v && v.length <= 3) || '음성 크기 정보를 3자리 이내로 입력해 주세요'
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    initTtsView () {
      initTtsView().then(
        response => {
          this.ttsEngines = response.data.result.ttsEngineList
          this.apiTypes = response.data.result.apiTypeList
        }
      )
    },
    setTts: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          ttsId: this.inputForm.ttsId,
          ttsNm: this.inputForm.ttsNm,
          ttsUrl: this.inputForm.ttsUrl,
          ttsEngine: this.inputForm.ttsEngine,
          apiType: this.inputForm.apiType,
          useYn: this.inputForm.useYn,
          basicSpeed: this.inputForm.basicSpeed,
          speedInterval: this.inputForm.speedInterval,
          maxSpeed: this.inputForm.maxSpeed,
          minSpeed: this.inputForm.minSpeed,
          basicVolume: this.inputForm.basicVolume,
          volumeInterval: this.inputForm.volumeInterval,
          maxVolume: this.inputForm.maxVolume,
          minVolume: this.inputForm.minVolume
        }
        createTts(input).then(
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
    this.initTtsView()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
