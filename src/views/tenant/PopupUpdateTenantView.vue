<template>
  <v-card class="dialog-tenant">
    <v-card-title>
    <span class="headline">테넌트 수정</span>
    </v-card-title>
    <v-card-text>
      <vuescroll>
        <v-form
          ref="form"
          v-model="valid"
        >
        <v-container>
          <v-row>
            <v-col cols="1">
              <span class="label">ID</span>
            </v-col>
            <v-col cols="4">
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.tenantId"
                hide-details="auto"
                outlined
                dense
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label must">테넌트명</span>
            </v-col>
            <v-col cols="4">
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.tenantNm"
                :rules="[tenantNmRules.required, tenantNmRules.minLength]"
                hide-details="auto"
                outlined
                dense
                oninput="javascript: if (this.value.length > 64) this.value = this.value.substring(0, 64)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1">
              <span class="label must">STT</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.sttId"
                :items="stts"
                :rules="sttIdRules"
                :placeholder="inputForm.sttId ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label ">TA</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.taId"
                :items="tas"
                :placeholder="inputForm.taId ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1">
              <span class="label must">TTS</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.ttsId"
                :items="ttss"
                :rules="ttsIdRules"
                :placeholder="inputForm.ttsId ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label must">화자 구분</span>
            </v-col>
            <v-col cols="4">
              <v-radio-group
                class="default mt-1 pt-0"
                v-model="inputForm.speakerGenderYn"
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
              <span class="label must">기본 화자</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.speaker"
                :items="ttsSpeakers"
                :placeholder="inputForm.speaker ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="1">
              <span class="label">화자2</span>
            </v-col>
            <v-col cols="4">
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                v-model="inputForm.speaker2"
                :items="ttsSpeakers"
                :placeholder="inputForm.speaker2 ? undefined : '선택'"
                hide-details="auto"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1">
              <span class="label must">DTMF 종료</span>
            </v-col>
            <v-col cols="4">
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.dtmfEndDigit"
                :rules="dtmfEndDigitRules"
                placeholder="'#' 또는 '*'를 입력하세요"
                clearable
                hide-details="auto"
                required
                oninput="javascript: if (this.value.length > 1) this.value = this.value.substring(0, 1)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="1">
              <span class="label must">순서</span>
            </v-col>
            <v-col cols="4">
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.sortOrder"
                :rules="sortOrderRules"
                placeholder="숫자로 입력하세요"
                clearable
                hide-details="auto"
                required
                oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
              ></v-text-field>
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
            <v-col>
              <PageSectionTitle
                :title="'AI Service System'"
              ></PageSectionTitle>
              <div class="btn-group align-right">
                <v-btn class="btn-plus" @click="tenantSystemPlusClick">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
                <v-btn class="btn-minus" @click="tenantSystemMinusClick">
                  <v-icon dark>mdi-minus</v-icon>
                </v-btn>
              </div>
              <v-card class="data-grid-wrap default has-scroll">
                <vuescroll>
                  <v-data-table
                    v-model="tenantSystemSelected"
                    :headers="tenantSystemHeaders"
                    :items="inputForm.tenantSystemList"
                    item-key="systemId"
                    :fixed-header="true"
                    :disable-pagination="true"
                    :height="minHeight"
                    :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                    hide-default-footer
                    show-select
                    no-data-text="시스템을 추가하세요"
                    :loading-text="$t('message.loading')"
                  >
                    <template v-slot:item.systemId="{ item, value }">
                      <v-select
                        class="default mt-0 pt-0"
                        style="width:180px"
                        :menu-props="{ offsetY: true }"
                        v-model="item.systemId"
                        :items="cptdSystemIds(value)"
                        :rules="[
                          value => !!value || `시스템을 선택하세요`
                        ]"
                        hide-details="auto"
                        outlined
                        dense
                      ></v-select>
                    </template>
                    <template v-slot:item.chatbotId="{ item }">
                      <v-select
                        class="default mt-0 pt-0"
                        style="width:180px"
                        :menu-props="{ offsetY: true }"
                        v-model="item.chatbotId"
                        :items="chatbots"
                        hide-details="auto"
                        outlined
                        dense
                        :disabled="item.systemId === 'AICC'"
                      ></v-select>
                    </template>
                    <template v-slot:item.speaker="{ item }">
                      <v-select
                        class="default mt-0 pt-0"
                        style="width:140px"
                        :menu-props="{ offsetY: true }"
                        v-model="item.speaker"
                        :items="ttsSpeakers"
                        hide-details="auto"
                        outlined
                        dense
                        :disabled="item.systemId === 'AICC'"
                      ></v-select>
                    </template>
                    <template v-slot:item.ttsId="{ item }">
                      <v-select
                        class="default mt-0 pt-0"
                        style="width:140px"
                        :menu-props="{ offsetY: true }"
                        v-model="item.ttsId"
                        :items="ttss"
                        hide-details="auto"
                        outlined
                        dense
                        :disabled="item.systemId === 'AICC'"
                      ></v-select>
                    </template>
                  </v-data-table>
                </vuescroll>
              </v-card>
            </v-col>
          </v-row>
          <v-row >
            <v-col>
              <PageSectionTitle
                :title="'AI Contact Center'"
              ></PageSectionTitle>
              <div class="btn-group align-right">
                <v-btn class="btn-plus" @click="tenantTelPlusClick">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
                <v-btn class="btn-minus" @click="tenantTelMinusClick">
                  <v-icon dark>mdi-minus</v-icon>
                </v-btn>
              </div>
              <v-card class="data-grid-wrap default has-scroll">
                <vuescroll>
                  <v-data-table
                    v-model="tenantTelSelected"
                    :headers="tenantTelHeaders"
                    :items="inputForm.tenantTelList"
                    item-key="telId"
                    :fixed-header="true"
                    :disable-pagination="true"
                    :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                    hide-default-footer
                    show-select
                    no-data-text="대표전화번호를 추가하세요"
                    :loading-text="$t('message.loading')"
                  >
                    <template v-slot:header.telNo="{ header }">
                      <span class="label must">{{header.text}}</span>
                    </template>
                    <template v-slot:item.telNo="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        style="width:100px"
                        v-model="item.telNo"
                        :rules="[
                          value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || `대표전화번호를 입력하세요`,
                          value => value.length <= 20 || '20자리를 넘을 수 없습니다.',
                          value => /^[0-9]+$/.test(value) || '숫자만 입력하세요.'
                        ]"
                        hide-details="auto"
                        outlined
                        dense
                        oninput="javascript: if (this.value.length > 20) this.value = this.value.substring(0, 20)"
                      ></v-text-field>
                    </template>
                    <template v-slot:header.chatbotId="{ header }">
                      <span class="label must">{{header.text}}</span>
                    </template>
                    <template v-slot:item.chatbotId="{ item }">
                      <v-select
                        class="default mt-0 pt-0"
                        style="width:180px"
                        :menu-props="{ offsetY: true }"
                        v-model="item.chatbotId"
                        :items="chatbots"
                        :rules="[
                          value => !!value || `챗봇을 선택하세요`
                        ]"
                        hide-details="auto"
                        outlined
                        dense
                      ></v-select>
                    </template>
                    <template v-slot:header.callGroupId="{ header }">
                      <span class="label">{{header.text}}</span>
                    </template>
                    <template v-slot:item.callGroupId="{ item }">
                      <v-select
                        class="default mt-0 pt-0"
                        style="width:100px"
                        :menu-props="{ offsetY: true }"
                        v-model="item.callGroupId"
                        :items="callGroups"
                        :rules="[
                          value => !!value || `Call Group을 선택하세요`
                        ]"
                        hide-details="auto"
                        outlined
                        dense
                      ></v-select>
                    </template>
                    <template v-slot:header.switchTelNo="{ header }">
                      <span class="label">{{header.text}}</span>
                    </template>
                    <template v-slot:item.switchTelNo="{ item }">
                      <v-text-field
                        class="default mt-0 pt-0"
                        style="width:100px"
                        v-model="item.switchTelNo"
                        hide-details="auto"
                        outlined
                        dense
                        oninput="javascript: if (this.value.length > 20) this.value = this.value.substring(0, 20)"
                      ></v-text-field>
                    </template>
                    <template v-slot:item.sttSkipYn="{ item }">
                      <v-checkbox
                        class="default mt-0 pt-0"
                        dense
                        hide-details
                        :ripple="false"
                        v-model="item.sttSkipYn"
                        :style="{ width: '22px', overflow: 'hidden', margin: 'auto', marginTop: '10px !important' }"
                        true-value="Y"
                        false-value="N">
                      </v-checkbox>
                    </template>
                    <template v-slot:item.musicOnHold="{ item }">
                      <v-checkbox
                        class="default mt-0 pt-0"
                        dense
                        hide-details
                        :ripple="false"
                        v-model="item.musicOnHold"
                        :style="{ width: '22px', overflow: 'hidden', margin: 'auto', marginTop: '10px !important' }"
                        true-value="Y"
                        false-value="N">
                      </v-checkbox>
                    </template>
                  </v-data-table>
                </vuescroll>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        </v-form>
      </vuescroll>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-secondary" text @click="delTenant()">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="setTenant">{{ $t('button.save')}}</v-btn>
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
  reqInitTenantView,
  reqSelectTenantForUpdate,
  reqUpdateTenant,
  reqDeleteTenant
} from '../../api/tenant'

