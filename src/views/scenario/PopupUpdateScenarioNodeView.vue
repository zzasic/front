
<template>
  <v-card @keydown.esc="abc">
    <v-card-title>
      <span class="headline" >{{ pageTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
      <PageSectionTitle
        :title="pagination.sectionTitle"
        :subtitle="pagination.sectionSubTitle"
      >
      </PageSectionTitle>
      <v-card class="data-grid-wrap default">
        <vuescroll>
          <v-data-table
            :headers="headers"
            :fixed-header="true"
            :items="result"
            :server-items-length="pagination.totalRows"
            :options.sync="optionSync"
            :loading="pagination.loading"
            hide-default-footer
            item-key="nodeId"
            :no-data-text="$t('message.noData')"
            :loading-text="$t('message.loading')"
          >
            <template v-slot:item.scenarioNm="{ item }">
              {{ item.scenarioNm.length > 60 ? item.scenarioNm.substr(0,60)+'....' : item.scenarioNm}}
            </template>
            <template v-slot:item.nodeNm="{ item }">
              {{ item.nodeNm.length > 60 ? item.nodeNm.substr(0,60)+'....' : item.nodeNm}}
            </template>
            <template v-slot:item.nodeDispNm="{ item }">
              <v-text-field
                class="default mt-0 pt-0"
                hide-details="auto"
                single-line
                v-model="item.nodeDispNm"
                :rules="[
                  v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '노드 노출명을 입력하세요.'
                ]"
                required
                ref="nodeDispNmRef"
              ></v-text-field>
            </template>
            <template v-slot:item.useYn="{ item }">
              <v-checkbox
                class="default pt-0 pb-0 mt-0 mb-0"
                dense
                hide-details
                :ripple="false"
                v-model="item.useYn"
                :style="{ width: '22px', overflow: 'hidden', margin: 'auto', marginTop: '9px !important' }"
                true-value="Y"
                false-value="N"
                  @change="changeCheckbox(item)">
              </v-checkbox>
            </template>
            <!-- <template v-slot:item.finalYn="{ item }">
              <v-radio-group v-model="selectedFinalNode" name="rowSelector" class="ml-0 pt-0 pb-0 mt-0 mb-0">
                <v-radio
                :disabled="item.useYn !== 'Y'"
                :style="{ width: '22px', overflow: 'hidden', margin: 'auto'}"
                @change="chooseRowGroup(item.nodeId)"
                class="pt-0 pb-0 mt-0 mb-0"
                :ripple="false"
                v-model="item.nodeId">
                </v-radio>
              </v-radio-group>
            </template> -->
            <template v-slot:item.finalYn="{ item }">
              <v-checkbox
                class="default pt-0 pb-0 mt-0 mb-0"
                :disabled="item.useYn !== 'Y'"
                dense
                hide-details
                :ripple="false"
                v-model="item.finalYn"
                :style="{ width: '22px', overflow: 'hidden', margin: 'auto', marginTop: '9px !important' }"
                true-value="Y"
                false-value="N"
                  @change="changeCheckbox(item)">
              </v-checkbox>
            </template>
          </v-data-table>
        </vuescroll>
      </v-card>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="saveScenarioNode">{{ $t('button.save')}}</v-btn>
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
import { getScenarioNodeList, saveScenarioNode } from '../../api/scenario'
export default {
  name: 'PopupUpdateScenarioNodeView',
  props: {
    editedItem: Object
  },
  components: {
  },
  created () {
    // this.init()
  },
  mounted () {
    this.$nextTick(() => {
      // 렌더링된 후 호출
    })
  },
  computed: {
    optionSync: {
      get: function () {
        return this.options
      },
      set: function (options) {
        const doit = !!this.options
        this.options = options
        if (doit) {
          this.getScenarioNodeList()
        }
      }
    }
  },
  watch: {
  },
  data () {
    return {
      valid: true,
      // 페이지 타이틀과 디스크립션
      pageTitle: '시나리오 노드관리',
      pageDescription: '시나리오 노드',
      // 테이블  데이터
      headers: [
        { text: '시나리오', value: 'scenarioNm', align: 'center', class: 'text-center' },
        { text: '시나리오 노드', value: 'nodeNm', align: 'center', class: 'text-center', width: '210px' },
        { text: '노드 노출명', value: 'nodeDispNm', align: 'center', class: 'text-center', width: '210px' },
        { text: '사용여부', value: 'useYn', align: 'center', class: 'text-center', width: '80px', sortable: false },
        { text: '최종노드', value: 'finalYn', align: 'center', class: 'text-center', width: '80px', sortable: false }
      ],
      result: [],
      // 페이지 네이션 설정
      pagination: {
        page: 1, // 현재페이지
        length: 1, // 페이징숫자 갯수
        itemsPerPage: 10, // table row view 갯수
        itemsPerPages: ['10', '20', '30'], // 왼쪽하단 selectbox
        totalRows: 0,
        sectionTitle: '시나리오 노드',
        sectionSubTitle: '',
        loading: false,
        options: {}
      },
      options: {}
    }
  },
  methods: {
    init: async function () {
      await this.getScenarioNodeList()
    },
    // 이력 조회
    getScenarioNodeList: function () {
      // param setting
      const searchCondition = {
        sortBy: this.options.sortBy && this.options.sortBy.length ? this.options.sortBy[0] : '',
        sortDesc: this.options.sortDesc && this.options.sortDesc.length ? this.options.sortDesc[0] === false ? 'DESC' : 'ASC' : '',
        scenarioId: this.editedItem.scenarioId
      }

      // retrieve
      this.pagination.loading = true
      getScenarioNodeList(searchCondition).then(
        response => {
          // 조회결과
          this.result = response.data.result.scenarioList ? response.data.result.scenarioList : []
          // paging setting
          this.pagination.totalRows = response.data.result.scenarioListCount
          // 최종노드
          // const obj = this.result.find((item) => item.finalYn === 'Y')
          // if (obj !== undefined) {
          //   this.selectedFinalNode = [obj.nodeId]
          // }
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
        this.pagination.loading = false
      })
    },
    saveScenarioNode: function () {
      if (!this.result || this.result.length === 0) {
        return false
      }
      if (!this.$refs.form.validate()) {
        return false
      }
      // param setting
      for (const obj of this.result) {
        if (obj.finalYn !== 'Y') {
          obj.finalYn = 'N'
        }
      }
      const input = {
        scenarioNodeList: this.result
      }
      // retrieve
      this.pagination.loading = true
      saveScenarioNode(input).then(
        response => {
          if (response.data.status === 200) {
            this.$emit('refresh-list')
            this.$emit('close-dialog')
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
      ).finally(() => {
        this.pagination.loading = false
      })
    },
    changeCheckbox: function (item) {
      if (item.useYn !== 'Y') {
        item.finalYn = 'N'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .v-card__text {
      padding: 0 30px 20px;
      > .__vuescroll.hasVBar {
        width: calc(100% + 28px) !important;
        > .__panel > .__view > {
          .v-form, .row, div {
            width: calc(100% - 28px) !important;
          }
        }
      }
      .data-grid-wrap.default {
        margin-bottom: 0;
        .v-data-table--fixed-header .v-data-table__wrapper {
          min-height: inherit;
          max-height: 490px;
          overflow: unset;
          table {
            border-color: #A5B3C2;
            tbody {
              tr {
                &.v-data-table__empty-wrapper {
                  td {
                    height: 250px;
                    border-bottom: 0 !important;
                    &:hover {
                      background-color: #fff;
                    }
                  }
                }
              }
            }
          }
        }
        > .__vuescroll.hasVBar {
          width: 100% !important;
          > .__panel > .__view > .v-data-table {
            width: 100% !important;
          }
          >.__rail-is-vertical {
            right: 3px !important;
          }
        }
      }
      .v-input--radio-group.v-input--radio-group--row {
        .v-input__slot {
          margin-bottom: 0;
        }
        .v-radio {
          margin-right: 100px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
</style>
