function param (obj, applyDot) {
  let prefix
  const s = []
  const add = function (key, value) {
    value = typeof value === 'function' ? value() : (value === null ? '' : value)
    s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value)
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      add(i, v)
    })
  } else {
    for (prefix in obj) {
      buildParams(prefix, obj[prefix], applyDot, add)
    }
  }
  return s.join('&').replace(/%20/g, '+')
}

function buildParams (prefix, obj, applyDot, add) {
  let name
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      if (/\[\]$/.test(prefix)) {
        add(prefix, v)
      } else {
        buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, applyDot, add)
      }
    })
  } else if (typeof obj === 'object') {
    for (name in obj) {
      if (applyDot && /^[$A-Z_][0-9A-Z_$]*$/i.test(name)) {
        buildParams(prefix + '.' + name, obj[name], applyDot, add)
      } else {
        buildParams(prefix + '[' + name + ']', obj[name], applyDot, add)
      }
    }
  } else {
    add(prefix, obj)
  }
}

function deparam (query, applyDot) {
  const ctypes = { true: !0, false: !1, null: null }
  const obj = {}
  if (!query) {
    return obj
  }
  query.replace(/\+/g, ' ').split('&').forEach((v) => {
    const vp = v.split('=')
    let key = decodeURIComponent(vp[0])
    let val = vp.length === 2 ? decodeURIComponent(vp[1]) : ''
    val = val && !isNaN(val) && ((+val + '') === val) ? +val /* number */ : val === 'undefined' ? undefined /* undefined */ : ctypes[val] !== undefined ? ctypes[val] /* true, false, null */ : val /* string */
    let keys = applyDot ? key.split(/[.[]/) : key.split('][')
    if (!applyDot && /\[/.test(keys[0])) {
      keys = keys.shift().split('[').concat(keys)
    }
    let cur = obj
    for (let c = 0; c < keys.length; c++) {
      try {
        key = keys[c].replace(/\]$/, '')
        key = key === '' ? cur.length : key
        cur = cur[key] = c < keys.length - 1 ? cur[key] || (keys[c + 1].replace(/\]$/, '') && isNaN(keys[c + 1].replace(/\]$/, '')) ? {} : []) : val
      } catch (e) {
        console.error(e)
      }
    }
  })
  return obj
}

export {
  param,
  deparam
}
