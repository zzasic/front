<template>
  <v-card>
    <v-card-title>
      <span class="headline">사전 조회</span>
    </v-card-title>
    <v-card-text>
      <v-container class="default-grid">
        <v-row>
          <v-col cols="2">
            프로퍼티 명
          </v-col>
          <v-col cols="5">
            {{dictionary.dctnrCode}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            언어
          </v-col>
          <v-col cols="5">
            {{dictionary.langNm}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            단어명
          </v-col>
          <v-col cols="5">
            {{dictionary.lableNm}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            사용여부
          </v-col>
          <v-col cols="5">
            {{'Y' === dictionary.useYn ? '사용' : '미사용'}}
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="submit-btns-group">
        <v-spacer></v-spacer>
        <v-btn color="btn-secondary" text @click="closeBtn">닫기</v-btn>
        <v-btn color="btn-secondary" text @click="deleteBtn">삭제</v-btn>
        <v-btn color="btn-primary" text @click="updateBtn">수정</v-btn>
      </v-card-actions>
    </v-card-text>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="closeBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import { getDictionary, deleteDictionary } from '@/api/dictionary'

export default {
  name: 'PopupReadDictionaryView',
  props: {
    dctnrCode: String,
    lang: String
  },
  computed: {},
  created () {
    this.init()
  },
  mounted () {
  },
  data () {
    return {
      // API 상세
      dictionary: {
        lang: '',
        langNm: '',
        lableNm: '',
        dctnrCode: '',
        useYn: ''
      }
    }
  },
  methods: {
    init: async function () {
      await this.getDictionary()
    },
    // 입력값 조회
    getDictionary: function () {
      getDictionary(this.dctnrCode, this.lang).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.dictionary = {
              lang: response.data.result.dictionary.lang,
              langNm: response.data.result.dictionary.langNm,
              lableNm: response.data.result.dictionary.lableNm,
              dctnrCode: response.data.result.dictionary.dctnrCode,
              useYn: response.data.result.dictionary.useYn
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
            alert('삭제되었습니다.')
            this.$emit('popupAction', {
              createView: false,
              readView: false,
              updateView: false
            })
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    },
    isBlank: function (x) {
      return (!x || x.trim().length === 0)
    },
    // 닫기
    closeBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        readView: false,
        updateView: false
      })
    },
    // 삭제
    deleteBtn: function () {
      if (confirm('해당 사전정보를 삭제하시겠습니까?')) {
        this.deleteDictionary()
      }
    },
    // 수정으로
    updateBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        readView: false,
        updateView: true,
        dctnrCode: this.dctnrCode,
        lang: this.lang
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
