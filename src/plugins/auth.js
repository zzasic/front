const auth = {
  componentUpdated (el, binding, vnode) {
    const { value } = binding
    const userAuthCd = sessionStorage.userAuthCode

    if (value && value instanceof Array && value.length > 0) {
      const btnUserAuthCds = value
      // 버튼 권한 보유 여부
      const hasUserAuthCd = btnUserAuthCds.includes(userAuthCd)

      if (!hasUserAuthCd) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}

export default auth
