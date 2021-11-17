<template>
  <v-container class="catalog-container">
  </v-container>
</template>

<script>
export default {
  name: 'UrlMvTest',
  props: {
  },
  mounted () {
    this.gotoClickTest()
  },
  methods: {
    gotoClickTest: function () {
      var anchor = document.createElement('a')
      anchor.setAttribute('href', 'http://172.23.248.202:3501')
      anchor.setAttribute('target', 'blank')
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)

      this.$router.go(-1)
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
