<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :subtitle="pageDescription"
        :title="pageTitle"
      ></PageTitle>
      <v-container class="search-group" fluid no-gutters>
        <v-row no-gutters>
          <v-col cols="2">
            <v-select
              v-model="searchForm.tenant"
              :items="cptdItemsTenantList"
              :label="$t('label.tenant')"
              :menu-props="{ offsetY: true }"
              class="default search"
              clearable
              @change="selectMentList"
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
      <v-card class="tabs-wrap no-animate" fluid no-gutters>
        <v-tabs
          v-model="tab"
          :ripple="false"
          background-color="transparent"
          flat
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="tabb in codeTypeList" :key="tabb.value" :href="`#${tabb.value}`">
            {{ tabb.text }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="tabb in codeTypeList" :key="tabb.value" :value="tabb.value">
            <v-card flat>
              <v-card-text ref="tabContent"
                           class="tabContent">
                           <!-- v-card-text 높이 값 계산 삭제 :style="{ height: `${getMentList(tabb.value).length * 200}px`, maxHeight: tabItemMaxHeight }" -->
                <vuescroll>
                  <v-form
                    :ref="`form_${tabb.value}`"
                    v-model="valid"
                    :lazy-validation="lazy"
                  >
                    <v-row v-for="(ment, idx) in getMentList(tabb.value)" :key="`${tabb.value}_${idx}`"
                           class="ment-list-row">
                      <v-col class="ment-label">
                        <span class="label">근무 여부 : </span>
                      </v-col>
                      <v-col class="ment-label" cols="3">
                        <span v-if="ment.workYn === 'N'" class="label">비근무</span>
                        <span v-if="ment.workYn === 'Y'" class="label">근무</span>
                        <!--
                                                <v-radio-group
                                                  v-model="ment.workYn"
                                                  row
                                                  :disabled="getStatus(ment) === 'D'"
                                                >
                                                  <v-radio
                                                    label="근무"
                                                    value="Y"
                                                    :ripple="false"
                                                  ></v-radio>
                                                  <v-radio
                                                    label="비근무"
                                                    value="N"
                                                    :ripple="false"
                                                  ></v-radio>
                                                </v-radio-group>-->
                      </v-col>
                      <v-col v-if="ment.workYn === 'Y'" class="ment-label">
                        <span class="label">시간설정</span>
                      </v-col>
                      <v-col v-if="ment.workYn === 'Y'" class="time-wrap" cols="3">
                        <div class="time-wrap">
                          <vue-timepicker
                            v-model="ment.startHm"
                            :class="{'errorhm': !!ment.errorStartHm}"
                            :disabled="getStatus(ment) === 'D'"
                            :hide-clear-button="!!ment.errorStartHm"
                            format="HH:mm"
                            lazy
                            manual-input
                          ></vue-timepicker>
                          <div v-if="!!ment.errorStartHm" class="error-msg">
                            {{ ment.errorStartHm }}
                          </div>
                        </div>
                        <div class="pl-2 pr-2 pt-1">~</div>
                        <div class="time-wrap">
                          <vue-timepicker
                            v-model="ment.endHm"
                            :class="{'errorhm': !!ment.errorEndHm}"
                            :disabled="getStatus(ment) === 'D'"
                            :hide-clear-button="!!ment.errorEndHm"
                            format="HH:mm"
                            lazy
                            manual-input
                          ></vue-timepicker>
                          <div v-if="!!ment.errorEndHm" class="error-msg">
                            {{ ment.errorEndHm }}
                          </div>
                        </div>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="btn-gropup" cols="1">
                        <v-btn v-if="getStatus(ment) === 'D' || getStatus(ment) === 'U'" class="row-del" text
                               @click="rowRestore(ment)">
                          <i class="icon icon-lg-refresh"></i>
                          <span class="hide">행복원</span>
                        </v-btn>
                        <v-btn v-if="getStatus(ment) !== 'D' && ment.workYn === 'Y'" class="row-del" text
                               @click="rowDel(ment)">
                          <i class="icon icon-lg-trash-alt"></i>
                          <span class="hide">행삭제</span>
                        </v-btn>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="ment.mentValue"
                          :disabled="getStatus(ment) === 'D'"
                          :rules="[
                            v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '내용을 입력해주세요'
                          ]"
                          class="default pt-0 mt-0 pr-0"
                          hide-details="auto"
                          label=" "
                          placeholder="내용을 입력해 주세요"
                          rows="4"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-form>
                </vuescroll>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="saveBtn()">저장</v-btn>
        <v-btn color="btn-secondary" text @click="rowAdd()">행추가</v-btn>
      </div>
    </vuescroll>
  </div>
</template>

<script>
/* timepicker */
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

import { getSearchCondition, selectMentList, updateMent } from '../../api/ment'

