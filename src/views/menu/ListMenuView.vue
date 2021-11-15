
<template>
  <div class="process">
    <vuescroll>
      <PageTitle
        :title="pageTitle"
        :subtitle="pageDescription"
      ></PageTitle>
      <v-container class="transaction wrapAdminPermitMgmt">
        <v-row>
          <v-col cols="4" class="menu-list" :style="{ height: boxHeightSize }">
            <v-card class="data-grid-wrap default has-scroll clickable mr-3">
              <v-card-title class="search-group">
                <v-text-field
                  class="default search"
                  v-model="search"
                  placeholder=" "
                  hide-details
                  clearable
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-container
                  id="scroll-target"
                  ref="scroll-target"
                  :style="{ height: innerHeightSize }"
                  class="menu-list-wrap">
                  <vuescroll>
                    <v-treeview
                      v-if="treeView"
                      :items="treeItems"
                      :item-key="'menuId'"
                      :item-text="'menuNm'"
                      :search="search"
                      :open.sync="opened"
                      :active="actived"
                      @update:active="updateActive"
                      activatable
                      return-object
                      dense
                    >
                      <template v-slot:label="{ item, open }">
                        <span
                          :draggable="item.menuLevel > 0"
                          @contextmenu="contextmenu($event, item)"
                          @mouseover="mouseover($event, item)"
                          @mouseout="mouseout($event)"
                          @mousedown="mousedown($event)"
                          @dragstart="dragstart($event, item)"
                          @dragend="dragend($event)"
                          @dragover="dragover($event, item)"
                          @drop="drop($event, item)"
                          @click="mouseclick($event, item)"
                        >
                          <v-icon v-if="item.lastMenuYn === 'Y'">
                            {{ open === true ? "mdi-menu-open" : "mdi-menu" }}
                          </v-icon>
                          <v-icon v-else-if="!item.children || item.children.length === 0">
                            {{ open === true ? "mdi-file-open" : "mdi-file" }}
                          </v-icon>
                          <v-icon v-else>
                            {{ open === true ? 'mdi-folder-open' : 'mdi-folder' }}
                          </v-icon>
                          {{ item.menuNm }} {{ item.useYn !== 'Y' ? '(미사용)' : '' }}
                        </span>
                      </template>
                      <template v-slot:append="{ item }">
                        <v-icon
                          x-small
                          dense
                          :class="getStatus(item).toLowerCase()"
                        >
                          {{ getStatus(item) }}
                        </v-icon>
                      </template>
                    </v-treeview>
                  </vuescroll>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-menu
                  v-model="showContextMenu"
                  :position-x="x"
                  :position-y="y"
                  absolute
                  offset-y
                >
                  <v-list
                    class="menu-default tree-menu"
                    dense>
                    <v-list-item :key="'upadd'" @click="upadd" v-if="srcItem.menuLevel > 0">
                      <v-list-item-title>[{{ srcItem.menuNm }}] 위에 추가</v-list-item-title>
                    </v-list-item>
                    <v-list-item :key="'downadd'" @click="downadd" v-if="srcItem.menuLevel > 0">
                      <v-list-item-title>[{{ srcItem.menuNm }}] 아래에 추가</v-list-item-title>
                    </v-list-item>
                    <v-list-item :key="'childadd'" @click="childadd" v-if="srcItem.menuLevel === 0 || srcItem.lastMenuYn === 'Y'">
                      <v-list-item-title>[{{ srcItem.menuNm }}] 하위에 추가</v-list-item-title>
                    </v-list-item>
                    <v-list-item :key="'thisdel'" @click="thisdel" v-if="srcItem.menuLevel > 0">
                      <v-list-item-title>[{{ srcItem.menuNm }}] 을(를) 삭제</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-menu
                  v-model="showDropMenu"
                  :position-x="x"
                  :position-y="y"
                  absolute
                  offset-y
                  v-if="srcItem !== dstItem && includeChild(srcItem, dstItem) === false"
                >
                  <v-list
                    dense>
                    <v-list-item :key="'upmove'" @click="upmove" v-if="srcItem.menuType !== dstItem.menuType || srcItem.menuLevel !== dstItem.menuLevel || srcItem.menuOrder + 1 !== dstItem.menuOrder">
                      <v-list-item-title>[{{ srcItem.menuNm }}] 을(를) [{{ dstItem.menuNm }}] 위로 이동</v-list-item-title>
                    </v-list-item>
                    <v-list-item :key="'downmove'" @click="downmove" v-if="srcItem.menuType !== dstItem.menuType || srcItem.menuLevel !== dstItem.menuLevel || srcItem.menuOrder !== dstItem.menuOrder + 1">
                      <v-list-item-title>[{{ srcItem.menuNm }}] 을(를) [{{ dstItem.menuNm }}] 아래로 이동</v-list-item-title>
                    </v-list-item>
                    <v-list-item :key="'childmove'" @click="childmove" v-if="(dstItem.menuLevel === 0 || dstItem.lastMenuYn === 'Y') && (srcItem.upperMenuId ? srcItem.upperMenuId : srcItem.menuType) !== dstItem.menuId">
                      <v-list-item-title>[{{ srcItem.menuNm }}] 을(를) [{{ dstItem.menuNm }}] 하위로 이동</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col class="menu-detail" :style="{ height: boxHeightSize }">
            <v-card class="data-grid-wrap default has-scroll clickable">
              <div class="no-msg" v-if="editItems.length == 0">수정할 메뉴를 선택해주세요</div>
              <v-card-title>
                <v-tabs
                  v-if="editItems.length > 0"
                  class="default no-animate"
                  v-model="editItemId"
                >
                  <v-tab
                    v-for="(item, idx) in editItems"
                    :key="item.menuId"
                    :href="`#${item.menuId}`"
                  >
                    {{ item.menuNm }}
                    {{ getStatus(item, ['menuLevel', 'menuOrder', 'menuType', 'upperMenuId']) === 'New' ? '(신규)' : getStatus(item, ['menuLevel', 'menuOrder', 'menuType', 'upperMenuId']) === 'Upd' ? '(수정)' : '' }}
                    <v-spacer></v-spacer>
                    <v-btn
                      right
                      icon
                      x-small
                      v-if="getStatus(item, ['menuLevel', 'menuOrder', 'menuType', 'upperMenuId']) === 'Upd'"
                      @click.stop="resetTabs($event, idx)"
                    >
                      <v-icon right x-small>mdi-backup-restore</v-icon>
                    </v-btn>
                    <v-btn
                      right
                      icon
                      x-small
                      v-else-if="getStatus(item, ['menuLevel', 'menuOrder', 'menuType', 'upperMenuId']) === 'New'"
                      @click.stop="deleteTabs($event, idx)"
                    >
                      <v-icon right x-small>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                      right
                      icon
                      x-small
                      v-else
                      @click.stop="closeTabs($event, idx)"
                    >
                      <v-icon right x-small>mdi-close</v-icon>
                    </v-btn>
                  </v-tab>
                </v-tabs>
              </v-card-title>
              <v-card-text>
                <v-tabs-items
                  v-if="editItems.length > 0"
                  class="default"
                  v-model="editItemId">
                  <v-tab-item
                    v-for="(item, idx) in editItems"
                    :key="item.menuId"
                    :value="`${item.menuId}`"
                    reverse-transition="true"
                    transition="true"
                  >
                    <v-form
                      :ref="`form${idx}`"
                      v-model="valid"
                      :lazy-validation="lazy"
                    >
                    <v-container
                        id="scroll-target1"
                        ref="scroll-target1"
                        :style="{ height: innerHeightSize }"
                        class="menu-detail-wrap">
                        <vuescroll>
                          <v-row v-if="getStatus(item) !== 'New'">
                            <v-col cols="2">
                              <span class="label">메뉴 ID</span>
                            </v-col>
                            <v-col cols="4">
                              <v-text-field
                                class="default mt-0 pt-0"
                                v-model="item.menuId"
                                placeholder=" "
                                clearable
                                hide-details="auto"
                                disabled
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-row v-if="langs && langs.length > 1">
                                <v-col cols="2">
                                  <span class="label">언어</span>
                                </v-col>
                                <v-col cols="4">
                                  <v-select
                                    class="default mt-0 pt-0"
                                    :menu-props="{ offsetY: true }"
                                    :value="'KO'"
                                    :items="langs"
                                    :rules="[v => !!v || '언어를 선택해주세요']"
                                    :placeholder="item.lang ? undefined : '한국어'"
                                    clearable
                                    disabled
                                    required
                                    hide-details="auto"
                                  ></v-select>
                                </v-col>
                                <v-col>
                                  <div class="btn-group mt-0 pt-0">
                                    <v-btn class="btn-plus" @click.stop="langPlusBtn(item, -1)" :disabled="!langContentsPlusable(item)">
                                      <v-icon dark>mdi-plus</v-icon>
                                    </v-btn>
                                    <v-btn class="btn-minus" @click.stop="langMinusBtn(item, -1)" disabled>
                                      <v-icon dark>mdi-minus</v-icon>
                                    </v-btn>
                                  </div>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="2">
                                  <span class="label must">메뉴 이름</span>
                                </v-col>
                                <v-col cols="4">
                                  <v-text-field
                                    class="default mt-0 pt-0"
                                    v-model="item.menuNm"
                                    :rules="[v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '메뉴이름을 입력해주세요', v => (!!v && v.length < 20) || $t('message.inputMaxLength', ['20'])]"
                                    placeholder=" "
                                    clearable
                                    hide-details="auto"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                              <v-row class="mb-0">
                                <v-col cols="2">
                                  <span class="label">메뉴 설명</span>
                                </v-col>
                                <v-col cols="10">
                                  <v-text-field
                                    class="default mt-0 pt-0"
                                    v-model="item.menuDesc"
                                    :rules="[v => !v || v.length < 100 || $t('message.inputMaxLength', ['100'])]"
                                    placeholder=" "
                                    clearable
                                    hide-details="auto"
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row v-for="(menuLang, idx) in item.menuLangList" :key="idx">
                            <v-col v-if="langs && langs.some((lang) => lang.value === menuLang.lang)">
                              <v-row>
                                <v-col cols="2">
                                  <span class="label">언어</span>
                                </v-col>
                                <v-col cols="4">
                                  <v-select
                                    class="default mt-0 pt-0"
                                    :menu-props="{ offsetY: true }"
                                    v-model="menuLang.lang"
                                    :items="langList(item, idx)"
                                    :rules="[v => !!v || '언어를 선택해주세요']"
                                    :placeholder="menuLang.lang ? undefined : '선택'"
                                    clearable
                                    required
                                    hide-details="auto"
                                  ></v-select>
                                </v-col>
                                <v-col>
                                  <div class="btn-group mt-0 pt-0">
                                    <v-btn class="btn-plus" @click="langPlusBtn(item, idx)" :disabled="!langContentsPlusable(item)">
                                      <v-icon dark>mdi-plus</v-icon>
                                    </v-btn>
                                    <v-btn class="btn-minus" @click="langMinusBtn(item, idx)" :disabled="!langContentsMinusable(item)">
                                      <v-icon dark>mdi-minus</v-icon>
                                    </v-btn>
                                  </div>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="2">
                                  <span class="label must">메뉴 이름</span>
                                </v-col>
                                <v-col cols="4">
                                  <v-text-field
                                    class="default mt-0 pt-0"
                                    v-model="menuLang.menuNm"
                                    :rules="[v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '메뉴이름을 입력해주세요', v => (!!v && v.length < 20) || $t('message.inputMaxLength', ['20'])]"
                                    placeholder=" "
                                    clearable
                                    hide-details="auto"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                              <v-row class="mb-0">
                                <v-col cols="2">
                                  <span class="label">메뉴 설명</span>
                                </v-col>
                                <v-col cols="10">
                                  <v-text-field
                                    class="default mt-0 pt-0"
                                    v-model="menuLang.menuDesc"
                                    :rules="[v => !v || v.length < 100 || $t('message.inputMaxLength', ['100'])]"
                                    placeholder=" "
                                    clearable
                                    hide-details="auto"
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row v-if="item.menuId !== 'MN_000000'">
                            <v-col cols="2">
                              <span class="label">메뉴 URL</span>
                            </v-col>
                            <v-col cols="10">
                              <v-text-field
                                class="default mt-0 pt-0"
                                v-model="item.urlInfo"
                                :rules="[v => !v || v.length < 100 || $t('message.inputMaxLength', ['100'])]"
                                placeholder=" "
                                clearable
                                hide-details="auto"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="item.menuId !== 'MN_000000'">
                            <v-col cols="2" v-if="item.menuLevel < 3">
                              <span class="label">목록메뉴 여부</span>
                            </v-col>
                            <v-col cols="4" v-if="item.menuLevel < 3">
                              <v-radio-group
                                class="default mt-0 pt-0"
                                v-model="item.lastMenuYn"
                                :mandatory="false"
                                row
                                hide-details="auto"
                                required
                              >
                                <v-radio
                                  :ripple="false"
                                  v-for="(use, idx) in [{ text: '사용', value: 'Y' }, { text: '미사용', value: 'N' }]"
                                  :key="idx"
                                  :label="use.text"
                                  :value="use.value"
                                >
                                </v-radio>
                              </v-radio-group>
                            </v-col>
                            <v-col cols="2">
                              <span class="label">사용 여부</span>
                            </v-col>
                            <v-col cols="4">
                              <v-radio-group
                                class="default mt-0 pt-0"
                                v-model="item.useYn"
                                :mandatory="false"
                                row
                                hide-details="auto"
                                required
                              >
                                <v-radio
                                  :ripple="false"
                                  class="default mt-0 pt-0"
                                  v-for="(use, idx) in [{ text: '사용', value: 'Y' }, { text: '미사용', value: 'N' }]"
                                  :key="idx"
                                  :label="use.text"
                                  :value="use.value"
                                  :disabled="item.menuId === 'MN_000000'"
                                >
                                </v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row>
                          <v-row v-if="item.menuId !== 'MN_000000'">
                            <v-col cols="2">
                              <span class="label">시스템 접근 권한</span>
                            </v-col>
                            <v-col cols="10">
                              <v-card class="data-grid-wrap default mb-0">
                                <v-data-table
                                  :headers="systemAuthHeaders"
                                  :items="[item]"
                                  :item-key="'menuId'"
                                  hide-default-footer
                                >
                                  <template v-slot:item="props">
                                    <tr>
                                      <td v-for="(header, inx) in props.headers" :key="inx" class="text-center">
                                        <v-checkbox
                                          v-model="props.item.systemIdList"
                                          :value="header.value"
                                          :ripple="false"
                                          multiple
                                          hide-details
                                        >
                                        </v-checkbox>
                                      </td>
                                    </tr>
                                  </template>
                                </v-data-table>
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-row v-if="item.menuId !== 'MN_000000'">
                            <v-col cols="2">
                              <span class="label">접근 권한</span>
                            </v-col>
                            <v-col cols="10">
                              <v-card class="data-grid-wrap default mb-0">
                                <v-data-table
                                  :headers="userAuthHeader"
                                  :items="[item]"
                                  :item-key="'menuId'"
                                  hide-default-footer
                                >
                                <!-- :style="{ width: '22px', overflow: 'hidden', margin: 'auto' }" -->
                                  <template v-slot:item.sauUse="{ item }">
                                    <v-checkbox
                                      class="default mt-0 pt-0"
                                      dense
                                      hide-details
                                      :ripple="false"
                                      v-model="item.sauUse"
                                      value="Y"
                                      false-value="N">
                                    </v-checkbox>
                                  </template>
                                  <template v-slot:item.auUse="{ item }">
                                    <v-checkbox
                                      class="default mt-0 pt-0"
                                      dense
                                      hide-details
                                      :ripple="false"
                                      v-model="item.auUse"
                                      value="Y"
                                      false-value="N">
                                    </v-checkbox>
                                  </template>
                                  <template v-slot:item.cauUse="{ item }">
                                    <v-checkbox
                                      class="default mt-0 pt-0"
                                      dense
                                      hide-details
                                      :ripple="false"
                                      v-model="item.cauUse"
                                      value="Y"
                                      false-value="N">
                                    </v-checkbox>
                                  </template>
                                  <template v-slot:item.cuUse="{ item }">
                                    <v-checkbox
                                      class="default mt-0 pt-0"
                                      dense
                                      hide-details
                                      :ripple="false"
                                      v-model="item.cuUse"
                                      value="Y"
                                      false-value="N">
                                    </v-checkbox>
                                  </template>
                                </v-data-table>
                              </v-card>
                            </v-col>
                          </v-row>
                        </vuescroll>
                      </v-container>
                    </v-form>
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-actions class="submit-btns-group">
              <v-spacer></v-spacer>
              <v-btn color="btn-secondary" text @click.stop="cancelBtn">{{ $t('button.cancel')}}</v-btn>
              <v-btn color="btn-primary" text @click.stop="saveBtn">{{ $t('button.save')}}</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </vuescroll>
  </div>
