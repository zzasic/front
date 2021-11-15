<template>
  <v-card class="dialog-cmnCode">
    <v-card-title>
      <span class="headline">공통코드 수정</span>
    </v-card-title>
    <v-card-text>
      <vuescroll>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-container>
            <v-row>
              <v-col cols="2">
                <span class="label">코드유형</span>
              </v-col>
              <v-col>
                <v-select
                  class="default mt-0 pt-0"
                  :menu-props="{ offsetY: true }"
                  v-model="codeInfo.codeType"
                  :items="cptdItemsCodeType"
                  :rules="codeTypeRules"
                  :placeholder="codeInfo.codeType ? undefined : '선택'"
                  clearable
                  hide-details="auto"
                  required
                  disabled
                ></v-select>
              </v-col>
              <v-col cols="4">
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label">ID</span>
              </v-col>
              <v-col>
                <v-text-field
                  class="default mt-0 pt-0"
                  v-model="codeInfo.codeId"
                  :rules="codeIdRules"
                  placeholder=" "
                  hide-details="auto"
                  clearable
                  required
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="4">
              </v-col>
            </v-row>

            <v-row v-for="(codeLang, index) in codeInfo.codeNms" :key="index">
              <v-col cols="12" v-if="inputForm.itemsLocale.some((lang) => lang.value === codeLang.lang)">
                <v-row>
                  <v-col cols="2">
                    <span class="label must">공통코드 명</span>
                  </v-col>
                  <v-col cols="2" v-if="inputForm.itemsLocale && inputForm.itemsLocale.length > 1">
                    <v-select
                      class="default mt-0 pt-0"
                      :menu-props="{ offsetY: true }"
                      :items="langList(index)"
                      :rules="langRules"
                      v-model="codeLang.lang"
                      :disabled="codeLang.lang === 'KO'"
                      :placeholder="codeLang.lang ? undefined : '언어'"
                      hide-details="auto"
                      clearable
                      required
                    ></v-select>
                  </v-col>
                  <v-col :class="{ 'ml-2' : inputForm.itemsLocale && inputForm.itemsLocale.length > 1 }">
                    <v-text-field
                      class="default mt-0 pt-0 full"
                      v-model="codeLang.codeValue"
                      :rules="codeValueRules"
                      placeholder=" "
                      hide-details="auto"
                      clearable
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" class="btn-col" v-if="inputForm.itemsLocale && inputForm.itemsLocale.length > 1">
                    <div class="btn-group align-right mt-0">
                      <v-btn class="btn-plus" @click="addCodeNameByLocale(index, true)"
                             :disabled="!langContentsPlusable">
                        <v-icon dark>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn class="btn-minus" @click="addCodeNameByLocale(index, false)"
                             :disabled="!langContentsMinusable || codeLang.lang === 'KO'">
                        <v-icon dark>mdi-minus</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2">
                    <span class="label"
                          v-if="!(inputForm.itemsLocale && inputForm.itemsLocale.length > 1)">설명</span>
                  </v-col>
                  <v-col>
                    <v-text-field
                      class="default mt-0 pt-0 full"
                      v-model="codeLang.codeDesc"
                      :rules="codeDescRules"
                      placeholder="설명"
                      hide-details="auto"
                      clearable
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" v-if="inputForm.itemsLocale && inputForm.itemsLocale.length > 1">
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <span class="label must">순서</span>
              </v-col>
              <v-col>
                <v-text-field
                  class="default mt-0 pt-0"
                  v-model="codeInfo.codeOrder"
                  :rules="codeOrderRules"
                  placeholder="숫자로 입력하세요"
                  clearable
                  hide-details="auto"
                  required
                  oninput="javascript: if (this.value.length > 5) this.value = this.value.substring(0, 5)"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label must">사용 여부</span>
              </v-col>
              <v-col>
                <v-radio-group
                  class="default mt-1 pt-0"
                  v-model="codeInfo.useYn"
                  :mandatory="false"
                  row
                  hide-details="auto"
                  required>
                  <v-radio
                    :ripple="false"
                    v-for="(use, idx) in useYns"
                    :key="idx"
                    :label="use.text"
                    :value="use.value"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="4">
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label">상위코드 유형</span>
              </v-col>
              <v-col>
                <v-select
                  class="default mt-0 pt-0"
                  :menu-props="{ offsetY: true }"
                  v-model="codeInfo.upperCodeType"
                  :items="cptdUpItemsCodeType"
                  @change="getSelectUpperCodeType()"
                  :placeholder="codeInfo.upperCodeType ? undefined : '미선택'"
                  clearable
                  :rules="upperCodeTypeRules"
                  hide-details="auto"
                  required
                ></v-select>
              </v-col>
              <v-col cols="4">
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label">상위코드 ID</span>
              </v-col>
              <v-col>
                <v-select
                  class="default mt-0 pt-0"
                  :menu-props="{ offsetY: true }"
                  v-model="codeInfo.upperCodeId"
                  :items="inputForm.itemsUpperCodeId"
                  :placeholder="codeInfo.upperCodeId ? undefined : '미선택'"
                  clearable
                  :rules="upperCodeIdRules"
                  hide-details="auto"
                  required
                ></v-select>
              </v-col>
              <v-col cols="4">
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label">부가코드</span>
              </v-col>
              <v-col>
                <v-text-field
                  class="default mt-0 pt-0"
                  v-model="codeInfo.optCode"
                  placeholder=" "
                  clearable
                  :rules="optCodeRules"
                  hide-details="auto"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </vuescroll>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel') }}</v-btn>
      <v-btn color="btn-secondary" text @click="delCmnCode">{{ $t('button.delete') }}</v-btn>
      <v-btn color="btn-primary" text @click="setCmnCode">{{ $t('button.save') }}</v-btn>
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
  deleteCmnCode,
  getChildrenCmnCode,
  getChooseCondition,
  getCmnCodeByCodeType,
  selectCmnCodeForUpdate,
  updateCmnCode
} from '../../api/cmnCode'
import cmnCode from '@/scripts/cmnCode'

