
<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <!-- <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.systemId"
              :items="systemList"
              :label="$t('label.system')"
              :placeholder="searchForm.systemId ? undefined : '전체'"
            ></v-select>
          </v-col> -->
          <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenantId"
              :items="tenantList"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenantId ? undefined : $t('label.all')"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-text-field
              class="default search"
              v-model="searchForm.branchNm"
              label="지점명"
              placeholder=" "
              hide-details
              clearable
              readonly
              @click="searhPopup"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.deviceKind"
              :items="cptdDeviceKindList"
               item-key="codeId"
              item-text="codeValue"
              item-value="codeId"
              :label="'단말종류'"
              :placeholder="searchForm.deviceKind ? undefined : $t('label.all')"
              clearable
            ></v-select>
          </v-col>
          <!--<v-col class="text-right">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-search"
              :ripple="false"
              @click="searchBtn"
            >{{ $t('button.search')}}</v-btn>
          </v-col>
          -->
        </v-row>
      </v-container>
      <v-container v-if="isSysCounselors === true" class="catalog-container monitoring">
        <SystemCounselorStatus v-for="(sysCounselor, sysIdx) in sysCounselors" :counselor="sysCounselor" :key="sysIdx"></SystemCounselorStatus>
      </v-container>
      <v-dialog
        v-model="dialog"
        persistent
        :max-width="600"
        hide-overlay
        scrollable
        >
      <PopupSearchBanch
      @popupAction="popupAction"
      v-if="popup.branchPopup === true"/>
    </v-dialog>
    </vuescroll>
  </div>
</template>

