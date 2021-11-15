import Vue from 'vue'
import VueRouter from 'vue-router'

/**********************************************/
import AppLayout from '@/components/admin/AppLayout'
import NotLayout from '@/components/admin/NotLayout'
import lazyLoading from './lazyLoading'
import { param, deparam } from '@/plugins/querystring'

import store from '@/store'
import { getMenuListById } from '@/api/menu'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'AppLayout',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Index',
        redirect: to => {
          if (to.query && to.query.r) {
            return { name: to.query.r }
          }
          return { name: 'Main', query: { t: new Date().getTime() }, params: { home: true } }
        }
      },
      {
        path: '',
        name: 'Main',
        component: lazyLoading('main/MainView')
      },
      { // AI 컨시어지 처리이력
        path: 'aiConcierg/history',
        name: 'ListAiConciergeView',
        component: lazyLoading('shinhan/aiConcierge/ListAiConciergeView')
      },
      { // AI 솔루션별 사용이력
        path: 'solutionHistory/solutionHistory',
        name: 'ListSolutionView',
        component: lazyLoading('shinhan/solutionHistory/ListSolutionView')
      },
      { // AI 솔루션별 사용량 집계
        path: 'solutionHistory/',
        name: 'SolutionStatisticView',
        component: lazyLoading('shinhan/solutionHistory/SolutionStatisticView')
      },
      { // 불완전판매방지 기간별 집계
        path: 'icc/iccStatiatics',
        name: 'IccStatiaticsView',
        component: lazyLoading('shinhan/icc/IccStatiaticsView')
      },
      { // AI 컨시어지 기간별 집계
        path: 'aiConcierg/aiStatistic',
        name: 'AiConciergeStatisticView',
        component: lazyLoading('shinhan/aiConcierge/AiConciergeStatisticView')
      },
      { // 콜봇 기간별 집계
        path: 'callBot/statistic',
        name: 'CallBotStatiaticsView',
        component: lazyLoading('shinhan/callBot/CallBotStatiaticsView')
      },
      { // AI 컨시어지 대시보드
        path: 'aiConcierge/dashboard',
        name: 'AiConciergeDashboardView',
        component: lazyLoading('shinhan/aiConcierge/AiConciergeDashboardView')
      },
      { // 불완전판매 방지 대시보드
        path: 'icc/dashboard',
        name: 'IccDashboardView',
        component: lazyLoading('shinhan/icc/IccDashboardView')
      },
      { // 콜봇 대시보드
        path: 'callBot/dashboard',
        name: 'CallBotDashboardView',
        component: lazyLoading('shinhan/callBot/CallBotDashboardView')
      },
      { // 네이버 테스트 페이지 이동
        path: 'urlMove',
        name: 'UrlMvTest',
        component: lazyLoading('shinhan/urlMv/UrlMvTest')
      },
      { // DB 검색
        path: 'dbSearchView',
        name: 'DbSearchView',
        component: lazyLoading('shinhan/dbSearch/DbSearchView')
      },
      { // sso 사용 승인 관리
        path: 'ssoUseApprovalReq',
        name: 'ListUseApprovalReqView',
        component: lazyLoading('shinhan/sso/ListUseApprovalReqView')
      },
      {
        path: 'dashboard',
        name: 'DashboardView',
        component: lazyLoading('main/DashboardView')
      },
      { // 0.1. 이용중인 서비스
        path: 'catalog/use',
        name: 'ListUseCatalogView',
        component: lazyLoading('catalog/ListUseCatalogView')
      },
      { // 1.1. 상담원 모니터링
        path: 'call/stat',
        name: 'CallStatView',
        component: lazyLoading('call/CallStatView')
      },
      { // 1.1. 인바운드 모니터링
        path: 'call/istat',
        name: 'InboundCallStatView',
        component: lazyLoading('call/InboundCallStatView')
      },
      { // 1.1. 아웃바운드 모니터링
        path: 'call/ostat',
        name: 'OutboundCallStatView',
        component: lazyLoading('call/OutboundCallStatView')
      },
      { // 1.2. 상담 이력
        path: 'counsel/inboundCall',
        name: 'ListInboundCallView',
        component: lazyLoading('counsel/ListInboundCallView')
      },
      { // 1.2. 아웃바운드 상담 이력
        path: 'counsel/outboundCall',
        name: 'ListOutboundCallView',
        component: lazyLoading('counsel/ListOutboundCallView')
      },
      { // 1.1.1. 인공인간 상담원 모니터링
        path: 'call/aiConciergStat',
        name: 'AiConciergCallStatView',
        component: lazyLoading('call/AiConciergCallStatView')
      },
      { // 1.1.2. 불완전판매 상담원 모니터링
        path: 'call/iccStat',
        name: 'IccCallStatView',
        component: lazyLoading('call/IccCallStatView')
      },
      { // 1.3. System 상담 이력
        path: 'counsel/systemCall',
        name: 'ListSystemCallView',
        component: lazyLoading('counsel/ListSystemCallView')
      },
      { // 1.4. 모의상담
        path: 'call/mock',
        name: 'CallMockView',
        component: lazyLoading('call/CallMockView')
      },
      { // 2.1. 초기인사멘트 관리
        path: 'ment/greeting',
        name: 'GreetingMentView',
        component: lazyLoading('ment/GreetingMentView')
      },
      { // 2.2. 상황별 멘트 관리
        path: 'ment/situation',
        name: 'SituationMentView',
        component: lazyLoading('ment/SituationMentView')
      },
      { // 2.3. 상황별 예외기준
        path: 'ment/except',
        name: 'SituationExceptBaseView',
        component: lazyLoading('ment/SituationExceptBaseView')
      },
      { // 2.4. 캠페인관리
        path: 'campaign/list',
        name: 'ListCampaignView',
        component: lazyLoading('campaign/ListCampaignView')
      },
      { // 2.4. 캠페인관리(등록)
        path: 'campaign/create',
        name: 'CreateCampaignView',
        component: lazyLoading('campaign/CreateCampaignView')
      },
      { // 2.4. 캠페인관리(수정)
        path: 'campaign/update/:campaignId',
        name: 'UpdateCampaignView',
        props: true,
        component: lazyLoading('campaign/UpdateCampaignView')
      },
      { // 2.5. 휴일관리
        path: 'holiday/list',
        name: 'ListHolidayView',
        component: lazyLoading('holiday/ListHolidayView')
      },
      { // 2.6. 공지사항(게시판) 관리
        path: 'notice/list',
        name: 'ListNoticeView',
        component: lazyLoading('notice/ListNoticeView')
      },
      { // 3.1. 사용자관리
        path: 'user/list',
        name: 'ListUserView',
        component: lazyLoading('user/ListUserView')
      },
      { // 3.1.1. 사용자관리(등록)
        path: 'user/create',
        name: 'CreateUserView',
        component: lazyLoading('user/CreateUserView')
      },
      { // 3.1.2. 사용자관리(수정)
        path: 'user/update/:userId',
        name: 'UpdateUserView',
        component: lazyLoading('user/UpdateUserView')
      },
      { // 3.1.3 개인정보 접근로그 조회
        path: 'userAuthHistory/list',
        name: 'ListUserAuthHistoryView',
        component: lazyLoading('user/ListUserAuthHistoryView')
      },
      { // 3.1.4 시스템 접속로그 조회
        path: 'userConnLogHistory/list',
        name: 'ListUserConnLogView',
        component: lazyLoading('user/ListUserConnLogView')
      },
      { // 3.1.2. 상담원 관리
        path: 'counselor/list',
        name: 'ListCounselorView',
        component: lazyLoading('counselor/ListCounselorView')
      },
      { // 3.1.5. 콜그룹 관리
        path: 'callGroup/list',
        name: 'ListCallGroupView',
        component: lazyLoading('counselor/ListCallGroupView')
      },
      { // 3.2. 공통코드 관리
        path: 'code/list',
        name: 'ListCmnCodeView',
        component: lazyLoading('cmnCode/ListCmnCodeView')
      },
      { // 3.3. 배치 관리
        path: 'batch/list',
        name: 'ListBatchView',
        component: lazyLoading('batch/ListBatchView')
      },
      { // 3.4. 메뉴관리
        path: 'menu/list',
        name: 'ListMenuView',
        component: lazyLoading('menu/ListMenuView')
      },
      { // 3.5. 테넌트관리
        path: 'tenant/list',
        name: 'ListTenantView',
        component: lazyLoading('tenant/ListTenantView')
      },
      { // 3.6. IP대역관리
        path: 'ipBand/list',
        name: 'ListIpBandView',
        component: lazyLoading('ipBand/ListIpBandView')
      },
      { // 3.7. 시나리오관리
        path: 'scenario/list',
        name: 'ListScenarioView',
        component: lazyLoading('scenario/ListScenarioView')
      },
      { // 3.7. 시나리오관리
        path: 'scategory/list',
        name: 'ListScenarioCategoryView',
        component: lazyLoading('scategory/ListScenarioCategoryView')
      },
      { // 3.8. 챗봇관리
        path: 'chatbot/list',
        name: 'ListChatbotView',
        component: lazyLoading('chatbot/ListChatbotView')
      },
      { // 3.8. STT관리
        path: 'stt/list',
        name: 'ListSttView',
        component: lazyLoading('stt/ListSttView')
      },
      { // 3.8. TTS관리
        path: 'tts/list',
        name: 'ListTtsView',
        component: lazyLoading('tts/ListTtsView')
      },
      { // 3.9. 약관관리
        path: 'terms/list',
        name: 'ListTermsView',
        component: lazyLoading('terms/ListTermsView')
      },
      { // 3.10. 사전관리
        path: 'dictionary/list',
        name: 'ListDictionaryView',
        component: lazyLoading('dictionary/ListDictionaryView')
      },
      { // 3.10.1. 서비스관리
        path: 'catalog/list',
        name: 'ListCatalogView',
        component: lazyLoading('catalog/ListCatalogView')
      },
      { // 3.10.2. 서비스관리(등록)
        path: 'catalog/create',
        name: 'CreateCatalogView',
        component: lazyLoading('catalog/CreateCatalogView')
      },
      { // 3.10.3. 서비스관리(수정)
        path: 'catalog/update/:serviceId',
        name: 'UpdateCatalogView',
        component: lazyLoading('catalog/UpdateCatalogView')
      },
      { // 3.10.1 API 관리
        path: 'apiinf/list',
        name: 'ListApiView',
        component: lazyLoading('inf/ListApiView')
      },
      { // 3.10.2. API 관리(등록)
        path: 'apiinf/create',
        name: 'CreateApiView',
        component: lazyLoading('inf/CreateApiView')
      },
      { // 3.10.3. API 관리(수정)
        path: 'apiinf/update/:apiId',
        name: 'UpdateApiView',
        component: lazyLoading('inf/UpdateApiView')
      },
      { // 3.10.4 API 연계 관리
        path: 'apiinf/callList',
        name: 'ListApiCallView',
        component: lazyLoading('inf/ListApiCallView')
      },
      { // 3.10.5 API 연계 이력
        path: 'apiinf/callHistoryList',
        name: 'ListApiCallHistoryView',
        component: lazyLoading('inf/ListApiCallHistoryView')
      },
      { // 3.10.6 API 라우팅 관리
        path: 'apiinf/routingList',
        name: 'ListApiRoutingView',
        component: lazyLoading('inf/ListApiRoutingView')
      },
      { // 3.11 TA관리
        path: 'ta/list',
        name: 'ListTaView',
        component: lazyLoading('ta/ListTaView')
      },
      { // 3.12 SYSTEM관리
        path: 'systemInfo/list',
        name: 'ListSystemInfoView',
        component: lazyLoading('systemInfo/ListSystemInfoView')
      },
      { // 4.1. 서비스 상태 모니터링
        path: 'service/monitoring',
        name: 'ServiceStatView',
        component: lazyLoading('service/ServiceStatView')
      },
      { // 4.2. 배치현황
        path: 'batch/log',
        name: 'ListBatchLogView',
        component: lazyLoading('batch/ListBatchLogView')
      },
      { // 5.1. 인바운드 상담 현황
        path: 'statistics/dailyStat',
        name: 'DailyStatisticsView',
        component: lazyLoading('statistics/DailyStatisticsView')
      },
      { // 5.2. 아웃바운드 상담 현황
        path: 'statistics/dailyOutboundStat',
        name: 'DailyOutboundStatisticsView',
        component: lazyLoading('statistics/DailyOutboundStatisticsView')
      },
      { // 5.3. 시나리오별 상담 현황
        path: 'statistics/dailyScenarioStat',
        name: 'DailyScenarioStatisticsView',
        component: lazyLoading('statistics/DailyScenarioStatisticsView')
      },
      { // 5.4. 의도추론 실패 상담 이력
        path: 'counsel/intentFail',
        name: 'ListIntentFailView',
        component: lazyLoading('counsel/ListIntentFailView')
      },
      { // 5.5. 사후 상담원 의도추론 실패 상담 이력
        path: 'counsel/afterIntentFail',
        name: 'ListAfterIntentFailView',
        component: lazyLoading('counsel/ListAfterIntentFailView')
      },
      { // 5.4. 의도추론 실패 상담 이력
        path: 'counsel/intentOutboundFail',
        name: 'ListOutboundIntentFailView',
        component: lazyLoading('counsel/ListOutboundIntentFailView')
      },
      { // 5.5. 인바운드 호전환 상담 이력
        path: 'counsel/transfer',
        name: 'ListTransferView',
        component: lazyLoading('counsel/ListTransferView')
      },
      { // 5.6. 아웃바운드 호전환 상담 이력
        path: 'counsel/transferOutbound',
        name: 'ListOutboundTransferView',
        component: lazyLoading('counsel/ListOutboundTransferView')
      },
      { // 5.7. 아웃바운드 단계별 현황
        path: 'counsel/processing',
        name: 'ListOutboundProcessingView',
        component: lazyLoading('counsel/ListOutboundProcessingView')
      },
      { // 5.8. 시스템 상담 현황
        path: 'statistics/dailySystemStat',
        name: 'DailySystemStatisticsView',
        component: lazyLoading('statistics/DailySystemStatisticsView')
      },
      { // 6.1. 월별 서비스 사용량
        path: 'usage/monthlyMetering',
        name: 'MonthlyUsageMeteringView',
        component: lazyLoading('usage/MonthlyUsageMeteringView')
      },
      { // 6.2. 일별 서비스 사용량
        path: 'usage/dailyMetering',
        name: 'DailyUsageMeteringView',
        component: lazyLoading('usage/DailyUsageMeteringView')
      },
      { // 장애관리
        path: 'incident/incident',
        name: 'IncidentMgmtView',
        component: lazyLoading('incident/IncidentMgmtView')
      },
      { // Query
        path: 'query/getQueryList',
        name: 'ExecuteQueryView',
        component: lazyLoading('query/ExecuteQueryView')
      }
    ]
  },
  {
    path: '/popup',
    name: 'NotLayout',
    component: NotLayout,
    children: [
      {
        path: 'counsel/history/:callId',
        name: 'PopupHistoryView',
        component: lazyLoading('counsel/PopupHistoryView')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: lazyLoading('Login')
  },
  {
    path: '/termsAgree',
    name: 'TermsAgree',
    component: lazyLoading('TermsAgree')
  },
  {
    path: '*',
    name: 'ErrorPage',
    component: lazyLoading('ErrorPage')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  parseQuery: function (query) {
    const obj = deparam(query ? query.substring(0, 1) === '?' ? query.substring(1) : query : '', true)
    return obj
  },
  stringifyQuery: function (query) {
    const qs = param(query, true)
    return qs ? `?${qs}` : ''
  }
})

const routerEach = (to, from, next) => {
  if (['Index', 'Login', 'ErrorPage', 'PopupHistoryView'].includes(to.name)) {
    next()
  } else if (!sessionStorage.accessToken) {
    sessionStorage.referer = location.href
    next(false)
    // GO TO Login
    router.push({ name: 'Login', query: { t: new Date().getTime() } })
  } else if (['TermsAgree'].includes(to.name)) {
    next()
  } else {
    getMenuListById(to.name === 'Main' ? 'MainView' : to.name, 'U').then(
      (response) => {
        if (response.data && response.data.status) {
          const status = response.data.status
          if (status === 200) {
            store.commit('MENU', response.data.result)
            const termsNotAgree = response.data.result.termsNotAgree
            if ((store.getters.getppolicy || {}).termsUse === 'true' && termsNotAgree === true) {
              // 약관동의하지 않으면
              sessionStorage.referer = location.href
              next(false)
              router.push({ name: 'TermsAgree', query: { t: new Date().getTime() } })
            } else {
              next()
            }
          } else if (status === 401) {
            delete sessionStorage.accessToken
            sessionStorage.referer = location.href
            next(false)
            // alert('해당 계정으로 다른 곳에서 로그인하였거나, 로그인정보가 만료되었습니다.')
            router.push({ name: 'Login', query: { t: new Date().getTime() } })
          } else {
            next(false)
            router.push({ name: 'ErrorPage', query: { t: new Date().getTime() } })
          }
        } else {
          next(false)
          router.push({ name: 'ErrorPage', query: { t: new Date().getTime() } })
        }
      },
      (error) => {
        if (error && error.response && error.response.status) {
          const status = error.response.status
          if (status === 401) {
            delete sessionStorage.accessToken
            sessionStorage.referer = location.href
            next(false)
            alert('해당 계정으로 다른 곳에서 로그인하였거나, 로그인정보가 만료되었습니다.')
            router.push({ name: 'Login', query: { t: new Date().getTime() } })
          } else {
            next(false)
            router.push({ name: 'ErrorPage', query: { t: new Date().getTime() } })
          }
        } else {
          next(false)
          router.push({ name: 'ErrorPage', query: { t: new Date().getTime() } })
        }
      }
    )
  }
}

router.beforeEach(routerEach)

export default router
