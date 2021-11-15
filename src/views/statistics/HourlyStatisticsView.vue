
<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
        :hasNoSearchGroup="true"
      ></PageTitle>
    </vuescroll>
  </div>
</template>

<script>

export default {
  name: 'HourlyStatisticsView',
  components: {
  },
  created: function () {
  },
  mounted: function () {
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    }
  },
  data: function () {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
