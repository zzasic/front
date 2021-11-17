<template>
  <div class="header">
    <h1>
      <button class="btn-logo" @click="goMain">
        <span style="cursor: pointer" class="name"><span>AI Connect</span></span>
      </button>
    </h1>
    <div class="unit">
      <button class="btn-notice" @click.stop="noticeBtn">
        <span class="hide">알림</span>
      </button>
      <v-dialog
        v-model="dialog"
        persistent
        width="840"
        scrollable
        hide-overlay
        content-class="posCustom"
      >
        <PopupListNoticeView
          @popupAction="popupNoticeAction"
          v-if="popup.listNoticeView === true"
          />
        <PopupReadNoticeView
          @popupAction="popupNoticeAction"
          :pnIdx="popup.pnIdx"
          :noticeList="popup.noticeList"
          v-if="popup.readNoticeView === true && popup.pnIdx !== null"
          />
      </v-dialog>
      <button class="btn-setting" v-if="false" @click="settingIconClick" v-show="showNhide === false">
        <span class="hide">설정</span>
      </button>
        <v-menu offset-y>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip slot="activator" bottom >
              <template v-slot:activator="{ on: tooltip }">
                <button slot="activator" class="btn-member" dark v-on="{ ...tooltip, ...menu }">
                  <span class="hide">{{ username }} 로그인</span>
                </button>
              </template>
              <span class="bottom">{{ username }}<span class="label-nim"></span></span>
            </v-tooltip>
          </template>
          <v-card>
          <div class="popupmenu-member-name">
             <span class="label-user">{{ username }}<span class="label-nim"></span></span>
             <button class="btn-menu-close"><span class="hide">닫기</span></button>
          </div>
          <v-divider></v-divider>
          <v-list class="popupmenu-listitem-member-setting">
            <v-list-item @click="userIconClick">
              <v-list-item-title>{{ $t('pageInfo.pageTitle101')}}</v-list-item-title>
            </v-list-item>
            <!-- <v-list-item @click="passwordChgClick">
              <v-list-item-title>{{ $t('pageInfo.pageTitle102')}}</v-list-item-title>
            </v-list-item> -->
            <v-list-item @click="userLogOutClick">
              <v-list-item-title>{{ $t('label.logout')}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
        <!-- popup start -->
        <v-dialog
          v-model="dialogLookupUserInfo.popupUpdateUserInfoView"
          width="490"
          persistent
          scrollable
        >
        <!-- ######### popup ######### -->
          <popup-update-user-info-view
            @close-dialog="closeDialogUserInfo"
            v-if="dialogLookupUserInfo.popupUpdateUserInfoView"
          />
        </v-dialog>
        <v-dialog
          v-model="dialogLookupPassword.popupUpdatePasswordView"
          width="490"
          persistent
        >
        <!-- ######### popup ######### -->
          <popup-update-password-view
            @close-dialog="closeDialogPassword"
            v-if="dialogLookupPassword.popupUpdatePasswordView"
          />
        </v-dialog>
        <!-- popup end -->
    </div>
  </div>
</template>

<script>
// import axios from 'axios'

import PopupListNoticeView from '@/views/notice/PopupListNoticeView'
import PopupReadNoticeView from '@/views/notice/PopupReadNoticeView'
import popupUpdateUserInfoView from '@/views/user/PopupUpdateUserInfoView'
import popupUpdatePasswordView from '@/views/user/PopupUpdatePasswordView'
import deleteStorage from '../scripts/shinhan/deleteStorage.js'
import {
  reqUserLogOut
} from '../api/user'

export default {
  name: 'Header',
  components: {
    PopupListNoticeView,
    PopupReadNoticeView,
    popupUpdateUserInfoView,
    popupUpdatePasswordView
  },
  props: {
  },
  computed: {
    dialog: function () {
      return (this.popup.listNoticeView === true || this.popup.readNoticeView === true)
    },
    showNhide: function () {
      // console.log('sessionStorage.userAuthCode : ', sessionStorage.userAuthCode)
      return sessionStorage.userAuthCode !== 'SAU'
    },
    username: function () {
      // console.log('sessionStorage.userName : ', sessionStorage.userName)
      return sessionStorage.userName
    }
  },
  data () {
    return {
      /* popup start */
      dialogLookupUserInfo: {
        popupUpdateUserInfoView: false
      },
      dialogLookupPassword: {
        popupUpdatePasswordView: false
      },
      /* popup end */
      show: false,
      popup: {
        listNoticeView: false,
        readNoticeView: false,
        pnIdx: null,
        noticeList: []
      }
    }
  },
  mounted () {
    // console.log('Header mounted...', this.username, this.showNhide)
  },
  updated () {
    // console.log('Header updated...')
  },
  methods: {
    /* popup start */
    closeDialogUserInfo: function () {
      this.dialogLookupUserInfo.popupUpdateUserInfoView = false
    },
    closeDialogPassword: function () {
      this.dialogLookupPassword.popupUpdatePasswordView = false
    },
    /* popup end */
    userIconClick () {
      this.dialogLookupUserInfo.popupUpdateUserInfoView = true
    },
    passwordChgClick () {
      this.dialogLookupPassword.popupUpdatePasswordView = true
    },
    settingIconClick () {
      this.$router.push({ name: 'ListUserView', query: { t: new Date().getTime() } })
    },
    userLogOutClick () {
      reqUserLogOut().then(
        response => {
          // axios.defaults.headers.common.Authorization = undefined

          // delete sessionStorage.accessToken
          // delete sessionStorage.userId
          // delete sessionStorage.userEmail
          // delete sessionStorage.userName
          // delete sessionStorage.userAuthCode
          // delete sessionStorage.userDeptName
          // delete sessionStorage.tenantId
          /* 프로그램내 사용 세션 삭제 - start */
          deleteStorage.removeStorage()
          /* 프로그램내 사용 세션 삭제 - end */
          this.$store.commit('LOGOUT')
          this.$router.push({ name: 'Login', query: { t: new Date().getTime() } })
        }
      )
    },
    goMain: function () {
      this.$router.push({ name: 'Index' })
    },
    popupNoticeAction: function (popup) {
      this.popup = popup
    },
    noticeBtn: function () {
      this.popupNoticeAction({
        listNoticeView: true,
        readNoticeView: false,
        pnIdx: null,
        noticeList: []
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../assets/style/common.scss';
  .header {
    background: #8f93f5; /* Old browsers */
    background: -moz-linear-gradient(left,  #8f93f5 0%, #FFA3B2 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left,  #8f93f5 0%, #FFA3B2 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right,  #8f93f5 0%, #FFA3B2 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8f93f5', endColorstr='#FFA3B2',GradientType=1 ); /* IE6-9 */
    height: 53px;
    color: $white;
    position: relative;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 3;
    h1 {
      background: url('../assets/image/favicon.png') left 0 top 13px no-repeat;
      padding-left: 25px;
      position: absolute;
      top: 12px;
      left: 20px;
      margin-top: -9px;
      .btn-logo {
        outline: 0 none;
        margin-top: -10px;
        .name {
          font-size : 18px;
          color: $white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          font-weight: bold;
          span {
            font-weight: normal;
          }
        }
        &:after {
          content: none;
          // width: 500px;
          // height: 52px;
          // position: absolute;
          // top: 0;
          // left: 142px;
          // background: url('../assets/image/bg-header.png') top -5px center no-repeat;
        }
      }
    }
    .unit {
      width: 126px;
      height: 24px;
      position: absolute;
      top: 16px;
      right: 32px;
      text-align: right;
      button {
        width: 24px;
        height: 24px;
        margin-left: 10px;
        outline: 0 none;
        opacity: 0.7;
        &.btn-notice {
          background: url('../assets/image/ic_bell.png') center center no-repeat;
        }
        &.btn-setting {
          background: url('../assets/image/ic_setting.png') center center no-repeat;
        }
        &.btn-member {
          background: url('../assets/image/ic_user.png') center center no-repeat;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .v-menu__content.theme--light {
    width: 200px;
    right: 10px !important;
    left: auto !important;
    top: 62px !important;
  }
  .popupmenu-member-name {
    height: 42px;
    padding: 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .label-user {
      font-size: 16px;
      color: $black;
      letter-spacing: -0.4px;
      font-weight: bold;
      .label-nim {
        color: #85909c;
        font-size: 14px;
        font-weight: normal;
        margin-left: 3px;
      }
    }
    .btn-menu-close {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 20px;
      top: 23px;
      background: url('../assets/image/ic_dialog_close.png') center center no-repeat;
      outline: 0 none;
    }
  }
  .popupmenu-listitem-member-setting {
    padding-bottom: 20px;
    .v-list-item__title {
      font-size: 14px;
      letter-spacing: 0.1px;
      color: #2c3238;
      height: 40px;
      cursor: pointer;
      padding: 11px 0 0 20px;
      &:hover {
        background: #BEF2FA;
      }
    }
  }
</style>
