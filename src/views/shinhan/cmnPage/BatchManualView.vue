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
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="3">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.useYn"
              :items="cptdUseYn"
              label="배치명"
              :placeholder="$t('label.all')"
              return-object
              clearable
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-menu
              content-class="date-picker"
              ref="pickerMenu"
              v-model="pickerMenu"
              :return-value.sync="inputForm.dates"
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
                  v-model="inputForm.dates"
                  range
                  no-title
                  scrollable
                  :event-color="
                    date =>
                      date == inputForm.dates[0]
                        ? ['startDate']
                        : date == inputForm.dates[1]
                        ? ['endDate']
                        : ''
                  "
                  :events="inputForm.dates"
                  :date-format="date => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(inputForm.dates)">{{ $t('button.confirm')}}</v-btn>
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
            > 실행 </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="search-group" style="height: auto" no-gutters fluid>
        <PageSectionTitle
        :title="'배치 수행 결과'"
      >
      </PageSectionTitle>
        <v-row>
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
  getQueryList,
  reqExcelDownQuery
} from '@/api/query'

import lodash from 'lodash'

export default {

  name: 'BatchManualView',

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
      useYn: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ],
      inputForm: {
        testResult: '',
        testDeserts: [],
        batchNm: '',
        useYn: '',
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
    cptdUseYn: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.useYn)
      return its
    },
    dateRangeText: {
      get: function () {
        const dateRange = this.inputForm.dates
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
        return dateRange.join(' ~ ')
      },
      set: function (value) {
        if (!value) {
          this.inputForm.dates = []
        }
      }
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
