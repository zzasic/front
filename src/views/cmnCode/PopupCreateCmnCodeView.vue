<template>
  <v-card class="dialog-cmnCode">
    <v-card-title>
    <span class="headline">공통코드 등록</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <v-container>
        <v-row>
          <v-col cols="2">
            <span class="label must">코드유형</span>
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
            ></v-select>
          </v-col>
          <v-col>
            <!-- popup start -->
            <v-dialog
              v-model="dialogLookupCodeType.popupCreateCodeTypeView"
              width="490"
              persistent
              scrollable
            >
              <template v-slot:activator="{ on }">
                <v-card-actions class="btn-add-code-type ml-2">
                  <v-btn class="btn-naked-primary" text :ripple="false" v-on="on">코드유형추가</v-btn>
                </v-card-actions>
              </template>
              <!-- 공통 코드 유형 조회 및 수정 팝업 -->
              <popup-create-code-type-view
                @close-dialog="closeDialogCodeType"
                @refresh-type="getSelectOption"
                v-if="dialogLookupCodeType.popupCreateCodeTypeView"
              />
            </v-dialog>
            <!-- popup end -->
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">ID</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="codeInfo.codeId"
              :rules="codeIdRules"
              placeholder="입력하세요"
              hide-details="auto"
              clearable
              required
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
                  placeholder="공통코드 명"
                  hide-details="auto"
                  clearable
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="btn-col" v-if="inputForm.itemsLocale && inputForm.itemsLocale.length > 1">
                <div class="btn-group align-right mt-0">
                  <v-btn class="btn-plus" @click="addCodeNameByLocale(index, true)" :disabled="!langContentsPlusable">
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn class="btn-minus" @click="addCodeNameByLocale(index, false)" :disabled="!langContentsMinusable || codeLang.lang === 'KO'">
                    <v-icon dark>mdi-minus</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <span class="label must" v-if="!(inputForm.itemsLocale && inputForm.itemsLocale.length > 1)">설명</span>
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
              placeholder="입력하세요"
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
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="setCmnCode">{{ $t('button.save')}}</v-btn>
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
  getChooseCondition,
  getCmnCodeByCodeType,
  createCmnCode
} from '../../api/cmnCode'
import cmnCode from '@/scripts/cmnCode'

import popupCreateCodeTypeView from '@/views/cmnCode/PopupCreateCodeTypeView'

export default {
  name: 'PopupCreateCmnCodeView',
  components: {
    popupCreateCodeTypeView
  },
  mixins: [cmnCode],
  data () {
    return {
      /* popup start */
      dialogLookupCodeType: {
        popupCreateCodeTypeView: false
      }
      /* popup end */
    }
  },
  methods: {
    /* popup start */
    closeDialogCodeType: function () {
      this.dialogLookupCodeType.popupCreateCodeTypeView = false
    },
    /* popup end */
    getSelectOption: function () {
      getChooseCondition().then(
        response => {
          this.inputForm.itemsCodeType = response.data.result.codeTypeList
          this.inputForm.itemsLocale = response.data.result.localeList
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
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
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

        createCmnCode(input).then(
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
    }
  },

  watch: {},

  created () {
    this.getSelectOption()
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