export default {
  name: 'PopupUpdateCmnCodeView',
  components: {},
  mixins: [cmnCode],
  props: {
    editedItem: Object
  },
  hasChild: false,

  data () {
    return {
      reqForm: {}
    }
  },
  methods: {
    getSelectOption: function () {
      getChooseCondition().then(
        response => {
          this.inputForm.itemsCodeType = response.data.result.codeTypeList
          this.inputForm.itemsLocale = response.data.result.localeList
        }
      )
    },
    getSelectCmnCode: function () {
      selectCmnCodeForUpdate(this.reqForm).then(
        response => {
          this.codeInfo.codeType = response.data.result.cmnCode.codeType
          this.codeInfo.codeId = response.data.result.cmnCode.codeId
          this.codeInfo.codeNms = [
            {
              lang: 'KO',
              codeValue: response.data.result.cmnCode.codeValue,
              codeDesc: response.data.result.cmnCode.codeDesc
            },
            ...response.data.result.cmnCode.codeNms
          ]
          this.codeInfo.codeOrder = response.data.result.cmnCode.codeOrder
          this.codeInfo.useYn = response.data.result.cmnCode.useYn
          if (response.data.result.cmnCode.upperCodeType !== null && response.data.result.cmnCode.upperCodeType !== '') {
            this.codeInfo.upperCodeType = response.data.result.cmnCode.upperCodeType
            this.getSelectUpperCodeType()
          }
          if (response.data.result.cmnCode.upperCodeId !== null && response.data.result.cmnCode.upperCodeId !== '') {
            this.codeInfo.upperCodeId = response.data.result.cmnCode.upperCodeId
          }
          this.codeInfo.optCode = response.data.result.cmnCode.optCode
        }
      )
    },
    langList: function (idx) {
      return this.inputForm.itemsLocale.filter(ln => {
        return this.codeInfo.codeNms.filter((nl, n) => {
          return n !== idx && ln.value === nl.lang
        }).length === 0
      })
    },
    addCodeNameByLocale (index, flag) {
      if (flag) {
        const lng = this.inputForm.itemsLocale.filter(ln => {
          return !this.codeInfo.codeNms.some(iln => {
            return iln.lang === ln.value
          })
        })[0]
        this.codeInfo.codeNms.splice((index + 1), 0, {
          lang: lng.value,
          codeValue: '',
          codeDesc: ''
        })
      } else {
        this.codeInfo.codeNms.splice(index, 1)
      }
    },
    getSelectUpperCodeType: function () {
      const input = {
        codeType: this.codeInfo.upperCodeType
      }
      getCmnCodeByCodeType(input).then(
        response => {
          if (response.data.status === 200) {
            this.inputForm.itemsUpperCodeId = response.data.result.codeList
          }
        },
        error => {
          console.error(error)
          delete sessionStorage.accessToken
          this.$router.push({
            name: 'Login',
            query: { t: new Date().getTime() }
          })
        }
      )
    },
    setCmnCode: function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          codeId: this.codeInfo.codeId,
          codeType: this.codeInfo.codeType,
          codeNms: this.codeInfo.codeNms,
          codeOrder: this.codeInfo.codeOrder,
          useYn: this.codeInfo.useYn,
          upperCodeType: this.codeInfo.upperCodeType,
          upperCodeId: this.codeInfo.upperCodeId,
          optCode: this.codeInfo.optCode
        }
        if (this.codeInfo.useYn === 'N') {
          // console.log(input)
          getChildrenCmnCode(input).then(
            response => {
              // console.log(response.data)
              if (response.data.status === 200) {
                if (response.data.result) {
                  alert('하위코드가 존재하여 미사용 처리 할 수 없습니다!')
                  this.$emit('refresh-list')
                  this.$emit('close-dialog')
                } else {
                  updateCmnCode(input).then(
                    updateResponse => {
                      if (updateResponse.data.status === 200) {
                        this.$emit('refresh-list')
                        this.$emit('close-dialog')
                      }
                    },
                    error => {
                      console.error(error)
                      delete sessionStorage.accessToken
                      this.$router.push({
                        name: 'Login',
                        query: { t: new Date().getTime() }
                      })
                    }
                  )
                }
              }
            }
          )
        } else {
          updateCmnCode(input).then(
            updateResponse => {
              if (updateResponse.data.status === 200) {
                this.$emit('refresh-list')
                this.$emit('close-dialog')
              }
            },
            error => {
              console.error(error)
              delete sessionStorage.accessToken
              this.$router.push({
                name: 'Login',
                query: { t: new Date().getTime() }
              })
            }
          )
        }
        // console.log(this.hasChild)
        this.hasChild = false
      }
    },
    delCmnCode: function () {
      if (confirm('삭제하시겠습니까?')) {
        const input = {
          codeId: this.codeInfo.codeId,
          codeType: this.codeInfo.codeType
        }
        // console.log(input)
        getChildrenCmnCode(input).then(
          response => {
            // console.log(response.data)
            if (response.data.status === 200) {
              if (response.data.result) {
                alert('하위코드가 존재하여 삭제 할 수 없습니다!')
                this.$emit('refresh-list')
                this.$emit('close-dialog')
              } else {
                deleteCmnCode(input).then(
                  deleteResponse => {
                    if (deleteResponse.data.status === 200) {
                      this.$emit('refresh-list')
                      this.$emit('close-dialog')
                    }
                  },
                  error => {
                    console.error(error)
                    delete sessionStorage.accessToken
                    this.$router.push({
                      name: 'Login',
                      query: { t: new Date().getTime() }
                    })
                  }
                )
              }
            }
          }
        )
      }
    }
  },

  watch: {},

  created () {
    this.reqForm = this.editedItem
    this.getSelectOption()
    this.getSelectCmnCode()
  },

  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.btn-add-code-type {
  padding: 0px;
}
</style>
