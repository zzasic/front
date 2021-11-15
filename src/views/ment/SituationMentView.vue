
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
              class="default search"
              :menu-props="{ offsetY: true }"
              v-model="searchForm.tenant"
              :items="cptdItemsTenantList"
              :label="$t('label.tenant')"
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
      <v-container class="tabContent" no-gutters fluid>
        <!-- v-container 높이 값 계산 삭제 :style="{ height: `${Math.ceil(codeTypeList.length / 2) * 200}px`, maxHeight: tabItemMaxHeight }"> -->
      <vuescroll
        :style="{ width: '100% !important'}"
      >
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
        <v-container class="mgmt-wrap" no-gutters fluid>
          <div
            class="half-list-row"
            v-for="tabb in codeTypeList" :key="tabb.value">
            <div
              v-for="(ment, idx) in getMentList(tabb.value)" :key="idx">
              <v-row>
                <v-col class="ment-label">
                  <span class="label">
                    {{ tabb.text }}
                    <v-btn v-if="getStatus(ment) === 'D' || getStatus(ment) === 'U'" text class="row-del" style="height: 100% !important" @click="rowRestore(ment)">
                      <i class="icon icon-lg-refresh"></i>
                      <span class="hide">행복원</span>
                    </v-btn>
                  </span>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="radio-use">
                  <v-radio-group
                    class="pt-0 mt-0"
                    v-model="ment.useYn"
                    row
                    v-on:change="changeStatus"
                  >
                    <v-radio
                      label="사용"
                      value="Y"
                      :ripple="false"
                    ></v-radio>
                    <v-radio
                      label="미사용"
                      value="N"
                      :ripple="false"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="ment.mentValue"
                    class="default pt-0 mt-0 pr-0"
                    hide-details="auto"
                    rows="4"
                    label=" "
                    placeholder="내용을 입력해 주세요"
                    :rules="[
                      v => ment.useYn !== 'Y' || (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '내용을 입력해주세요'
                    ]"
                  ></v-textarea>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-container>
      </v-form>
      </vuescroll>
      </v-container>
      <div class="btn-group align-right">
        <v-btn color="btn-primary" text @click="saveBtn()">저장</v-btn>
      </div>
    </vuescroll>
  </div>
</template>

<script>

import {
  getSearchCondition,
  selectMentList,
  updateMent
} from '../../api/ment'

export default {
  name: 'SituationMentView',
  components: {
  },
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
  data: function () {
    return {
      valid: true,
      lazy: true,
      tabItemMaxHeight: (window.innerHeight - 368) + 'px',
      codeType: 'MENT_TYPE',
      itemsTenantList: [],
      searchForm: {
        tenant: ''
      },
      codeTypeList: [],
      mentList: [],
      mentTemp: {
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
          this.searchForm.itemsTenantList = response.data.result.tenantList
          this.itemsTenantList = response.data.result.tenantList
          this.searchForm.tenant = this.itemsTenantList[0].value // 첫번째
          this.codeTypeList = response.data.result.codeTypeList
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
      if (ment.useYn !== ment.org.useYn || ment.mentValue !== ment.org.mentValue) {
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
          const tMentList = response.data.result.mentList || []
          // status 처리
          for (const ment of tMentList) {
            // console.log(ment)
            const orgMent = JSON.parse(JSON.stringify(ment))
            ment.org = orgMent
            ment._status = ''
          }
          this.mentList = response.data.result.mentList || []
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
        // this.pagination.loading = false
      })
    },
    handleResize () {
      this.tabItemMaxHeight = (window.innerHeight - 400) + 'px'
    },
    getMentList: function (mentCd) {
      const selectTenant = this.searchForm.tenant
      const ments = this.mentList.filter(m => {
        return m.mentCd === mentCd
      })
      if (ments && ments.length > 0) {
        return ments
      }
      const newMent = Object.assign({}, this.mentTemp, {
        mentCd: mentCd,
        tenantId: selectTenant
      })
      this.mentList.push(newMent)
      return this.mentList.filter(m => {
        return m.mentCd === mentCd
      })
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
    saveBtn () {
      const isvalid = this.$refs.form.validate()
      if (isvalid === false) {
        return
      }
      let count = 0
      for (const ment of this.mentList) {
        if (this.getStatus(ment)) {
          count++
        }
      }
      if (count === 0) {
        alert('신규로 추가하거나, 수정된 내용이 없습니다.')
        return
      }
      if (!confirm('저장하시겠습니까?')) {
        return
      }
      const gmentList = this.mentList
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
    },
    changeStatus () {
      this.$refs.form.validate()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
/* 상황별 멘트*/
.mgmt-wrap {
  &.container {
    display: flex;
    flex-wrap: wrap;
  }
  > div.half-list-row {
    position: relative;
    width: calc(50% - 4px);
    padding: 20px;
    border: 1px solid #DAE3ED;
    border-radius: 3px;
    background: #FFFFFF;
    &:nth-child(2n+2) {
      margin-left: 8px;
    }
    &:nth-child(n+3) {
      margin-top: 8px;
    }
    &:before {
      content: none;
      // display: inline-block;
      // width: 100%;
      // height: 100%;
      // position: absolute;
      // top: 0;
      // left: 0;
      // border-radius: 3px;
    }
    &:focus, &:hover, &:active {
      &::before {
        content: none;
        // border-style: solid;
        // border-image: linear-gradient(to right, #72c4ff 0%, #FFA3B2 100%);
        // border-image-slice: 1;
        // border-image-width: 1px;
        // border-radius: 3px;
      }
    }
    .ment-label {
      height: 32px;
      min-width: fit-content;
      .label {
        font-size: 14px;
        display: inline-block;
      }
    }
    .radio-use {
      min-width: fit-content;
      max-width: fit-content;
      white-space: nowrap;
      text-align: right;
      .v-input--radio-group {
        white-space: normal;
        display: inline-block;
        .v-input__slot {
          margin-bottom: 0;
        }
      }
    }
  }
}
.tabContent + .btn-group {
  margin: 20px 0 0;
}
</style>
