<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :hasNoSearchGroup="true"
      ></PageTitle>
      <v-form
        ref="form"
      >
      <v-container class="addUserDefaultData">
        <v-row>
          <v-col cols="1">
            <span class="label must">ID</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.serviceId"
              :rules="[serviceIdRules.required, serviceIdRules.minLength]"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">서비스 명</span>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="1">
            <span class="label must">서비스 유형</span>
          </v-col>
          <v-col cols="4">
            <v-select
              class="default mt-0 pt-0"
              :menu-props="{ offsetY: true }"
              v-model="inputForm.serviceType"
              :items="serviceTypes"
              :placeholder="inputForm.serviceType ? undefined : ''"
              :rules="serviceTypeRules"
              hide-details="auto"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">URL</span>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="1">
            <span class="label must">사용자 권한</span>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">서비스 아이콘</span>
          </v-col>
          <v-col cols="2">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.iconUrl"
              hide-details="auto"
              readonly
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="1">
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
          <v-col cols="1">
            <span class="label">설명</span>
          </v-col>
          <v-col cols="4">
            <v-text-field
              class="default mt-0 pt-0"
              v-model="inputForm.serviceDesc"
              :rules="serviceDescRules"
              hide-details="auto"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="1">
            <span class="label must">순서</span>
          </v-col>
          <v-col cols="4">
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
        <!-- <v-row>
          <v-col>
            <PageSectionTitle
              :title="sectionTitle"
            >
            </PageSectionTitle>
            <v-card-actions class="btn-group align-right">
              <v-spacer></v-spacer>
              <v-btn class="btn-plus" @click="apiPlus"><v-icon dark>mdi-plus</v-icon></v-btn>
              <v-btn class="btn-minus" @click="apiMinus"><v-icon dark>mdi-minus</v-icon></v-btn>
            </v-card-actions>
            <v-card class="data-grid-wrap default has-scroll">
              <vuescroll>
                <v-data-table
                  v-model="selectedApi"
                  :headers="headersApi"
                  :items.sync="this.inputForm.apiInfoList"
                  class="users-data-table"
                  item-key="apiId"
                  :fixed-header="true"
                  :disable-pagination="true"
                  :footer-props="{ disablePagination: true, disableItemsPerPage : true }"
                  hide-default-footer
                  show-select
                  :no-data-text="$t('message.noData')"
                  :loading-text="$t('message.loading')"
                  @item-selected="itemSelected"
                >
                  <template v-slot:item.apiUrl="{ item }">
                    <v-text-field
                      class="default mt-0 pt-0"
                      hide-details="auto"
                      single-line
                      v-model="item.apiUrl"
                      :rules="[
                        v => !!v || 'API URL을 입력하세요'
                      ]"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </vuescroll>
            </v-card>
          </v-col>
        </v-row> -->
      </v-container>
      </v-form>
      <v-card-actions class="submit-btns-group">
        <v-spacer></v-spacer>
        <v-btn color="btn-secondary" text @click="cancelCatalog()">{{ $t('button.cancel')}}</v-btn>
        <v-btn color="btn-primary" text @click="setCatalog()">{{ $t('button.save')}}</v-btn>
      </v-card-actions>
      <v-dialog
        v-model="popupApiAddView"
        width="490"
        persistent>
        <v-card v-if="popupApiAddView === true" class="dialog-del-reason">
          <v-card-title>
            <span class="headline">연계 API 정보 추가</span>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="addForm"
            >
              <v-container>
                <v-row>
                  <v-col cols="2">
                    <span class="label must">연계 API</span>
                  </v-col>
                  <v-col>
                    <v-select
                      class="default mt-0 pt-0"
                      :menu-props="{ offsetY: true }"
                      v-model="inputForm.sapiId"
                      :items="apiListForAdd"
                      :rules="[
                        v => (!!v && v.length > 0) || '연계 API를 선택하세요'
                      ]"
                      hide-details="auto"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions class="submit-btns-group">
            <v-spacer></v-spacer>
            <v-btn color="btn-secondary" text @click="popupApiAddView = false">{{ $t('button.cancel')}}</v-btn>
            <v-btn color="btn-primary" text @click="addApiInfo">{{ $t('button.add')}}</v-btn>
            <v-btn color="btn-primary" text @click="addApiInfoNext">{{ $t('button.addNext')}}</v-btn>
          </v-card-actions>
          <v-btn
            class="default dialogclose"
            text
            @click="popupApiAddView = false"
            :ripple="false"
          >
            <span class="hide">팝업 닫기</span>
          </v-btn>
        </v-card>
      </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import {
  initCatalogView,
  selectAddApiInfoList,
  createCatalog
} from '../../api/catalog'

import lodash from 'lodash'

