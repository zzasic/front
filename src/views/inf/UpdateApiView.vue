<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :hasNoSearchGroup="true"
      ></PageTitle>
      <v-form
        ref="form"
      >
      <v-container class="search-group pb-8" style="height: auto" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field
              class="default"
              label="API ID"
              v-model="inputForm.apiId"
              hide-details="auto"
              outlined
              disabled
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-text-field
              class="default"
              v-model="inputForm.apiNm"
              label="API 명"
              :rules="apiNmRules"
              hide-details="auto"
              :placeholder="inputForm.apiNm ? undefined : 'API 명을 입력하세요'"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              class="default"
              v-model="inputForm.apiDesc"
              label="API 설명"
              hide-details="auto"
              :placeholder="inputForm.apiDesc ? undefined : 'API 설명을 입력하세요'"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-send"
              :ripple="false"
              @click="sendBtn"
              elevation="0"
            >SEND</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.method"
              label="METHOD"
              :items="methods"
              :placeholder="inputForm.method ? undefined : ''"
              :rules="methodRules"
              hide-details="auto"
              clearable
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              class="default"
              v-model="inputForm.requestUrl"
              label="REQUEST URL"
              hide-details="auto"
              :rules="requestUrlRules"
              :placeholder="inputForm.requestUrl ? undefined : 'Request URL을 입력하세요'"
              @change="parseUrl"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1" class="text-right">
          </v-col>
        </v-row>
      </v-container>
      <v-container class="transaction pt-6" style="height: auto">
        <v-row>
          <v-col>
          <v-tabs
            class="default no-animate"
            v-model="paramTab">
            <v-tab
              href="#P">
              Paths {{ cptdApiPathList && cptdApiPathList.length > 0 ? `(${cptdApiPathList.length})` : '' }}
            </v-tab>
            <v-tab
              href="#Q">
              Params {{ cptdApiParamList && cptdApiParamList.length > 0 ? `(${cptdApiParamList.length})` : '' }}
            </v-tab>
            <v-tab
              href="#H">
              Headers {{ cptdApiHeaderList && cptdApiHeaderList.length > 0 ? `(${cptdApiHeaderList.length})` : '' }}
            </v-tab>
            <v-tab
              v-if="inputForm.method !== 'G'"
              href="#B">
              Body
            </v-tab>
          </v-tabs>
          <v-card-actions class="btn-group align-right with-tab">
            <v-spacer></v-spacer>
            <v-radio-group v-if="paramTab === 'B'" v-model="inputForm.bodyName" :mandatory="false" class="default mt-1 pt-0" row>
              <v-radio :ripple="false" v-for="(body, idx) in bodyNames" :key="idx" :label="body.text" :value="body.value"></v-radio>
            </v-radio-group>
            <v-btn :disabled="paramTab === 'B' && inputForm.bodyName !== 'form'" class="btn-plus" @click="paramPlus"><v-icon dark>mdi-plus</v-icon></v-btn>
            <v-btn :disabled="paramTab === 'B' && inputForm.bodyName !== 'form'" class="btn-minus" @click="paramMinus"><v-icon dark>mdi-minus</v-icon></v-btn>
          </v-card-actions>
          <v-tabs-items
            class="default"
            v-model="paramTab">
            <v-tab-item
              value="P">
              <v-card class="data-grid-wrap default has-scroll">
                <vuescroll>
                  <v-data-table
                    v-model="selectedApiPath"
                    :headers="headersApiPath"
                    :items="cptdApiPathList"
                    class="users-data-table"
                    item-key="paramId"
                    :fixed-header="true"
                    :disable-pagination="true"
                    :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                    hide-default-footer
                    show-select
                    :loading-text="$t('message.loading')"
                  >
                    <template v-slot:item.paramNm="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramNm"
                        :rules="[
                          v => !!v || 'KEY를 입력하세요'
                        ]"
                        :placeholder="item.paramNm ? undefined : 'Key'"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.paramValue="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramValue"
                        :placeholder="item.paramValue ? undefined : 'Value'"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.paramDesc="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramDesc"
                        :placeholder="item.paramValue ? undefined : 'Description'"
                      ></v-text-field>
                    </template>
                  </v-data-table>
                </vuescroll>
              </v-card>
            </v-tab-item>
            <v-tab-item
              value="Q">
              <v-card class="data-grid-wrap default has-scroll">
                <vuescroll>
                  <v-data-table
                    v-model="selectedApiParam"
                    :headers="headersApiParam"
                    :items="cptdApiParamList"
                    class="users-data-table"
                    item-key="paramId"
                    :fixed-header="true"
                    :disable-pagination="true"
                    :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                    hide-default-footer
                    show-select
                    :loading-text="$t('message.loading')"
                  >
                    <template v-slot:item.paramNm="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramNm"
                        :rules="[
                          v => !!v || 'KEY를 입력하세요'
                        ]"
                        :placeholder="item.paramNm ? undefined : 'Key'"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.paramValue="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramValue"
                        :placeholder="item.paramValue ? undefined : 'Value'"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.paramDesc="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramDesc"
                        :placeholder="item.paramValue ? undefined : 'Description'"
                      ></v-text-field>
                    </template>
                  </v-data-table>
                </vuescroll>
              </v-card>
            </v-tab-item>
            <v-tab-item
              value="H">
              <v-card class="data-grid-wrap default has-scroll">
                <vuescroll>
                  <v-data-table
                    v-model="selectedApiHeader"
                    :headers="headersApiHeader"
                    :items="cptdApiHeaderList"
                    class="users-data-table"
                    item-key="paramId"
                    :fixed-header="true"
                    :disable-pagination="true"
                    :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                    hide-default-footer
                    show-select
                    :loading-text="$t('message.loading')"
                  >
                    <template v-slot:item.paramNm="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramNm"
                        :rules="[
                          v => !!v || 'KEY를 입력하세요'
                        ]"
                        :placeholder="item.paramNm ? undefined : 'Key'"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.paramValue="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramValue"
                        :placeholder="item.paramValue ? undefined : 'Value'"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.paramDesc="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramDesc"
                        :placeholder="item.paramValue ? undefined : 'Description'"
                      ></v-text-field>
                    </template>
                  </v-data-table>
                </vuescroll>
              </v-card>
            </v-tab-item>
            <v-tab-item
              v-if="inputForm.method !== 'G'"
              value="B">
              <v-card v-if="inputForm.bodyName === 'form'" class="data-grid-wrap default has-scroll">
                <vuescroll>
                  <v-data-table
                    v-model="selectedApiBody"
                    :headers="headersApiBody"
                    :items="cptdApiBodyList"
                    class="users-data-table"
                    item-key="paramId"
                    :fixed-header="true"
                    :disable-pagination="true"
                    :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                    hide-default-footer
                    show-select
                    :loading-text="$t('message.loading')"
                  >
                    <template v-slot:item.paramNm="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramNm"
                        :rules="[
                          v => !!v || 'KEY를 입력하세요'
                        ]"
                        :placeholder="item.paramNm ? undefined : 'Key'"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.paramValue="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramValue"
                        :placeholder="item.paramValue ? undefined : 'Value'"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.paramDesc="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        hide-details="auto"
                        single-line
                        v-model="item.paramDesc"
                        :placeholder="item.paramValue ? undefined : 'Description'"
                      ></v-text-field>
                    </template>
                  </v-data-table>
                </vuescroll>
              </v-card>
              <v-card v-else class="data-grid-wrap default has-scroll">
                <ace-editor
                  ref="bodyEditor"
                  v-model="inputForm.bodyContents"
                  @init="editorInit"
                  :lang="inputForm.bodyName"
                  mode="chrome"
                  :options="{
                    tabSize: 2
                  }"
                  width="100%"
                  height="250"
                ></ace-editor>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          </v-col>
          <v-col class="pl-3">
            <v-radio-group v-model="responseName" :mandatory="false" class="default mt-1 pt-0" row>
              <v-radio :ripple="false" v-for="(body, idx) in resNames" :key="idx" :label="body.text" :value="body.value"></v-radio>
            </v-radio-group>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="responseEditor"
                v-model="responseContents"
                @init="editorResInit"
                :lang="responseName"
                mode="chrome"
                :options="{
                  tabSize: 2
                }"
                width="100%"
                height="315"
              ></ace-editor>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="btn-group align-right">
              <v-btn color="btn-primary" text @click="setApi">{{ $t('button.save')}}</v-btn>
              <v-btn color="btn-secondary" text @click="cancelApi">{{ $t('button.cancel')}}</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </vuescroll>
  </div>
