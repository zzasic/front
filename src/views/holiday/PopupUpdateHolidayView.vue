<template>
  <v-card class="dialog-holiday">
    <v-card-title>
      <span class="headline">휴일 수정</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
        <v-container>
          <v-row>
            <v-col cols="2">
              <span class="label must">휴무일 명</span>
            </v-col>
            <v-col>
              <v-text-field
                class="default mt-0 pt-0"
                v-model="inputForm.holidayNm"
                :rules="[
                  v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '휴무일 명을 입력해주세요',
                  v => (!!v && v.length < 20) || $t('message.inputMaxLength', ['20'])
                ]"
                placeholder=" "
                clearable
                oninput="javascript: if (this.value.length > 20) this.value = this.value.substring(0, 20)"
                required
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <span class="label must">고객사</span>
            </v-col>
            <v-col>
              <v-select
                class="default mt-0 pt-0"
                :menu-props="{ offsetY: true }"
                :placeholder="inputForm.tenantId ? undefined : '선택'"
                hide-details="auto"
                single-line
                v-model="inputForm.tenantId"
                :rules="[v => !!v || '고객사를 선택하세요']"
                :items="tenants"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <span class="label must">휴무일</span>
            </v-col>
            <v-col>
              <v-menu
                content-class="date-picker"
                ref="pickerMenu"
                v-model="pickerMenu"
                :return-value.sync="inputForm.holidayDate"
                :close-on-content-click="false"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="default text-field-date mt-0 pt-0 pl-0"
                    v-model='inputForm.holidayDate'
                    placeholder="YYYY-MM-DD"
                    v-on="on"
                    :rules="[
                      v => !!v || '휴무일을 선택해주세요'
                    ]"
                    readonly
                    clearable
                    @click="clickPicker"
                  >
                  </v-text-field>
                </template>
                <div @click="clickPicker">
                  <v-date-picker
                    class="single-date"
                    v-model="inputForm.holidayDate"
                    no-title
                    scrollable
                    :date-format="date => new Date(date).toDateString()"
                    :locale="$i18n.locale"
                    :picker-date.sync="pickerDate"
                    @click:date="dateClick"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text :ripple="false" color="pink" @click="pickerMenu = false">{{ $t('button.close')}}</v-btn>
                    <v-btn text :ripple="false" color="pink" @click="$refs.pickerMenu.save(inputForm.holidayDate)">{{ $t('button.confirm')}}</v-btn>
                  </v-date-picker>
                </div>
              </v-menu>
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
                row
                hide-details="auto"
                required
              >
                <v-radio
                  :ripple="false"
                  v-for="(use, idx) in useYns"
                  :key="idx"
                  :label="use.text"
                  :value="use.value"
                >
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <span class="label must">반복 여부</span>
            </v-col>
            <v-col>
              <v-radio-group
                class="default mt-1 pt-0"
                v-model="inputForm.repeateYn"
                :mandatory="false"
                row
                hide-details="auto"
                required
              >
                <v-radio
                  :ripple="false"
                  v-for="(use, idx) in repeateYns"
                  :key="idx"
                  :label="use.text"
                  :value="use.value"
                >
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-secondary" text @click="deleteBtn">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="saveBtn">{{ $t('button.save')}}</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="cancelBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import { updateHolidayView, updateHoliday, deleteHolidaies } from '@/api/holiday/'
import datepicker from '@/plugins/datepicker'

export default {
  name: 'PopupUpdateHolidayView',
  props: {
    holidayId: String
  },
  computed: {},
  mixins: [datepicker],
  created () {
    this.init()
  },
  mounted () {
    this.$nextTick(() => {
      // 렌더링된 후 호출
    })
  },
  data () {
    return {
      valid: true,
      lazy: true,
      // 사용여부
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
      // 반복여부
      repeateYns: [
        {
          text: '반복',
          value: 'Y'
        },
        {
          text: '미반복',
          value: 'N'
        }
      ],
      tenants: [],
      // 입력값
      inputForm: {
        holidayNm: '', // 휴무일명
        tenantId: '', // 고객사
        holidayDate: '', // 휴무일
        useYn: 'Y', // 사용여부
        repeateYn: 'N' // 반복여부
      }
    }
  },
  watch: {
  },
  methods: {
    init: async function () {
      await this.updateHolidayView()
    },
    // 입력값 조회
    updateHolidayView: function () {
      updateHolidayView(this.holidayId).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.tenants = response.data.result.tenantList
            const holiday = response.data.result.holiday
            this.inputForm = {
              holidayNm: holiday.holidayNm,
              tenantId: holiday.tenantId,
              holidayDate: this.$moment(holiday.holidayDate, 'YYYYMMDD').format('YYYY-MM-DD'),
              useYn: holiday.useYn,
              repeateYn: holiday.repeateYn
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
    // 휴무일 수정
    updateHoliday: function () {
      // param setting
      const updateForm = {
        holidayId: this.holidayId,
        holidayNm: this.inputForm.holidayNm,
        tenantId: this.inputForm.tenantId,
        holidayDate: this.inputForm.holidayDate,
        useYn: this.inputForm.useYn,
        repeateYn: this.inputForm.repeateYn
      }
      updateHoliday(updateForm).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.$emit('popupAction', {
              createView: false,
              updateView: false,
              batchView: false
            })
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    },
    deleteHolidaies: function () {
      const holidaies = [
        {
          holidayId: this.holidayId
        }
      ]
      deleteHolidaies(holidaies).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 삭제되었습니다
            this.$emit('popupAction', {
              createView: false,
              updateView: false,
              batchView: false
            })
          }
        },
        error => {
          console.error(error)
          delete localStorage.accessToken
          // this.$router.push('/Login')
        }
      )
    },
    // 취소버튼
    cancelBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        updateView: false,
        batchView: false
      })
      // this.$router.push({ name: 'readDictionaryView', params: { apiId: this.apiId } })
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    },
    isBlank: function (x) {
      return (!x || x.trim().length === 0)
    },
    // 삭제
    deleteBtn: function () {
      if (confirm('해당 휴무일정보를 삭제하시겠습니까?')) {
        this.deleteHolidaies()
      }
    },
    // 저장버튼
    saveBtn: function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        this.updateHoliday()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