</template>

<script>
import { getSearchCondition, getMenuList, batchMenuUpdate } from '@/api/menu'

export default {
  name: 'ListMenuView',
  components: {},
  created: function () {
    this.getSearchCondition()
    this.opened.push(this.rootItem)
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    editItemId: function (newVal, oldVal) {
      if (newVal) {
        const maxLevel = this.menuList.reduce((pre, menu) => Math.max(pre, menu.menuLevel), 0)
        this.actived = []
        let tgtVal = newVal
        for (let mx = 0; mx < maxLevel; mx++) {
          const obj = this.menuList.find((menu) => menu.menuId === tgtVal)
          if (!obj) {
            return
          }
          if (!this.opened.some((open) => open.menuId === obj.menuId)) {
            this.opened.push(obj)
          }
          if (this.actived.length === 0) {
            this.actived.push(obj)
          }
          if (obj.upperMenuId || obj.menuType) {
            tgtVal = obj.upperMenuId || obj.menuType
          }
        }
      }
    }
  },
  data: function () {
    return {
      boxHeightSize: (window.innerHeight - 227) + 'px',
      innerHeightSize: (window.innerHeight - 341) + 'px',
      valid: true,
      lazy: true,
      searchCondition: {
        itemsPerPage: 999999,
        page: 1
      },
      pagination: {
        loading: false
      },
      treeView: false,
      search: '',
      menuList: [],
      opened: [],
      actived: [],
      // 언어
      langs: [],
      // 시스템
      systems: [],
      rootItem: {
        menuId: 'U',
        menuNm: 'ROOT',
        menuLevel: 0,
        menuOrder: 1,
        menuType: 'U',
        useYn: 'Y'
      },
      items: [this.rootItem],
      delItems: [],
      editItemIds: [],
      editItemId: '',
      srcItem: {},
      dstItem: {},
      showContextMenu: false,
      showDropMenu: false,
      x: 0,
      y: 0,
      userAuthHeader: [
        { text: '시스템 관리자(SAU)', value: 'sauUse', align: 'center', class: 'text-center', sortable: false, width: '100px' },
        { text: '서비스 운영자(AU)', value: 'auUse', align: 'center', class: 'text-center', sortable: false, width: '100px' },
        { text: '고객 관리자(CAU)', value: 'cauUse', align: 'center', class: 'text-center', sortable: false, width: '100px' },
        { text: '고객 사용자(CU)', value: 'cuUse', align: 'center', class: 'text-center', sortable: false, width: '100px' }
      ]
    }
  },
  computed: {
    pageTitle: function () {
      return this.$store.getters.pageTitle
    },
    pageDescription: function () {
      return this.$store.getters.pageDescription
    },
    treeItems: function () {
      const items = [this.rootItem]
      if (this.menuList) {
        const menuMap = this.menuList.reduce((acc, menu) => {
          const upperMenuId = menu.upperMenuId || menu.menuType
          if (!acc[upperMenuId]) {
            acc[upperMenuId] = []
          }
          menu.menuOrder = acc[upperMenuId].length + 1
          acc[upperMenuId].push(menu)
          return acc
        }, {})
        const maxLevel = this.menuList.reduce((pre, menu) => Math.max(pre, menu.menuLevel), 0)
        for (let cy = 0; cy <= maxLevel; cy++) {
          for (const menu of this.menuList) {
            const menuId = menu.menuId
            if (menuMap[menuId]) {
              menu.children = menuMap[menuId]
            } else {
              delete menu.children
            }
          }
        }
        items[0].children = this.menuList.filter((menu) => menu.menuLevel === 1)
      }
      return items
    },
    editItems: function () {
      const edits = []
      for (const editItemId of this.editItemIds) {
        edits.push(this.menuList.find((menu) => menu.menuId === editItemId))
      }
      return edits
    },
    systemAuthHeaders: function () {
      const sah = []
      if (!this.systems || this.systems.length === 0) {
        return sah
      }
      for (const sys of this.systems) {
        sah.push({ text: sys.text, value: sys.value, align: 'center', class: 'text-center', sortable: false })
      }
      return sah
    }
  },
  methods: {
    // Drag And Drop + ContextMenu start
    mouseover: function (event, item) {
      event.preventDefault()
      event.target.style.cursor = 'pointer'
    },
    mouseout: function (event) {
      event.preventDefault()
      event.target.style.cursor = ''
    },
    mousedown: function (event) {
      this.showContextMenu = false
      this.showDropMenu = false
    },
    dragstart: function (event, item) {
      this.srcItem = item
      this.dstItem = {}
      event.target.style.opacity = 0.5
    },
    dragend: function (event) {
      event.target.style.opacity = ''
    },
    dragover: function (event, item) {
      event.preventDefault()
      if (item.status === 'Del') {
        event.target.style.cursor = 'not-allowed'
      }
    },
    drop: function (event, item) {
      event.preventDefault()
      this.dstItem = item
      this.x = event.clientX
      this.y = event.clientY
      this.$nextTick(() => {
        this.showDropMenu = true
      })
    },
    mouseclick: function (event, item) {
      event.preventDefault()
    },
    contextmenu: function (event, item) {
      event.preventDefault()
      this.srcItem = item
      this.dstItem = {}
      this.x = event.clientX
      this.y = event.clientY
      this.$nextTick(() => {
        this.showContextMenu = true
      })
    },
    // Drag And Drop + ContextMenu end
    handleResize () {
      this.boxHeightSize = (window.innerHeight - 227) + 'px'
      this.innerHeightSize = (window.innerHeight - 341) + 'px'
    },
    // 조회조건 조회
    getSearchCondition: function () {
      getSearchCondition().then(
        response => {
          const status = response.data.status
          if (status === 200) {
            this.langs = response.data.result.localeList // 언어
            this.systems = response.data.result.systemInfoList // 시스템
            this.getMenuList()
          }
        }
      )
    },
    // 메뉴관리목록 조회
    getMenuList: function () {
      // param setting
      this.treeView = false
      this.pagination.loading = true
      getMenuList(this.searchCondition).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            // 조회결과
            this.menuList = response.data.result.menuList
            this.menuList.forEach((menu) => {
              Object.assign(menu, {
                upperMenuId: menu.upperMenuId || '' // NULL 값 처리
              })
              menu.org = JSON.parse(JSON.stringify(menu))
            })
            this.menuList.sort((a, b) => {
              return a.menuType === b.menuType ? (a.menuLevel === b.menuLevel ? (a.menuOrder === b.menuOrder ? 0 : (a.menuOrder > b.menuOrder ? 1 : -1)) : (a.menuLevel > b.menuLevel ? 1 : -1)) : (a.menuType < b.menuType ? 1 : -1)
            })
          }
        }
      ).finally(() => {
        this.pagination.loading = false
        this.treeView = true
      })
    },
    getStatus: function (item, excludes) {
      // console.log(item)
      if (item.menuLevel === 0) {
        return ''
      } else if (item.status === 'New' || !item.org) {
        return 'New'
      } else {
        const org = item.org
        for (const key in item) {
          if (excludes && excludes.length > 0 && excludes.indexOf(key) > -1) {
            continue
          }
          if (['menuNm', 'menuLevel', 'menuOrder', 'menuDesc', 'menuType', 'upperMenuId', 'urlInfo', 'lastMenuYn', 'systemIds'].indexOf(key) > -1) {
            if (item[key] !== org[key]) {
              return 'Upd'
            }
          } else if (['useYn', 'cuUse', 'cauUse', 'auUse', 'sauUse'].indexOf(key) > -1) {
            if ((item[key] ? item[key] === 'Y' ? 'Y' : 'N' : 'N') !== (org[key] ? org[key] === 'Y' ? 'Y' : 'N' : 'N')) {
              return 'Upd'
            }
          }
        }
        const ml = item.menuLangList || []
        const ol = org.menuLangList || []
        if (ml.length !== ol.length) {
          return 'Upd'
        }
        for (const obj of ol) {
          let c = 0
          for (const mbj of ml) {
            if (obj.lang === mbj.lang && obj.menuNm === mbj.menuNm && obj.menuDesc === mbj.menuDesc) {
              c++
            }
          }
          if (c === 0) {
            return 'Upd'
          }
        }
        for (const mbj of ml) {
          let c = 0
          for (const obj of ol) {
            if (obj.lang === mbj.lang && obj.menuNm === mbj.menuNm && obj.menuDesc === mbj.menuDesc) {
              c++
            }
          }
          if (c === 0) {
            return 'Upd'
          }
        }
        const msl = item.systemIdList || []
        const osl = org.systemIdList || []
        if (msl.length !== osl.length) {
          return 'Upd'
        }
        for (const obj of osl) {
          let c = 0
          for (const mbj of msl) {
            if (obj === mbj) {
              c++
            }
          }
          if (c === 0) {
            return 'Upd'
          }
        }
        for (const mbj of msl) {
          let c = 0
          for (const obj of osl) {
            if (obj === mbj) {
              c++
            }
          }
          if (c === 0) {
            return 'Upd'
          }
        }
        return ''
      }
    },
    updateActive: function (actived) {
      if (actived && actived.length > 0 && ['U', 'A'].indexOf(actived[0].menuId) === -1) {
        if (this.editItemIds && this.editItemIds.length > 15 && !this.editItemIds.some((ei) => ei === actived[0].menuId)) {
          alert('한번에 작업할 수 있는 메뉴 수는 16개 까지 입니다.')
          return
        }
        const item = actived[0]
        if (this.editItemIds.indexOf(item.menuId) === -1) {
          this.editItemIds.push(item.menuId)
        }
        this.editItemId = item.menuId
      }
    },
    // 위에(이전에) 추가
    upadd: function () {
      if (this.editItemIds && this.editItemIds.length > 15) {
        alert('한번에 작업할 수 있는 메뉴 수는 16개 까지 입니다.')
        return
      }
      this.treeView = false
      const index = this.menuList.findIndex((menu) => menu.menuId === this.srcItem.menuId)
      const key = '' + new Date().getTime()
      const addMenu = {
        status: 'New',
        menuNm: '새 메뉴_' + key,
        menuDesc: '',
        lastMenuYn: this.srcItem.menuLevel < 3 ? 'Y' : 'N',
        menuLevel: this.srcItem.menuLevel,
        menuType: this.srcItem.menuType,
        menuId: 'NEW_' + key,
        useYn: 'N',
        cuUse: 'N',
        cauUse: 'N',
        auUse: 'N',
        sauUse: 'N',
        upperMenuId: this.srcItem.upperMenuId,
        menuLangList: [],
        systemIds: '',
        systemIdList: []
      }
      this.menuList.splice(index, 0, addMenu)
      this.editItemIds.push(addMenu.menuId)
      this.editItemId = 'NEW_' + key
      // this.tabChange()
      this.$nextTick(() => {
        this.treeView = true
      })
    },
    // 아래에(이후에) 추가
    downadd: function () {
      if (this.editItemIds && this.editItemIds.length > 15) {
        alert('한번에 작업할 수 있는 메뉴 수는 16개 까지 입니다.')
        return
      }
      this.treeView = false
      const index = this.menuList.findIndex((menu) => menu.menuId === this.srcItem.menuId)
      const key = '' + new Date().getTime()
      const addMenu = {
        status: 'New',
        menuNm: '새 메뉴_' + key,
        menuDesc: '',
        lastMenuYn: this.srcItem.menuLevel < 3 ? 'Y' : 'N',
        menuLevel: this.srcItem.menuLevel,
        menuType: this.srcItem.menuType,
        menuId: 'NEW_' + key,
        useYn: 'N',
        cuUse: 'N',
        cauUse: 'N',
        auUse: 'N',
        sauUse: 'N',
        upperMenuId: this.srcItem.upperMenuId,
        menuLangList: [],
        systemIds: '',
        systemIdList: []
      }
      this.menuList.splice(index + 1, 0, addMenu)
      this.editItemIds.push(addMenu.menuId)
      this.editItemId = 'NEW_' + key
      // this.tabChange()
      this.$nextTick(() => {
        this.treeView = true
      })
    },
    childadd: function () {
      if (this.editItemIds && this.editItemIds.length > 15) {
        alert('한번에 작업할 수 있는 메뉴 수는 16개 까지 입니다.')
        return
      }
      this.treeView = false
      const index = this.menuList.length - this.menuList.slice().reverse().findIndex((menu) => menu.upperMenuId === this.srcItem.menuId) - 1
      const key = '' + new Date().getTime()
      const addMenu = {
        status: 'New',
        menuNm: '새 메뉴_' + key,
        menuDesc: '',
        lastMenuYn: this.srcItem.menuLevel + 1 < 3 ? 'Y' : 'N',
        menuLevel: this.srcItem.menuLevel + 1,
        menuType: this.srcItem.menuType,
        menuId: 'NEW_' + key,
        useYn: 'N',
        cuUse: 'N',
        cauUse: 'N',
        auUse: 'N',
        sauUse: 'N',
        upperMenuId: this.srcItem.menuId,
        menuLangList: [],
        systemIds: '',
        systemIdList: []
      }
      this.menuList.splice(index + 1, 0, addMenu)
      this.editItemIds.push(addMenu.menuId)
      this.editItemId = 'NEW_' + key
      // this.tabChange()
      this.$nextTick(() => {
        this.treeView = true
      })
    },
    thisdel: function () {
      if (this.srcItem.children) {
        if (!confirm('해당 메뉴를 삭제시 하위에 설정된 메뉴가 모두 삭제가 됩니다. 삭제를 진행하시겠습니까?')) {
          return
        }
      }
      this.treeView = false
      const maxLevel = this.menuList.reduce((pre, menu) => Math.max(pre, menu.menuLevel), 0)
      const delMenuIdList = [this.srcItem.menuId]
      for (let cy = 0; cy <= maxLevel; cy++) {
        const delTempMenuList = this.menuList.filter((menu) => { return delMenuIdList.indexOf(menu.menuId) > -1 })
        for (const delTempMenu of delTempMenuList) {
          if (delTempMenu.children) {
            for (const childMenu of delTempMenu.children) {
              if (delMenuIdList.indexOf(childMenu.menuId) === -1) {
                delMenuIdList.push(childMenu.menuId)
              }
            }
          }
        }
      }
      // 삭제 대상 delMenuIdList
      for (const delMenuId of delMenuIdList) {
        const delIdx = this.menuList.findIndex((menu) => menu.menuId === delMenuId)
        const delEdIdx = this.editItemIds.findIndex((menuId) => menuId === delMenuId)
        this.delItems.push(...this.menuList.splice(delIdx, 1))
        this.editItemIds.splice(delEdIdx, 1)
      }
      this.$nextTick(() => {
        this.treeView = true
      })
    },
    // 위로 이동
    upmove: function () {
      this.treeView = false
      const fromIdx = this.menuList.findIndex((menu) => menu.menuId === this.srcItem.menuId)
      const cutItems = this.menuList.splice(fromIdx, 1)
      const toIdx = this.menuList.findIndex((menu) => menu.menuId === this.dstItem.menuId)
      Object.assign(cutItems[0], {
        lastMenuYn: this.dstItem.menuLevel < 3 ? 'Y' : 'N',
        menuLevel: this.dstItem.menuLevel,
        menuType: this.dstItem.menuType,
        upperMenuId: this.dstItem.upperMenuId
      })
      this.menuList.splice(toIdx, 0, cutItems[0])
      this.$nextTick(() => {
        this.treeView = true
      })
    },
    // 아래로 이동
    downmove: function () {
      this.treeView = false
      const fromIdx = this.menuList.findIndex((menu) => menu.menuId === this.srcItem.menuId)
      const cutItems = this.menuList.splice(fromIdx, 1)
      const toIdx = this.menuList.findIndex((menu) => menu.menuId === this.dstItem.menuId)
      Object.assign(cutItems[0], {
        lastMenuYn: this.dstItem.menuLevel < 3 ? 'Y' : 'N',
        menuLevel: this.dstItem.menuLevel,
        menuType: this.dstItem.menuType,
        upperMenuId: this.dstItem.upperMenuId
      })
      this.menuList.splice(toIdx + 1, 0, cutItems[0])
      this.$nextTick(() => {
        this.treeView = true
      })
    },
    // 하위로 이동
    childmove: function () {
      this.treeView = false
      const fromIdx = this.menuList.findIndex((menu) => menu.menuId === this.srcItem.menuId)
      const cutItems = this.menuList.splice(fromIdx, 1)
      const toIdx = this.menuList.length - this.menuList.slice().reverse().findIndex((menu) => menu.upperMenuId === this.dstItem.menuId) - 1
      Object.assign(cutItems[0], {
        lastMenuYn: this.dstItem.menuLevel + 1 < 3 ? 'Y' : 'N',
        menuLevel: this.dstItem.menuLevel + 1,
        menuType: this.dstItem.menuType,
        upperMenuId: this.dstItem.menuId
      })
      this.menuList.splice(toIdx + 1, 0, cutItems[0])
      this.$nextTick(() => {
        this.treeView = true
      })
    },
    includeChild: function (src, dst) {
      if (!src.children || src.children.length === 0) {
        return false
      }
      const ln = this.findIdx(src.children, dst)
      if (!ln || ln.length === 0) {
        return false
      }
      return true
    },
    resetTabs: function (event, idx) {
      event.preventDefault()
      if (!confirm('초기화 하시겠습니까?')) {
        return
      }
      if (this.editItems[idx] && this.editItems[idx].org) {
        this.editItems[idx].menuNm = this.editItems[idx].org.menuNm
        this.editItems[idx].menuDesc = this.editItems[idx].org.menuDesc
        this.editItems[idx].lastMenuYn = this.editItems[idx].org.lastMenuYn
        this.editItems[idx].useYn = this.editItems[idx].org.useYn
        this.editItems[idx].cuUse = this.editItems[idx].org.cuUse
        this.editItems[idx].cauUse = this.editItems[idx].org.cauUse
        this.editItems[idx].auUse = this.editItems[idx].org.auUse
        this.editItems[idx].sauUse = this.editItems[idx].org.sauUse
        this.editItems[idx].menuLangList = this.editItems[idx].org.menuLangList
        this.editItems[idx].systemIds = this.editItems[idx].org.systemIds
        this.editItems[idx].systemIdList = this.editItems[idx].org.systemIdList
      }
    },
    deleteTabs: function (event, idx) {
      event.preventDefault()
      if (!confirm('삭제 하시겠습니까?')) {
        return
      }
      this.srcItem = this.menuList.find((menu) => menu.menuId === this.editItemIds[idx])
      this.thisdel()
    },
    closeTabs: function (event, idx) {
      event.preventDefault()
      this.editItemIds.splice(idx, 1)
      this.actived = [] // updateactive 이벤트로 두번 눌러야 열리는 경우를 방지하기 위해
    },
    findIdx: function (items, item) {
      let ix4 = 0
      for (const x of items) {
        if (x.menuId === item.menuId) {
          return [ix4]
        } else if (x.children && x.children.length > 0) {
          const a = this.findIdx(x.children, item)
          if (a && a.length > 0) {
            return [ix4, ...a]
          }
        }
        ix4++
      }
      return []
    },
    // 언어목록
    langList: function (item, idx) {
      return this.langs.filter(ln => {
        return ln.value !== 'KO' && (!item.menuLangList || item.menuLangList.filter((nl, n) => {
          return n !== idx && ln.value === nl.lang
        }).length === 0)
      })
    },
    // 내용 추가
    langPlusBtn: function (item, idx) {
      if (!item.menuLangList) {
        item.menuLangList = []
      }
      const lng = this.langs.filter(ln => {
        return ln.value !== 'KO' && (item.menuLangList.filter((nl, n) => {
          return ln.value === nl.lang
        }).length === 0)
      })[0]
      if (lng) {
        item.menuLangList.splice((idx + 1), 0, {
          lang: lng.value,
          menuNm: '',
          menuDesc: ''
        })
      }
    },
    langContentsPlusable: function (item) {
      return !item.menuLangList || item.menuLangList.length < this.langs.length - 1
    },
    // 내용 삭제
    langMinusBtn: function (item, idx) {
      item.menuLangList.splice(idx, 1)
    },
    langContentsMinusable: function (item) {
      return item.menuLangList && item.menuLangList.length > 0
    },
    findEditItems: function (items, status) {
      const eItems = []
      for (const item of items) {
        if (this.getStatus(item) === status) {
          eItems.push(item)
        }
        if (item.children && item.children.length > 0) {
          const cItems = this.findEditItems(item.children, status)
          if (cItems && cItems.length > 0) {
            eItems.push(...cItems)
          }
        }
      }
      return eItems
    },
    saveBtn: function () {
      const delList = this.delItems
      const newList = this.findEditItems(this.menuList, 'New')
      const updList = this.findEditItems(this.menuList, 'Upd')
      if ((!delList || delList.length === 0) && (!newList || newList.length === 0) && (!updList || updList.length === 0)) {
        alert('수정/신규/삭제된 메뉴가 없습니다.')
        return
      }
      let validResult = true
      for (const ixp in this.editItems) {
        if (this.$refs[`form${ixp}`]) {
          const vx = this.$refs[`form${ixp}`][0].validate()
          if (validResult === true && vx === false) {
            this.editItemId = this.editItems[ixp].menuId
          }
          validResult = validResult && vx
        }
      }
      if (validResult === false) {
        return
      }
      let msg = (newList && newList.length > 0 ? ('신규 : ' + newList.length + ' 건\n') : '')
      msg += (updList && updList.length > 0 ? ('수정 : ' + updList.length + ' 건\n') : '')
      msg += (delList && delList.length > 0 ? ('삭제 : ' + delList.length + ' 건\n') : '')
      msg += '을 처리하시겠습니까?'
      if (!confirm(msg)) {
        return
      }
      const params = {
        delList: delList && delList.length > 0 ? delList : [],
        newList: newList && newList.length > 0 ? newList : [],
        updList: updList && updList.length > 0 ? updList : []
      }
      batchMenuUpdate(params).then(
        response => {
          const status = response.data.status
          if (status === 200) {
            alert('처리되었습니다')
            this.getMenuList()
            const newChages = response.data.result
            for (const newKey in newChages) {
              const idx = this.editItemIds.findIndex((ed) => ed === newKey)
              if (idx > -1) {
                this.editItemIds.splice(idx, 1, newChages[newKey])
              }
            }
          }
        }
      ).finally(() => {
      })
    }
  }
}
</script>

<style lang="scss">
  .transaction {
    &.wrapAdminPermitMgmt {
      .row {
        .row {
          padding: 9px 0 !important;
        }
        .data-grid-wrap {
          .search-group {
            .v-input {
              &.v-text-field.default {
                margin-left: 0px !important;
              }
            }
          }
        }
      }
    }
  }
</style>