</template>

<script>
import AceEditor from 'vue2-ace-editor'

import {
  initApiView,
  selectApiForUpdate,
  updateApi,
  sendApi
} from '../../api/inf'

import lodash from 'lodash'

export default {
  name: 'UpdateApiView',
  components: {
    AceEditor
  },
  data () {
    return {
      apiId: this.$route.params.apiId,
      lazy: true,
      /* input start */
      inputForm: {
        apiNm: '',
        apiDesc: '',
        method: 'G',
        requestUrl: '',
        contentType: '',
        useYn: 'Y',
        bodyName: 'form',
        bodyContents: '',
        apiParamList: []
      },
      responseHeaderList: [],
      responseContents: '',
      responseName: 'text',
      /* input end */
      methods: [
        {
          text: 'GET',
          value: 'G'
        },
        {
          text: 'POST',
          value: 'P'
        },
        {
          text: 'PUT',
          value: 'U'
        },
        {
          text: 'DELETE',
          value: 'D'
        }
      ],
      bodyNames: [
        {
          text: 'FORM',
          value: 'form'
        },
        {
          text: 'TEXT',
          value: 'text'
        },
        {
          text: 'JSON',
          value: 'json'
        },
        {
          text: 'XML',
          value: 'xml'
        }
      ],
      resNames: [
        {
          text: 'TEXT',
          value: 'text'
        },
        {
          text: 'JSON',
          value: 'json'
        },
        {
          text: 'XML',
          value: 'xml'
        }
      ],
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
      apiNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'API명을 입력하세요',
        v => (!!v && v.length <= 32) || '32자리가 넘을 수 없습니다.'
      ],
      methodRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '메소드를 선택하세요'
      ],
      requestUrlRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'Request URL을 입력하세요',
        v => (!!v && v.length <= 500) || '500자리가 넘을 수 없습니다.'
      ],
      /* validate end */
      paramTab: 'P',
      selectedApiHeader: [],
      headersApiHeader: [
        { text: 'KEY', value: 'paramNm', align: 'center', class: 'text-center' },
        { text: 'VALUE', value: 'paramValue', align: 'center', class: 'text-center' },
        { text: 'DESCRIPTION', value: 'paramDesc', align: 'center', class: 'text-center' }
      ],
      selectedApiPath: [],
      headersApiPath: [
        { text: 'KEY', value: 'paramNm', align: 'center', class: 'text-center' },
        { text: 'VALUE', value: 'paramValue', align: 'center', class: 'text-center' },
        { text: 'DESCRIPTION', value: 'paramDesc', align: 'center', class: 'text-center' }
      ],
      selectedApiParam: [],
      headersApiParam: [
        { text: 'KEY', value: 'paramNm', align: 'center', class: 'text-center' },
        { text: 'VALUE', value: 'paramValue', align: 'center', class: 'text-center' },
        { text: 'DESCRIPTION', value: 'paramDesc', align: 'center', class: 'text-center' }
      ],
      selectedApiBody: [],
      headersApiBody: [
        { text: 'KEY', value: 'paramNm', align: 'center', class: 'text-center' },
        { text: 'VALUE', value: 'paramValue', align: 'center', class: 'text-center' },
        { text: 'DESCRIPTION', value: 'paramDesc', align: 'center', class: 'text-center' }
      ]
    }
  },
  created () {

  },
  mounted () {
    this.initApiView()
    this.selectApiForUpdate()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdApiHeaderList: function () {
      return this.inputForm.apiParamList.filter((p) => p.paramType === 'H') || []
    },
    cptdApiParamList: function () {
      return this.inputForm.apiParamList.filter((p) => p.paramType === 'Q') || []
    },
    cptdApiPathList: function () {
      return this.inputForm.apiParamList.filter((p) => p.paramType === 'P') || []
    },
    cptdApiBodyList: function () {
      return this.inputForm.apiParamList.filter((p) => p.paramType === 'B') || []
    }
  },
  methods: {
    editorInit: function (editor) {
      require('brace/theme/chrome')
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/snippets/xml')
      require('brace/snippets/json')
      editor.setShowFoldWidgets(true)
    },
    editorResInit: function (editor) {
      require('brace/theme/chrome')
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/snippets/xml')
      require('brace/snippets/json')
      editor.setShowFoldWidgets(true)
      editor.setReadOnly(true)
    },
    initApiView () {
      initApiView().then(
        response => {
          this.useYns = response.data.result.useYnList
        }
      )
    },
    selectApiForUpdate () {
      const input = {
        apiId: this.apiId
      }
      selectApiForUpdate(input).then(
        response => {
          this.inputForm.apiId = response.data.result.api.apiId
          this.inputForm.apiNm = response.data.result.api.apiNm
          this.inputForm.apiDesc = response.data.result.api.apiDesc
          this.inputForm.method = response.data.result.api.method
          this.inputForm.requestUrl = response.data.result.api.requestUrl
          this.inputForm.contentType = response.data.result.api.contentType
          this.inputForm.useYn = response.data.result.api.useYn
          this.inputForm.bodyId = response.data.result.api.bodyId
          this.inputForm.bodyName = response.data.result.api.bodyName
          this.inputForm.bodyContents = response.data.result.api.bodyContents
          this.inputForm.apiParamList = response.data.result.api.apiParamList
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    parseUrl (val, oval) {
      try {
        const url = new URL(val)
        // Path Params
        const psl = decodeURI(url.pathname).split(/\//)
        for (const psi of psl) {
          if (psi && psi.startsWith('{') && psi.endsWith('}') && psi.length > 2) {
            const pn = psi.substring(1, psi.length - 1)
            if (this.inputForm.apiParamList && this.inputForm.apiParamList.some((p) => p.paramType === 'P' && p.paramNm === pn)) {
              continue
            }
            this.inputForm.apiParamList.push({
              paramId: `NEW${Math.random().toString(36).substr(2, 11)}`,
              paramType: 'P',
              paramNm: pn,
              paramValue: ''
            })
          }
        }
        // Query Params
        const itr = url.searchParams.entries()
        let rt
        while (!(rt = itr.next()).done) {
          const pn = rt.value[0]
          const pv = rt.value[1]
          if (this.inputForm.apiParamList && this.inputForm.apiParamList.some((p) => p.paramType === 'Q' && p.paramNm === pn)) {
            continue
          }
          this.inputForm.apiParamList.push({
            paramId: `NEW${Math.random().toString(36).substr(2, 11)}`,
            paramType: 'Q',
            paramNm: pn,
            paramValue: pv
          })
        }
        this.$nextTick(() => {
          this.inputForm.requestUrl = `${url.origin}${decodeURI(url.pathname)}`
        })
      } catch (e) {}
    },
    paramMinus: lodash.debounce(function () {
      switch (this.paramTab) {
        case 'P':
          for (const param of this.selectedApiPath) {
            this.inputForm.apiParamList.splice(this.inputForm.apiParamList.findIndex((a) => a.paramType === 'P' && a.paramId === param.paramId), 1)
          }
          break
        case 'Q':
          for (const param of this.selectedApiParam) {
            this.inputForm.apiParamList.splice(this.inputForm.apiParamList.findIndex((a) => a.paramType === 'Q' && a.paramId === param.paramId), 1)
          }
          break
        case 'H':
          for (const param of this.selectedApiHeader) {
            this.inputForm.apiParamList.splice(this.inputForm.apiParamList.findIndex((a) => a.paramType === 'H' && a.paramId === param.paramId), 1)
          }
          break
        case 'B':
          for (const param of this.selectedApiBody) {
            this.inputForm.apiParamList.splice(this.inputForm.apiParamList.findIndex((a) => a.paramType === 'B' && a.paramId === param.paramId), 1)
          }
          break
        default:
          break
      }
    }, 100),
    paramPlus: lodash.debounce(function () {
      this.inputForm.apiParamList.push({
        paramId: `NEW${Math.random().toString(36).substr(2, 11)}`,
        paramType: this.paramTab
      })
    }, 100),
    sendBtn: function () {
      const input = {
        apiId: this.apiId,
        apiNm: this.inputForm.apiNm,
        apiDesc: this.inputForm.apiDesc,
        method: this.inputForm.method,
        requestUrl: this.inputForm.requestUrl,
        contentType: this.inputForm.contentType,
        useYn: this.inputForm.useYn,
        bodyId: this.inputForm.bodyId,
        bodyName: this.inputForm.bodyName,
        bodyContents: this.inputForm.bodyContents,
        apiParamList: this.inputForm.apiParamList
      }
      sendApi(input).then(
        response => {
          if (response.data.status === 200) {
            const resApi = response.data.result.api
            this.responseHeaderList = resApi.responseHeaderList
            this.responseName = resApi.responseName
            if (this.responseName === 'json') {
              this.responseContents = JSON.stringify(JSON.parse(resApi.responseContents), null, 2)
            } else {
              this.responseContents = resApi.responseContents
            }
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    setApi: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          apiId: this.apiId,
          apiNm: this.inputForm.apiNm,
          apiDesc: this.inputForm.apiDesc,
          method: this.inputForm.method,
          requestUrl: this.inputForm.requestUrl,
          contentType: this.inputForm.contentType,
          useYn: this.inputForm.useYn,
          bodyId: this.inputForm.bodyId,
          bodyName: this.inputForm.bodyName,
          bodyContents: this.inputForm.bodyContents,
          apiParamList: this.inputForm.apiParamList
        }
        updateApi(input).then(
          response => {
            if (response.data.status === 200) {
              this.$router.push({ name: 'ListApiView', query: { t: new Date().getTime() } })
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
    cancelApi: function () {
      this.$router.push({ name: 'ListApiView', query: { t: new Date().getTime() } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .process {
    .btn-group {
      margin-top: 0px;
      &.with-tab {
        margin-top: -64px;
      }
    }
  }
  .ace_content * {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  }
  .btn-send {
    font-size: 12px;
    letter-spacing: 0.2px;
    min-width: 90px !important;
    margin-top: 26px;
    height: 100px !important;
    position: absolute;
    right: 38px;
  }
</style>
