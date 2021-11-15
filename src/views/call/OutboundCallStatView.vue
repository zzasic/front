
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
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenantId"
              :items="tenantList"
              :label="$t('label.tenant')"
              :placeholder="searchForm.tenantId ? undefined : '전체'"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.taskIds"
              :items="scenarioCategoryList"
              multiple
              label="업무"
              :placeholder="searchForm.taskIds && searchForm.taskIds.length > 0 ? undefined : '전체'">
              <template v-slot:selection="{ item, index }">
                <span v-if="index === 0" class="pl-3">{{ item.text }}</span>
                <span v-if="index === 1" class="pl-3">외 {{ searchForm.taskIds.length }} 건</span>
              </template>
            </v-select>
          </v-col>
          <!-- <v-col cols="1">
            <v-select
              class="default"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.agentStatus"
              :items="agentStatusList"
              label="상태"
              :placeholder="searchForm.agentStatus ? undefined : '전체'"
            ></v-select>
          </v-col> -->
          <!-- <v-spacer></v-spacer> -->
          <v-col class="text-right">
            <v-btn-toggle
              class="agentstatus"
              v-model="searchForm.agentStatus"
              color="accent-3"
              mandatory
              tile
              group>
              <v-btn value="STATUS01">
                <v-card outlined>
                  <v-card-title>
                    <v-avatar color="#FFE812">
                      <span class="black--text headline">{{ counselorCount('STATUS01') }}</span>
                    </v-avatar>
                  </v-card-title>
                  <v-card-text>
                    통화중
                  </v-card-text>
                </v-card>
              </v-btn>
              <v-btn value="STATUS019">
                <v-card outlined>
                  <v-card-title>
                    <v-avatar color="#F7504F">
                      <span class="white--text headline">{{ counselorCount('STATUS019') }}</span>
                    </v-avatar>
                  </v-card-title>
                  <v-card-text>
                    이상통화
                  </v-card-text>
                </v-card>
              </v-btn>
              <v-btn value="STATUS02">
                <v-card outlined>
                  <v-card-title>
                    <v-avatar color="#01BEDB">
                      <span class="white--text headline">{{ counselorCount('STATUS02') }}</span>
                    </v-avatar>
                  </v-card-title>
                  <v-card-text>
                    통화대기
                  </v-card-text>
                </v-card>
              </v-btn>
              <v-btn value="ALL">
                <v-card outlined>
                  <v-card-title>
                    <v-avatar color="#34BC6F">
                      <span class="white--text headline">{{ counselorCount('ALL') }}</span>
                    </v-avatar>
                  </v-card-title>
                  <v-card-text>
                    전체
                  </v-card-text>
                </v-card>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="isCounselors === true" class="catalog-container monitoring">
        <CounselorStatus :counselor="counselor" v-for="counselor in counselors" :key="counselor.counselorId"></CounselorStatus>
      </v-container>
    </vuescroll>
  </div>
</template>

<script>
import { getCounselorStatusSearchCondition } from '@/api/counselor'
import CounselorStatus from '@/components/CounselorStatus'

export default {
  name: 'OutboundCallStatView',
  components: {
    CounselorStatus
  },
  data () {
    return {
      // 검색영역 시작
      tenants: [],
      agentStatuses: [],
      categoryies: [],
      // 검색조건
      searchForm: {
        tenantId: '',
        taskIds: [],
        agentStatus: 'ALL'
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
    getcounselors: function () {
      const counselors = this.$store.getters.getcounselors
      return (counselors || []).filter((cs) => cs.callType === 'OUT')
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
    scenarioCategoryList: function () {
      return (this.categoryies || []).filter(c => {
        return this.tenants.some(t => c.opt4 === t.value) && c.opt5 === 'OUT' && (!this.searchForm.tenantId || this.searchForm.tenantId === c.opt4)
      })
    },
    agentStatusList: function () {
      const its = [
        {
          text: this.$t('label.all'),
          value: ''
        }
      ]
      its.push(...this.agentStatuses)
      return its
    },
    isCounselors: function () {
      return this.getcounselors && this.getcounselors.length > 0
    },
    counselors: function () {
      return (this.getcounselors && this.getcounselors.length > 0 ? this.getcounselors : []).filter(cs => {
        return (!this.searchForm.tenantId || this.searchForm.tenantId === cs.tenantId) && (this.searchForm.agentStatus === 'ALL' || (cs.connectYn === 'N' ? 'STATUS04' : cs.connectYn === 'C' ? 'STATUS03' : cs.callYn === 'Y' ? (cs.abnormalCount > 0 ? 'STATUS019' : 'STATUS01') : 'STATUS02').startsWith(this.searchForm.agentStatus))
      }).filter(cu => {
        // taskId
        return !this.searchForm.taskIds || this.searchForm.taskIds.length === 0 || this.searchForm.taskIds.some(t => t === cu.taskId)
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
            this.agentStatuses = response.data.result.agentStatusList // AI 상담원 상태
            this.categoryies = response.data.result.scenarioCategoryList
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
    counselorCount: function (status) {
      return (this.getcounselors && this.getcounselors.length > 0 ? this.getcounselors : []).filter(cs => {
        return (!this.searchForm.tenantId || this.searchForm.tenantId === cs.tenantId) && (status === 'ALL' || (cs.connectYn === 'N' ? 'STATUS04' : cs.connectYn === 'C' ? 'STATUS03' : cs.callYn === 'Y' ? (cs.abnormalCount > 0 ? 'STATUS019' : 'STATUS01') : 'STATUS02').startsWith(status))
      }).filter(cu => {
        // taskId
        return !this.searchForm.taskIds || this.searchForm.taskIds.length === 0 || this.searchForm.taskIds.some(t => t === cu.taskId)
      }).length
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
