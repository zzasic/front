<template>
  <v-card class="dialog-excelUpload">
    <v-card-title>
      <span class="headline">{{ parentTitle }} 일괄 등록</span>
    </v-card-title>
    <v-card-text>
      <v-tabs
        class="default no-animate"
        v-model="tabExcel"
        :centered="false"
        :ripple="false"
        :grow="false"
        :vertical="false"
        v-show="false"
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab
          :key="1"
          :href="`#tab-${1}`"
        >
          1단계
        </v-tab>
        <v-tab
          :key="2"
          :href="`#tab-${2}`"
        >
          2단계
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabExcel">
        <v-tab-item
          :key="1"
          :value="'tab-' + 1"
        >
          <v-container class="batchUpload">
            <v-row>
              <v-col cols="1">
                <span class="label must">파일</span>
              </v-col>
              <v-col cols="11">
                <!-- 템플릿다운로드 -->
                <v-btn class="btn-util-small download ml-1"
                  text :ripple="false"
                  @click="helperBtn"
                >
                  템플릿다운로드
                </v-btn>
                <Vue2Dropzone
                  ref="vdropzone"
                  id="vdropzone"
                  class="dragdropFileUpload"
                  :class="{'has-file': fileList && fileList.length > 1}"
                  :options="dropzoneOptions"
                  :useCustomSlot="true"
                  :include-styling="false"
                  :duplicateCheck="true"
                  @vdropzone-file-added="vfileAdded"
                  @vdropzone-complete="vComplete"
                  @vdropzone-success="vsuccess"
                  @vdropzone-error="verror"
                  @vdropzone-removed-file="vremoved"
                  @vdropzone-sending="vsending"
                  @vdropzone-success-multiple="vsuccessMuliple"
                  @vdropzone-sending-multiple="vsendingMuliple"
                  @vdropzone-queue-complete="vqueueComplete"
                  @vdropzone-total-upload-progress="vprogress"
                  @vdropzone-duplicate-file="vdduplicate"
                  >
                  <input
                    type="file"
                    hide-details="auto"
                    ref="holidayfile"
                   />
                  <div class="label-dragdrop">
                    <span>{{ filenameStatusToBeLabeling }}</span>
                  </div>
                  <!-- 파일 선택 -->
                  <v-btn
                    text
                    :ripple="false"
                    class="btn-util-small excel"
                  >
                    파일 선택
                  </v-btn>
                </Vue2Dropzone>
              </v-col>
            </v-row>
            <v-row v-if="fileList && fileList.length > 0">
              <v-col cols="1"></v-col>
              <v-col cols="11">
                <div class="uploaded-files">
                <ul>
                  <li
                    v-for="(file, idx) in fileList"
                    v-bind:key="idx"
                    class="one-file"
                  >
                    <strong class="name">{{ file.name }}</strong>
                    <span class="size">{{ file.label }} {{ comma(file.size) }} bytes</span>
                    <v-btn text :ripple="false" class="btn-trash" @click="vdropzoneRemoveFile(file)"><span class="hide">지우기</span></v-btn>
                  </li>
                </ul>
              </div>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions class="submit-btns-group">
            <v-spacer></v-spacer>
            <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel')}}</v-btn>
            <v-btn color="btn-primary" text @click="nextBtn">{{ $t('button.next')}}</v-btn>
          </v-card-actions>
        </v-tab-item>
        <v-tab-item
          :key="2"
          :value="'tab-' + 2"
        >
          <v-container class="batchUpload excel">
            <v-expansion-panels
              v-model="excels"
              multiple
            >
              <v-expansion-panel v-for="(xlsData, idx) in xlsDatas" :key="idx">
                <v-expansion-panel-header>
                  {{ xlsData.name }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <vuescroll>
                  <v-card class="data-grid-wrap default" style="max-width: 1024px;">
                    <v-data-table
                      v-model="xlsData.selected"
                      :headers="headers"
                      :items="xlsData.deserts"
                      :item-key="'eid'"
                      :server-items-length="xlsData.deserts.length"
                      :no-data-text="$t('message.noData')"
                      :loading-text="$t('message.loading')"
                      :height="Math.min((xlsData.deserts.length + 1) * 40, 440)"
                      show-select
                      fixed-header
                      hide-default-footer
                    >
                      <template v-slot:item="props">
                        <tr>
                          <td v-for="(header, inx) in props.headers" :key="inx" class="text-center">
                            <v-simple-checkbox
                              v-if="header.value === 'data-table-select'"
                              :value="props.isSelected"
                              :ripple="false"
                              @input="props.select($event)"
                            >
                            </v-simple-checkbox>
                            <v-text-field
                              v-else-if="header.type === 'text'"
                              v-model="props.item[header.value]"
                              class="default mt-0 pt-0"
                              @blur="header.mode = null"
                              :disabled="props.item.isSelectable === false"
                              :style="{ width: header.width }"
                              hide-details="auto"
                              full-width
                              dense
                            >
                            </v-text-field>
                            <v-select
                              v-else-if="header.type === 'select'"
                              v-model="props.item[header.value]"
                              class="default mt-0 pt-0"
                              :menu-props="{ offsetY: true }"
                              :items="header.items"
                              @blur="header.mode = null"
                              :disabled="props.item.isSelectable === false"
                              :style="{ width: header.width }"
                              hide-details="auto"
                              full-width
                              dense
                            >
                            </v-select>
                            <span v-else>{{ props.item[header.value] }}</span>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-card>
                  </vuescroll>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>
          <v-card-actions class="submit-btns-group">
            <v-spacer></v-spacer>
            <v-btn color="btn-secondary" text @click="cancelBtn">{{ $t('button.cancel')}}</v-btn>
            <v-btn color="btn-secondary" text @click="prevBtn">{{ $t('button.prev')}}</v-btn>
            <v-btn color="btn-primary" text @click="saveBtn">{{ $t('button.save')}}</v-btn>
          </v-card-actions>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-btn
      class="default dialogclose"
      text
      @click.stop="cancelBtn"
      :ripple="false"
    >
      <span class="hide">팝업 닫기</span>
    </v-btn>
  </v-card>
</template>

<script>
import { postRequest, postRequestBlob, uploadRequest } from '@/api/AxioCreate'

import Vue2Dropzone from 'vue2-dropzone'

export default {
  name: 'PopupExcelUploadTemplateView',
  props: {
    code: String,
    title: String
  },
  components: {
    Vue2Dropzone
  },
  computed: {
    parentTitle: function () {
      return this.title
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  data () {
    return {
      tabExcel: null,
      // 파일 업로드 필드에 텍스트 상태
      filenameStatusToBeLabeling: 'Drag & Drop',
      // 파일 목록
      // 파일 목록 샘플
      dropzoneOptions: {
        url: '/api/upload',
        maxFilesize: 0.5,
        headers: {
          Authorization: `Bearer ${sessionStorage.accessToken}`
        },
        addRemoveLinks: false, // Remove 버튼 추가
        autoProcessQueue: false, // 업로드 즉시 서버로 전송 falses
        acceptedFiles: '.xls,.xlsx',
        clickable: true, // drag and drop 창 클릭시 파일찾기 안나오게
        paramName: 'fileList',
        uploadMultiple: true,
        parallelUploads: 100,
        maxFiles: 100,
        previewTemplate: this.previewTemplate()
      },
      excels: [],
      fileList: [],
      headers: [],
      xlsDatas: []
    }
  },
  methods: {
    init: function () {
      postRequest(`/api/excel/init/${this.code}`, JSON.stringify({})).then(
        (response) => {
          const status = response.data.status
          if (status === 200) {
            this.headers = response.data.result
            this.headers.forEach((v, i) => {
              if (v.type === 'text') {
                v.width = (v.text.length * 44) + 'px'
              } else if (v.type === 'select') {
                if (v.value.endsWith('Yn')) {
                  v.width = (v.text.length * 35) + 'px'
                } else {
                  v.width = (v.text.length * 55) + 'px'
                }
              }
            })
          }
        },
        (error) => {
          console.error(error)
        }
      )
    },
    helperBtn: function () {
      postRequestBlob(`/api/excel/helper/${this.code}`, JSON.stringify({})).then(
        (response) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], {
              type: response.headers['content-type']
            })
          )
          const filename = String(this.parentTitle).replace(/\s/ig, '') + '.템플릿.' + this.$moment().format('YYYYMMDD') + '.xlsx'
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        },
        (error) => {
          console.error(error)
        }
      )
    },
    // 취소버튼
    cancelBtn: function () {
      this.$emit('popupAction', {
        createView: false,
        readView: false,
        updateView: false,
        batchView: false
      })
    },
    isEmpty: function (x) {
      return (x === null || x === undefined)
    },
    isBlank: function (x) {
      return (!x || x.trim().length === 0)
    },
    // 숫자에 콤마
    comma: function (n) {
      return Number(n).toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
    // 다음버튼
    nextBtn: function () {
      if (this.fileList.length > 0) {
        // this.$refs.vdropzone.processQueue()
        const formData = new FormData()
        this.fileList.forEach((file, idx) => {
          formData.append('fileList', file)
        })
        uploadRequest(`/api/excel/upload/${this.code}`, formData).then(
          (response) => {
            const status = response.data.status
            if (status === 200) {
              this.xlsDatas = response.data.result
              this.tabExcel = 'tab-2'
            }
          },
          (error) => {
            console.error(error.response)
          }
        )
      } else {
        alert('파일을 선택하세요')
      }
    },
    // 이전버튼
    prevBtn: function () {
      this.excels = []
      this.xlsDatas = []
      this.tabExcel = 'tab-1'
    },
    // 저장버튼
    saveBtn: function () {
      let selected = []
      for (let i = 0; i < this.xlsDatas.length; i++) {
        selected = [...selected, ...this.xlsDatas[i].selected]
      }
      console.log(selected)
      if (selected.length > 0) {
        this.$emit('popupAction', {
          createView: false,
          readView: false,
          updateView: false,
          batchView: false,
          templates: selected
        })
      } else {
        alert('일괄 처리 대상을 선택하세요')
      }
    },
    /* Dropzone Start */
    previewTemplate: function () {
      return '<div />'
    },
    vfileAdded: function (file) {
      // console.log('fileAdded')
      this.vdropzoneOn()
    },
    vComplete: function (response) {
      this.vdropzoneOn()
    },
    vsuccess: function (file, response) {
      // console.log('success')
    },
    verror: function (file) {
      // console.log('error')
    },
    vremoved: function (file, xhr, error) {
      // console.log('removedFile')
      this.vdropzoneOn()
    },
    vsending: function (file, xhr, formData) {
      // console.log('sending')
    },
    vsuccessMuliple: function (files, response) {
      // console.log('successMultiple')
    },
    vsendingMuliple: function (file, xhr, formData) {
      // console.log('sendingMultiple')
    },
    vqueueComplete: function (file, xhr, formData) {
      // console.log('queueComplete')
    },
    vprogress: function (totalProgress, totalBytes, totalBytesSent) {
      // console.log('progress')
    },
    vdduplicate: function () {
      // console.log('dDuplicate')
      this.vdropzoneOn()
    },
    vdropzoneOn: function () {
      this.$refs.vdropzone.dropzone.files.forEach((file, idx) => {
        if (file.status === 'error') {
          this.$refs.vdropzone.removeFile(file)
        }
      })
      this.fileList = this.$refs.vdropzone.dropzone.files
      // console.log(this.fileList.length)
    },
    vdropzoneRemoveFile: function (file) {
      this.$refs.vdropzone.removeFile(file)
    }
    /* Dropzone End */
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.dragdropFileUpload {
  cursor: pointer;
}
.excel .v-data-table tbody tr td:not(:first-child) {
  padding-left: 0px;
  padding-right: 0px;
}
.excel .v-expansion-panel-content__wrap {
  padding-left: 16px;
  padding-right: 16px;
}
.errorMessage {
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
</style>
