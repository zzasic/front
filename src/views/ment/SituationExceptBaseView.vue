
<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="2">
            <v-select
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenant"
              :items="cptdItemsTenantList"
              :label="$t('label.tenant')"
              @change="selectMentList"
              clearable
            ></v-select>
          </v-col>
          <!-- <v-col class="text-right">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-search"
              :ripple="false"
              @click="selectMentList"
            >{{ $t('button.search')}}</v-btn>
          </v-col> -->
        </v-row>
      </v-container>
      <v-container class="tabContent" no-gutters fluid>
        <!-- v-container 높이 값 계산 삭제 :style="{ height: `${mentList.length * 200}px`, maxHeight: tabItemMaxHeight }" -->
        <vuescroll>
          <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
          >
            <v-container class="except" no-gutters fluid>
              <v-row class="ment-list-row " v-for="tabb in codeTypeList" :key="tabb.value">
                <v-col>
                  <v-container v-for="(ment, idx) in getMentList(tabb.value)" :key="idx">
                    <v-row>
                      <v-col class="ment-label">
                        <span class="label">
                          {{ tabb.text }}
                          <v-btn v-if="getStatus(ment) === 'D' || getStatus(ment) === 'U'" text class="row-del" style="height: 100% !important" @click="rowRestore(ment)">
                            <i class="icon icon-lg-refresh"></i>
                            <span class="hide">행복원</span>
                          </v-btn>
                        </span>
                      </v-col>
                      <v-col cols="9" class="ment-option-group prenoti" v-if="ment.mentCd === 'NOM002'">
                        <v-menu
                          content-class="date-picker"
                          ref="pickerStartMenu"
                          v-model="pickerStartMenu"
                          :close-on-content-click="false"
                          :return-value.sync="ment.startDt"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              class="default text-field-date pr-0"
                              placeholder="YYYY-MM-DD"
                              v-model="ment.startDt"
                              v-on="on"
                              readonly
                              clearable
                              :rules="[v => ment.useYn !== 'Y' || !!v || '시작일자를 선택하세요']"
                              @click="clickPicker"
                            >
                            </v-text-field>
                          </template>
                          <div @click="clickPicker">
                            <v-date-picker
                              class="single-date"
                              v-model="ment.startDt"
                              no-title
                              scrollable
                              :date-format="date => new Date(date).toDateString()"
                              :locale="$i18n.locale"
                              :picker-date.sync="pickerStartDate"
                              @click:date="dateClick"
                            >
                              <v-spacer></v-spacer>
                              <v-btn text :ripple="false" color="pink" @click="pickerStartMenu = false">{{ $t('button.close')}}</v-btn>
                              <v-btn text :ripple="false" color="pink" @click="$refs.pickerStartMenu[idx].save(ment.startDt)">{{ $t('button.confirm')}}</v-btn>
                            </v-date-picker>
                          </div>
                        </v-menu>
                        <div class="time-wrap">
                          <vue-timepicker
                          v-model="ment.startHm"
                          format="HH:mm"
                          manual-input
                          :disabled="getStatus(ment) === 'D'"
                          lazy
                          :hide-clear-button="!!ment.errorStartHm"
                          :class="{'errorhm': !!ment.errorStartHm}"
                          >
                          </vue-timepicker>
                          <div class="error-msg" v-if="!!ment.errorStartHm">
                            {{ ment.errorStartHm }}
                          </div>
                        </div>
                        <div class="pl-2 pr-2 pt-1">~</div>
                        <v-menu
                          content-class="date-picker"
                          ref="pickerEndMenu"
                          v-model="pickerEndMenu"
                          :close-on-content-click="false"
                          :return-value.sync="ment.endDt"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              class="default text-field-date pr-0"
                              placeholder="YYYY-MM-DD"
                              v-model="ment.endDt"
                              v-on="on"
                              readonly
                              clearable
                              :rules="[
                              v => ment.useYn !== 'Y' || !!v || '종료일자를 선택하세요',
                              v => ment.useYn !== 'Y' || ment.startDt <= v || '종료일시는 시작일시보다 작을 수 없습니다'
                              ]"
                              @click="clickPicker"
                            >
                            </v-text-field>
                          </template>
                          <div @click="clickPicker">
                            <v-date-picker
                              class="single-date"
                              v-model="ment.endDt"
                              no-title
                              scrollable
                              :date-format="date => new Date(date).toDateString()"
                              :picker-date.sync="pickerEndDate"
                              :locale="$i18n.locale"
                              @click:date="dateClick"
                            >
                              <v-spacer></v-spacer>
                              <v-btn text :ripple="false" color="pink" @click="pickerEndMenu = false">{{ $t('button.close')}}</v-btn>
                              <v-btn text :ripple="false" color="pink" @click="$refs.pickerEndMenu[idx].save(ment.endDt)">{{ $t('button.confirm')}}</v-btn>
                            </v-date-picker>
                          </div>
                        </v-menu>
                        <div class="time-wrap">
                          <vue-timepicker
                          v-model="ment.endHm"
                          format="HH:mm"
                          manual-input
                          :disabled="getStatus(ment) === 'D'"
                          lazy
                          :hide-clear-button="!!ment.errorEndHm"
                          :class="{'errorhm': !!ment.errorEndHm}"
                          >
                          </vue-timepicker>
                          <div class="error-msg" v-if="!!ment.errorEndHm">
                            {{ ment.errorEndHm }}
                          </div>
                        </div>
                        <v-radio-group
                          class="ml-4"
                          v-model="ment.useYn"
                          row
                        >
                          <v-radio
                            label="사용"
                            value="Y"
                            :ripple="false"
                          ></v-radio>
                          <v-radio
                            label="미사용"
                            value="N"
                            :ripple="false"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="9" class="ment-option-group" v-else>
                        <v-text-field
                          v-model="ment.baseCnt"
                          class="default mt-0 pt-0 w80"
                          hide-details="auto"
                          outlined
                          dense
                          maxlength="3"
                          :rules="[
                            v => ment.useYn !== 'Y' || /^[0-9]*$/.test(v) || '숫자만 입력하세요'
                          ]"
                        ></v-text-field>
                        <span class="ml-2 txt">건(초)</span>
                        <span class="info-msg highlight ml-3">※ 최대 3자리 수 까지 가능합니다.</span>
                        <v-radio-group
                          class="ml-4"
                          v-model="ment.useYn"
                          row
                        >
                          <v-radio
                            label="사용"
                            value="Y"
                            :ripple="false"
                          ></v-radio>
                          <v-radio
                            label="미사용"
                            value="N"
                            :ripple="false"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="ment.mentValue"
                          class="default pt-0 mt-0 pr-0"
                          hide-details="auto"
                          rows="4"
                          label=" "
                          placeholder="내용을 입력해 주세요"
                          :rules="[
                            v => ment.useYn !== 'Y' || (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '내용을 입력해주세요'
                          ]"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </vuescroll>
      </v-container>
      <div class="btn-group align-right mt-7">
        <v-btn color="btn-primary" text @click="saveBtn()">저장</v-btn>
      </div>
    </vuescroll>
  </div>
