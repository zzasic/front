<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :hasNoSearchGroup="false"
      ></PageTitle>
      <v-form
        ref="form"
      >
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="getQueryList">RUN SQL</v-btn>
        <v-btn color="btn-secondary" text @click="testBtn">엑셀다운로드</v-btn>
      </div>
      <v-container class="search-group" style="height: auto" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="1">
            <span class="label must">SQL</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.inputData"
                @init="testEditorInit"
                lang="sql"
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
        <!-- <v-row>
          <v-col>
            <vuescroll>
            <v-card class="data-grid-wrap default clickable">
              <v-data-table
                :headers="headers"
                :items="inputForm.testDeserts"
                :server-items-length="inputForm.testDeserts.length"
                :no-data-text="$t('message.noData')"
                :loading-text="$t('message.loading')"
                :hide-default-header="!inputForm.testDeserts.length"
                hide-default-footer
                fixed-header
              >
              </v-data-table>
            </v-card>
            </vuescroll>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col cols="1">
            <span class="label must">SQL Result</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.testResult"
                @init="testResultInit"
                lang="json"
                mode="chrome"
                :options="{
                  tabSize: 2
                }"
                width="100%"
                height="450"
              ></ace-editor>
            </v-card>
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
  getQueryList,
  reqExcelDownQuery
} from '@/api/query'

import lodash from 'lodash'

export default {

  name: 'ExecuteQueryView',

  components: {
    AceEditor
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
        testResult: '',
        testDeserts: []
      }
      /* input end */
    }
  },

  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    headers: function () {
      const headers = []
      if (this.inputForm.testDeserts.length > 0) {
        Object.keys(this.inputForm.testDeserts[0]).forEach((v, i) => {
          const h = {}
          h.type = 'text'
          h.text = v
          h.value = v
          h.align = 'center'
          h.class = 'text-center'
          headers.push(h)
        })
      }
      return headers
    }
  },

  methods: {
    testEditorInit: function (editor) {
      require('brace/theme/chrome')
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/xml')
      require('brace/mode/json')
      require('brace/mode/javascript')
      require('brace/mode/sql')
      require('brace/snippets/xml')
      require('brace/snippets/json')
      require('brace/snippets/javascript')
      require('brace/snippets/sql')
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
    getQueryList: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (this.inputForm.inputData.trim().toUpperCase().startsWith('SELECT')) {
          const input = {
            query: this.inputForm.inputData
          }
          getQueryList(input).then(
            response => {
              if (response.data.status === 200) {
                const resApi = response.data.result
                if (resApi === undefined) {
                  alert('쿼리 수행 중 오류가 발생하였습니다.')
                } else {
                  this.inputForm.testResult = JSON.stringify(resApi.query, null, '\t')
                  this.inputForm.testDeserts = resApi.query
                  /*
                    JSON.stringify(JSON.parse(resApi.query), null, 2)
                  */
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
        } else {
          alert('SELECT로 시작하는 구문만 사용 할 수 있습니다.\n다른 구문은 전문 쿼리 도구를 사용하세요')
        }
      }
    }, 300),
    testBtn: function () {
      this.excelDown()
    },
    excelDown: function () {
      if (this.inputForm.inputData.trim().toUpperCase().startsWith('SELECT')) {
        const input = {
          query: this.inputForm.inputData
        }
        reqExcelDownQuery(input).then(response => {
          const filename = this.$moment().format('YYYY-MM-DD_HH:mm:ss') + '_queryResult.xlsx'
          const url = window.URL.createObjectURL(
            new Blob([response.data], {
              type: response.headers['content-type']
            })
          )
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
        },
        error => {
          console.error(error)
          const status = error.data.status
          if (status === 403) {
            this.$router.push({
              name: '403',
              query: { t: new Date().getTime() }
            })
          } else {
            delete sessionStorage.accessToken
            this.$router.push({
              name: 'Login',
              query: { t: new Date().getTime() }
            })
          }
        })
      } else {
        alert('SELECT로 시작하는 구문만 사용 할 수 있습니다.\n다른 구문은 전문 쿼리 도구를 사용하세요')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .btn-group {
    margin-top: -15px !important;
  }
  .transaction {
    margin-top: -24px;
  }
  .ace_content * {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  }
</style>
