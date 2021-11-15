
<template>
  <div class="admin">
    <Header :username="username"></Header>
    <LNB :MenuData="MenuData"></LNB>
    <div class="process">
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-tabs
        class="default no-animate"
        v-model="tabUser"
        :centered="false"
        :ripple="false"
        :grow="false"
        :vertical="vertical"
      >
        <v-tab
          :key="1"
          :href="`#tab-${1}`"
        >
          개별 등록
        </v-tab>
        <v-tab-item
          :key="1"
          :value="'tab-' + 1"
        >
          <PageSectionTitle
            :title="sectionTitle"
            :totalRows="totalRows"
            :subtitle="sectionSubTitle"
          >
          </PageSectionTitle>
          <v-container class="addUserDefaultData">
            <v-row>
              <v-col cols="1">
                <span class="label must">이름</span>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class="default mt-0 pt-0"
                  placeholder="김엘지"
                  hide-details="auto"
                  single-line
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="1">
                <span class="label must">이메일 ID</span>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class="default mt-0 pt-0"
                  placeholder="lg@lgcns.com"
                  hide-details="auto"
                  single-line
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="1">
                <span class="label must">회사</span>
              </v-col>
              <v-col cols="3">
                <v-select
                  class="default mt-0 pt-0"
                  :menu-props="{ offsetY: true }"
                  :items="company"
                  placeholder="LG CNS"
                  hide-details="auto"
                  single-line
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="1">
                <span class="label must">부서</span>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class="default mt-0 pt-0"
                  placeholder="UX/UI팀"
                  hide-details="auto"
                  single-line
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="1">
                <span class="label must">연락처</span>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class="default mt-0 pt-0"
                  placeholder="010-0000-0000"
                  hide-details="auto"
                  single-line
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
             <v-col cols="1">
                <span class="label must">사용자 유형</span>
              </v-col>
              <v-col cols="3">
                <v-select
                  class="default mt-0 pt-0"
                  :menu-props="{ offsetY: true }"
                  placeholder="서비스 사용자(General User)"
                  :items="user"
                  hide-details="auto"
                  single-line
                  @change="changeUserType($event)"
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="1">
                <span class="label must">언어</span>
              </v-col>
              <v-col cols="3">
                <v-select
                  class="default mt-0 pt-0"
                  :menu-props="{ offsetY: true }"
                  placeholder="국문"
                  :items="language"
                  hide-details="auto"
                  single-line
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="1">
                <span class="label must">국가 코드</span>
              </v-col>
              <v-col cols="3">
                <v-select
                  class="default mt-0 pt-0"
                  :menu-props="{ offsetY: true }"
                  placeholder="대한민국"
                  :items="country"
                  hide-details="auto"
                  single-line
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
             <v-col cols="1">
                <span class="label must">사용 여부</span>
              </v-col>
              <v-col cols="3">
                <v-radio-group v-model="radios" :mandatory="false" hide-details="auto" class="mt-0 pt-0" row>
                  <v-radio label="사용" value="radio-1"></v-radio>
                  <v-radio label="미사용" value="radio-2"></v-radio>
                </v-radio-group>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-container>
          <div v-if="userTypeUser">
            <PageSectionTitle
              :title="sectionTitle2"
              :totalRows="totalRows2"
              :subtitle="sectionSubTitle2"
            >
            </PageSectionTitle>
            <v-card class="data-grid-wrap default has-scroll">
              <v-data-table
                v-model="selectedContract"
                :headers="headersContract"
                :items="itemsContract"
                :fixed-header="true"
                hide-default-footer
                show-select
                no-data-text="검색결과가 존재하지 않습니다."
                loading-text="데이터를 불러오는 중 입니다."
              ></v-data-table>
            </v-card>
            <v-card-actions class="submit-btns-group">
              <v-spacer></v-spacer>
              <v-btn color="btn-secondary" text @click="test()">취소</v-btn>
                <v-btn color="btn-primary" text @click="test()">저장</v-btn>
            </v-card-actions>
          </div>
          <v-container class="transaction" v-if="userTypeAdmin">
            <v-row>
              <v-col cols="3" class="pr-2">
                <!-- 운영자 권한 그룹 -->
                <PageSectionTitle
                  :title="sectionTitle3"
                  :totalRows="totalRows3"
                  :subtitle="null"
                ></PageSectionTitle>
                <div class="btn-group align-right">
                  <v-text-field
                    class="default search pr-0"
                    v-model="search"
                    placeholder="검색어를 입력하세요"
                    hide-details="auto"
                  ></v-text-field>
                </div>
                <div class="list type-group">
                  <ul>
                    <li
                      v-for="item in adminPermitGroup"
                      v-bind:key="item"
                      @click="selectAdminGroupListitem(item.index)"
                      v-bind:class="{ selected:item.selected }"
                    >
                      <v-row>
                        <v-col cols="2" class="text-center group-check">
                          <v-checkbox :ripple="false" hide-details="auto"></v-checkbox>
                        </v-col>
                        <v-col cols="10" class="group-title">
                          {{ item.title }}
                        </v-col>
                      </v-row>
                    </li>
                  </ul>
                </div>
              </v-col>
              <v-col cols="9" class="pl-2 pr-0">
                <PageSectionTitle
                  :title="sectionTitle4"
                  :totalRows="totalRows4"
                  :subtitle="null"
                ></PageSectionTitle>
                <div class="btn-group align-right">
                  <v-text-field
                    class="default search pr-0"
                    v-model="search"
                    placeholder="검색어를 입력하세요"
                    hide-details="auto"
                  ></v-text-field>
                </div>
                <div class="list type-user">
                  <ul>
                    <li
                      v-for="item in totalServices"
                      v-bind:key="item"
                    >
                      <v-row>
                        <v-col cols="4">
                          {{item.servicename }} <span v-if="item.showLabel"> (계약 명)</span>
                        </v-col>
                        <v-col cols="4">
                          {{ item.period }} <span v-if="item.showLabel"> (계약기간)</span>
                        </v-col>
                        <v-col cols="4" class="text-center">
                          {{ item.servicetype }} <span v-if="item.showLabel"> (이용 서비스)</span>
                        </v-col>
                      </v-row>
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>
            <v-card-actions class="submit-btns-group">
              <v-spacer></v-spacer>
              <v-btn color="btn-secondary" text @click="test()">전체삭제</v-btn>
              <v-btn color="btn-secondary" text @click="test()">취소</v-btn>
              <v-btn color="btn-primary" text @click="test()">저장</v-btn>
            </v-card-actions>
          </v-container>
        </v-tab-item>
        <v-tab
          :key="2"
          :href="`#tab-${2}`"
        >
          일괄 업로드
        </v-tab>

        <v-tab-item
          :key="2"
          :value="'tab-' + 2"
        >
          <v-container class="batchUpload">
            <v-row>
              <v-col cols="1">
                <span class="label must">회사</span>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class="default mt-0 pt-0"
                  label="abc@lgcns.com"
                  hide-details="auto"
                  single-line
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="1">
                <span class="label must">파일</span>
              </v-col>
              <v-col cols="4">
                <div class="dragdropFileUpload">
                  <input type="file" class="input-file" @change="onFileChangeToBeLabeling($event)" />
                  <div class="label-dragdrop">{{ filenameStatusToBeLabeling }}</div>
                  <div class="btn-psusedo">파일 선택</div>
                  템플릿 다운로드
                </div>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <div class="uploaded-files">
                <ul>
                  <li
                    v-for="item in files"
                    v-bind:key="item"
                    class="one-file"
                  >
                    <strong class="name">{{ item.filename }}</strong>
                    <span class="size">{{ item.label }} {{ item.filesize }} bytes</span>
                    <v-btn text :ripple="false" class="btn-trash"><span class="hide">지우기</span></v-btn>
                  </li>
                </ul>
              </div>
            </v-row>
            <v-card-actions class="submit-btns-group">
              <v-spacer></v-spacer>
              <v-btn color="btn-secondary" text @click="test()">취소</v-btn>
              <v-btn color="btn-primary" text @click="test()">저장</v-btn>
            </v-card-actions>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingUserMgmt',
  components: {
  },
  data () {
    return {
      // 파일 업로드 필드에 텍스트 상태
      filenameStatusToBeLabeling: 'Drag & Drop',
      // 셀렉트 박스 더미값들
      user: ['서비스 사용자 (General User)', '서비스 운영자(Admin User)'],
      company: ['LG CNS', '국세청', '한국공항공사'],
      language: ['국문', 'English'],
      country: ['대한민국', '미국'],
      // 사용자 유형
      userTypeUser: true,
      userTypeAdmin: true,
      // 이전 계약 정보 데이터
      selectedContract: [],
      // 파일 목록
      // 파일 목록 샘플
      files: [
        {
          filename: 'Intent_Upload_Sample_File.json',
          filesize: 489
        },
        {
          filename: 'Intent_Upload_Sample_File.json',
          filesize: 489
        },
        {
          filename: 'Intent_Upload_Sample_File.json',
          filesize: 489
        }
      ],
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
        },
        {
          name: 'AI 비전 판정서비스',
          period: '2020-01-10 ~ 2020-02-20',
          service: '제조 비전 검사',
          align: 'start'
        },
        {
          name: '금융 챗봇 데모 시스템 구축(POC)',
          period: '2020-01-10 ~ 2020-02-20',
          service: '음성 챗봇',
          align: 'start'
        },
        {
          name: 'LG CNS AI 언어',
          period: '2020-01-10 ~ 2020-02-20',
          service: '챗봇',
          align: 'start'
        }
      ],
      // 헤더와 유닛메뉴
      username: '김연아',
      // 페이지 타이틀과 디스크립션
      pageTitle: '사용자 신규 등록',
      pageDescription: '',
      // 다이내믹 LNB 데이터 생성
      MenuData: [
        {
          text: '사용자 관리',
          link: 'SettingUserMgmt',
          selected: true,
          index: 1
        },
        {
          text: '운영자 권한 그룹 관리',
          link: 'SettingAdminPermissionMgmt',
          selected: false,
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
          selected: false
        }
      ],
      // 총 건수
      totalServices: [
        {
          index: 1,
          servicename: 'LG전자 DT 기반 혁신 Task',
          period: '2019.01.02~2019.12.31',
          servicetype: '챗봇',
          showLabel: true
        },
        {
          index: 2,
          servicename: 'AI 비전 파주 판정서비스',
          period: '2019.01.02~2019.12.31',
          servicetype: '제조 비전 검사',
          showLabel: false
        },
        {
          index: 3,
          servicename: '금융 챗봇 데모 시스템 구축(POC)',
          period: '2019.01.02~2019.12.31',
          servicetype: '음성 챗봇',
          showLabel: false
        }
      ],
      // 페이지 서브 타이틀
      sectionTitle: '기본 정보',
      totalRows: null,
      sectionSubTitle: '',
      sectionTitle2: '계약 정보',
      totalRows2: 3,
      sectionSubTitle2: '',
      sectionTitle3: '운영자 권한 그룹',
      totalRows3: 6,
      sectionSubTitle3: '',
      sectionTitle4: '총 건수',
      totalRows4: 3,
      sectionSubTitle4: ''
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
      this.sectionTitleVisionGroup = this.adminPermitGroup[index - 1].title
    },
    changeUserType (event) {
      // var usertype = event.target.value
    },
    onFileChangeToBeLabeling (event) {
      var fileData = event.target.files[0]
      this.filenameStatusToBeLabeling = fileData.name
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
