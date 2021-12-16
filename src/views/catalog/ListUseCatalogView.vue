<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
        :hasNoSearchGroup="true"
      ></PageTitle>
      <CatalogItem
        v-if="(applicationItems ? applicationItems : []).length > 0"
        :catalogItems="applicationItems"
      ></CatalogItem>
    </vuescroll>
  </div>
</template>

<script>
import { getUseCatalogList } from '@/api/catalog/'
import CatalogItem from '@/views/catalog/CatalogItem'

export default {
  name: 'ListUseCatalogView',
  components: {
    CatalogItem
  },
  created () {
  },
  mounted () {
    this.getUseCatalogList()
  },
  data () {
    return {
      // 서브 타이틀 데이터
      // 카탈로그 아이템 - application 서비스
      applicationItems: []
    }
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    }
  },
  methods: {
    getUseCatalogList: function () {
      getUseCatalogList().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            for (const appCatalog of response.data.result.catalogList) {
              // sessionStorage에 존재하는지 확인
              if (sessionStorage.systemIds.indexOf('AICC') !== -1 || sessionStorage.systemIds.indexOf(appCatalog.serviceId.substr(0, 3)) !== -1) {
                appCatalog.title = appCatalog.serviceNm
                appCatalog.isNew = false
                appCatalog.image = require('@/assets/image/' + String(appCatalog.iconUrl))
                this.applicationItems.push(appCatalog)
              }
            }
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
<style lang="scss">

</style>
