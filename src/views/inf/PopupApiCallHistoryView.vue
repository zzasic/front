<template>
  <v-card class="dialog-counselor">
    <v-card-title>
    <span class="headline">API 연동 상세</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
      <v-container>
        <v-row>
          <v-col cols="1">
            <span class="label">ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.historyId"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">시스템</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.systemNm"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label">테넌트</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.tenantNm"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">호출 유형</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.callTypeNm"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label">호출 시점</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.callTimeNm"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">API 명</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.apiNm"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label">실시간 여부</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.realtimeYn"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">입력값</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.inputData"
                @init="inputDataInit"
                lang="javascript"
                mode="chrome"
                :options="{
                  tabSize: 2
                }"
                width="100%"
                height="180"
              ></ace-editor>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">요청 URL</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.requestUrl"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">요청값</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.body"
                @init="bodyInit"
                lang="text"
                mode="chrome"
                :options="{
                  tabSize: 2
                }"
                width="100%"
                height="180"
              ></ace-editor>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">결과값</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.message"
                @init="messageInit"
                lang="json"
                mode="chrome"
                :options="{
                  tabSize: 2
                }"
                width="100%"
                height="180"
              ></ace-editor>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">닫기</v-btn>
      <v-btn color="btn-primary" v-if="inputForm.result === 'F'" text @click="resendBtn()">재전송</v-btn>
      <v-btn color="btn-primary" v-else-if="inputForm.result !== 'S'" text @click="resendBtn()">전송</v-btn>
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
import AceEditor from 'vue2-ace-editor'
import {
  initApiCallView,
  selectApiCallHistoryForUpdate,
  resendApiCallHistory
} from '@/api/inf'

import lodash from 'lodash'

export default {

  name: 'PopupUpdateApiCallView',

  components: {
    AceEditor
  },
  props: {
    editedItem: Object
  },
  data () {
    return {
      valid: true,
      lazy: true,
      /* input start */
      bExtensionDupCheck: true,
      errorMessages: [],
      successMessages: [],
      reqForm: {},
      inputForm: {
        historyId: '',
        apiCallId: '', // API 연계 ID
        systemId: '', // System ID
        systemNm: '',
        tenantId: '', // 테넌트 ID
        tenantNm: '',
        callType: '', // 통화유형
        callTypeNm: '',
        callTime: '', // 연계시점
        callTimeNm: '',
        apiId: '', // API ID
        apiNm: '',
        realtimeYn: 'Y', // 실시간여부
        sendTime: null,
        compTime: null,
        inputData: '',
        requestUrl: '',
        body: '',
        message: '',
        states: '',
        result: ''
      },
      /* input end */

      tenants: [], // 테넌트 목록
      systems: [],
      callTimes: [],
      callTypes: [],
      apis: [],
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
      tenantIdRules: [
        value => !!value || '테넌트를 선택해주세요'
      ],
      systemIdRules: [
        value => !!value || '시스템을 선택해주세요'
      ],
      callTypeRules: [
        value => !!value || '상담유형을 선택해주세요'
      ],
      callTimeRules: [
        value => !!value || '연계시점을 선택해주세요'
      ],
      apiIdRules: [
        value => !!value || 'API를 선택해주세요'
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    inputDataInit: function (editor) {
      require('brace/theme/chrome')
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/mode/javascript')
      require('brace/snippets/xml')
      require('brace/snippets/json')
      require('brace/snippets/javascript')
      editor.setShowFoldWidgets(true)
      editor.setReadOnly(true)
    },
    bodyInit: function (editor) {
      require('brace/theme/chrome')
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/mode/javascript')
      require('brace/snippets/xml')
      require('brace/snippets/json')
      require('brace/snippets/javascript')
      editor.setShowFoldWidgets(true)
      editor.setReadOnly(true)
    },
    messageInit: function (editor) {
      require('brace/theme/chrome')
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/mode/javascript')
      require('brace/snippets/xml')
      require('brace/snippets/json')
      require('brace/snippets/javascript')
      editor.setShowFoldWidgets(true)
      editor.setReadOnly(true)
    },
    initApiCallView: function () {
      initApiCallView().then(
        response => {
          this.systems = response.data.result.systemInfoList
          this.tenants = response.data.result.tenantList
          this.callTimes = response.data.result.callTimeList
          this.callTypes = response.data.result.callTypeList
          this.apis = response.data.result.apiList
          this.useYns = response.data.result.useYnList // 사용여부
        }
      )
    },
    selectApiCallHistoryForUpdate: function () {
      selectApiCallHistoryForUpdate(this.reqForm).then(
        response => {
          this.inputForm.historyId = response.data.result.apiCallHistory.historyId
          this.inputForm.apiCallId = response.data.result.apiCallHistory.apiCallId
          this.inputForm.systemId = response.data.result.apiCallHistory.systemId
          this.inputForm.systemNm = response.data.result.apiCallHistory.systemNm
          this.inputForm.tenantId = response.data.result.apiCallHistory.tenantId
          this.inputForm.tenantNm = response.data.result.apiCallHistory.tenantNm
          this.inputForm.callType = response.data.result.apiCallHistory.callType
          this.inputForm.callTypeNm = response.data.result.apiCallHistory.callTypeNm
          this.inputForm.callTime = response.data.result.apiCallHistory.callTime
          this.inputForm.callTimeNm = response.data.result.apiCallHistory.callTimeNm
          this.inputForm.apiId = response.data.result.apiCallHistory.apiId
          this.inputForm.apiNm = response.data.result.apiCallHistory.apiNm
          this.inputForm.realtimeYn = response.data.result.apiCallHistory.realtimeYn
          this.inputForm.inputData = response.data.result.apiCallHistory.inputData
          this.inputForm.requestUrl = response.data.result.apiCallHistory.requestUrl
          this.inputForm.body = response.data.result.apiCallHistory.body
          this.inputForm.message = response.data.result.apiCallHistory.message
          this.inputForm.states = response.data.result.apiCallHistory.states
          this.inputForm.result = response.data.result.apiCallHistory.result
        }
      )
    },
    resendApiCallHistory: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('재전송 하시겠습니까?')) {
          return
        }
        const input = {
          historyId: this.inputForm.historyId,
          apiCallId: this.inputForm.apiCallId,
          systemId: this.inputForm.systemId,
          tenantId: this.inputForm.tenantId,
          callType: this.inputForm.callType,
          callTime: this.inputForm.callTime,
          apiId: this.inputForm.apiId,
          realtimeYn: this.inputForm.realtimeYn,
          inputData: this.inputForm.inputData,
          requestUrl: this.inputForm.requestUrl,
          body: this.inputForm.body,
          message: this.inputForm.message
        }
        resendApiCallHistory(input).then(
          response => {
            if (response.data.status === 200) {
              this.selectApiCallHistoryForUpdate()
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
    }, 300),

    resendBtn: function () {
      this.resendApiCallHistory()
    }
  },

  created () {
    this.initApiCallView()
  },
  mounted () {
    this.reqForm.historyId = this.editedItem.historyId
    this.$nextTick(() => {
      this.selectApiCallHistoryForUpdate()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
  .ace_content * {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  }
</style>
