<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :hasNoSearchGroup="true"
      ></PageTitle>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container class="addUserDefaultData">
        <PageSectionTitle
          :title="sectionTitle"
        >
        </PageSectionTitle>
        <v-row>
          <v-col cols="1">
            <span class="label must">캠페인명</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.campaignNm"
              :rules="campaignNmRules"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">테넌트</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.tenantId ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.tenantId"
              :rules="tenantIdRules"
              :items="tenants"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">시나리오</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.scenarioId ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.scenarioId"
              :rules="scenarioIdRules"
              :items="itemScenarios"
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">발신번호</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.telId ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.telId"
              :rules="telIdRules"
              :items="itemTels"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">시작일시</span>
          </v-col>
          <v-col cols="2">
            <v-menu
              content-class="date-picker"
              ref="pickerStartMenu"
              v-model="pickerStartMenu"
              :close-on-content-click="false"
              :return-value.sync="inputForm.startDt"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="default text-field-date pr-0"
                  style="margin-top: 0px; padding: 0px 15px 0 0;"
                  placeholder="YYYY-MM-DD"
                  v-model="inputForm.startDt"
                  v-on="on"
                  readonly
                  clearable
                  :rules="startDtRules"
                  @click="clickPicker"
                >
                </v-text-field>
              </template>
              <div @click="clickPicker">
                <v-date-picker
                  class="single-date"
                  v-model="inputForm.startDt"
                  no-title
                  scrollable
                  :date-format="date => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerStartDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerStartMenu = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerStartMenu.save(inputForm.startDt)">{{ $t('button.confirm')}}</v-btn>
                </v-date-picker>
              </div>
            </v-menu>
          </v-col>
          <v-col cols="2">
            <div class="time-wrap"
              style="padding-left: 10px"
            >
              <vue-timepicker
              v-model="inputForm.startHm"
              format="HH:mm"
              :hour-range="startHours"
              hide-disabled-hours
              :minute-range.sync="startMinutes"
              hide-disabled-minutes
              :minute-interval="10"
              manual-input
              lazy
              @input="startHmInputHandler"
              >
              </vue-timepicker>
            </div>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">종료일시</span>
          </v-col>
          <v-col cols="2">
            <v-menu
              content-class="date-picker"
              ref="pickerEndMenu"
              v-model="pickerEndMenu"
              :close-on-content-click="false"
              :return-value.sync="inputForm.endDt"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="default text-field-date pr-0"
                  style="margin-top: 0px; padding: 0px 15px 0 0;"
                  placeholder="YYYY-MM-DD"
                  v-model="inputForm.endDt"
                  v-on="on"
                  readonly
                  clearable
                  :rules="endDtRules"
                  @click="clickPicker"
                >
                </v-text-field>
              </template>
              <div @click="clickPicker">
                <v-date-picker
                  class="single-date"
                  v-model="inputForm.endDt"
                  no-title
                  scrollable
                  :date-format="date => new Date(date).toDateString()"
                  :locale="$i18n.locale"
                  :picker-date.sync="pickerEndDate"
                  @click:date="dateClick"
                >
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerEndMenu = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerEndMenu.save(inputForm.endDt)">{{ $t('button.confirm')}}</v-btn>
                </v-date-picker>
              </div>
            </v-menu>
          </v-col>
          <v-col cols="2">
            <div class="time-wrap"
              style="padding-left: 10px"
            >
              <vue-timepicker
              v-model="inputForm.endHm"
              format="HH:mm"
              :hour-range="endHours"
              hide-disabled-hours
              :minute-range.sync="endMinutes"
              hide-disabled-minutes
              :minute-interval="10"
              manual-input
              lazy
              @input="endHmInputHandler"
              >
              </vue-timepicker>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">재시도 건수</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.retryCnt"
              :rules="retryCntRules"
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">재시도 간격(시간)</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.retryInterval"
              :rules="retryIntervalRules"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <span class="label must">배율</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              hide-details="auto"
              single-line
              v-model="inputForm.square"
              :rules="squareRules"
            ></v-text-field>
            <!-- <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              :placeholder="inputForm.square ? undefined : '선택'"
              hide-details="auto"
              single-line
              v-model="inputForm.square"
              :rules="squareRules"
              :items="itemSquare"
            ></v-select> -->
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">캠페인 상태</span>
          </v-col>
          <v-col cols="4">
            <v-radio-group
              class="default mt-0 pt-0"
              v-model="inputForm.campaignStatus"
              :mandatory="false"
              row>
              <v-radio
                :ripple="false"
                v-for="(use, idx) in campaignStatuses"
                :key="idx"
                :label="use.text"
                :value="use.value"
                :disabled="campaignStatus > use.value"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <PageSectionTitle
              :title="sectionTitle2"
            >
            </PageSectionTitle>
            <v-card-actions class="btn-group align-right" v-if="campaignStatus === '0'">
              <v-spacer></v-spacer>
              <v-btn class="btn-plus" @click="campaignItemPlus"><v-icon dark>mdi-plus</v-icon></v-btn>
              <v-btn class="btn-minus" @click="campaignItemMinus"><v-icon dark>mdi-minus</v-icon></v-btn>
              <v-btn class="btn-naked-primary" text :ripple="false" @click="popup.popupExcelUploadTemplateView = true">일괄등록</v-btn>
              <!-- popup start -->
              <v-dialog
                v-model="popup.popupExcelUploadTemplateView"
                width="1024"
                persistent
              >
              <!-- ######### popup ######### -->
                <popup-excel-upload-template-view
                  @popupAction="popupAction"
                  :code="`campaignItem`"
                  :title="'캠페인 목록'"
                  v-if="popup.popupExcelUploadTemplateView === true"
                />
              </v-dialog>
            </v-card-actions>
            <v-card class="data-grid-wrap default has-scroll">
              <vuescroll>
                <v-data-table
                  v-model="selectCampaignItem"
                  :headers="headersCampaignItem"
                  :items="inputForm.campaignItemList"
                  class="users-data-table"
                  item-key="itemId"
                  :fixed-header="true"
                  :disable-pagination="true"
                  :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                  :show-select="campaignStatus === '0'"
                  hide-default-footer
                  :no-data-text="$t('message.noData')"
                  :loading-text="$t('message.loading')"
                >
                  <template v-slot:item.custNum="{ item }" v-if="campaignStatus === '0'">
                    <v-text-field
                      class="default mt-0 pt-0"
                      hide-details="auto"
                      single-line
                      v-model="item.custNum"
                      :rules="[
                        v => !!v || '고객번호를 입력하세요'
                      ]"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.resultCd="{ item }">
                    {{ item.resultCd }}
                  </template>
                  <template v-slot:item.progCd="{ }">
                    미완료
                  </template>
                  <template v-slot:item.endDt="{ item }">
                    {{ item.endDt }}
                  </template>
                </v-data-table>
              </vuescroll>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
      <v-card-actions class="submit-btns-group">
        <v-spacer></v-spacer>
        <v-btn color="btn-secondary" text @click="cancelCampaignInfo()">{{ $t('button.cancel')}}</v-btn>
        <v-btn color="btn-primary" text @click="setCampaignInfo()">{{ $t('button.save')}}</v-btn>
      </v-card-actions>
    </vuescroll>
  </div>
