<template>
  <v-card class="dialog-chatbot">
    <v-card-title>
    <span class="headline">챗봇 수정</span>
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
              v-model="inputForm.chatbotId"
              :rules="[chatbotIdRules.required, chatbotIdRules.minLength]"
              hide-details="auto"
              outlined
              disabled
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">챗봇명</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.chatbotNm"
              :rules="chatbotNmRules"
              hide-details="auto"
              outlined
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">URL</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.chatbotUrl"
              :rules="chatbotUrlRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">챗봇엔진</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.chatbotEngine"
              :items="chatbotEngines"
              :rules="chatbotEngineRules"
              :placeholder="inputForm.chatbotEngine ? undefined : '선택'"
              hide-details="auto"
              outlined
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">통화유형</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.callType"
              :items="callTypes"
              :rules="callTypeRules"
              :placeholder="inputForm.callType ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
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
        <v-row v-if="inputForm.chatbotEngine === 'infochatter' ">
          <v-col cols="1">
            <span class="label must">저장소ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.repoId"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">Agent명</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.agentName"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="inputForm.chatbotEngine === 'daptalk' ">
          <v-col cols="1">
            <span class="label must">서비스</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.serviceId"
              :items="services"
              :rules="serviceIdRules"
              :placeholder="inputForm.serviceId ? undefined : '선택'"
              hide-details="auto"
              outlined
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              dense
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">서비스 테넌트</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.serviceTenantId"
              :items="cptdServiceTenants"
              :rules="tenantIdRules"
              :placeholder="inputForm.serviceTenantId ? undefined : '선택'"
              hide-details="auto"
              outlined
              :disabled="inputForm.chatbotEngine === 'daptalk'"
              dense
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-secondary" text @click="deleteChatbot()">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="setChatbot">{{ $t('button.save')}}</v-btn>
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
  initChatbotView,
  selectChatbotForUpdate,
  updateChatbot,
  deleteChatbot
} from '../../api/chatbot'

import lodash from 'lodash'

export default {

  name: 'PopupUpdateChatbotView',

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
        chatbotId: '',
        chatbotNm: '',
        serviceTenantId: '',
        chatbotUrl: '',
        chatbotEngine: '',
        callType: 'IN',
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
      services: [],
      chatbotEngines: [],
      callTypes: [],

      /* validate start */
      chatbotIdRules: {
        required: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        /* eslint-disable */
        minLength: v => v.length <= 36 || '36자리가 넘을 수 없습니다.'
        /* eslint-disable */
      },
     chatbotNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '챗봇명를 입력하세요',
        v => v.length <= 200 || '200자리가 넘을 수 없습니다.'
      ],
      chatbotUrlRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'URL을 입력하세요',
        v => v.length <= 300 || '300자리가 넘을 수 없습니다.'
      ],
      serviceIdRules: [
        v => !!v || '테넌트를 선택하세요'
      ],
      tenantIdRules: [
        v => !!v || '테넌트를 선택하세요'
      ],
      chatbotEngineRules: [
        v => !!v || '챗봇엔진을 선택하세요'
      ],
      callTypeRules: [
        v => !!v || '통화유형을 선택하세요'
      ]
      /* validate end */
    }
  },

  computed: {
    cptdServiceTenants: function () {
      return this.tenants.filter((t) => {
        return t.opt1 === this.inputForm.serviceId
      })
    }
  },

  methods: {
    initChatbotView () {
      initChatbotView().then(
        response => {
          this.services = response.data.result.catalogList //
          this.tenants = response.data.result.tenantList //
          this.chatbotEngines = response.data.result.chatbotEngineList
          this.callTypes = response.data.result.callTypeList
        }
      )
    },
    getSelectChatbot: function () {
      selectChatbotForUpdate(this.reqForm).then(
        response => {
          this.inputForm.chatbotId = response.data.result.chatbot.chatbotId
          this.inputForm.chatbotNm = response.data.result.chatbot.chatbotNm
          this.inputForm.serviceId = response.data.result.chatbot.serviceId
          this.inputForm.serviceTenantId = response.data.result.chatbot.serviceTenantId
          this.inputForm.chatbotUrl = response.data.result.chatbot.chatbotUrl
          this.inputForm.chatbotEngine = response.data.result.chatbot.chatbotEngine
          this.inputForm.callType = response.data.result.chatbot.callType
          this.inputForm.repoId = response.data.result.chatbot.repoId
          this.inputForm.agentName = response.data.result.chatbot.agentName
          this.inputForm.useYn = response.data.result.chatbot.useYn
        }
      )
    },
    setChatbot: lodash.debounce(function () {
      if (!this.$refs.form.validate()) {
        return
      }
      // if (this.inputForm.chatbotEngine === 'daptalk') {
      //   alert('DAP 챗봇은 수정이 불가합니다.\n(DAP 챗봇은 동기화 작업만 가능합니다.)')
      //   return
      // }
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const input = {
        chatbotId: this.inputForm.chatbotId,
        chatbotNm: this.inputForm.chatbotNm,
        serviceTenantId: this.inputForm.serviceTenantId,
        serviceId: this.inputForm.serviceId,
        chatbotUrl: this.inputForm.chatbotUrl,
        chatbotEngine: this.inputForm.chatbotEngine,
        callType: this.inputForm.callType,
        repoId: this.inputForm.repoId,
        agentName: this.inputForm.agentName,
        useYn: this.inputForm.useYn
      }
      updateChatbot(input).then(
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
    deleteChatbot: lodash.debounce(function () {
      if (this.inputForm.chatbotEngine === 'daptalk') {
        alert('DAP 챗봇은 삭제가 불가합니다.\n(DAP 챗봇은 동기화 작업만 가능합니다.)')
        return
      }
      if (!confirm('삭제하시겠습니까?')) {
        return
      }
      deleteChatbot(this.reqForm).then(
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
    this.initChatbotView()
  },
  mounted () {
    this.reqForm = this.editedItem
    this.$nextTick(() => {
      this.getSelectChatbot()
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