<script>
import { getCounselorStatusSearchCondition } from '@/api/counselor'
import SystemCounselorStatus from '@/components/SystemCounselorStatus'
import PopupSearchBanch from '@/views/counsel/PopupSearchBanch'
import { getCmnCodeList } from '../../api/cmnCode'
export default {
  name: 'AiConciergCallStatView',
  components: {
    SystemCounselorStatus,
    PopupSearchBanch
  },
  data () {
    return {
      // 검색영역 시작
      tenants: [],
      deviceKindList: [],
      // 검색조건
      searchForm: {
        tenantId: '',
        systemId: 'AIH',
        branchNm: '',
        deviceKind: '',
        codeIdArr: []
      },
      popup: {
        branchPopup: false
      }
      // 검색영역 끝
    }
  },
  created () {},
  mounted () {
    // console.log('CallState')
    this.init()
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    getsyscounselors: function () {
      const sysc = this.$store.getters.getsyscounselors
      // console.log(sysc)
      return sysc
    },
    systemList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.systems)
      return its
    },
    tenantList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.tenants)
      return its
    },
    isSysCounselors: function () {
      // alert(this.searchForm.codeIdArr + this.isEmpty(this.searchForm.branchNm) + ' isSysCounselors -' + this.searchForm.branchNm + '-')
      if (this.isEmpty(this.searchForm.branchNm)) {
        return this.getsyscounselors && this.getsyscounselors.length > 0 && this.getsyscounselors.some(sc => (!this.searchForm.systemId || this.searchForm.systemId === sc.systemId) && (!this.searchForm.tenantId || this.searchForm.tenantId === sc.tenantId) && (!this.searchForm.deviceKind || this.searchForm.deviceKind === sc.deviceKind) && sc.callYn === 'Y')
      } else {
        return this.getsyscounselors && this.getsyscounselors.length > 0 && this.getsyscounselors.some(sc => (!this.searchForm.systemId || this.searchForm.systemId === sc.systemId) && (!this.searchForm.tenantId || this.searchForm.tenantId === sc.tenantId) && (!this.searchForm.deviceKind || this.searchForm.deviceKind === sc.deviceKind) && (this.searchForm.codeIdArr.includes(sc.branchCd)) && sc.callYn === 'Y')
      }
    },
    sysCounselors: function () {
      // alert(this.searchForm.codeIdArr + this.isEmpty(this.searchForm.branchNm) + ' sysCounselors ' + this.searchForm.branchNm)
      console.log(' --sysCounselors-- ' + JSON.stringify(this.getsyscounselors))
      if (this.isEmpty(this.searchForm.branchNm)) {
        return (this.getsyscounselors || []).filter(sc => {
          // return (!this.searchForm.systemId || this.searchForm.systemId === sc.systemId) && (!this.searchForm.tenantId || this.searchForm.tenantId === sc.tenantId) && sc.callYn === 'Y'
          return (!this.searchForm.systemId || this.searchForm.systemId === sc.systemId) && (!this.searchForm.tenantId || this.searchForm.tenantId === sc.tenantId || this.searchForm.deviceKind === sc.deviceKind) && sc.callYn === 'Y'
        })
      } else {
        return (this.getsyscounselors || []).filter(sc => {
          // return (!this.searchForm.systemId || this.searchForm.systemId === sc.systemId) && (!this.searchForm.tenantId || this.searchForm.tenantId === sc.tenantId) && sc.callYn === 'Y'
          return (!this.searchForm.systemId || this.searchForm.systemId === sc.systemId) && (!this.searchForm.tenantId || this.searchForm.tenantId === sc.tenantId || this.searchForm.deviceKind === sc.deviceKind || this.searchForm.codeIdArr.includes(sc.branchCd)) && sc.callYn === 'Y'
        })
      }
    },
    cptdDeviceKindList () {
      const deviceKindList = [
        {
          codeValue: this.$t('label.all'),
          codeId: ''
        }
      ]
      deviceKindList.push(...this.deviceKindList)
      return deviceKindList
    }
  },
  methods: {
    isEmpty: function (x) {
      return (x === null || x === undefined || x === '')
    },
    async init () {
      this.getCmnCodeList()
      await this.getCounselorStatusSearchCondition()
    },
    getCounselorStatusSearchCondition () {
      // param setting
      const searchCondition = {
        tenantId: this.searchForm.tenantId,
        deviceKind: this.searchForm.deviceKind, // 단말기 종류
        codeIdArr: this.searchForm.codeIdArr // 지점명 배열
      }
      // console.log(' searchCondition ' + JSON.stringify(searchCondition))
      getCounselorStatusSearchCondition(searchCondition).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.tenants = response.data.result.tenantList // 테넌트
            this.systems = response.data.result.systemInfoList // 시스템
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
    },
    searhPopup: function () {
      this.popup.branchPopup = true
    },
    popupAction: function (popup, obj) {
      this.searchForm.codeIdArr = []
      if (obj != null && obj.length > 0) {
        let txt = ''
        for (let i = 0; i < obj.length; i++) {
          if (i === (obj.length - 1)) {
            txt = txt + obj[i].codeValue
          } else {
            txt = txt + obj[i].codeValue + ','
          }
          this.searchForm.codeIdArr.push(obj[i].codeId)
        }
        this.searchForm.branchNm = txt
      }
      this.popup = popup
    },
    dialog: function () {
      return (this.popup.branchPopup === true)
    },
    // 검색버튼
    searchBtn: function () {
      console.log('form' + JSON.stringify(this.searchForm))
      // this.pagination.page = 1
      this.init()
    },
    // 공통코드유형 정보 조회
    getCmnCodeList: function () {
      // param setting
      const searchCondition = {
        codeType: 'DEVICE',
        useYn: 'Y'
      }
      // retrieve
      // this.pagination.loading = true
      getCmnCodeList(searchCondition).then(
        response => {
          this.deviceKindList = response.data.result.cmnCodeList ? response.data.result.cmnCodeList : []
          // console.log(' this.deviceKind ' + JSON.stringify(this.deviceKindList))
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
/* IE10+ hack */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .vue-window-modal-header {
    .title {
      font-weight: 300;
    }
  }
  .catalog-container {
    width: auto;
    max-width: 1620px !important;
    @media only screen and (max-height:819px){
      max-width: 1278px !important;
    }
    .catalog-item {
      max-width: calc(100%/10 - 8px);
      min-width: 149px;
      margin-right: 8px;
      margin-bottom: 14px;
    }
  }
}
</style>
