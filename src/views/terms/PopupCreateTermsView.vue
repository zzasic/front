<template>
  <v-card class="dialogTerms">
    <v-card-title>
      <span class="headline">약관 등록</span>
    </v-card-title>
    <v-card-text>
      <vuescroll>
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
        >
          <v-container>
            <v-row>
              <v-col class="col-head">
                <span class="label must">ID</span>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  class="default mt-0 pt-0"
                  v-model="inputForm.termsId"
                  :rules="[
                    v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'ID를 입력해주세요',
                    v => !!v && v.length <= 32 || 'ID 는 32자리 이내로 입력해 주세요'
                  ]"
                  placeholder=" "
                  clearable
                  required
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-head">
                <span class="label must">버전</span>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  class="default mt-0 pt-0"
                  v-model="inputForm.termsVer"
                  :rules="[
                    v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '버전을 입력해주세요',
                    v => !!v && v.length <= 64 || '버전은 64자리 이내로 입력해 주세요'
                  ]"
                  placeholder=" "
                  clearable
                  required
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-for="(termsLang, idx) in inputForm.termsLangList" :key="idx">
              <v-col v-if="langs && langs.some((lang) => lang.value === termsLang.lang)">
                <!-- <v-container> -->
                  <v-row v-if="langs && langs.length > 1">
                    <v-col class="col-head">
                      <span class="label">언어</span>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        class="default mt-0 pts-0"
                        :menu-props="{ offsetY: true }"
                        v-model="termsLang.lang"
                        :items="langList(idx)"
                        :rules="[v => !!v || '언어를 선택해주세요']"
                        placeholder="선택"
                        :disabled="termsLang.lang === 'KO'"
                        clearable
                        required
                        hide-details="auto"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="col-head">
                      <span class="label must">약관명</span>
                    </v-col>
                    <v-col>
                      <v-text-field
                        class="default mt-0 pt-0 full"
                        v-model="termsLang.termsTitle"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '약관명을 입력해주세요',
                          v => !!v && v.length <= 200 || '약관명은 200자리 이내로 입력해 주세요'
                        ]"
                        placeholder=" "
                        clearable
                        required
                        hide-details="auto"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                   <!-- <v-row>
                    <v-col class="col-head">
                      <span class="label must">약관 버전</span>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        class="default mt-0 pt-0"
                        v-model="inputForm.termsVer"
                        :rules="[
                          v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '약관 버전을 입력해주세요',
                          v => !!v && v.length <= 64 || '약관 버전은 64자리 이내로 입력해 주세요'
                        ]"
                        placeholder=" "
                        clearable
                        required
                        hide-details="auto"
                      ></v-text-field>
                    </v-col>
                  </v-row> -->
                  <v-row>
                    <v-col class="col-head">
                      <span class="label must">약관내용(HTML)</span>
                    </v-col>
                    <v-col>
                      <v-textarea
                        class="default mt-0 pt-0 full"
                        v-model="termsLang.termsContents"
                        :rules="[v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '약관내용을 입력해주세요']"
                        placeholder=" "
                        solo
                        dense
                        required
                        hide-details="auto"
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
                  <v-btn class="btn-minus" @click="langMinusBtn(idx)" :disabled="!langContentsMinusable || termsLang.lang === 'KO'">
                    <v-icon dark>mdi-minus</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-head">
                <span class="label must">적용기간</span>
              </v-col>
              <v-col cols="4">
                <v-menu
                  ref="pickerMenu"
                  v-model="pickerMenu"
                  :return-value.sync="inputForm.termsDates"
                  :close-on-content-click="false"
                  max-width="290"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      class="default text-field-date pr-0"
                      v-model='dateRangeText'
                      placeholder="YYYY.MM.DD - YYYY.MM.DD"
                      v-on="on"
                      :rules="[
                        v => (!!v && v.includes('~')) || '적용기간을 선택해주세요'
                      ]"
                      readonly
                      clearable
                      @click="clickPicker"
                    >
                    </v-text-field>
                  </template>
                  <div @click="clickPicker">
                    <v-date-picker
                      v-model="inputForm.termsDates"
                      range
                      no-title
                      scrollable
                      :event-color="
                        date =>
                          date == inputForm.termsDates[0]
                            ? ['startDate']
                            : date == inputForm.termsDates[1]
                            ? ['endDate']
                            : ''
                      "
                      :events="inputForm.termsDates"
                      :date-format="date => new Date(date).toDateString()"
                      :locale="$i18n.locale"
                      :picker-date.sync="pickerDate"
                      @click:date="dateClick"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                      <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(inputForm.termsDates)">{{ $t('button.confirm')}}</v-btn>
                    </v-date-picker>
                  </div>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-head">
                <span class="label must">개인정보처리방침</span>
              </v-col>
              <v-col cols="8">
                <v-radio-group
                  class="default mt-0 pt-0"
                  v-model="inputForm.privacyYn"
                  :mandatory="false"
                  row
                  hide-details="auto"
                  required
                >
                  <v-radio
                    v-for="(ns, idx) in privacyYns"
                    :key="idx"
                    :label="ns.text"
                    :value="ns.value"
                    :ripple="false"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-head">
                <span class="label must">필수 여부</span>
              </v-col>
              <v-col cols="8">
                <v-radio-group
                  class="default mt-0 pt-0"
                  v-model="inputForm.necessaryFlag"
                  :mandatory="false"
                  row
                  hide-details="auto"
                  required
                  v-if="inputForm.privacyYn == 'Y' ? inputForm.necessaryFlag ='Y': inputForm.necessaryFlag"
                  :disabled="inputForm.privacyYn=='Y'"
                >
                  <v-radio
                    v-for="(ns, idx) in necessaryFlags"
                    :key="idx"
                    :label="ns.text"
                    :value="ns.value"
                    :ripple="false"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-head">
                <span class="label must">사용 여부</span>
              </v-col>
              <v-col cols="8">
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
            </v-row>
          </v-container>
        </v-form>
      </vuescroll>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="saveBtn">{{ $t('button.save')}}</v-btn>
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
import { createTermsView, createTerms } from '@/api/terms'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'PopupCreateTermsView',
  mixins: [datepicker],
  computed: {
    dateRangeText: {
      get: function () {
        const dateRange = this.inputForm.termsDates
        dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
        return dateRange.join(' ~ ')
      },
      set: function (value) {
        if (!value) {
          this.inputForm.termsDates = []
        }
      }
    },
    langContentsPlusable: function () {
      return this.inputForm.termsLangList.length < this.langs.length
    },
    langContentsMinusable: function () {
      return this.inputForm.termsLangList.length > 1
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
      // 언어
      langs: [],
      // 필수여부
      necessaryFlags: [
        {
          text: '필수',
          value: 'Y'
        },
        {
          text: '선택',
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
      // 개인정보처리방침
      privacyYns: [
        {
          text: 'Y',
          value: 'Y'
        },
        {
          text: 'N',
          value: 'N'
        }
      ],
      // 입력값
      inputForm: {
        termsId: '',
        termsVer: '1.00', // 약관버전
        termsLangList: [
          {
            lang: 'KO', // 언어
            termsTitle: '', // 제목
            termsContents: '' // 내용
          }
        ],
        termsDates: [],
        necessaryFlag: 'Y', // 필수여부
        useYn: 'Y', // 사용여부
        privacyYn: 'N' // 개인정보처리방침
      }
    }
  },
  watch: {
  },
  methods: {
    init: async function () {
      await this.createTermsView()
    },
    // 입력값 조회
    createTermsView: function () {
      createTermsView().then(
        response => {
          const status = response.data.status
          if (status === 200) {
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
    // 약관관리 등록
    createTerms: function () {
      const dateRange = this.inputForm.termsDates
      dateRange.sort((a, b) => { return a >= b ? a === b ? 0 : 1 : -1 })
      // param setting
      const createForm = {
        termsId: this.inputForm.termsId,
        termsVer: this.inputForm.termsVer,
        termsLangList: this.inputForm.termsLangList,
        termsStartTime: dateRange && dateRange.length > 0 ? dateRange[0] : '', // 공지시작일
        termsEndTime: dateRange && dateRange.length > 0 ? dateRange.length > 1 ? dateRange[1] : dateRange[0] : '', // 공지종료일
        necessaryFlag: this.inputForm.necessaryFlag === 'Y' ? 'Y' : 'N',
        useYn: this.inputForm.useYn === 'Y' ? 'Y' : 'N',
        privacyYn: this.inputForm.privacyYn === 'Y' ? 'Y' : 'N'
      }
      createTerms(createForm).then(
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
        return this.inputForm.termsLangList.filter((nl, n) => {
          return n !== idx && ln.value === nl.lang
        }).length === 0
      })
    },
    // 내용 추가
    langPlusBtn: function (idx) {
      const lng = this.langs.filter(ln => {
        return !this.inputForm.termsLangList.some(iln => {
          return iln.lang === ln.value
        })
      })[0]
      this.inputForm.termsLangList.splice((idx + 1), 0, {
        lang: lng.value,
        termsTitle: '',
        termsContents: ''
      })
    },
    // 내용 삭제
    langMinusBtn: function (idx) {
      this.inputForm.termsLangList.splice(idx, 1)
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
        this.createTerms()
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
