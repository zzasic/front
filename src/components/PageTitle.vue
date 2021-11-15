<template>
  <v-card class="title-group"
    v-bind:class="{
      hasBottomLine: hasNoSearchGroup==true
    }"
  >
    <v-btn class="btn-historyback default"
      text
      :ripple="false"
      v-if="hasHistoryBackButton==true"
    ><span class="hide">back</span></v-btn>
    <v-card-title><h2>{{ title }}</h2></v-card-title>
    <v-card-subtitle><p>{{ subtitle }}</p></v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: 'PageTitle',
  props: ['title', 'subtitle', 'hasNoSearchGroup', 'hasHistoryBackButton'],
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../assets/style/common.scss';
  .process {
    .title-group.v-card {
      box-shadow: none;
      border: none;
      background: none;
      margin-bottom: 32px;
      &.hasBottomLine {
        border-bottom: 1px solid #DAE3ED;
        padding-bottom: 26px;
        margin-bottom: 32px;
      }
      h2 {
        color: $black;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: -0.4px;
        display: inline;
        padding-right: 15px;
      }
      p {
        display: inline;
        color: $gray700;
        font-size: 12px;
        letter-spacing: -0.05px;
      }
      div.v-card__title, .v-card__subtitle {
        display: inline;
        padding-left: 0;
      }
      &.hasline {
        padding-bottom: 20px;
        margin-bottom: 26px;
        border-bottom: 1px solid $gray200;
        border-radius: 0;
      }
    }
    .btn-historyback {
      background: url('~@/assets/image/ic_history_back.png') center center no-repeat;
      width: 16px;
      height: 16px;
      min-width: 16px;
      margin-right: 4px;
      margin-top: -10px;
    }
  }
</style>
