<template>
  <component :is="component" v-if="component" />
</template>
<script>
export default {
  name: 'MainView',
  data () {
    return {
      component: null
    }
  },
  computed: {
    getmain: function () {
      return this.$store.getters.getmain
    }
    // loader () {
    //   return () => import('@/views/main/DashboardView')
    //   // return () => import('@/views/call/CallStatView')
    // }
  },
  mounted () {
    this.component = this.findCompoment(this.getmain.mainUrl)
    // this.loader()
    //   .then(() => {
    //     this.component = this.findCompoment('DashboardView')
    //   })
    //   .catch(() => {
    //     this.component = () => import('@/views/main/DashboardView')
    //   })
  },
  methods: {
    findCompoment (name) {
      return this.findEach(this.$router.options.routes, name)
    },
    findEach (routes, name) {
      for (const rt of routes) {
        if (rt.children && rt.children.length > 0) {
          const compo = this.findEach(rt.children, name)
          if (compo !== null) {
            return compo
          }
        }
        if (rt.name === name) {
          return rt.component
        }
      }
      return null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
