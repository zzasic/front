<template>
  <v-card class="dialog-batch">
    <v-card-title>
    <span class="headline">일괄 등록</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
      <v-container>
        <v-row>
          <v-col>
            <v-textarea
              class="default mt-0 pt-0 full"
              v-model="contents"
              :rules="[
                  v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '내용을 입력해주세요',
                  v => (!!v && v.length < 2000) || $t('message.inputMaxLength', ['2000'])
                ]"
              placeholder=" "
              solo
              dense
              no-resize
              rows="7"
              required
              hide-details="auto"
              oninput="javascript: if (this.value.length > 2000) this.value = this.value.substring(0, 2000)"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="submit-btns-group">
      <v-spacer></v-spacer>
      <v-btn color="btn-secondary" text @click="$emit('close-dialog')">{{ $t('button.cancel')}}</v-btn>
      <v-btn color="btn-primary" text @click="setBatch">{{ $t('button.save')}}</v-btn>
    </v-card-actions>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="$emit('close-dialog')"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: 'PopupBatchCampaignItemView',
  components: {},
  data () {
    return {
      valid: true,
      lazy: true,
      contents: ''
    }
  },
  created: function () {
  },
  mounted: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.v-textarea textarea {
  padding-left: 10px;
  font-size: 11px;
}
</style>
