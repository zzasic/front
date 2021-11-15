<template>
  <router-view />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NotLayout',
  data () {
    return {
      opened: true
    }
  },
  created () {
    // console.log('Not Layout created...')
  },
  mounted () {
    // console.log('Not Layout mounted...')
  },
  beforeUpdate () {
    // console.log('Not Layout beforeUpdate...')
  },
  updated () {
    // console.log('Not Layout updated...')
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'isLoading'
    ])
  }
}
</script>
