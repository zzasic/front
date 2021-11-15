<template>
  <v-card class="dialog-counselor">
    <v-card-title>
    <span class="headline">API 연계 등록</span>
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
            <span class="label must">시스템</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.systemId"
              :items="systems"
              :rules="systemIdRules"
              :placeholder="inputForm.systemId ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">테넌트</span>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="1">
            <span class="label must">호출 유형</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.callType"
              :items="callTypes"
              :rules="callTypeRules"
              :placeholder="inputForm.callType ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">호출 시점</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.callTime"
              :items="callTimes"
              :rules="callTimeRules"
              :placeholder="inputForm.callTime ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label ">API 명</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.apiId"
              :items="apis"
              :rules="apiIdRules"
              :placeholder="inputForm.apiId ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">실시간 여부</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.realtimeYn"
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
        <v-row>
          <v-col cols="1">
            <span class="label must">PRE스크립트</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.inputData"
                @init="testEditorInit"
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
            <span class="label must">스크립트</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.script"
                @init="editorInit"
                lang="javascript"
                mode="chrome"
                :options="{
                  tabSize: 2
                }"
                width="100%"
                height="250"
              ></ace-editor>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">TEST결과값</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.testResult"
                @init="testResultInit"
                :lang="inputForm.testResultName"
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
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-secondary" text @click="testBtn">TEST</v-btn>
      <v-btn color="btn-primary" text @click="saveBtn">{{ $t('button.save')}}</v-btn>
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
  createApiCall,
  sendApiCall
} from '@/api/inf'

import lodash from 'lodash'

export default {

  name: 'PopupCreateApiCallView',

  components: {
    AceEditor
  },

  data () {
    return {
      valid: true,
      lazy: true,
      /* input start */
      bExtensionDupCheck: false,
      errorMessages: [],
      successMessages: [],
      inputForm: {
        apiCallId: '', // API 연계 ID
        callType: '', // 통화유형
        callTime: '', // 연계시점
        systemId: '', // System ID
        tenantId: '', // 테넌트 ID
        apiId: '', // API ID
        realtimeYn: 'Y', // 실시간여부
        useYn: 'Y', // 사용여부
        inputData: [
          '// $input : api override 객체 class Map<String, Object>',
          '// $context : ApplicationContext',
          '// $body : @Controller 경우 RequestBody',
          '// $session : @Controller 경우 Session',
          '// $params : 사용자 Parameter class Map<String, Object>',
          '// $kafka : @Kafka 경우 ConsumerRecord',
          '// $api : API정보 class Api',
          '// $apiCall : API연계정보 class ApiCall',
          '// $apiCallHistory : API이력정보 class ApiCallHistory',
          '// $system : class System',
          '// $gson : class google Gson'
        ].join('\r\n'), // PRE TEST SCRIPT
        script: '', // SCRIPT
        testResultName: '',
        testResult: ''
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
    testEditorInit: function (editor) {
      require('brace/theme/chrome')
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/mode/javascript')
      require('brace/snippets/xml')
      require('brace/snippets/json')
      require('brace/snippets/javascript')
      editor.setShowFoldWidgets(true)
    },
    editorInit: function (editor) {
      require('brace/theme/chrome')
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/mode/javascript')
      require('brace/snippets/xml')
      require('brace/snippets/json')
      require('brace/snippets/javascript')
      editor.setShowFoldWidgets(true)
    },
    testResultInit: function (editor) {
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
    createApiCall: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          apiCallId: this.inputForm.apiCallId,
          systemId: this.inputForm.systemId,
          tenantId: this.inputForm.tenantId,
          callType: this.inputForm.callType,
          callTime: this.inputForm.callTime,
          apiId: this.inputForm.apiId,
          realtimeYn: this.inputForm.realtimeYn,
          useYn: this.inputForm.useYn,
          script: this.inputForm.script
        }
        createApiCall(input).then(
          response => {
            if (response.data.status === 200) {
              this.$emit('refresh-list')
              this.$emit('close-dialog')
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
    sendApiCall: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('테스트 하시겠습니까?')) {
          return
        }
        const input = {
          apiCallId: this.inputForm.apiCallId,
          systemId: this.inputForm.systemId,
          tenantId: this.inputForm.tenantId,
          callType: this.inputForm.callType,
          callTime: this.inputForm.callTime,
          apiId: this.inputForm.apiId,
          realtimeYn: this.inputForm.realtimeYn,
          useYn: this.inputForm.useYn,
          inputData: this.inputForm.inputData,
          script: this.inputForm.script
        }
        sendApiCall(input).then(
          response => {
            if (response.data.status === 200) {
              const resApi = response.data.result.api
              this.inputForm.testResultName = resApi.responseName
              if (this.inputForm.testResultName === 'json') {
                this.inputForm.testResult = JSON.stringify(JSON.parse(resApi.responseContents), null, 2)
              } else {
                this.inputForm.testResult = resApi.responseContents
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
      }
    }, 300),

    testBtn: function () {
      this.sendApiCall()
    },
    saveBtn: function () {
      this.createApiCall()
    }
  },
  created () {
    this.initApiCallView()
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
