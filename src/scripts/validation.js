export default {
  isAlphaNumeric: function (sVal) {
    if (this.isEmpty(sVal)) {
      return false
    }

    /* eslint-disable */
    var regexp = /^[a-zA-Z0-9]+$/
    /* eslint-disable */

    if (sVal.match(regexp) == null) {
      return false
    }
    return true
  },
	  
  isNumber: function (sVal) {
    if (this.isEmpty(sVal)) {
      return false
    }

    /* eslint-disable */
    var regexp = /^[0-9]+$/
    /* eslint-disable */

    if (sVal.match(regexp) == null) {
      return false
    }
    return true
  },
	  
  isEmailCheck: function (sVal) {
    if (this.isEmpty(sVal)) {
      return false
    }

    /* eslint-disable */
    var regexp = /^[0-9a-zA-Z-_\.]*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,5}$/i
    /* eslint-disable */

    if (sVal.match(regexp) == null) {
      return false
    }
    return true
  },
  
  isTelNumCheck: function (sVal) {
    if (this.isEmpty(sVal)) {
      return false
    }

    /* eslint-disable */
    var regexp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/
    /* eslint-disable */

    if (sVal.match(regexp) == null) {
      return false
    }
    return true
  },

  isDateCheck: function (sVal) {
    if (this.isEmpty(sVal)) {
      return false
    }

    /* eslint-disable */
    var regexp = /^(2)\d{3}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/
    /* eslint-disable */

    if (sVal.match(regexp) == null) {
      return false
    }
    return true
  },

  isEmpty: function (val) {
    if (val === undefined || val === '') {
      return true
    }
    return false
  }
}
