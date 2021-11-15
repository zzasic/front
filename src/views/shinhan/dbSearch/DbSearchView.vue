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
          <v-col class="sideWidth">
            <v-card class="data-grid-wrap default">
              <vuescroll>
                <v-data-table
                  :calculate-widths="true"
                  :headers="headers"
                  :items="inputForm.testDeserts"
                  :server-items-length="inputForm.testDeserts.length"
                  :options.sync="optionSync"
                  :no-data-text="$t('message.noData')"
                  :loading-text="$t('message.loading')"
                  hide-default-footer
                  fixed-header
                  :aria-setsize="450"
                >
                <!-- <template v-slot:item="props">
                  <tr @click="detailRow(props.item), selected = props.item.callId">
                    <td class="text-center">{{ props.item.tenantNm }}</td>
                    <td class="text-center">{{ props.item.branchCd }}</td>
                    <td class="text-center">{{ props.item.deviceNo }}</td>
                    <td class="text-center">{{ props.item.ipAddress }}</td>
                    <td class="text-center">{{ props.item.startDt ? $moment(props.item.startDt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').zone('+09:00').format('MM-DD HH:mm:ss') : '' }}</td>
                    <td class="text-center">{{ props.item.timeDiff }}</td>
                    <td class="text-center"><v-btn @click="detailRow(props.item)" text class="default" color="btn-secondary" >{{ $t('button.detail')}}</v-btn></td>
                  </tr>
                </template> -->

                <!-- <template v-slot:item="props">
                  <tr>
                    <td v-for="header in props" :key="header.idx"> {{ props.item }} </td>
                  </tr>
                </template> -->
                </v-data-table>
                </vuescroll>
            </v-card>
          </v-col>
        </v-row>
        <!-- <v-row>
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
        </v-row> -->
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
  name: 'DbSearchView',
  components: {
    AceEditor
  },
  mixins: [],
  created () {
    window.addEventListener('resize', this.myEventHandler)
  },
  mounted () {
    window.removeEventListener('resize', this.myEventHandler)
  },
  data () {
    return {
      // 테스트 헤더
      headerz: [],
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
      },
      pagination: {
        page: 1, // 현재페이지
        length: 1, // 페이징숫자 갯수
        itemsPerPage: 10, // table row view 갯수
        itemsPerPages: [10, 20, 30], // 왼쪽하단 selectbox
        totalRows: 0,
        sectionTitle: '검색 결과',
        sectionSubTitle: '검색 결과에 따라서 상단 결과(header) 값이 바뀝니다.',
        loading: false
      },
      options: {}
    }
  },
  computed: {
    headers: function () {
      const headers = []
      if (this.inputForm.testDeserts.length > 0) {
        const size = 100 / this.inputForm.testDeserts.length
        Object.keys(this.inputForm.testDeserts[0]).forEach((v, i) => {
          const h = {}
          h.type = 'text'
          h.text = v
          h.value = v
          h.align = 'center'
          h.class = 'text-center'
          h.width = String(size) + '%'
          headers.push(h)
        })
      }
      return headers
    },
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          // this.fnc_getDbInfo()
        }
      }
    }
  },
  watch: {},
  methods: {
    myEventHandler: function (event) {
      this.width = window.innerWidth
      this.height = window.innerHeight
    },
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
        /*
        if (!confirm('조회')) {
          return
        }
        */
        const input = {
          query: this.inputForm.inputData
        }
        getQueryList(input).then(
          response => {
            if (response.data.status === 200) {
              const resApi = response.data.result
              this.inputForm.testResult = JSON.stringify(resApi.query, null, '\t')
              this.inputForm.testDeserts = resApi.query
              /*
                JSON.stringify(JSON.parse(resApi.query), null, 2)
              */
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
      this.excelDown()
    },
    excelDown: function () {
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>

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
.sideWidth {
  width: 450px;
}
// .__rail-is-horizontal {
//   word-break: normal;
//   tab-size: 4;
//   text-rendering: optimizeLegibility;
//   -webkit-font-smoothing: antialiased;
//   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
//   direction: ltr;
//   -webkit-text-size-adjust: none;
//   font-size: 14px;
//   line-height: 1.5;
//   overflow-wrap: break-word;
//   white-space: normal;
//   color: rgba(0, 0, 0, 0.87);
//   box-sizing: inherit;
//   font-family: "Noto Sans KR", "Spoqa Han Sans", "Malgun Gothic";
//   padding: 0;
//   cursor: pointer;
//   position: absolute;
//   margin: auto;
//   transition: opacity 0.5s ease 0s;
//   user-select: none;
//   border-radius: inherit;
//   width: 28.2485%;
//   background: black;
//   height: 20px;
//   opacity: 0;
//   transform: translateX(10.0189%);
//   top: 0px;
//   bottom: 0px;
// }
</style>