</template>

<script>
/* timepicker */
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'
import datepicker from '@/plugins/datepicker'

import { getSearchCondition, selectMentList, updateMent } from '../../api/ment'

export default {
  name: 'SituationExceptBaseView',
  components: {
    VueTimepicker
  },
  mixins: [datepicker],
  created: function () {
    this.getSearchCondition()
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  updated () {
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    cptdItemsTenantList () {
      const its = []
      its.push(...this.itemsTenantList)
      return its
    }
  },
  data: function () {
    return {
      valid: true,
      lazy: true,
      tabItemMaxHeight: (window.innerHeight - 378) + 'px',
      codeType: 'MENT_EXP',
      itemsTenantList: [],
      searchForm: {
        tenant: ''
      },
      codeTypeList: [],
      mentList: [],
      mentTemp: {
        startDt: '',
        endDt: '',
        startHm: '00:00',
        endHm: '23:59',
        mentCd: '',
        mentId: '',
        mentValue: '',
        tenantId: '',
        baseCnt: 0,
        useYn: 'Y',
        workYn: 'Y',
        _status: 'I',
        status: function () {
          return 'I'
        }
      },
      detailBody: 0
    }
  },
  watch: {
    mentList: {
      deep: true,
      handler: function () {
        // console.log('mentList change')
        for (const ment of this.mentList) {
          if (ment.mentCd === 'NOM002') {
            // 사전공지사항
            if (!!ment.startHm && (ment.startHm.includes('mm') || ment.startHm.includes('HH'))) {
              ment.startHm = ment.startHm.replace('HH', '00').replace('mm', '00')
            }
            if (!!ment.endHm && (ment.endHm.includes('mm') || ment.endHm.includes('HH'))) {
              ment.endHm = ment.endHm.replace('HH', '23').replace('mm', '59')
            }
            if (ment.useYn === 'Y') {
              if (!ment.startHm || !/^[0-9]{2}:[0-9]{2}$/.test(ment.startHm)) {
                ment.errorStartHm = '시작시간을 설정해주세요'
              } else {
                ment.errorStartHm = ''
              }
              if (!ment.endHm || !/^[0-9]{2}:[0-9]{2}$/.test(ment.endHm)) {
                ment.errorEndHm = '종료시간을 설정해주세요'
              } else if (!ment.errorStartHm && !!ment.startDt && !!ment.endDt && `${ment.startDt} ${ment.startHm}` > `${ment.endDt} ${ment.endHm}`) {
                ment.errorEndHm = '종료일시는 시작일시보다 작을 수 없습니다'
              } else {
                ment.errorEndHm = ''
              }
            } else {
              ment.errorStartHm = ''
              ment.errorEndHm = ''
            }
          }
        }
      }
    }
  },
  methods: {
    getSearchCondition: function () {
      getSearchCondition(this.codeType).then(
        response => {
          this.itemsTenantList = response.data.result.tenantList
          this.searchForm.tenant = this.itemsTenantList[0].value // 첫번째
          this.codeTypeList = response.data.result.codeTypeList
          this.$nextTick(() => {
            this.selectMentList()
          })
        }
      )
    },
    getStatus (ment) {
      if (ment._status) {
        return ment._status
      }
      // YYYY-MM-DDTHH:mm:ss+0000 => HH:mm 으로 vue-timepicker 에서 자동 변환됨.
      if (ment.startDt !== ment.org.startDt || ment.endDt !== ment.org.endDt || ment.startHm !== ment.org.startHm || ment.endHm !== ment.org.endHm || ment.useYn !== ment.org.useYn || ment.baseCnt !== ment.org.baseCnt || ment.mentValue !== ment.org.mentValue) {
        return 'U'
      }
      return ''
    },
    selectMentList: function () {
      const searchCondition = {
        tenantId: this.searchForm.tenant
      }
      selectMentList(this.codeType, searchCondition).then(
        response => {
          const tMentList = response.data.result.mentList ? response.data.result.mentList : []
          // status 처리
          for (const ment of tMentList) {
            // console.log(ment)
            const orgMent = JSON.parse(JSON.stringify(ment))
            ment.org = orgMent
            ment._status = ''
          }
          this.mentList = tMentList
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
      ).finally(() => {
        // this.pagination.loading = false
      })
    },
    handleResize () {
      this.tabItemMaxHeight = (window.innerHeight - 400) + 'px'
    },
    getMentList: function (mentCd) {
      const selectTenant = this.searchForm.tenant
      const ments = this.mentList.filter(m => {
        return m.mentCd === mentCd
      })
      if (ments && ments.length > 0) {
        return ments
      }
      const newMent = Object.assign({}, this.mentTemp, {
        mentCd: mentCd,
        tenantId: selectTenant
      })
      // console.log(newMent)
      this.mentList.push(newMent)
      return this.mentList.filter(m => {
        return m.mentCd === mentCd
      })
    },
    rowRestore (ment) {
      if (!confirm('선택한 행을 복원하시겠습니까?')) {
        return
      }
      if (this.getStatus(ment) === 'D') {
        ment._status = ''
      } else {
        Object.assign(ment, ment.org)
      }
    },
    saveBtn () {
      let isvalid = this.$refs.form.validate()
      for (const ment of this.mentList) {
        if (ment.mentCd === 'NOM002') {
          // 사전공지사항
          if (!!ment.startHm && (ment.startHm.includes('mm') || ment.startHm.includes('HH'))) {
            ment.startHm = ment.startHm.replace('HH', '00').replace('mm', '00')
          }
          if (!!ment.endHm && (ment.endHm.includes('mm') || ment.endHm.includes('HH'))) {
            ment.endHm = ment.endHm.replace('HH', '23').replace('mm', '59')
          }
          if (ment.useYn === 'Y') {
            if (!ment.startHm || !/^[0-9]{2}:[0-9]{2}$/.test(ment.startHm)) {
              ment.errorStartHm = '시작시간을 설정해주세요'
              isvalid = isvalid && false
            } else {
              ment.errorStartHm = ''
            }
            if (!ment.endHm || !/^[0-9]{2}:[0-9]{2}$/.test(ment.endHm)) {
              ment.errorEndHm = '종료시간을 설정해주세요'
              isvalid = isvalid && false
            } else if (!ment.errorStartHm && !!ment.startDt && !!ment.endDt && `${ment.startDt} ${ment.startHm}` > `${ment.endDt} ${ment.endHm}`) {
              ment.errorEndHm = '종료일시는 시작일시보다 작을 수 없습니다'
              isvalid = isvalid && false
            } else {
              ment.errorEndHm = ''
            }
          } else {
            ment.errorStartHm = ''
            ment.errorEndHm = ''
          }
        }
      }
      if (isvalid === false) {
        return
      }
      let count = 0
      for (const ment of this.mentList) {
        if (this.getStatus(ment)) {
          count++
        }
      }
      if (count === 0) {
        alert('신규로 추가하거나, 수정된 내용이 없습니다.')
        return
      }
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const gmentList = this.mentList
      for (const gment of gmentList) {
        const gstatus = this.getStatus(gment)
        if (gstatus === 'D' || gstatus === 'U' || gstatus === 'I') {
          gment.status = gstatus
        }
      }
      updateMent(gmentList).then(
        (response) => {
          if (response.data.status === 200) {
            alert('저장되었습니다.')
            this.selectMentList()
          }
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
