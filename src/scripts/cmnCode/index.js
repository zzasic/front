export default {
  data: function () {
    return {
      valid: true,
      /* input start */
      inputForm: {
        itemsCodeType: [],
        itemsLocale: [],
        itemsUpperCodeId: []
      },

      codeInfo: {
        codeType: '',
        codeId: '',
        codeNms: [
          {
            lang: 'KO',
            codeValue: '',
            codeDesc: ''
          }
        ],
        codeOrder: '',
        upperCodeType: '',
        upperCodeId: '',
        useYn: 'Y',
        optCode: ''
      },
      /* input end */

      useYns: [
        {
          text: '사용',
          value: 'Y'
        },
        {
          text: '미사용',
          value: 'N'
        }
      ],

      /* validate start */
      codeTypeRules: [
        v => !!v || '공통코드 유형을 선택하세요'
      ],
      codeIdRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '공통코드 ID를 입력하세요',
        v => v.length <= 32 || '공통코드 ID는 32자리 이내로 입력해 주세요'
      ],
      langRules: [
        v => !!v || '공통코드 언어를 선택하세요'
      ],
      codeValueRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '공통코드 명을 입력하세요',
        v => v.length <= 64 || '공통코드 명은 64자리 이내로 입력해 주세요'
      ],
      codeDescRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '공통코드 설명을 입력하세요',
        v => v.length <= 128 || '공통코드 설명은 128자리 이내로 입력해 주세요'
      ],
      codeOrderRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) || '공통코드 순서를 입력하세요',
        /* eslint-disable */
        v => /^[0-9]*$/.test(v) || '공통코드 순서를 숫자로 입력해 주세요',
        /* eslint-disable */
        v => v.length <= 5 || '공통코드 순서를 5자리 이내로 입력해 주세요'
      ],
      upperCodeTypeRules: [
        v => !!v && this.codeInfo.codeType !== v || !v || '공통코드 유형과 상위코드 유형이 동일하여 선택할 수 없습니다.'
      ],
      upperCodeIdRules: [
        v => this.codeInfo.upperCodeType && !!v || !this.codeInfo.upperCodeType || '상위코드 ID를 선택하세요'
      ],
      optCodeRules: [
        v => (!!v && v.length > 0 && v.replace(/\s/g, '').length > 0) && v.length <= 128 || !v || '부가코드는 128자리 이내로 입력해 주세요'
      ]
      /* validate end */
    }
  },
  computed: {
    cptdItemsCodeType: function () {
      const its = []
      its.push(...this.inputForm.itemsCodeType)
      return its
    },
    cptdUpItemsCodeType: function () {
      if (!this.codeInfo.codeType || this.codeInfo.codeType.length === 0) {
        return []
      }
      const its = [
        {
          text: '미선택',
          value: ''
        }
      ]
      its.push(...this.inputForm.itemsCodeType)
      return its
    },
    langContentsPlusable: function () {
      return this.codeInfo.codeNms.length < this.inputForm.itemsLocale.length
    },
    langContentsMinusable: function () {
      return this.codeInfo.codeNms.length > 1
    }
  }
}