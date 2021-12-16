<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :hasNoSearchGroup="false"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-menu
              content-class="date-picker"
              ref="pickerMenu"
              v-model="pickerMenu"
              :return-value.sync="searchForm.dates"
              :close-on-content-click="false"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="default text-field-date pr-0"
                  v-model='dateRangeText'
                  label="검색기간"
                  placeholder="YYYY.MM.DD - YYYY.MM.DD"
                  v-on="on"
                  readonly
                  clearable
                  @click="clickPicker"
                >
                </v-text-field>
              </template>
              <div @click="clickPicker">
                <v-date-picker
                  v-model="searchForm.dates"
                  range
                  no-title
                  scrollable
                  :event-color="
                    date =>
                      date == searchForm.dates[0]
                        ? ['startDate']
                        : date == searchForm.dates[1]
                        ? ['endDate']
                        : ''
                  "
                  :events="searchForm.dates"
                  :date-format="date => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(searchForm.dates)">{{ $t('button.confirm')}}</v-btn>
                </v-date-picker>
              </div>
            </v-menu>
          </v-col>
          <v-col class="text-right">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-search"
              :ripple="false"
              @click="searchBtn"
            >{{ $t('button.search')}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-form
        ref="form"
      >
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="getQueryList">데이터 수집</v-btn>
        <!-- <v-btn color="btn-secondary" text @click="testBtn">엑셀다운로드</v-btn> -->
      </div>
      <v-container class="search-group" style="height: auto" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="1">
            <span class="label must">CALL ID</span>
          </v-col>
          <v-col>
            <v-card class="data-grid-wrap default has-scroll">
              <ace-editor
                ref="bodyEditor"
                v-model="inputForm.inputData"
                @init="testEditorInit"
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
            <span class="label must">Result</span>
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
import datepicker from '@/plugins/datepicker'
import AceEditor from 'vue2-ace-editor'
import {
  getQueryList
} from '@/api/query'

import lodash from 'lodash'

export default {

  name: 'KafkaDataManualView',

  components: {
    AceEditor
  },
  mixins: [datepicker],
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
        testDeserts: [],
        inputData: ''
      },
      searchForm: {
        dates: [this.$moment().add(-1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
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
    },
    dateRangeText: {
      get: function () {
        const dateRange = this.searchForm.dates
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
        return dateRange.join(' ~ ')
      },
      set: function (value) {
        if (!value) {
          this.searchForm.dates = []
        }
      }
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
      require('brace/snippets/text')
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
    getQueryList: lodash.debounce(function () { // filter는 특정 조건을 걸러내는 역할. 구문 헷갈리니 잘 외워놓기
      // data 전처리
      const inputVal = this.inputForm.inputData.trim().replace(/(\s*)/g, '').split(',').filter(val => val.length !== 0)
      this.inputForm.inputData = inputVal.join(',')
      if (this.$refs.form.validate()) {
        const input = {
          callIds: this.inputForm.inputData.trim().replace(/(\s*)/g, '')
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
      }
    }, 300),
    // 기간으로 call_id 조회 테스트
    searchBtn: function () {
      // api 만들기
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
