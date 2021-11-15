<template>
  <v-card class="dialog-scenario">
    <v-card-title>
    <span class="headline">시나리오 카테고리 수정</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col cols="2">
            <span class="label must">카테고리ID</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.categoryId"
              :rules="[categoryIdRules.required, categoryIdRules.minLength, categoryIdRules.alphanumber]"
              hide-details="auto"
              outlined
              disabled
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">카테고리명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.categoryNm"
              :rules="categoryNmRules"
              hide-details="auto"
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col cols="2">
            <span class="label must">테넌트</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.tenantId"
              :items="tenants"
              :rules="tenantIdRules"
              :placeholder="inputForm.tenantId ? undefined : '선택'"
              hide-details="auto"
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col cols="2">
            <span class="label must">챗봇</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.chatbotId"
              :items="chatbots"
              :rules="chatbotIdRules"
              :placeholder="inputForm.chatbotId ? undefined : '선택'"
              hide-details="auto"
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label">호전환번호</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.switchTelNo"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">모니터링 대상</span>
          </v-col>
          <v-col>
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.monitoringYn"
              :mandatory="false"
              row>
              <v-radio
                :ripple="false"
                v-for="(use, idx) in useYns" :key="idx"
                :label="use.text"
                :value="use.value"
              ></v-radio>
            </v-radio-group>
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
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              row>
              <v-radio
                :ripple="false"
                v-for="(use, idx) in useYns" :key="idx"
                :label="use.text"
                :value="use.value"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-secondary" text @click="deleteScenarioCategory()">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="setScenarioCategory">{{ $t('button.save')}}</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="$emit('close-dialog')"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>

import {
  initScenarioCategoryView,
  selectScenarioCategoryForUpdate,
  updateScenarioCategory,
  deleteScenarioCategory
} from '../../api/scategory'

import lodash from 'lodash'

export default {

  name: 'PopupUpdateScenarioCategoryView',

  components: {
  },
  props: {
    editedItem: Object
  },
  data () {
    return {
      valid: true,
      reqForm: {},

      /* input start */
      inputForm: {
        categoryId: '',
        categoryNm: '',
        tenantId: '',
        chatbotId: '',
        chatbotEngine: '',
        switchTelNo: '',
        monitoringYn: '',
        useYn: 'Y'
      },
      /* input end */

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
      tenants: [],
      chatbots: [],

      /* validate start */
      categoryIdRules: {
        required: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        /* eslint-disable */
        minLength: v => v.length <= 36 || '36자리가 넘을 수 없습니다.',
        alphanumber: v => /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(v) || '영문, 숫자 조합으로 입력해 주세요.'
        /* eslint-disable */
      },
       categoryNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '카테고리명를 입력하세요',
        v => v.length <= 200 || '200자리가 넘을 수 없습니다.',
      ],
      chatbotIdRules: [
        value => !!value || '챗봇을 선택하세요',
      ],
      tenantIdRules: [
        v => !!v || '테넌트를 선택하세요'
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    initScenarioCategoryView () {
      initScenarioCategoryView().then(
        response => {
          this.tenants = response.data.result.tenantList //
          this.chatbots = response.data.result.chatbotList //
        }
      )
    },
    getSelectScenarioCategory: function () {
      selectScenarioCategoryForUpdate(this.reqForm).then(
        response => {
          this.inputForm.categoryId = response.data.result.scenarioCategory.categoryId
          this.inputForm.categoryNm = response.data.result.scenarioCategory.categoryNm
          this.inputForm.tenantId = response.data.result.scenarioCategory.tenantId
          this.inputForm.chatbotId = response.data.result.scenarioCategory.chatbotId
          this.inputForm.chatbotEngine = response.data.result.scenarioCategory.chatbotEngine
          this.inputForm.useYn = response.data.result.scenarioCategory.useYn
          this.inputForm.switchTelNo = response.data.result.scenarioCategory.switchTelNo
          this.inputForm.monitoringYn = response.data.result.scenarioCategory.monitoringYn
        }
      )
    },
    setScenarioCategory: lodash.debounce(function () {
      if (!this.$refs.form.validate()) {
        return
      }
      // if (this.inputForm.chatbotEngine === 'daptalk' || this.chatbots.some((ch) => ch.value === this.inputForm.chatbotId && ch.opt3 === 'daptalk')) {
      //   alert('DAP 챗봇 시나리오는 수정이 불가합니다.\n(DAP 챗봇 시나리오는 동기화 작업만 가능합니다.)')
      //   return
      // }
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const input = {
        categoryId: this.inputForm.categoryId,
        categoryNm: this.inputForm.categoryNm,
        tenantId: this.inputForm.tenantId,
        chatbotId: this.inputForm.chatbotId,
        switchTelNo: this.inputForm.switchTelNo,
        monitoringYn: this.inputForm.monitoringYn,
        useYn: this.inputForm.useYn
      }
      updateScenarioCategory(input).then(
        response => {
          if (response.data.status === 200) {
            this.$emit('refresh-list')
            this.$emit('close-dialog')
          }
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    }, 300),
    deleteScenarioCategory: lodash.debounce(function () {
      if (this.inputForm.chatbotEngine === 'daptalk' || this.selected.some((ch) => ch.chatbotEngine === 'daptalk')) {
        alert('DAP 챗봇 카테고리는 삭제가 불가합니다.\n(DAP 챗봇 카테고리는 동기화 작업만 가능합니다.)')
        return
      }
      if (!confirm('삭제하시겠습니까?')) {
        return
      }
      deleteScenarioCategory(this.reqForm).then(
        response => {
          if (response.data.status === 200) {
            this.$emit('refresh-list')
            this.$emit('close-dialog')
          }
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    }, 300)
  },

  watch: {},

  created () {
    this.initScenarioCategoryView()
  },
  mounted () {
    this.reqForm = this.editedItem
    this.$nextTick(() => {
      this.getSelectScenarioCategory()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .transaction {
    margin-top: -24px;
  }
</style>
