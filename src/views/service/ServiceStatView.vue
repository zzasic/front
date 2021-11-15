
<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
        :hasNoSearchGroup="true"
      ></PageTitle>
      <v-container class="search-group" no-gutters fluid>
        <v-row no-gutters>
          <v-col cols="1">
            <v-text-field
              class="default"
              v-model="monitoringInterval"
              label="모니터링 갱신시간"
              placeholder=" "
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col class="text-left">
            <v-btn
              text
              color="btn-tertiary"
              class="btn-search no-icon"
              :ripple="false"
              @click="applyInterval"
            >적용</v-btn>
            <span class="m-count">※ 1초 후 Refresh</span>
          </v-col>
        </v-row>
      </v-container>
      <v-container no-gutters fluid>
        <ul class="system-monitoring">
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>Voice G/W #1</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>Voice G/W #2</strong></div>
            <!-- 장애시 iserror 클래스 추가 -->
            <div class="system-monitoring__status iserror">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">장애</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>STT</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>TTS</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>Chatbot</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>SOE #1</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>SOE #1</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>Kafka #1</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>Kafka #2</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__icon"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>통화 LOG</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__circle"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>통화 LOG</strong></div>
            <!-- 장애시 iserror 클래스 추가 -->
            <div class="system-monitoring__status iserror">
              <i class="system-monitoring__circle"></i>
              <div class="system-monitoring__text">장애</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>통화 LOG</strong></div>
            <div class="system-monitoring__status">
              <i class="system-monitoring__fill"></i>
              <div class="system-monitoring__text">정상</div>
            </div>
          </li>
          <li class="system-monitoring__item">
            <div class="system-monitoring__title"><strong>통화 LOG</strong></div>
            <!-- 장애시 iserror 클래스 추가 -->
            <div class="system-monitoring__status iserror">
              <i class="system-monitoring__fill"></i>
              <div class="system-monitoring__text">장애</div>
            </div>
          </li>
        </ul>
      </v-container>
    </vuescroll>
  </div>
</template>

<script>

export default {
  name: 'ServiceStatView',
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
      monitoringInterval: 10
    }
  },
  methods: {
    applyInterval () {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.search-group {
  .btn-search.no-icon {
    background-image: none;
    .v-btn__content {
      padding-left: 0;
    }
  }
  .m-count {
    position: relative;
    top: 15px;
    display: inline-block;
    margin-left: 20px;
    font-size: 12px;
    color: #E0205C;
  }
}
</style>