import lodash from 'lodash'

export default {

  name: 'PopupUpdateTenantView',

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
        tenantId: '',
        tenantNm: '',
        tenantEngNm: '',
        sortName: '',
        sortOrder: '',
        useYn: '',
        sttId: '',
        sttModel: '0',
        ttsId: '',
        taId: '',
        speakerGenderYn: '',
        speaker: '',
        speaker2: '',
        ttsStopYn: 'N',
        sttSkipYn: 'Y',
        dtmfEndDigit: '',
        tenantTelList: [{
          isSelectable: false,
          telId: `NEW${new Date().getTime()}`,
          telNo: '',
          switchTelNo: '',
          chatbotId: '',
          callGroupId: '',
          ttsStopYn: 'N',
          sttSkipYn: 'N',
          musicOnHold: 'N',
          useYn: 'Y'
        }],
        tenantSystemList: []
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
      stts: [],
      sttModels: [],
      ttss: [],
      tas: [],
      ttsSpeakers: [],
      chatbots: [],
      systems: [],
      callGroups: [],
      /* validate start */
      tenantIdRules: {
        required: value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        /* eslint-disable */
        minLength: v => v.length < 12 || '12자리가 넘을 수 없습니다.',
        alphanumber: v => /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(v) || '영문, 숫자 조합으로 입력해 주세요.'
        /* eslint-disable */
      },
      tenantNmRules: {
        // v => !!v || '테넌트명를 입력하세요'
        required: value => (!!value && value.length > 0 && value.replace(/\s/g, '').length > 0) || '테넌트 명을 입력하세요',
        /* eslint-disable */
        minLength: v => v.length < 64 || '64자리가 넘을 수 없습니다.',
      },
      sttIdRules: [
        value => !!value || 'STT를 선택하세요'
      ],
      sttModelRules: [
        value => !!value || 'STT모델을 선택하세요'
      ],
      ttsIdRules: [
        value => !!value || 'TTS를 선택하세요'
      ],
      speakerRules: [
        value => !!value || 'TTS화자를 선택하세요'
      ],
      sortOrderRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '순서를 입력하세요',
        /* eslint-disable */
        v => /^[0-9]*$/.test(v) || '순서를 숫자로 입력해 주세요',
        /* eslint-disable */
        v => (!!v && v.length <= 5) || '순서를 5자리 이내로 입력해 주세요'
      ],
      dtmfEndDigitRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '가변길이 DTMF 종료문자를 입력하세요',
        /* eslint-disable */
        v => (!!v && v.length <= 1) || '가변길이 DTMF 종료문자를 1자리 이내로 입력해 주세요'
      ],
      /* validate end */
      tenantTelSelected: [],
      tenantTelHeaders: [
        { text: '대표전화번호', value: 'telNo', width:'90px', align: 'center', sortable: false },
        { text: '챗봇', value: 'chatbotId', width:'180px', align: 'center', sortable: false },
        { text: 'Call Group', value: 'callGroupId', width:'90px', align: 'center', sortable: false },
        { text: '호전환번호', value: 'switchTelNo', width:'90px', align: 'center', sortable: false },
        { text: '발화무시', value: 'sttSkipYn', width:'60px', align: 'center', class: 'text-center', sortable: false },
        { text: '대기음', value: 'musicOnHold', width:'60px', align: 'center', class: 'text-center', sortable: false }
      ],
      tenantSystemSelected: [],
      tenantSystemHeaders: [
        { text: '시스템', value: 'systemId', width:'90px', align: 'center', sortable: false },
        { text: '챗봇', value: 'chatbotId', width:'180px', align: 'center', sortable: false },
        { text: 'TTS', value: 'ttsId', width:'120px', align: 'center', sortable: false },
        { text: '화자', value: 'speaker', width:'120px', align: 'center', class: 'text-center', sortable: false }
      ]
    }
  },

  computed: {
    minHeight: function () {
      if (this.inputForm.tenantSystemList.length > 0) {
        return `auto`
      } else {
        return '124px'
      }
    }
  },

  methods: {
    initTenantView () {
      reqInitTenantView().then(
        response => {
          this.stts = response.data.result.sttList // STT 목록
          this.ttss = response.data.result.ttsList // TTS 목록
          this.tas = response.data.result.taList // TA 목록
          this.ttsSpeakers = response.data.result.ttsSpeakerList // TTS 화자목록
          this.chatbots = response.data.result.chatbotList // 챗봇 목록
          this.callGroups = response.data.result.callGroupList // 콜그룹 목록
          this.systems = response.data.result.systemInfoList // 시스템 목록
        }
      )
    },
    tenantTelPlusClick: function () {
      this.inputForm.tenantTelList.push({
        isSelectable: true,
        telId: `NEW${new Date().getTime()}`,
        telNo: '',
        switchTelNo: '',
        chatbotId: '',
        callGroupId: '',
        ttsStopYn: 'N',
        sttSkipYn: 'N',
        musicOnHold: 'N',
        sortOrder: '99',
        dtmfEndDigit: '#',
        useYn: 'Y'
      })
    },
    tenantTelMinusClick: function () {
      if (!this.tenantTelSelected || this.tenantTelSelected.length === 0) {
        alert('삭제할 테넌트 전화번호를 선택하세요.')
        return
      }
      if (!confirm('선택한 테넌트 전화번호를 삭제하시겠습니까?')) {
        return
      }
      for (const si of this.tenantTelSelected) {
        const idx = this.inputForm.tenantTelList.findIndex(tt => tt.telId === si.telId)
        if (idx > -1) {
          this.inputForm.tenantTelList.splice(idx, 1)
        }
      }
      this.tenantTelSelected = []
    },
    cptdSystemIds: function (systemId) {
      return (this.systems || []).filter(s => {
        return s.value === systemId || !this.inputForm.tenantSystemList.some((t, i) => {
          return t.systemId === s.value
        })
      })
    },
    tenantSystemPlusClick: function () {
      const systemList = this.cptdSystemIds('')
      if (systemList.length > 0) {
        this.inputForm.tenantSystemList.push({
          isSelectable: true,
          systemId: systemList[0].value,
          chatbotId: '',
          ttsId: '',
          speaker: ''
        })
      }
    },
    tenantSystemMinusClick: function () {
      if (!this.tenantSystemSelected || this.tenantSystemSelected.length === 0) {
        alert('삭제할 테넌트 시스템을 선택하세요.')
        return
      }
      if (!confirm('선택한 테넌트 시스템을 삭제하시겠습니까?')) {
        return
      }
      for (const si of this.tenantSystemSelected) {
        const idx = this.inputForm.tenantSystemList.findIndex(tt => tt.systemId === si.systemId)
        if (idx > -1) {
          this.inputForm.tenantSystemList.splice(idx, 1)
        }
      }
      this.tenantSystemSelected = []
    },
    getSelectTenant: function () {
      reqSelectTenantForUpdate(this.reqForm).then(
        response => {
          this.inputForm.tenantId = response.data.result.tenant.tenantId
          this.inputForm.tenantNm = response.data.result.tenant.tenantNm
          this.inputForm.tenantEngNm = response.data.result.tenant.tenantEngNm
          this.inputForm.sortName = response.data.result.tenant.sortName
          this.inputForm.sortOrder = response.data.result.tenant.sortOrder
          this.inputForm.useYn = response.data.result.tenant.useYn
          this.inputForm.sttId = response.data.result.tenant.sttId
          this.inputForm.sttModel = '0'
          this.inputForm.ttsId = response.data.result.tenant.ttsId
          this.inputForm.taId = response.data.result.tenant.taId
          this.inputForm.speakerGenderYn = response.data.result.tenant.speakerGenderYn
          this.inputForm.speaker = response.data.result.tenant.speaker
          this.inputForm.speaker2 = response.data.result.tenant.speaker2
          this.inputForm.ttsStopYn = 'N'
          this.inputForm.sttSkipYn = 'Y'
          this.inputForm.dtmfEndDigit = response.data.result.tenant.dtmfEndDigit
          if (response.data.result.tenant.tenantTelList && response.data.result.tenant.tenantTelList.length > 0) {
            this.inputForm.tenantTelList = response.data.result.tenant.tenantTelList
            this.inputForm.tenantTelList[0].isSelectable = false
          }
          this.inputForm.tenantSystemList = response.data.result.tenant.tenantSystemList
        }
      )
    },
    setTenant: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          tenantId: this.inputForm.tenantId,
          tenantNm: this.inputForm.tenantNm,
          tenantEngNm: this.inputForm.tenantEngNm,
          sortName: this.inputForm.sortName,
          sortOrder: this.inputForm.sortOrder,
          useYn: this.inputForm.useYn,
          sttId: this.inputForm.sttId,
          sttModel: '0',
          ttsId: this.inputForm.ttsId,
          taId: this.inputForm.taId,
          speakerGenderYn: this.inputForm.speakerGenderYn,
          speaker: this.inputForm.speaker,
          speaker2: this.inputForm.speaker2,
          ttsStopYn: 'N',
          sttSkipYn: 'Y',
          dtmfEndDigit: this.inputForm.dtmfEndDigit,
          tenantTelList: this.inputForm.tenantTelList,
          tenantSystemList: this.inputForm.tenantSystemList
        }
        reqUpdateTenant(input).then(
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
      }
    }, 300),
    delTenant: lodash.debounce(function () {
      if (confirm('삭제하시겠습니까?')) {
        reqDeleteTenant(this.reqForm).then(
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
      }
    }, 300)
  },

  watch: {},

  created () {
    this.initTenantView()
  },
  mounted () {
    this.reqForm = this.editedItem
    this.$nextTick(() => {
      this.getSelectTenant()
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