export default {

  name: 'CreateCatalogView',

  components: {},

  data () {
    return {
      boolDefaultUserApi: true,
      lazy: true,
      pickerIcon: false,

      /* input start */
      inputForm: {
        serviceId: '',
        serviceNm: '',
        serviceDesc: '',
        serviceAuthCd: '',
        sortOrder: '1',
        iconUrl: '',
        serviceUrl: '',
        useYn: 'Y',
        sapiId: '',
        apiInfoList: []
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
      serviceTypes: [],
      authTypes: [],
      catalogIcons: [],
      apiTypes: [],

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
      ],
      serviceTypeRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '서비스 유형을 선택하세요'
      ],
      /* validate end */

      /* 여기서 부터 화면부분 */
      /* api info start */
      headersApi: [
        { text: 'API 구분', value: 'apiTypeNm', align: 'center', class: 'text-center', width: '150px' },
        { text: 'API', value: 'apiNm', align: 'center', class: 'text-center', width: '250px' },
        { text: 'API URL', value: 'apiUrl', align: 'center', class: 'text-center' },
        { text: '전송타입', value: 'transType', align: 'center', class: 'text-center', width: '100px' }
      ],
      selectedApi: [],
      /* api info end */

      apiInfoList: [],

      sectionTitle: '연계 API 설정',
      popupApiAddView: false
    }
  },

  created: function () {
  },
  mounted: async function () {
    await this.initCatalogView()
  },
  watch: {
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    apiListForAdd: function () {
      if (this.boolDefaultUserApi) {
        return Object.values(this.apiTypes.filter((c) => c.opt3 !== 'Y'))
      } else {
        return this.apiTypes
      }
    },
    cptdAuthTypeList: function () {
      const its = [
        // {
        //   text: '미사용',
        //   value: ''
        // }
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
          this.authTypes = [response.data.result.authTypeList[0]]
          // this.authTypes = response.data.result.authTypeList
          this.catalogIcons = response.data.result.catalogIconList
          this.apiTypes = response.data.result.apiTypeList
          this.serviceTypes = response.data.result.serviceTypeList
          // SHBK 사용자 권한 고정
          this.inputForm.serviceAuthCd = this.authTypes[0].value
        }
      ).finally(() => {
        const defaultApiType = this.apiTypes.filter((c) => c.opt3 === 'Y')
        if (this.boolDefaultUserApi && (!this.apiInfoList || this.apiInfoList.length ===  0)) {
          this.selectAddApiInfoList(defaultApiType[0].value)
        } else {
          for (const obj of this.apiInfoList) {
            if (this.boolDefaultUserApi && obj.apiType === 'Y') {
              obj.isSelectable = false
            } else {
              obj.isSelectable = true
            }
            this.inputForm.apiInfoList.push(obj)
          }
        }
      })
    },
    selectAddApiInfoList: function (apiTypeId) {
      const input = {
          apiTypeId: apiTypeId
        }
      selectAddApiInfoList(input).then(
        response => {
          this.apiInfoList = response.data.result.apiInfoList
          for (const obj of this.apiInfoList) {
            const boolDupChk = this.inputForm.apiInfoList.some((au) => {return au.apiId === obj.apiId})
            if ((!this.inputForm.apiInfoList || this.inputForm.apiInfoList.length === 0) || !boolDupChk) {
              if (this.boolDefaultUserApi && obj.apiType === 'Y') {
                obj.isSelectable = false
              } else {
                obj.isSelectable = true
              }
              this.inputForm.apiInfoList.push(obj)
            }
          }
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
          serviceType: this.inputForm.serviceType,
          serviceAuthCd: this.inputForm.serviceAuthCd,
          sortOrder: this.inputForm.sortOrder,
          iconUrl: this.inputForm.iconUrl,
          serviceUrl: this.inputForm.serviceUrl,
          useYn: this.inputForm.useYn,
          apiInfoList: this.inputForm.apiInfoList
        }
        createCatalog(input).then(
          response => {
            if (response.data.status === 200) {
              this.$router.push({ name: 'ListCatalogView', query: { t: new Date().getTime() } })
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
    apiMinus: function () {
      if (!this.selectedApi || this.selectedApi.length === 0) {
        alert('삭제할 연계 API 설정정보를 선택하세요.')
        return
      }
      for (const sItem of this.selectedApi) {
        this.inputForm.apiInfoList.splice(this.inputForm.apiInfoList.findIndex((c) => c.apiId === sItem.apiId),1)
      }
      this.selectedApi = []
    },
    apiPlus: function () {
      this.inputForm.sapiId = ''
      this.popupApiAddView = true
    },
    addApiInfo: function () {
      if (!this.$refs.addForm.validate()) {
        return false
      }
      this.selectAddApiInfoList(this.inputForm.sapiId)
      this.popupApiAddView = false
    },
    addApiInfoNext: function () {
      if (!this.$refs.addForm.validate()) {
        return false
      }
      this.selectAddApiInfoList(this.inputForm.sapiId)
      this.popupApiAddView = false
      this.$nextTick(() => {
        this.apiPlus()
      })
    },
    cancelCatalog: function () {
      this.$router.push({ name: 'ListCatalogView', query: { t: new Date().getTime() } })
    },
    itemSelected: function (val) {
      const obj = val.item
      const apitype = obj.apiType
      if ( apitype === 'Y' || apitype === 'T' ) {
        const list = Object.values(this.inputForm.apiInfoList.filter((c) => c.apiTypeId === val.item.apiTypeId))
        for (const map of list) {
          if (val.value) {
            this.selectedApi.push(map)
          }else {
            this.selectedApi.splice(this.selectedApi.findIndex((c) => c.apiId === map.apiId),1)
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .process {
    .users-data-table {
      height: 300px;
    }
    .submit-btns-group {
      margin-top: -4px;
    }
  }
</style>
