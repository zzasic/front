<template>
  <v-card class="dialog-catalog">
    <v-card-title>
    <span class="headline">서비스 수정</span>
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
            <span class="label must">ID</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.serviceId"
              :rules="[serviceIdRules.required, serviceIdRules.minLength]"
              hide-details="auto"
              outlined
              disabled
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">서비스 명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.serviceNm"
              :rules="serviceNmRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label">설명</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.serviceDesc"
              :rules="serviceDescRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">순서</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.sortOrder"
              :rules="sortOrderRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">URL</span>
          </v-col>
          <v-col>
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.serviceUrl"
              :rules="serviceUrlRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">사용자 권한</span>
          </v-col>
          <v-col>
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.serviceAuthCd"
              :items="cptdAuthTypeList"
              :placeholder="inputForm.serviceAuthCd ? undefined : '미사용'"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <span class="label must">서비스 아이콘</span>
          </v-col>
          <v-col cols="6">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.iconUrl"
              hide-details="auto"
              readonly
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col>
            <v-card-actions class="btn-add-code-type ml-0 pt-0">
              <v-btn class="btn-naked-primary" text :ripple="false" @click="pickerIcon = true">아이콘선택</v-btn>
            </v-card-actions>
            <v-dialog
              ref="pickerIcon"
              v-model="pickerIcon"
              :return-value.sync="inputForm.iconUrl"
              :close-on-content-click="false"
              max-width="500"
              persistent
              scrollable
              >
              <v-card class="dialog-catalog">
                <v-card-title>
                <span class="headline">아이콘 선택</span>
                </v-card-title>
                <v-container class="pa-1">
                  <v-item-group
                    v-model="inputForm.iconUrl"
                  >
                    <v-row>
                      <v-col
                        v-for="(item, i) in catalogIcons"
                        :key="i"
                        cols="12"
                        md="3"
                        :style="{ padding: '5px !important'}"
                      >
                        <v-item :value="item.text" v-slot="{ active, toggle }">
                          <v-card
                            outlined>
                            <v-card-text :style="{ padding: '10px 20px' }">
                              <v-img
                                :src="getIconImage(item)"
                                width="60"
                                height="60"
                                class="text-center"
                                @click="toggle"
                              >
                              </v-img>
                            </v-card-text>
                            <v-card-actions class="submit-btns-group"
                              :style="{ padding: '5px 20px !important' }">
                              <v-spacer></v-spacer>
                              <v-btn
                                icon
                                @click="toggle"
                              >
                                <v-icon>
                                  {{ active ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}
                                </v-icon>
                              </v-btn>
                              <v-spacer></v-spacer>
                            </v-card-actions>
                          </v-card>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-item-group>
                </v-container>
                <v-spacer></v-spacer>
                <v-card-actions class="submit-btns-group"
                  :style="{ padding: '5px 10px !important' }">
                  <v-spacer></v-spacer>
                  <v-btn text :ripple="false" color="pink" @click="pickerIcon = false">{{ $t('button.close')}}</v-btn>
                  <v-btn text :ripple="false" color="pink" @click="$refs.pickerIcon.save(inputForm.iconUrl)">{{ $t('button.confirm')}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
      <v-btn color="btn-secondary" text @click="deleteCatalog()">{{ $t('button.delete')}}</v-btn>
      <v-btn color="btn-primary" text @click="setCatalog">{{ $t('button.save')}}</v-btn>
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
  initCatalogView,
  selectCatalogForUpdate,
  updateCatalog,
  deleteCatalog
} from '../../api/catalog'

import lodash from 'lodash'

export default {

  name: 'PopupUpdateCatalogView',

  components: {
  },
  props: {
    editedItem: Object
  },
  data () {
    return {
      valid: true,
      lazy: true,
      pickerIcon: false,
      reqForm: {},

      /* input start */
      inputForm: {
        serviceId: '',
        serviceNm: '',
        serviceDesc: '',
        serviceAuthCd: '',
        sortOrder: '1',
        iconUrl: '',
        serviceUrl: '',
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
      authTypes: [],
      catalogIcons: [],

      /* validate start */
      serviceIdRules: {
        required: v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'ID를 입력하세요',
        /* eslint-disable */
        minLength: v => (!!v && v.length <= 32) || '32자리가 넘을 수 없습니다.'
        /* eslint-disable */
      },
      serviceNmRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '서비스명를 입력하세요',
        v => (!!v && v.length <= 100) || '100자리가 넘을 수 없습니다.'
      ],
      serviceDescRules: [
        v => !v || v.length <= 500 || '500자리가 넘을 수 없습니다.'
      ],
      sortOrderRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '순서를 입력하세요',
        /* eslint-disable */
        v => /^[0-9]*$/.test(v) || '순서를 숫자로 입력해 주세요',
        /* eslint-disable */
        v => (!!v && v.length <= 5) || '순서를 5자리 이내로 입력해 주세요'
      ],
      serviceUrlRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || 'URL을 입력하세요',
        v => (!!v && v.length <= 500) || '500자리가 넘을 수 없습니다.'
      ]
      /* validate end */
    }
  },

  computed: {
    cptdAuthTypeList: function () {
      const its = [
        {
          text: '미사용',
          value: ''
        }
      ]
      its.push(...this.authTypes)
      return its
    }
  },

  methods: {
    getIconImage: function (item) {
      return require('@/assets/image/' + item.text)
    },
    initCatalogView () {
      initCatalogView().then(
        response => {
          this.useYns = response.data.result.useYnList
          this.authTypes = response.data.result.authTypeList
          this.catalogIcons = response.data.result.catalogIconList
        }
      )
    },
    getSelectCatalog: function () {
      selectCatalogForUpdate(this.reqForm).then(
        response => {
          this.inputForm.serviceId = response.data.result.catalog.serviceId
          this.inputForm.serviceNm = response.data.result.catalog.serviceNm
          this.inputForm.serviceDesc = response.data.result.catalog.serviceDesc
          this.inputForm.serviceAuthCd = response.data.result.catalog.serviceAuthCd
          this.inputForm.sortOrder = response.data.result.catalog.sortOrder
          this.inputForm.iconUrl = response.data.result.catalog.iconUrl
          this.inputForm.serviceUrl = response.data.result.catalog.serviceUrl
          this.inputForm.useYn = response.data.result.catalog.useYn
        }
      )
    },
    setCatalog: lodash.debounce(function () {
      if (this.$refs.form.validate()) {
        if (!confirm('저장하시겠습니까?')) {
          return
        }
        const input = {
          serviceId: this.inputForm.serviceId,
          serviceNm: this.inputForm.serviceNm,
          serviceDesc: this.inputForm.serviceDesc,
          serviceAuthCd: this.inputForm.serviceAuthCd,
          sortOrder: this.inputForm.sortOrder,
          iconUrl: this.inputForm.iconUrl,
          serviceUrl: this.inputForm.serviceUrl,
          useYn: this.inputForm.useYn
        }
        updateCatalog(input).then(
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
    deleteCatalog: lodash.debounce(function () {
      if (confirm('삭제하시겠습니까?')) {
        deleteCatalog(this.reqForm).then(
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
    this.initCatalogView()
  },
  mounted () {
    this.reqForm = this.editedItem
    this.$nextTick(() => {
      this.getSelectCatalog()
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
