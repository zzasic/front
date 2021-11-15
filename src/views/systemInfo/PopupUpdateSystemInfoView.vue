<template>
  <v-card class="dialog-systemInfo">
    <v-card-title>
    <span class="headline">시스템 수정</span>
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
              v-model="inputForm.systemId"
              :rules="systemIdRules"
              hide-details="auto"
              outlined
              disabled
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">시스템명</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.systemNm"
              :rules="systemNmRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">URL</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.systemUrl"
              :rules="systemUrlRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">메인 URL</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.mainUrl"
              :rules="mainUrlRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">STT 사용</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.sttUseYn"
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
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">ChatBot 여부</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.chatbotUseYn"
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
            <span class="label must">TTS 사용</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.ttsUseYn"
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
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">TA 여부</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.taUseYn"
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
      <v-btn color="btn-secondary" text @click="deleteSystemInfo()">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="setSystemInfo()">{{ $t('button.save')}}</v-btn>
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
  initSystemInfoView,
  selectSystemInfoForUpdate,
  updateSystemInfo,
  deleteSystemInfo
} from '../../api/systemInfo'

import lodash from 'lodash'

export default {

  name: 'PopupUpdateSystemInfoView',

  components: {
  },
  props: {
    editedItem: Object
  },
  data () {
    return {
      valid: true,
      reqForm: {},

      /* input start */
      inputForm: {
        systemId: '',
        systemNm: '',
        systemUrl: '',
        sttUseYn: '',
        chatbotUseYn: '',
        ttsUseYn: '',
        taUseYn: '',
        useYn: 'Y',
        mainUrl: ''
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
      systemIdRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        v => (!!v && v.length <= 10) || 'ID는 10자리 이내로 입력해 주세요'
      ],
      systemNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '시스템명를 입력하세요',
        v => (!!v && v.length <= 200) || '시스템명은 200자리 이내로 입력해 주세요'
      ],
      systemUrlRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'URL을 입력하세요',
        v => (!!v && v.length <= 300) || 'URL은 300자리 이내로 입력해 주세요'
      ],
      mainUrlRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'URL을 입력하세요',
        v => (!!v && v.length <= 300) || 'MAIN URL은 300자리 이내로 입력해 주세요'
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    initSystemInfoView () {
      initSystemInfoView().then(
        response => {
          // this.apiTypes = response.data.result.apiTypeList
        }
      )
    },
    getSelectSystemInfo: function () {
      selectSystemInfoForUpdate(this.reqForm).then(
        response => {
          this.inputForm.systemId = response.data.result.systemInfo.systemId
          this.inputForm.systemNm = response.data.result.systemInfo.systemNm
          this.inputForm.systemUrl = response.data.result.systemInfo.systemUrl
          this.inputForm.sttUseYn = response.data.result.systemInfo.sttUseYn
          this.inputForm.chatbotUseYn = response.data.result.systemInfo.chatbotUseYn
          this.inputForm.ttsUseYn = response.data.result.systemInfo.ttsUseYn
          this.inputForm.taUseYn = response.data.result.systemInfo.taUseYn
          this.inputForm.useYn = response.data.result.systemInfo.useYn
          this.inputForm.mainUrl = response.data.result.systemInfo.mainUrl
        }
      )
    },
    setSystemInfo: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          systemId: this.inputForm.systemId,
          systemNm: this.inputForm.systemNm,
          systemUrl: this.inputForm.systemUrl,
          sttUseYn: this.inputForm.sttUseYn,
          chatbotUseYn: this.inputForm.chatbotUseYn,
          ttsUseYn: this.inputForm.ttsUseYn,
          taUseYn: this.inputForm.taUseYn,
          useYn: this.inputForm.useYn,
          mainUrl: this.inputForm.mainUrl
        }
        updateSystemInfo(input).then(
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
    deleteSystemInfo: lodash.debounce(function () {
      if (confirm('삭제하시겠습니까?')) {
        deleteSystemInfo(this.reqForm).then(
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
    this.initSystemInfoView()
  },
  mounted () {
    this.reqForm = this.editedItem
    this.$nextTick(() => {
      this.getSelectSystemInfo()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
