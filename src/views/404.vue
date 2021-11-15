
<template>
<v-container fill-height fluid class="error">
  <div class="error-container">
    <v-row>
      <h1 class="error-logo">
        <v-btn
          text
          class="btn-logo"
          :ripple="false"
          :to="{ name: 'Index' }"
        >
          <span class="text-logo">AI Connect</span>
        </v-btn>
      </h1>
    </v-row>
    <v-row align="center"
      justify="center"
    >
      <v-col>
        <v-card class="msg-box">
          <h2 class="msg-title">{{ $t('message.404Title')}}</h2>
          <div class="msg-content">
            {{ $t('message.404Message')}}
          </div>
          <v-card-actions class="submit-btns-group pr-0">
            <v-spacer></v-spacer>
            <v-btn
              :to="{ name: 'Index' }"
              class="btn-primary--text"
              text
              >메인화면 이동</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div class="bg-topleft"></div>
  <div class="bg-bottomright"></div>
</v-container>
</template>

<script>

export default {
  name: 'Error',
  components: {
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../assets/style/common.scss";
html, body, .v-application, .admin {
  min-width: 854px;
}
body {
  .theme--light.v-application {
    background: none;
  }
  .error {
    background: #1e5799 !important; /* Old browsers */
    background: -moz-radial-gradient(50% 50% at 50% 50%, rgba(240, 47, 82, 0.2) 0%, rgba(255, 255, 255, 0) 100%), -moz-linear-gradient(90deg, rgba(143, 147, 244, 0.5) 0%, rgba(181, 187, 235, 0.5) 35.42%), -moz-linear-gradient(left,  #1e5799 0%, #93d1ff 0%, #ffa6ad 100%) !important; /* FF3.6-15 */
    background: -webkit-radial-gradient(50% 50% at 50% 50%, rgba(240, 47, 82, 0.2) 0%, rgba(255, 255, 255, 0) 100%), -webkit-linear-gradient(90deg, rgba(143, 147, 244, 0.5) 0%, rgba(181, 187, 235, 0.5) 35.42%), -webkit-linear-gradient(left,  #1e5799 0%,#93d1ff 0%,#ffa6ad 100%) !important; /* Chrome10-25,Safari5.1-6 */
    background: radial-gradient(50% 50% at 50% 50%, rgba(240, 47, 82, 0.2) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(90deg, rgba(143, 147, 244, 0.5) 0%, rgba(181, 187, 235, 0.5) 35.42%, rgba(255, 163, 178, 0.5) 100%), linear-gradient(90deg, #93D1FF 0%, #FFA6AD 100%), #FFFFFF !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#93D1FF', endColorstr='#FFA6AD',GradientType=1 ) !important; /* IE6-9 */
    background-image: url('~@/assets/image/login-bg-lefttop.png'), url('~@/assets/image/login-bg-bottomright.png');
    background-repeat: no-repeat, no-repeat;
    background-position: bottom right, top left;
    .error-container {
      width: 640px;
      margin: auto;
      position: relative;
      z-index: 2;
      .error-logo-wrap {
        .btn-logo {
          display: block;
          width: auto;
          height: 59px !important;
          margin-bottom: 5px;
          padding: 0 0 0 97px;
          text-align: left;
          text-transform: none;
          box-shadow: none;
          background:transparent url('~@/assets/image/error-header-logo-02.png') left center no-repeat;
          .v-btn__content {
            display: block;
            flex: 0 1 auto;
          }
          .text-logo {
            display: block;
            padding-top: 20px;
            font-size: 26px;
            color: #fff;
            font-weight: 500;
            line-height: 1.1;
            letter-spacing: -0.7px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          }
        }
      }
      .msg-box {
        padding: 30px;
        clear: both;
        background: #ffffff;
        filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.11)),
                drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.08));
        border-radius: 8px;
        width: 100%;
        padding: 35px 30px 30px;
        h2.msg-title {
          font-size: 24px;
          letter-spacing: -0.4px;
        }
        .msg-content {
          font-size: 13px;
          line-height: 22px;
          letter-spacing: 0.1px;
          color: #56606b;
          padding: 24px 0;
          min-height: 120px;
        }
      }
    }
    .bg-topleft {
      width: 337px;
      height: 401px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      background:url('~@/assets/image/login-bg-lefttop.png') center center no-repeat;
    }
    .bg-bottomright {
      width: 494px;
      height: 710px;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 1;
      background:url('~@/assets/image/login-bg-bottomright.png') center center no-repeat;
    }
    .v-text-field {
      input {
        line-height: 22px;
      }
    }
    .v-list-item .v-list-item__title {
      line-height: 1.4;
    }
    .v-select__selection {
      line-height: 22px;
    }
  }
}
/* IE10+ hack */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  h2.msg-title {
    font-weight: 600;
  }
}
</style>
