<template>
  <v-card class="dialog-scenario">
    <v-card-title>
    <span class="headline">시나리오 수정</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col cols="1">
            <span class="label must">ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.scenarioId"
              :rules="[scenarioIdRules.required, scenarioIdRules.minLength, scenarioIdRules.alphanumber]"
              hide-details="auto"
              outlined
              disabled
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">시나리오명</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.scenarioNm"
              :rules="scenarioNmRules"
              hide-details="auto"
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">챗봇</span>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">카테고리</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.categoryId"
              :items="cptdCategorys"
              :placeholder="inputForm.categoryId ? undefined : '선택'"
              hide-details="auto"
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">인텐트ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.intentId"
              hide-details="auto"
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">챗플로우ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.chatflowId"
              hide-details="auto"
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label">호전환 번호</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.switchTelNo"
              hide-details="auto"
              outlined
              disabled
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label">ACS번호</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.didNumber"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">통계수집 대상</span>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">이상감지 대상</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-1 pt-0"
              v-model="inputForm.abnormalYn"
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
          <v-col cols="1">
            <span class="label must">사용 여부</span>
          </v-col>
          <v-col cols="4">
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
      <v-btn color="btn-secondary" text @click="deleteScenario()">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="setScenario">{{ $t('button.save')}}</v-btn>
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
  initScenarioView,
  selectScenarioForUpdate,
  updateScenario,
  deleteScenario
} from '../../api/scenario'

import lodash from 'lodash'

export default {

  name: 'PopupUpdateScenarioView',

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
        scenarioId: '',
        scenarioNm: '',
        chatbotId: '',
        chatbotEngine: '',
        intentId: '',
        didNumber: '',
        chatflowId: '',
        tenantId: '',
        categoryId: '',
        switchTelNo: '',
        useYn: 'Y',
        monitoringYn: 'Y',
        abnormalYn: 'Y'
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
      categorys: [],

      /* validate start */
      scenarioIdRules: {
        required: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        /* eslint-disable */
        minLength: v => v.length <= 36 || '36자리가 넘을 수 없습니다.',
        alphanumber: v => /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(v) || '영문, 숫자 조합으로 입력해 주세요.'
        /* eslint-disable */
      },
       scenarioNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '시나리오명를 입력하세요',
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
    cptdCategorys: function () {
      return this.categorys.filter((ctg) => {
        return this.inputForm.chatbotId === ctg.opt2
      })
    }
  },

  methods: {
    initScenarioView () {
      initScenarioView().then(
        response => {
          this.tenants = response.data.result.tenantList //
          this.chatbots = response.data.result.chatbotList //
          this.categorys = response.data.result.scenarioCategoryList //
        }
      )
    },
    getSelectScenario: function () {
      selectScenarioForUpdate(this.reqForm).then(
        response => {
          this.inputForm.scenarioId = response.data.result.scenario.scenarioId
          this.inputForm.scenarioNm = response.data.result.scenario.scenarioNm
          this.inputForm.chatbotId = response.data.result.scenario.chatbotId
          this.inputForm.chatbotEngine = response.data.result.scenario.chatbotEngine
          this.inputForm.intentId = response.data.result.scenario.intentId
          this.inputForm.didNumber = response.data.result.scenario.didNumber
          this.inputForm.chatflowId = response.data.result.scenario.chatflowId
          this.inputForm.tenantId = response.data.result.scenario.tenantId
          this.inputForm.useYn = response.data.result.scenario.useYn
          this.inputForm.monitoringYn = response.data.result.scenario.monitoringYn
          this.inputForm.abnormalYn = response.data.result.scenario.abnormalYn
          this.inputForm.categoryId = response.data.result.scenario.categoryId
          this.inputForm.switchTelNo = response.data.result.scenario.switchTelNo
        }
      )
    },
    setScenario: lodash.debounce(function () {
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
        scenarioId: this.inputForm.scenarioId,
        scenarioNm: this.inputForm.scenarioNm,
        chatbotId: this.inputForm.chatbotId,
        intentId: this.inputForm.intentId,
        didNumber: this.inputForm.didNumber,
        chatflowId: this.inputForm.chatflowId,
        tenantId: this.inputForm.tenantId,
        useYn: this.inputForm.useYn,
        monitoringYn: this.inputForm.monitoringYn,
        abnormalYn: this.inputForm.abnormalYn,
        categoryId: this.inputForm.categoryId
      }
      updateScenario(input).then(
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
    deleteScenario: lodash.debounce(function () {
      if (this.inputForm.chatbotEngine === 'daptalk' || this.selected.some((ch) => ch.chatbotEngine === 'daptalk')) {
        alert('DAP 챗봇 시나리오는 삭제가 불가합니다.\n(DAP 챗봇 시나리오는 동기화 작업만 가능합니다.)')
        return
      }
      if (!confirm('삭제하시겠습니까?')) {
        return
      }
      deleteScenario(this.reqForm).then(
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
    this.initScenarioView()
  },
  mounted () {
    this.reqForm = this.editedItem
    this.$nextTick(() => {
      this.getSelectScenario()
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
