<template>
<div class="LNB">
  <h2 class="hide">LNB</h2>
  <div class="menu-container">
    <vuescroll>
      <ul>
        <li
          v-for="(item, idx) in getmenu"
          v-bind:key="idx"
          v-bind:class="{ selected: item.selected === true, expanded: item.foldStatus === true, fold: item.foldStatus === false }"
        >
          <button @click.stop="routerLinkTo(item, item.subMenu && item.subMenu.length > 0)">
            <span>{{ item.text }}</span>
          </button>
          <ul>
            <li
              v-for="(subitem, sidx) in item.subMenu"
              v-bind:key="sidx"
              v-bind:class="{ selected: subitem.selected === true }"
              class="submenu"
            >
              <button @click.stop="routerLinkTo(subitem, subitem.subMenu && subitem.subMenu.length > 0)">
                <span>{{ subitem.text }}</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </vuescroll>
  </div>
  <div v-if="getppolicy.termsUse === 'true'" class="copyright">
    <v-btn text class="btn-reset" @click="terms" :ripple="false">
      {{ $t('login.privacyPolicy') }}

    </v-btn>
    <!-- <br />Copyright ©2020 LG CNS. All right reserved. -->
  </div>
  <div v-if="locale==='en'">
    <v-dialog
      v-model="dialogLookupTerms.popupTermsViewEn"
      width="700"
      persistent
    >
      <!-- ######### popup ######### -->
      <popup-terms-view-en
        @close-dialog="closeDialogTerms"
        v-scroll
        v-if="dialogLookupTerms.popupTermsViewEn"
      />
    </v-dialog>
  </div>
  <div v-else>
    <v-dialog
      v-model="dialogLookupTerms.popupTermsView"
      width="700"
      persistent
    >
      <!-- ######### popup ######### -->
      <popup-terms-view
        @close-dialog="closeDialogTerms"
        v-scroll
        v-if="dialogLookupTerms.popupTermsView"
      />
    </v-dialog>
  </div>

</div>
</template>

<script>
import popupTermsView from '@/views/PopupTermsView'
import popupTermsViewEn from '@/views/PopupTermsViewEn'

export default {
  name: 'LNB',
  components: {
    popupTermsView,
    popupTermsViewEn
  },
  props: {
    // 메뉴 정보
  },
  created () {
  },
  mounted () {
    this.dialogLookupTerms.popupTermsView = false
    this.dialogLookupTerms.popupTermsViewEn = false
  },
  updated () {
    this.locale = window.localStorage.localeCode
  },
  computed: {
    getppolicy: function () {
      return this.$store.getters.getppolicy || {}
    },
    getmenu: function () {
      return this.$store.getters.getmenu
    }
  },
  data () {
    return {
      MenuData: [],
      dialogLookupTerms: {
        popupTermsView: false,
        popupTermsViewEn: false
      },
      locale: ''
    }
  },
  methods: {
    terms () {
      this.dialogLookupTerms.popupTermsViewEn = true
      this.dialogLookupTerms.popupTermsView = true
    },
    closeDialogTerms: function () {
      this.dialogLookupTerms.popupTermsViewEn = false
      this.dialogLookupTerms.popupTermsView = false
    },
    routerLinkTo: function (item, hasSubmenu) {
      if (hasSubmenu === true) {
        item.foldStatus = !item.foldStatus
      } else {
        this.$router.push({ name: item.link, query: { t: new Date().getTime() } })
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import '../assets/style/common.scss';
    .LNB {
      width: 222px;
      // float: left;
      position:fixed;
      padding-top: 30px;
      box-sizing: border-box;
      height: 100vh;
      //max-height: calc(100% - 0);
      top: 53px;
      border-right: 1px solid #DAE3ED;
      .menu-container {
        width: 100%;
        height: calc(100% - 110px);
        overflow: hidden;
        display: inline-block;
        .__vuescroll.hasVBar {
          width: calc(100% + 5px) !important;
          > .__panel {
            > .__view > ul  {
              width: calc(100% - 5px) !important;
            }
          }
        }
      }
      li {
        display: block;
        min-height: 42px;
        width: 100%;
        position: relative;
        button {
          display: block;
          height: 42px;
          text-align: left;
          box-sizing: border-box;
          padding-left: 16px;
          width: 100%;
          outline: 0 none;
          position: relative;
          span {
            color: $gray900;
            font-size: 14px;
            position: absolute;
            top: 11px;
            left: 16px;
          }
          &:hover {
            background-color: #F6F6FD; // kbk
          }
        }
        &.selected {
          background-color: #fff;
          button {
            border-left: 4px solid #A8ABF0;;
            height: 42px;
            background: #F6F6FD;
            span {
              font-weight: bold;
              left: 12px;
            }
          }
          li {
            border-left: none;
            background-color: #fff;
            button {
              padding-left: 36px;
              span {
                left: 36px !important;
                font-weight: normal !important;
              }
            }
            &.selected {
              button {
                border-left: 4px solid #A8ABF0 !important;
                background: #F6F6FD !important;
                span {
                  left: 28px !important;
                }
              }
            }
          }
        }
        .submenu {
          button {
            padding-left: 36px;
            border-left: none !important;
            background-color: #fff !important;
            /* kbk
            &::before {
              content: '';
              background: url('~@/assets/image/ic_lnb_dot.png') center center no-repeat;
              width: 8px;
              height: 26px;
              display: inline-block;
              margin-left: -13px;
            }
            */
            &:hover {
              background: #F6F6FD !important;
            }
            span {
              left: 36px !important;
            }
          }
          &.selected {
            button {
              border-left: 4px solid #A8ABF0 !important;
              background: #F6F6FD !important;
              &::before {
                margin-left: -16px;
              }
              span {
                left: 32px !important;
              }
            }
          }
        }
        // kbk
        &.fold {
          > button {
            background-image: url('~@/assets/image/ic_lnb_plus.png');
            background-repeat: no-repeat;
            background-position: left 204px top 50%;
          }
          > ul {
            display: none;
          }
        }
        // kbk
        &.expanded {
          > button {
            background-image: url('~@/assets/image/ic_lnb_minus.png');
            background-repeat: no-repeat;
            background-position: left 204px top 50%;
          }
          > ul {
            display: block;
          }
        }
      }
      a {
        text-decoration: none;
      }
      .btn-reset {
        height: auto;
        color: #56606B;
        font-size: 12px;
        text-decoration: underline;
        text-transform: capitalize;
        letter-spacing: 0;
        padding: 0;
      }
      .copyright {
        font-weight: normal;
        font-size: 11px;
        line-height: 17px;
        letter-spacing: 0.15px;
        color: #8996A3;
        position: absolute;
        bottom: 70px;
        left: 16px;
        z-index: 3;
        .btn-reset {
          padding-left: 0;
        }
      }
    }
    /* IE Hack */
    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
      .LNB .menu-container .__vuescroll.hasVBar > .__panel > .__view > ul {
        width: calc(100% - 18px) !important;
      }
      .LNB {
        li.selected button span {
          font-weight: 500;
        }
        .copyright {
          font-weight: 200;
        }
      }
    }
</style>
