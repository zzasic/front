<template>
  <v-card class="dialog-notice">
    <v-card-title>
      <span class="headline">공지사항 등록</span>
    </v-card-title>
    <v-card-text>
      <vuescroll>
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
        >
          <v-container class="noticeView">
            <v-row v-for="(noticeLang, idx) in inputForm.noticeLangList" :key="idx">
              <v-col v-if="langs.some((lang) => lang.value === noticeLang.lang)">
                <!-- <v-container class="outline"> -->
                <v-row v-if="langs && langs.length > 1">
                  <v-col cols="2">
                    <span class="label">언어</span>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      class="default mt-0 pt-0"
                      :menu-props="{ offsetY: true }"
                      v-model="noticeLang.lang"
                      :items="langList(idx)"
                      :rules="[v => !!v || '언어를 선택해주세요']"
                      :placeholder="noticeLang.lang ? undefined : '선택'"
                      :disabled="noticeLang.lang === 'KO'"
                      clearable
                      required
                      hide-details="auto"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2">
                    <span class="label must">제목</span>
                  </v-col>
                  <v-col>
                    <v-text-field
                      class="default mt-0 pt-0 full"
                      v-model="noticeLang.title"
                      :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '제목을 입력해주세요',
                          v => (!!v && v.length < 80) || $t('message.inputMaxLength', ['80'])
                        ]"
                      placeholder=" "
                      clearable
                      required
                      hide-details="auto"
                      oninput="javascript: if (this.value.length > 80) this.value = this.value.substring(0, 80)"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2">
                    <span class="label must">내용</span>
                  </v-col>
                  <v-col>
                    <v-textarea
                      class="default mt-0 pt-0 full"
                      v-model="noticeLang.contents"
                      :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '내용을 입력해주세요',
                          v => (!!v && v.length < 2000) || $t('message.inputMaxLength', ['2000'])
                        ]"
                      placeholder=" "
                      solo
                      dense
                      no-resize
                      rows="7"
                      required
                      hide-details="auto"
                      oninput="javascript: if (this.value.length > 2000) this.value = this.value.substring(0, 2000)"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <!-- </v-container> -->
              </v-col>
              <v-col cols="1" v-if="langs && langs.length > 1">
                <div class="btn-group align-right">
                  <v-btn class="btn-plus" @click="langPlusBtn(idx)" :disabled="!langContentsPlusable">
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn class="btn-minus" @click="langMinusBtn(idx)"
                         :disabled="!langContentsMinusable || noticeLang.lang === 'KO'">
                    <v-icon dark>mdi-minus</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label must">게시기간</span>
              </v-col>
              <v-col cols="4">
                <v-menu
                  content-class="date-picker"
                  ref="pickerMenu"
                  v-model="pickerMenu"
                  :return-value.sync="inputForm.boardDates"
                  :close-on-content-click="false"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      class="default text-field-date pr-0"
                      v-model='dateRangeText'
                      placeholder="YYYY.MM.DD - YYYY.MM.DD"
                      v-on="on"
                      :rules="[
                        v => (!!v && v.includes('~')) || '게시기간을 선택해주세요'
                      ]"
                      readonly
                      clearable
                      hide-details="auto"
                      @click="clickPicker"
                    >
                    </v-text-field>
                  </template>
                  <div @click="clickPicker">
                    <v-date-picker
                      v-model="inputForm.boardDates"
                      range
                      no-title
                      scrollable
                      :event-color="
                        date =>
                          date == inputForm.boardDates[0]
                            ? ['startDate']
                            : date == inputForm.boardDates[1]
                            ? ['endDate']
                            : ''
                      "
                      :events="inputForm.boardDates"
                      :date-format="date => new Date(date).toDateString()"
                      :locale="$i18n.locale"
                      :picker-date.sync="pickerDate"
                      @click:date="dateClick"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close') }}
                      </v-btn>
                      <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(inputForm.boardDates)">
                        {{ $t('button.confirm') }}
                      </v-btn>
                    </v-date-picker>
                  </div>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label must">게시 여부</span>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  class="default mt-0 pt-0"
                  v-model="inputForm.boardYn"
                  :mandatory="false"
                  row
                  hide-details="auto"
                  required
                >
                  <v-radio
                    v-for="(bd, idx) in boardYns"
                    :key="idx"
                    :label="bd.text"
                    :value="bd.value"
                    :ripple="false"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label must">팝업 여부</span>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  v-if="inputForm.boardYn == 'N' ? inputForm.popupYn ='N': inputForm.popupYn ='Y'"
                  class="default mt-0 pt-0"
                  v-model="inputForm.popupYn"
                  :mandatory="false"
                  row
                  hide-details="auto"
                  required
                  :disabled="inputForm.boardYn=='N'"
                >
                  <v-radio
                    v-for="(pop, idx) in popupYns"
                    :key="idx"
                    :label="pop.text"
                    :value="pop.value"
                    :ripple="false"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="2">
                <span class="label must">사용 여부</span>
              </v-col>
              <v-col cols="5">
                <v-radio-group
                  class="default mt-0 pt-0"
                  v-model="inputForm.useYn"
                  :mandatory="false"
                  row
                  hide-details="auto"
                  required
                >
                  <v-radio
                    v-for="(use, idx) in useYns"
                    :key="idx"
                    :label="use.text"
                    :value="use.value"
                    :ripple="false"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row> -->
          </v-container>
        </v-form>
      </vuescroll>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel') }}</v-btn>
      <v-btn color="btn-primary" text @click="saveBtn">{{ $t('button.save') }}</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="cancelBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import { createNotice, createNoticeView } from '@/api/notice'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'PopupCreateNoticeView',
  mixins: [datepicker],
  computed: {
    dateRangeText: {
      get: function () {
        const dateRange = this.inputForm.boardDates
        dateRange.sort((a, b) => {
          return a >= b ? a === b ? 0 : 1 : -1
        })
        return dateRange.join(' ~ ')
      },
      set: function (value) {
        if (!value) {
          this.inputForm.boardDates = []
        }
      }
    },
    // aiClassList: function () {
    //   const its = [
    //     {
    //       text: '공통',
    //       value: 'CMN'
    //     }
    //   ]
    //   its.push(...this.aiClasses)
    //   return its
    // },
    langContentsPlusable: function () {
      return this.inputForm.noticeLangList.length < this.langs.length
    },
    langContentsMinusable: function () {
      return this.inputForm.noticeLangList.length > 1
    }
  },
  created: function () {
    this.init()
  },
  mounted: function () {
  },
  data: function () {
    return {
      valid: true,
      lazy: true,
      // AI분류
      // aiClasses: [],
      // 언어
      langs: [],
      // 게시여부
      boardYns: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ],
      // 사용여부
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
      // 팝업여부
      popupYns: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ],
      // 입력값
      inputForm: {
        // aiClass: '', // AI 분류
        noticeLangList: [
          {
            lang: 'KO', // 언어
            title: '', // 제목
            contents: '' // 내용
          }
        ],
        boardDates: [],
        boardYn: 'Y', // 게시여부
        popupYn: 'N', // 팝업여부
        useYn: 'Y' // 사용여부
      }
    }
  },
  watch: {},
  methods: {
    init: async function () {
      await this.createNoticeView()
    },
    // 입력값 조회
    createNoticeView: function () {
      createNoticeView().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // this.aiClasses = response.data.result.aiClassList // AI분류
            this.langs = response.data.result.langList // 언어
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    },
    // filteringXSS: function (origin) {
    //   return [origin.lang, origin.title, origin.content.replace(/\\<|\\>|\\"|\\'|\\%|\\;|\\(|\\)|\\&|\\+|\\-/g, '')]
    // },
    // API관리 등록
    createNotice: function () {
      const dateRange = this.inputForm.boardDates
      dateRange.sort((a, b) => {
        return a >= b ? a === b ? 0 : 1 : -1
      })
      // param setting

      // this.inputForm.noticeLangList = this.inputForm.noticeLangList.map(notice => this.filteringXSS(notice))
      const createForm = {
        // aiClass: this.inputForm.aiClass,
        noticeLangList: this.inputForm.noticeLangList,
        boardStartDate: dateRange && dateRange.length > 0 ? dateRange[0] : '', // 공지시작일
        boardEndDate: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : '', // 공지종료일
        boardYn: this.inputForm.boardYn === 'Y' ? 'Y' : 'N',
        popupYn: this.inputForm.popupYn === 'Y' ? 'Y' : 'N',
        useYn: this.inputForm.useYn === 'Y' ? 'Y' : 'N'
      }
      createNotice(createForm).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.$emit('popupAction', {
              createView: false,
              updateView: false
            })
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    },
    langList: function (idx) {
      return this.langs.filter(ln => {
        return this.inputForm.noticeLangList.filter((nl, n) => {
          return n !== idx && ln.value === nl.lang
        }).length === 0
      })
    },
    // 내용 추가
    langPlusBtn: function (idx) {
      const lng = this.langs.filter(ln => {
        return !this.inputForm.noticeLangList.some(iln => {
          return iln.lang === ln.value
        })
      })[0]
      this.inputForm.noticeLangList.splice((idx + 1), 0, {
        lang: lng.value,
        title: '',
        contents: ''
      })
    },
    // 내용 삭제
    langMinusBtn: function (idx) {
      this.inputForm.noticeLangList.splice(idx, 1)
    },
    // 취소버튼
    cancelBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        updateView: false
      })
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    },
    isBlank: function (x) {
      return (!x || x.trim().length === 0)
    },
    // 저장버튼
    saveBtn: function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        this.createNotice()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.v-textarea textarea {
  padding-left: 10px;
  font-size: 11px;
}
</style>