export default {
  name: 'GreetingMentView',
  components: {
    VueTimepicker
  },
  props: {},
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
  watch: {
    mentList: {
      deep: true,
      handler: function () {
        // console.log('mentList change')
        let g = 0
        const selectMentCd = this.tab // 평일, 토요일, 일요일, 공휴일
        /*        const workMentList = this.mentList.filter(m => {
          return m.workYn === 'Y'
        }).sort(function compareNumbers (a, b) {
          if (a.workYn > b.workYn) {
            return 1
          } else if (a.workYn < b.workYn) {
            return -1
          } else {
            if (a.startDt > b.startDt) {
              return -1
            } else {
              return 1
            }
          }
        }) */
        const gmentList = this.getMentList(selectMentCd)
        const workgMentList = gmentList.filter(m => {
          return m.workYn === 'Y'
        }).sort(function compareNumbers (a, b) {
          if (a.workYn > b.workYn) {
            return 1
          } else if (a.workYn < b.workYn) {
            return -1
          } else {
            if (a.startDt > b.startDt) {
              return -1
            } else {
              return 1
            }
          }
        })
        for (const ment of workgMentList) {
          if (ment.workYn === 'Y') {
            if (!!ment.startHm && (ment.startHm.includes('mm') || ment.startHm.includes('HH'))) {
              ment.startHm = ment.startHm.replace('HH', '00').replace('mm', '00')
            }
            if (!!ment.endHm && (ment.endHm.includes('mm') || ment.endHm.includes('HH'))) {
              ment.endHm = ment.endHm.replace('HH', '00').replace('mm', '00')
            }
            if (!ment.startHm || !/^[0-9]{2}:[0-9]{2}$/.test(ment.startHm)) {
              ment.errorStartHm = '시작시간을 설정해주세요'
            } else if (workgMentList.some((vx, ix) => ment.mentCd === vx.mentCd && ix !== g && vx.startHm <= ment.startHm && ment.startHm <= vx.endHm)) {
              ment.errorStartHm = '동일 시간대에 설정된 초기 인사멘트가 있습니다.'
            } else {
              ment.errorStartHm = ''
            }
            if (!ment.endHm || !/^[0-9]{2}:[0-9]{2}$/.test(ment.endHm)) {
              ment.errorEndHm = '종료시간을 설정해주세요'
            } else if (workgMentList.some((vx, ix) => ment.mentCd === vx.mentCd && ix !== g && vx.startHm <= ment.endHm && ment.endHm <= vx.endHm)) {
              ment.errorEndHm = '동일 시간대에 설정된 초기 인사멘트가 있습니다.'
            } else if (!ment.errorStartHm && ment.startHm > ment.endHm) {
              ment.errorEndHm = '종료시간은 시작시간보다 작을 수 없습니다'
            } else {
              ment.errorEndHm = ''
            }
          }
          g++
        }
      }
    }
  },
  data: function () {
    return {
      valid: true,
      lazy: true,
      tabItemMaxHeight: (window.innerHeight - 428) + 'px',
      codeType: 'GTM_TYPE',
      itemsTenantList: [],
      searchForm: {
        tenant: ''
      },
      tab: '',
      codeTypeList: [],
      mentList: [],
      mentTemp: {
        startHm: '',
        endHm: '',
        mentCd: '',
        mentId: '',
        mentValue: '',
        tenantId: '',
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
  methods: {
    getSearchCondition: function () {
      getSearchCondition(this.codeType).then(
        response => {
          this.itemsTenantList = response.data.result.tenantList
          this.searchForm.tenant = this.itemsTenantList[0].value // 첫번째
          this.codeTypeList = response.data.result.codeTypeList
          this.tab = this.codeTypeList[0].value
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
      if (ment.startHm !== ment.org.startHm || ment.endHm !== ment.org.endHm || ment.workYn !== ment.org.workYn || ment.mentValue !== ment.org.mentValue) {
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
            this.$router.push({
              name: '403',
              query: { t: new Date().getTime() }
            })
          } else {
            delete sessionStorage.accessToken
            this.$router.push({
              name: 'Login',
              query: { t: new Date().getTime() }
            })
          }
        }
      ).finally(() => {
        // this.pagination.loading = false
      })
    },
    getMentList: function (mentCd) {
      // console.log(this.mentList)
      const filtered = this.mentList.filter(m => {
        return m.mentCd === mentCd
      }).sort(function compareNumbers (a, b) {
        if (a.workYn > b.workYn) {
          return 1
        } else if (a.workYn < b.workYn) {
          return -1
        } else {
          if (a.startDt > b.startDt) {
            return -1
          } else {
            return 1
          }
        }
      })
      return filtered
    },
    handleResize () {
      this.tabItemMaxHeight = (window.innerHeight - 428) + 'px'
    },
    rowAdd () {
      if (this.getMentList(this.tab).length > 0) {
        const selectMentCd = this.tab
        const selectTenant = this.searchForm.tenant
        const newMent = Object.assign({}, this.mentTemp, {
          mentCd: selectMentCd,
          tenantId: selectTenant
        })
        // console.log(newMent)
        this.mentList.push(newMent)
      } else {
        const selectMentCd = this.tab
        const selectTenant = this.searchForm.tenant
        const mentTemp = {
          startHm: '',
          endHm: '',
          mentCd: selectMentCd,
          mentId: '',
          mentValue: '',
          tenantId: selectTenant,
          useYn: 'Y',
          workYn: 'N',
          _status: 'I',
          status: function () {
            return 'I'
          }

        }
        this.mentList.push(mentTemp)
      }
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
    rowDel (ment) {
      if (!confirm('선택한 행을 삭제하시게습니까?')) {
        return
      }
      if (this.getStatus(ment) === 'I') {
        const idx = this.mentList.findIndex(m => m === ment)
        this.mentList.splice(idx, 1)
      } else {
        ment._status = 'D'
      }
    },
    saveBtn () {
      const selectMentCd = this.tab // 평일, 토요일, 일요일, 공휴일
      // const workMentList = this.mentList.filter(m => {
      //   return m.workYn === 'Y'
      // }).sort(function compareNumbers (a, b) {
      //   if (a.workYn > b.workYn) {
      //     return 1
      //   } else if (a.workYn < b.workYn) {
      //     return -1
      //   } else {
      //     if (a.startDt > b.startDt) {
      //       return -1
      //     } else {
      //       return 1
      //     }
      //   }
      // })
      const gmentList = this.getMentList(selectMentCd)
      const workgMentList = gmentList.filter(m => {
        return m.workYn === 'Y'
      }).sort(function compareNumbers (a, b) {
        if (a.workYn > b.workYn) {
          return 1
        } else if (a.workYn < b.workYn) {
          return -1
        } else {
          if (a.startDt > b.startDt) {
            return -1
          } else {
            return 1
          }
        }
      })
      let isvalid = this.$refs[`form_${selectMentCd}`][0].validate()
      let g = 0
      for (const ment of workgMentList) {
        if (ment.workYn === 'Y') {
          if (!!ment.startHm && (ment.startHm.includes('mm') || ment.startHm.includes('HH'))) {
            ment.startHm = ment.startHm.replace('HH', '00').replace('mm', '00')
          }
          if (!!ment.endHm && (ment.endHm.includes('mm') || ment.endHm.includes('HH'))) {
            ment.endHm = ment.endHm.replace('HH', '00').replace('mm', '00')
          }
          if (!ment.startHm || !/^[0-9]{2}:[0-9]{2}$/.test(ment.startHm)) {
            ment.errorStartHm = '시작시간을 설정해주세요'
            isvalid = isvalid && false
          } else if (workgMentList.some((vx, ix) => {
            return ment.workYn === 'Y' && vx.workYn === 'Y' && g !== ix && ment.mentCd === vx.mentCd && vx.startHm <= ment.startHm && ment.startHm <= vx.endHm
          })) {
            ment.errorStartHm = '동일 시간대에 설정된 초기 인사멘트가 있습니다.'
            isvalid = isvalid && false
          } else {
            ment.errorStartHm = ''
          }
          // ment.mentValue !== vx.mentValue
          if (!ment.endHm || !/^[0-9]{2}:[0-9]{2}$/.test(ment.endHm)) {
            ment.errorEndHm = '종료시간을 설정해주세요'
            isvalid = isvalid && false
          } else if (workgMentList.some((vx, ix) => {
            return ment.workYn === 'Y' && vx.workYn === 'Y' && g !== ix && ment.mentCd === vx.mentCd && vx.startHm <= ment.startHm && ment.startHm <= vx.endHm
          })) {
            ment.errorEndHm = '동일 시간대에 설정된 초기 인사멘트가 있습니다.'
            isvalid = isvalid && false
          } else if (!ment.errorStartHm && ment.startHm > ment.endHm) {
            ment.errorEndHm = '종료시간은 시작시간보다 작을 수 없습니다'
            isvalid = isvalid && false
          } else {
            ment.errorEndHm = ''
          }
        }
        g++
      }
      if (isvalid === false) {
        alert('에러 메시지를 확인해주세요!')
        return
      }
      let count = 0
      for (const gment of gmentList) {
        if (this.getStatus(gment)) {
          count++
        }
      }
      if (count === 0) {
        alert('신규로 추가하거나, 수정한 내용이 없습니다.')
        return
      }
      if (!confirm('저장하시겠습니까?')) {
        return
      }
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
