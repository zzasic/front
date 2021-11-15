<template>
  <v-card class="dialog-counselor">
    <v-card-title>
    <span class="headline">AI 라우팅 수정</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
      <v-container>
        <v-row>
          <v-col cols="1">
            <span class="label must">ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.routingId"
              hide-details="auto"
              readonly
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">시스템</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.systemId"
              :items="systems"
              :rules="systemIdRules"
              :placeholder="inputForm.systemId ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">테넌트</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.tenantId"
              :items="tenants"
              :rules="tenantIdRules"
              :placeholder="inputForm.tenantId ? undefined : '선택'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">Base Path</span>
          </v-col>
          <v-col cols="11">
            <v-text-field
              class="default mt-0 pt-0 full"
              v-model="inputForm.basePath"
              :rules="basePathRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">Proxy Url</span>
          </v-col>
          <v-col cols="11">
            <v-text-field
              class="default mt-0 pt-0 full"
              v-model="inputForm.proxyUrl"
              :rules="proxyUrlRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">Target Url</span>
          </v-col>
          <v-col cols="11">
            <v-text-field
              class="default mt-0 pt-0 full"
              v-model="inputForm.targetUrl"
              :rules="targetUrlRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">설명</span>
          </v-col>
          <v-col cols="11">
            <v-text-field
              class="default mt-0 pt-0 full"
              v-model="inputForm.routingDesc"
              :rules="routingDescRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
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
      <v-btn color="btn-secondary" text @click="deleteBtn">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="saveBtn">{{ $t('button.save')}}</v-btn>
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
  initApiRoutingView,
  selectApiRoutingForUpdate,
  updateApiRouting,
  deleteApiRouting
} from '@/api/inf'

import lodash from 'lodash'

export default {

  name: 'PopupUpdateApiRoutingView',

  components: {
  },
  props: {
    editedItem: Object
  },
  data () {
    return {
      valid: true,
      lazy: true,
      /* input start */
      bExtensionDupCheck: true,
      errorMessages: [],
      successMessages: [],
      inputForm: {
        routingId: '', // 라우팅 ID
        systemId: '', // systemId
        tenantId: '', // tenantId
        basePath: '', // basePath
        proxyUrl: '', // proxyUrl
        targetUrl: '', // targetUrl
        routingDesc: '', // routingDesc
        useYn: 'Y' // 사용여부
      },
      /* input end */

      tenants: [], // 테넌트 목록
      systems: [],
      useYns: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ], // 사용여부

      /* validate start */
      basePathRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || 'Base Path를 입력하세요'
      ],
      proxyUrlRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || 'Proxy Url을 입력하세요'
      ],
      targetUrlRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || 'Target Url을 입력하세요'
      ],
      routingDescRules: [
        value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || '설명을 입력하세요'
      ],
      systemIdRules: [
        value => !!value || '시스템을 선택해주세요'
      ],
      tenantIdRules: [
        value => !!value || '테넌트를 선택해주세요'
      ],
      ApiIdRules: [
        v => !!v || 'API를 선택하세요'
      ]
      /* validate end */
    }
  },

  computed: {
  },

  methods: {
    initApiRoutingView: function () {
      initApiRoutingView(this.reqForm).then(
        response => {
          this.tenants = response.data.result.tenantList
          this.systems = response.data.result.systemInfoList
        }
      )
    },
    getSelectApiRouting: function () {
      selectApiRoutingForUpdate(this.reqForm).then(
        response => {
          this.inputForm.routingId = response.data.result.apiRouting.routingId
          this.inputForm.systemId = response.data.result.apiRouting.systemId
          this.inputForm.tenantId = response.data.result.apiRouting.tenantId
          this.inputForm.basePath = response.data.result.apiRouting.basePath
          this.inputForm.proxyUrl = response.data.result.apiRouting.proxyUrl
          this.inputForm.targetUrl = response.data.result.apiRouting.targetUrl
          this.inputForm.routingDesc = response.data.result.apiRouting.routingDesc
          this.inputForm.useYn = response.data.result.apiRouting.useYn
        }
      )
    },
    updateApiRouting: lodash.debounce(function () {
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const input = {
        routingId: this.inputForm.routingId,
        systemId: this.inputForm.systemId,
        tenantId: this.inputForm.tenantId,
        basePath: this.inputForm.basePath,
        proxyUrl: this.inputForm.proxyUrl,
        targetUrl: this.inputForm.targetUrl,
        routingDesc: this.inputForm.routingDesc,
        useYn: this.inputForm.useYn
      }
      updateApiRouting(input).then(
        response => {
          if (response.data.status === 200) {
            this.$emit('refresh-list')
            this.$emit('close-dialog')
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
    }, 300),

    saveBtn: function () {
      this.updateApiRouting()
    },
    deleteBtn: lodash.debounce(function () {
      if (!confirm('삭제하시겠습니까?')) {
        return
      }

      deleteApiRouting(this.reqForm).then(
        response => {
          if (response.data.status === 200) {
            this.$emit('refresh-list')
            this.$emit('close-dialog')
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
    }, 300)
  },

  created () {
    this.initApiRoutingView()
  },
  mounted () {
    this.reqForm = this.editedItem
    this.$nextTick(() => {
      this.getSelectApiRouting()
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