</template>

<script>
import PopupExcelUploadTemplateView from '@/views/PopupExcelUploadTemplateView'

import {
  getCampaignViewCondition,
  getCampaign,
  updateCampaign
} from '../../api/campaign'
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'UpdateCampaignView',
  components: {
    VueTimepicker,
    PopupExcelUploadTemplateView
  },
  mixins: [datepicker],
  data () {
    return {
      campaignId: this.$route.params.campaignId,
      campaignStatus: '0',
      valid: false,
      popup: {
        popupExcelUploadTemplateView: false
      },
      tenants: [],
      tels: [],
      squares: [],
      scenarios: [],
      campaignStatuses: [],
      selectCampaignItem: [],
      headersCampaignItem: [
        { text: '고객번호', value: 'custNum', align: 'center', class: 'text-center', width: '150px' },
        { text: '최종결과', value: 'resultCd', align: 'center', class: 'text-center', width: '210px' },
        { text: '진행결과', value: 'progCd', align: 'center', class: 'text-center', width: '210px' },
        { text: '차수', value: 'retryCnt', align: 'center', class: 'text-center', width: '210px' },
        { text: '결과완료시간', value: 'endDt', align: 'center', class: 'text-center', width: '210px' },
        { text: '통화이력', value: 'buttonhere', align: 'center', class: 'text-center', width: '80px', sortable: false }
      ],
      /* input start */
      inputForm: {
        campaignNm: '',
        tenantId: '',
        telId: '',
        startDt: '',
        startHm: '',
        endDt: '',
        endHm: '',
        telNo: '',
        retryCnt: '0',
        retryInterval: '0',
        square: '100',
        scenarioId: '',
        campaignStatus: '0',
        campaignItemList: []
      },
      /* input end */
      /* validate start */
      campaignNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '이름을 입력하세요',
        v => (!!v && v.length < 20) || this.$t('message.inputMaxLength', ['100'])
      ],
      tenantIdRules: [
        v => !!v || '테넌트를 선택하세요'
      ],
      telIdRules: [
        v => !!v || '전화번호를 선택하세요'
      ],
      startDtRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '시작일을 선택하세요'
      ],
      endDtRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '종료일을 선택하세요'
      ],
      telNoRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '발신번호를 입력하세요',
        v => /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/.test(v) || '연락처 형식을 확인해 주세요'
      ],
      retryCntRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '재시도건수를 입력하세요'
      ],
      retryIntervalRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '재시도 간격(시간)을 입력하세요'
      ],
      squareRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '배율을 입력하세요',
        v => /^[1-9]{1}[0-9]{2}$/.test(v) || '배율은 3자리 숫자로 입력하세요'
      ],
      scenarioIdRules: [
        v => !!v || '시나리오를 선택하세요'
      ],
      /* validate end */

      sectionTitle: '기본 정보',
      sectionTitle2: '대상자 목록'
    }
  },
  created: function () {
    this.getCampaignViewCondition()
    this.$nextTick(() => {
      this.getCampaign()
    })
  },
  mounted: function () {
  },
  watch: {
    'inputForm.startHm': function (x, y) {
      this.tmpStartHmCond = (!!x && x.length > 0 && x.replace(/\s/g, '').length > 0)
    },
    'inputForm.endHm': function (x, y) {
      this.tmpEndHmCond = (!!x && x.length > 0 && x.replace(/\s/g, '').length > 0)
    }
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    startHours: function () {
      return [[9, 18]]
    },
    startMinutes: function () {
      return [[0, 60]]
    },
    endHours: function () {
      return [[9, 18]]
    },
    endMinutes: function () {
      return [[0, 60]]
    },
    itemSquare: function () {
      return [
        {
          text: '100%',
          value: '1'
        },
        {
          text: '200%',
          value: '2'
        },
        {
          text: '300%',
          value: '3'
        },
        {
          text: '400%',
          value: '4'
        }
      ]
    },
    itemScenarios: function () {
      return this.scenarios
    },
    itemTels: function () {
      return (this.tels || []).filter((s) => s.opt1 === this.inputForm.tenantId)
    }
  },
  methods: {
    getCampaignViewCondition: function () {
      getCampaignViewCondition().then(
        response => {
          this.tenants = response.data.result.tenantList
          this.tels = response.data.result.tenantTelList
          this.scenarios = response.data.result.scenarioList
          this.campaignStatuses = response.data.result.campaignStatusList
        }
      )
    },
    startHmInputHandler: function (data) {
      if (data) {
        this.inputForm.startHm = data.replace('HH', '09').replace('mm', '00')
      }
    },
    endHmInputHandler: function (data) {
      if (data) {
        this.inputForm.endHm = data.replace('HH', '09').replace('mm', '00')
      }
    },
    getCampaign: function () {
      const input = {
        campaignId: this.campaignId
      }
      console.log(input)
      getCampaign(input).then(
        response => {
          this.inputForm.campaignNm = response.data.result.campaign.campaignNm
          this.inputForm.tenantId = response.data.result.campaign.tenantId
          this.inputForm.telId = response.data.result.campaign.telId
          this.inputForm.startDt = response.data.result.campaign.startDt
          this.inputForm.startHm = response.data.result.campaign.startHm
          this.inputForm.endDt = response.data.result.campaign.endDt
          this.inputForm.endHm = response.data.result.campaign.endHm
          this.inputForm.telNo = response.data.result.campaign.telNo
          this.inputForm.retryCnt = response.data.result.campaign.retryCnt
          this.inputForm.retryInterval = response.data.result.campaign.retryInterval
          this.inputForm.square = response.data.result.campaign.square
          this.inputForm.scenarioId = response.data.result.campaign.scenarioId
          this.inputForm.campaignStatus = response.data.result.campaign.campaignStatus
          this.inputForm.campaignItemList = response.data.result.campaign.campaignItemList
          this.campaignStatus = response.data.result.campaign.campaignStatus
        }
      )
    },
    updateCampaign: function () {
      if (!this.$refs.form.validate()) {
        return
      }
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const input = {
        campaignId: this.campaignId,
        campaignNm: this.inputForm.campaignNm,
        tenantId: this.inputForm.tenantId,
        telId: this.inputForm.telId,
        startDt: this.inputForm.startDt,
        startHm: this.inputForm.startHm,
        endDt: this.inputForm.endDt,
        endHm: this.inputForm.endHm,
        telNo: this.inputForm.telNo,
        retryCnt: this.inputForm.retryCnt,
        retryInterval: this.inputForm.retryInterval,
        listCnt: (this.inputForm.campaignItemList || []).length,
        square: this.inputForm.square,
        scenarioId: this.inputForm.scenarioId,
        campaignStatus: this.inputForm.campaignStatus,
        campaignItemList: this.inputForm.campaignItemList
      }
      updateCampaign(input).then(
        response => {
          if (response.data.status === 200) {
            this.$router.push({ name: 'ListCampaignView', query: { t: new Date().getTime() } })
          }
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    campaignItemPlus: function () {
      console.log('campaignItemPlus')
      this.inputForm.campaignItemList.push({
        itemId: `NEW${new Date().getTime()}`,
        custNum: '',
        resultCd: '0',
        progCd: '',
        retryCnt: 0,
        endDt: ''
      })
    },
    campaignItemMinus: function () {
      console.log('campaignItemMinus')
      if (!this.selectCampaignItem || this.selectCampaignItem.length === 0) {
        alert('삭제할 발신목록을 선택하세요.')
        return
      }
      for (const cItem of this.selectCampaignItem) {
        this.inputForm.campaignItemList.splice(this.inputForm.campaignItemList.findIndex((c) => c.itemId === cItem.itemId), 1)
      }
      this.selectCampaignItem = []
    },
    cancelCampaignInfo: function () {
      this.$router.push({ name: 'ListCampaignView', query: { t: new Date().getTime() } })
    },
    popupAction: function (popup) {
      console.log(popup.templates)
      if (popup.templates) {
        for (const t of popup.templates) {
          this.inputForm.campaignItemList.push({
            itemId: `NEW${new Date().getTime()}`,
            custNum: t.custNum,
            resultCd: '0',
            progCd: '',
            retryCnt: 0,
            endDt: ''
          })
        }
      }
      this.popup.popupExcelUploadTemplateView = popup.batchView
    },
    setCampaignInfo: function () {
      this.updateCampaign()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
