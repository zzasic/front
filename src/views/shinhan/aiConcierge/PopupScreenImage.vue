<template>
<div >
  <v-card>
    <v-card-title>
      <span class="headline">{{param.screenName}}</span>
    </v-card-title>
    <v-card-text>
      <v-card class="data-grid-wrap default clickable">
        <v-img
          :max-width="param.imgWidth * 0.8"
          :max-height="param.imgHeight * 0.8"
          :src="getIconImage(param.screenId)"
        ></v-img>
      </v-card>
    </v-card-text>
      <v-card-actions class="submit-btns-group">
        <v-spacer></v-spacer>
        <v-btn color="btn-secondary" text @click="confirmBtn">확인</v-btn>
      </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="closeBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</div>
</template>

<script>
export default {
  name: 'PopupScreenImage',
  props: ['param'],
  created () {
    this.isClose = true
  },
  mounted () {
  },
  destroyed () {
  },
  data () {
    return {
      isClose: false
    }
  },
  methods: {
    getIconImage: function (str) {
      return this.param.imgUrl + str + '.png'
      // return require('@/assets/image/' + str + '.png')
    },
    // 취소버튼
    closeBtn: function () {
      this.isClose = false
      this.$emit('popupAction', 'imagePopup')
    },
    confirmBtn: function () {
      this.isClose = false
      this.$emit('popupAction', 'imagePopup', this.selected)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
