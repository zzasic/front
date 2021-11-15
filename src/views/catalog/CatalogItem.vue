<template>
  <v-container class="catalog-container">
    <div class="catalog-item"
      v-for="(item, idx) in catalogItems"
      v-bind:key="idx"
      v-bind:style="{ backgroundImage: 'url(' + item.image + ')' }"
      @click="gotoClick(item)"
    >
      <h4>
        <span
          class="icon-type chat"
        >
          <span class="hide">타입</span>
        </span>
        {{ item.title }}
        <span class="icon-new" v-if="item.isNew==!null"><span class="hide">New</span></span>
      </h4>
      <div class="catalog-item-content">
        <p class="multi-ellipsis">{{ item.serviceDesc }}</p>
        <v-btn text small :ripple="false" @click="gotoClick(item)">{{ $t('label.goto') }} ></v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'CatalogItem',
  props: {
    // 서비스
    catalogItems: Array
  },
  methods: {
    gotoClick: function (item) {
      if (item && item.serviceUrl) {
        // 챗봇
        const agent = navigator.userAgent.toLowerCase()
        if ((navigator.appName === 'Netscape' && agent.indexOf('trident') !== -1) || (agent.indexOf('msie') !== -1)) {
          // ie일 경우
          alert('Chatbot서비스는 Chrome에 최적화되어 있습니다.\nChrome 브라우저를 사용해주시기 바랍니다.')
          return
        }
        // console.log(item)
        var anchor = document.createElement('a')
        anchor.setAttribute('href', `${item.serviceUrl}${sessionStorage.accessToken}`)
        anchor.setAttribute('target', item.serviceId)
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
      } else {
        alert(this.$t('message.soon'))
      }
    }
  },
  computed: {
  },
  data () {
    return {
    }
  }
}
</script>
