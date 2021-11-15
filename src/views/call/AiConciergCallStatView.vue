
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
              :placeholder="searchForm.tenantId ? undefined : '전체'"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="isSysCounselors === true" class="catalog-container monitoring">
        <SystemCounselorStatus v-for="(sysCounselor, sysIdx) in sysCounselors" :counselor="sysCounselor" :key="sysIdx"></SystemCounselorStatus>
      </v-container>
    </vuescroll>
  </div>
</template>

<script>
import { getCounselorStatusSearchCondition } from '@/api/counselor'
import SystemCounselorStatus from '@/components/SystemCounselorStatus'

export default {
  name: 'AiConciergCallStatView',
  components: {
    SystemCounselorStatus
  },
  data () {
    return {
      // 검색영역 시작
      tenants: [],
      systems: [],
      // 검색조건
      searchForm: {
        tenantId: '',
        systemId: 'AIH'
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
      return this.getsyscounselors && this.getsyscounselors.length > 0 && this.getsyscounselors.some(sc => (!this.searchForm.systemId || this.searchForm.systemId === sc.systemId) && (!this.searchForm.tenantId || this.searchForm.tenantId === sc.tenantId) && sc.callYn === 'Y')
    },
    sysCounselors: function () {
      return (this.getsyscounselors || []).filter(sc => {
        return (!this.searchForm.systemId || this.searchForm.systemId === sc.systemId) && (!this.searchForm.tenantId || this.searchForm.tenantId === sc.tenantId) && sc.callYn === 'Y'
      })
    }
  },
  methods: {
    async init () {
      await this.getCounselorStatusSearchCondition()
    },
    getCounselorStatusSearchCondition () {
      getCounselorStatusSearchCondition().then(
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
