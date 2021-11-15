<template>
  <v-app>
    <!-- <router-view :key="$route.fullPath" /> -->
    <router-view />
  </v-app>
</template>

<script>
import { getPortalPolicy } from '@/api/home'

export default {
  name: 'App',
  data () {
    return {
    }
  },
  created () {
    this.getPortalPolicy()
  },
  mounted () {
  },
  methods: {
    getPortalPolicy () {
      getPortalPolicy().then(
        response => {
          this.$store.commit('PPOLICY', response.data.result.portalPolicy)
        }
      )
    }
  },
  computed: {
  }
}
</script>
