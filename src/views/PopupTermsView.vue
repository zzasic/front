<template>
  <v-card class="dialog-Terms">
    <v-card-title>
      <span class="headline">{{ pageTitle }}</span>
      <span class="text">{{ pageDescription }}</span>
    </v-card-title>
    <v-card-text>
      <div class="layer-terms">
        <v-container>
          <!-- <v-row>
            <v-col cols="12">
              <h2>{{ pageTitle }}</h2>
              <span class="text">{{ pageDescription }}</span>
            </v-col>
          </v-row>
          <br /> -->
          <v-row class="mb-3">
            <v-col></v-col>
            <v-col cols="2">
              <span class="label">개정일 선택</span>
            </v-col>
            <v-col cols="4">
            <v-select
              return-object
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :items="termses"
              v-model="selectTerms"
              item-text="termsVer"
              item-value="termsVer"
            ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <vuescroll>
          <div class="text" v-html="selectTerms.termsContents">
          </div>
        </vuescroll>
      </div>
    </v-card-text>
    <v-btn
      class="default dialogclose"
      text
      @click="$emit('close-dialog')"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import { getTermsPrivateList } from '@/api/terms/'

export default {
  mounted () {
    this.getTermsPrivateList()
  },
  data: function () {
    return {
      ops: {},
      selectTerms: {},
      pageTitle: '개인정보 처리 방침',
      pageDescription: 'AI 컨텍센터 시스템(AICC)은 개인정보보호 관련 법률 규정을 준수합니다',
      termses: []
    }
  },
  methods: {
    getTermsPrivateList () {
      getTermsPrivateList().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.termses = response.data.result.termsList
            this.selectTerms = this.termses[0]
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  /* 약관 등의 레이어 */
  .layer-terms {
    .text {
      padding-bottom: 300px;
    }
  }
  table.bordered {
    border: 1px solid black;
  }
  table.bordered td {
    border-top: 1px solid black;
  }
</style>
