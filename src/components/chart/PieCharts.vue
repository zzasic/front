<script>
import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    console.log(' chartData ' + JSON.stringify(this.chartData))
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    chartData () {
      this.$data._chart.update()
    }
  }
}
</script>

<style>
</style>
