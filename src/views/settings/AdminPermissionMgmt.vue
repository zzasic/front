
<template>
  <div class="admin">
    <Header :username="username"></Header>
    <LNB :MenuData="MenuData"></LNB>
    <div class="process">
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="transaction wrapAdminPermitMgmt">
        <v-row>
          <v-col cols="3">
            <PageSectionTitle
              :title="sectionTitleAdminGroup"
              :totalRows="totalRowsAdminGroup"
              :subtitle="sectionSubTitleAdminGroup"
            ></PageSectionTitle>
            <div class="btn-group align-right">
              <v-text-field
                class="default search pr-0"
                v-model="search"
                placeholder="검색어를 입력하세요"
                hide-details="auto"
              ></v-text-field>
              <v-btn
                class="btn-download default"
                text
              >
                <span class="hide">다운로드</span>
              </v-btn>
            </div>
            <div class="list type-group mb-4">
              <ul>
                <li
                  v-for="item in adminPermitGroup"
                  v-bind:key="item"
                  @click="selectAdminGroupListitem(item.index)"
                  v-bind:class="{ selected:item.selected }"
                >
                  <v-row>
                    <v-col cols="2" class="text-center group-check">
                      <v-checkbox :ripple="false" color="primary"></v-checkbox>
                    </v-col>
                    <v-col cols="10" class="group-title">
                      {{ item.title }}
                      <v-btn
                        class="btn-edit"
                        v-if="item.editable"
                        :ripple="false"
                        text
                      ><span class="hide">Edit</span></v-btn>
                    </v-col>
                  </v-row>
                </li>
              </ul>
            </div>
            <v-card-actions class="submit-btns-group">
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialogAddNewGroup"
                width="565"
                persistent
                scrollable
              >
                <template v-slot:activator="{ on }">
                  <v-btn color="btn-secondary" text v-on="on">신규</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">운영자 권한 그룹 신규 등록</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="3">
                        <span class="label must">권한 그룹 명</span>
                      </v-col>
                      <v-col cols="9">
                        <v-text-field
                          class="default mt-0 pt-0 pr-0"
                          hide-details="auto"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="submit-btns-group">
                    <v-spacer></v-spacer>
                    <v-btn color="btn-secondary" text @click="dialogAddNewGroup=false">취소</v-btn>
                    <v-btn color="btn-primary" text @click="dialogAddNewGroup=false">저장</v-btn>
                  </v-card-actions>
                  <v-btn
                    class="default dialogclose"
                    text
                    @click="dialogAddNewGroup = false"
                    :ripple="false"
                  >
                    <span class="hide">팝업 닫기</span>
                  </v-btn>
                </v-card>
              </v-dialog>
              <v-dialog
                v-model="dialogRemoveGroup"
                width="622"
                persistent
                scrollable
              >
                <template v-slot:activator="{ on }">
                  <v-btn color="btn-secondary" text v-on="on">삭제</v-btn>
                </template>
                <v-card>
                  <v-card-title class="small-title">
                    <span class="headline small">운영자 권한 그룹을 삭제하면 그룹에 속한 사용자와 계약정보도 모두 삭제됩니다. 정말 삭제 하시겠습니까?</span>
                  </v-card-title>
                  <v-card-actions class="submit-btns-group">
                    <v-spacer></v-spacer>
                    <v-btn color="btn-secondary" class="naked" :ripple="false" text @click="dialogRemoveGroup=false">취소</v-btn>
                    <v-btn color="btn-primary" class="naked" :ripple="false" text @click="dialogRemoveGroup=false">확인</v-btn>
                  </v-card-actions>
                  <v-btn
                    class="default dialogclose"
                    text
                    @click="dialogAddNewGroup = false"
                    :ripple="false"
                  >
                    <span class="hide">팝업 닫기</span>
                  </v-btn>
                </v-card>
              </v-dialog>
            </v-card-actions>
          </v-col>
          <v-col cols="3">
            <PageSectionTitle
              :title="sectionTitleUser"
              :totalRows="totalRowsUser"
              :subtitle="sectionSubTitleUser"
            ></PageSectionTitle>
            <div class="btn-group align-right">
              <v-text-field
                class="default search pr-0"
                v-model="search"
                placeholder="검색어를 입력하세요"
                hide-details="auto"
              ></v-text-field>
              <v-btn v-on="on" class="btn-plus">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
              <v-btn v-on="on" class="btn-minus">
                <v-icon dark>mdi-minus</v-icon>
              </v-btn>
            </div>
            <v-card class="data-grid-wrap default has-scroll mb-10">
              <v-data-table
                v-model="selectedUser"
                :headers="headersUser"
                :items="itemsUser"
                :fixed-header="true"
                hide-default-footer
                no-data-text="검색결과가 존재하지 않습니다."
                loading-text="데이터를 불러오는 중 입니다."
              ></v-data-table>
            </v-card>
            <v-card-actions class="submit-btns-group">
              <v-spacer></v-spacer>
              <v-btn color="btn-secondary" text @click="test()">취소</v-btn>
              <v-btn color="btn-primary" text @click="test()">저장</v-btn>
            </v-card-actions>
          </v-col>
          <v-col cols="6">
            <PageSectionTitle
              :title="sectionTitleContract"
              :totalRows="totalRowsContract"
              :subtitle="sectionSubTitleContract"
            ></PageSectionTitle>
            <div class="btn-group align-right">
              <v-text-field
                class="default search pr-0"
                v-model="search"
                placeholder="검색어를 입력하세요"
                hide-details="auto"
              ></v-text-field>
              <v-btn v-on="on" class="btn-plus">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
              <v-btn v-on="on" class="btn-minus">
                <v-icon dark>mdi-minus</v-icon>
              </v-btn>
            </div>
            <v-card class="data-grid-wrap default has-scroll mb-10">
              <v-data-table
                v-model="selectedContract"
                :headers="headersContract"
                :items="itemsContract"
                :fixed-header="true"
                hide-default-footer
                no-data-text="검색결과가 존재하지 않습니다."
                loading-text="데이터를 불러오는 중 입니다."
              ></v-data-table>
            </v-card>
            <v-card-actions class="submit-btns-group">
              <v-spacer></v-spacer>
              <v-btn color="btn-secondary" text @click="test()">취소</v-btn>
              <v-btn color="btn-primary" text @click="test()">저장</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingAdminPermissionMgmt',
  components: {
  },
  data () {
    return {
      // 다이얼로그 초기 세팅
      dialogAddNewGroup: false,
      dialogRemoveGroup: false,
      // 이전 계약 정보 데이터
      selectedUser: [],
      headersUser: [
        {
          text: '이름',
          value: 'name',
          align: 'center'
        },
        {
          text: '이메일',
          value: 'email',
          align: 'center'
        }
      ],
      itemsUser: [
        {
          name: '김연아',
          email: 'abcded@lgcns.com'
        },
        {
          name: '박태환',
          email: 'tae@lgcns.com'
        },
        {
          name: '손흥민',
          email: 'son@lgcns.com'
        },
        {
          name: '박지성',
          email: 'park@lgcns.com'
        },
        {
          name: '류현진',
          email: 'ryu@lgcns.com'
        }
      ],
      // 이전 계약 정보 데이터
      selectedContract: [],
      headersContract: [
        {
          text: '계약명',
          value: 'name',
          align: 'center'
        },
        {
          text: '계약기간',
          value: 'period',
          align: 'center'
        },
        {
          text: '이용 서비스',
          value: 'service',
          align: 'center'
        }
      ],
      itemsContract: [
        {
          name: 'LG CNS DT 기반 혁신 Task',
          period: '2020-01-10 ~ 2020-02-20',
          service: '챗봇',
          align: 'start'
        }
      ],
      // 헤더와 유닛메뉴
      username: '김연아',
      // 페이지 타이틀과 디스크립션
      pageTitle: '운영자 권한 그룹 관리',
      pageDescription: '',
      // 다이내믹 LNB 데이터 생성
      MenuData: [
        {
          text: '사용자 관리',
          link: 'SettingUserMgmt',
          selected: false,
          index: 1
        },
        {
          text: '운영자 권한 그룹 관리',
          link: 'SettingAdminPermissionMgmt',
          selected: true,
          index: 2
        },
        {
          text: 'API 관리',
          link: 'SettingAPIMgmt',
          selected: false,
          index: 3
        },
        {
          text: '공통 코드 관리',
          link: 'SettingCommonCodeMgmt',
          selected: false,
          index: 4
        },
        {
          text: '사전 관리',
          link: 'SettingDicMgmt',
          selected: false,
          index: 5
        },
        {
          text: '개인정보 활용 동의 약관 관리',
          link: 'SettingTermsPrivacy',
          selected: false,
          index: 6
        },
        {
          text: '운영자 접속 IP 대역 관리',
          link: 'SettingAdminIPMgmt',
          selected: false,
          index: 7
        },
        {
          text: '공지사항 관리',
          link: 'SettingNoticeMgmt',
          selected: false,
          index: 8
        }
      ],
      // 운영자 권한 그룹
      adminPermitGroup: [
        {
          index: 1,
          title: '제조 비전 운영자 그룹',
          selected: true
        },
        {
          index: 2,
          title: '물류 하차 화물 분류 운영자 그룹',
          selected: false
        },
        {
          index: 3,
          title: '보안 X-Ray 운영자 그룹',
          editable: true,
          selected: false
        },
        {
          index: 4,
          title: '챗봇 운영자 그룹',
          selected: false
        },
        {
          index: 5,
          title: 'AI 빅데이터 플랫폼팀 운영자 그룹',
          selected: false
        },
        {
          index: 6,
          title: '분석가 그룹',
          editable: true,
          selected: false
        }
      ],
      // 페이지 서브 타이틀
      sectionTitleAdminGroup: '운영자 권한 그룹',
      totalRowsAdminGroup: 3,
      sectionSubTitleAdminGroup: '',
      sectionTitleUser: '사용자',
      totalRowsUser: 4,
      sectionSubTitleUser: '',
      sectionTitleContract: '계약 정보',
      totalRowsContract: 1,
      sectionSubTitleContract: ''
    }
  },
  computed: {
  },
  methods: {
    selectAdminGroupListitem (index) {
      for (const item of this.adminPermitGroup) {
        item.selected = false
      }
      this.adminPermitGroup[index - 1].selected = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
