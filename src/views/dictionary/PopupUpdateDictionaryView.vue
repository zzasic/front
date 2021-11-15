<template>
  <v-card>
    <v-card-title>
      <span class="headline">무의미 단어 수정</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
        <v-container>
          <!-- <v-row>
            <v-col cols="2">
              <span class="label must">프로퍼티 명</span>
            </v-col>
            <v-col>
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.dctnrCode"
                :placeholder="inputForm.dctnrCode"
                clearable
                disabled
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <span class="label must">언어</span>
            </v-col>
            <v-col>
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.langNm"
                :placeholder="inputForm.langNm"
                clearable
                disabled
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row> -->
          <v-row>
            <v-col cols="2">
              <span class="label must">단어명</span>
            </v-col>
            <v-col>
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.lableNm"
                :rules="[v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '단어 명을 입력해주세요', v => (!!v && v.length < 300) || $t('message.inputMaxLength', ['300'])]"
                placeholder=" "
                clearable
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <span class="label must">사용 여부</span>
            </v-col>
            <v-col>
              <v-radio-group
                class="default mt-1 pt-0"
                v-model="inputForm.useYn"
                :mandatory="false"
                row
                hide-details="auto"
                required
              >
                <v-radio
                  :ripple="false"
                  v-for="(use, idx) in useYns"
                  :key="idx"
                  :label="use.text"
                  :value="use.value"
                >
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-secondary" text @click="deleteBtn">{{ $t('button.delete')}}</v-btn>
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
import { updateDictionaryView, updateDictionary, deleteDictionary } from '@/api/dictionary/'

export default {
  name: 'PopupUpdateDictionaryView',
  props: {
    dctnrCode: String,
    lang: String
  },
  computed: {},
  created () {
    this.init()
  },
  mounted () {
    this.$nextTick(() => {
      // 렌더링된 후 호출
    })
  },
  data () {
    return {
      tabDictionary: null,
      valid: true,
      lazy: true,
      // 언어
      langs: [],
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
      // 입력값
      inputForm: {
        lang: 'KO', // 언어
        lableNm: '', // 용어 명
        dctnrCode: '', // 프로퍼티 명
        useYn: 'Y' // 사용여부
      }
    }
  },
  methods: {
    init: async function () {
      await this.updateDictionaryView()
    },
    // 입력값 조회
    updateDictionaryView: function () {
      updateDictionaryView(this.dctnrCode, this.lang).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.langs = response.data.result.langList // 이용서비스
            const dictionary = response.data.result.dictionary
            this.inputForm = {
              lang: this.lang,
              langNm: dictionary.langNm,
              lableNm: dictionary.lableNm,
              dctnrCode: this.dctnrCode,
              useYn: dictionary.useYn
            }
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    // API관리 등록
    updateDictionary: function () {
      // param setting
      const updateForm = {
        lang: this.lang,
        lableNm: this.inputForm.lableNm,
        dctnrCode: this.inputForm.dctnrCode,
        useYn: this.inputForm.useYn
      }
      updateDictionary(updateForm).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.$emit('popupAction', {
              createView: false,
              batchView: false,
              readView: false,
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
    deleteDictionary: function () {
      const dictionarys = [
        {
          dctnrCode: this.dctnrCode,
          lang: this.lang
        }
      ]
      deleteDictionary(dictionarys).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 삭제되었습니다
            this.$emit('popupAction', {
              createView: false,
              batchView: false,
              readView: false,
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
    // 취소버튼
    cancelBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        batchView: false,
        updateView: false,
        readView: false
      })
      // this.$router.push({ name: 'readDictionaryView', params: { apiId: this.apiId } })
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    },
    isBlank: function (x) {
      return (!x || x.trim().length === 0)
    },
    // 삭제
    deleteBtn: function () {
      if (confirm('해당 사전정보를 삭제하시겠습니까?')) {
        this.deleteDictionary()
      }
    },
    // 저장버튼
    saveBtn: function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        this.updateDictionary()
      }
      // if (this.isEmpty(this.inputForm.apiNm) || this.isBlank(this.inputForm.apiNm)) {
      //   alert('API 명을 입력하세요.')
      //   this.$refs.apiNm.focus()
      //   return false
      // }
      // if (this.isEmpty(this.inputForm.service ? this.inputForm.service.value : '') || this.isBlank(this.inputForm.service ? this.inputForm.service.value : '')) {
      //   alert('이용서비스를 선택하세요.')
      //   this.$refs.service.focus()
      //   return false
      // }
      // if (this.isEmpty(this.inputForm.apiUrl) || this.isBlank(this.inputForm.apiUrl)) {
      //   alert('API URL을 입력하세요.')
      //   this.$refs.apiUrl.focus()
      //   return false
      // }
      // if (this.isEmpty(this.inputForm.transType ? this.inputForm.transType.value : '') || this.isBlank(this.inputForm.service ? this.inputForm.service.value : '')) {
      //   alert('TRANS TYPE을 선택하세요.')
      //   this.$refs.transType.focus()
      //   return false
      // }
      // this.updateDictionary()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
