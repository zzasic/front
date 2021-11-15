<template>
  <div class="section-title-group">
    <h3>{{ title }}</h3>
    <strong v-if="totalRows != null" class="row-count">{{ totalRows }}</strong>
    <span class="sub-title">{{ subtitle }}</span>
  </div>
</template>

<script>
export default {
  name: 'PageSectionTitle',
  props: ['title', 'totalRows', 'subtitle'],
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../assets/style/common.scss';
  .section-title-group {
    clear: both;
    margin-bottom: 15px;
    vertical-align: middle;
    h3 {
      color: $black;
      font-size: 16px;
      font-weight: bold;
      display: inline;
      vertical-align: middle;
    }
    .row-count {
      font-size: 10px;
      color: $gray800;
      font-weight: bold;
      display: inline-block;
      background-color: $gray200;
      padding: 4px 7px;
      line-height: 1;
      height: 18px;
      min-width: 20px;
      text-align: center;
      vertical-align: middle;
      border-radius: 9px;
      margin-left: 6px;
      box-sizing: border-box;
      margin-top: 3px;
      font-family: 'Spoqa Han Sans';
    }
    .sub-title {
      font-size: 12px;
      color: #56606B;
      letter-spacing: 0.1px;
      vertical-align: middle;
      margin-left: 15px;
    }
  }
</style>
