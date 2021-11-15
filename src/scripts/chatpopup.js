export default {
  props: {
    url: String,
    chat: Object,
    counselor: Object,
    call: Object
  },
  data () {
    return {
      sticky: true,
      width: '400px'
    }
  },
  methods: {
    dragElement () {
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      const _context = this
      // const _parent = this.$parent
      const _window = this.$refs['vue-window-modal']
      const _windowHeader = this.$refs['vue-window-modal-header']
      _windowHeader.onmousedown = dragMouseDown
      function dragMouseDown (e) {
        e = e || window.event
        _context.focusPopup()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
        _windowHeader.style.cursor = '-webkit-grabbing'
      }
      function elementDrag (e) {
        e = e || window.event
        _context.sticky = false
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        // set the element's new position:
        if (_window.offsetTop < 0) {
          _window.style.top = '0px'
        } else if ((_window.offsetTop + Number(_context.height.replace(/px$/, ''))) > window.innerHeight) {
          _window.style.top = (window.innerHeight - Number(_context.height.replace(/px$/, ''))) + 'px'
        } else if ((_window.offsetTop - pos2) < (window.innerHeight - 35)) {
          _window.style.top = (_window.offsetTop - pos2) + 'px'
        } else {
          _context.centerWindow()
        }
        if (_window.offsetLeft < 0) {
          _window.style.left = '0px'
        } else if ((_window.offsetLeft + Number(_context.width.replace(/px$/, ''))) > window.innerWidth) {
          _window.style.left = (window.innerWidth - Number(_context.width.replace(/px$/, ''))) + 'px'
        } else if ((_window.offsetLeft - pos1) < (window.innerWidth - 35)) {
          _window.style.left = (_window.offsetLeft - pos1) + 'px'
        } else {
          _context.centerWindow()
        }
      }
      function closeDragElement () {
        /* stop moving when mouse button is released: */
        document.onmouseup = null
        document.onmousemove = null
        _windowHeader.style.cursor = '-webkit-grab'

        const _arr = _context.$parent.$children.filter(_vc => {
          return (_vc.sticky === true || _vc.popupType === 'hist') && _vc._uid !== _context._uid
        })
        const _top = _arr.reduce((acc, cur) => {
          const _win = cur.$refs['vue-window-modal']
          return Math.min(acc, Number(_win.style.top.replace(/px$/, '')))
        }, window.innerHeight)
        const _bottom = _arr.reduce((acc, cur) => {
          const _win = cur.$refs['vue-window-modal']
          return Math.max(acc, Number(_win.style.top.replace(/px$/, '')) + Number(cur.height.replace(/px$/, '')))
        }, 0)
        const _left = _arr.reduce((acc, cur) => {
          const _win = cur.$refs['vue-window-modal']
          return Math.min(acc, Number(_win.style.left.replace(/px$/, '')))
        }, window.innerWidth)
        const _right = _arr.reduce((acc, cur) => {
          const _win = cur.$refs['vue-window-modal']
          return Math.max(acc, Number(_win.style.left.replace(/px$/, '')) + Number(cur.width.replace(/px$/, '')))
        }, 0)
        // Stikcy 처리
        if (Math.abs(_right - Number(_window.style.left.replace(/px$/, ''))) < 20 && Math.abs(_top - Number(_window.style.top.replace(/px$/, ''))) < 20) {
          // Right Sticky
          _window.style.top = _top + 'px'
          _window.style.left = (_right + 1) + 'px'
          _context.sticky = true
        } else if (Math.abs(_left - Number(_window.style.left.replace(/px$/, ''))) < 20 && Math.abs(_bottom - Number(_window.style.top.replace(/px$/, ''))) < 20) {
          // Bottom Sticky
          _window.style.top = (_bottom + 1) + 'px'
          _window.style.left = _left + 'px'
          _context.sticky = true
        } else if (Math.abs(_left - (Number(_window.style.left.replace(/px$/, '')) + Number(_context.width.replace(/px$/, '')))) < 20 && Math.abs(_top - Number(_window.style.top.replace(/px$/, ''))) < 20) {
          // Left Sticky
          _window.style.top = _top + 'px'
          _window.style.left = (_left - Number(_context.width.replace(/px$/, '')) - 1) + 'px'
          _context.sticky = true
        } else if (Math.abs(_left - Number(_window.style.left.replace(/px$/, ''))) < 20 && Math.abs(_top - (Number(_window.style.top.replace(/px$/, '')) + Number(_context.height.replace(/px$/, '')))) < 20) {
          // Top Sticky
          _window.style.top = (_top - Number(_context.height.replace(/px$/, '')) - 1) + 'px'
          _window.style.left = _left + 'px'
          _context.sticky = true
        }
      }
    },
    focusPopup () {
      const popups = Array.from(document.getElementsByClassName('vue-window-modal'))
      this.$refs['vue-window-modal'].style.zIndex = popups.map(el => Number(el.style.zIndex)).reduce((z1, z2) => Math.max(z1, z2), 9998) + 1
    },
    centerWindow () {
      const _window = this.$refs['vue-window-modal']
      const _arr = this.$parent.$children.filter(_vc => {
        return (_vc.sticky === true || _vc.popupType === 'hist') && _vc._uid !== this._uid
      })
      const _top = _arr.reduce((acc, cur) => {
        const _win = cur.$refs['vue-window-modal']
        return Math.min(acc, Number(_win.style.top.replace(/px$/, '')))
      }, window.innerHeight)
      const _left = _arr.reduce((acc, cur) => {
        const _win = cur.$refs['vue-window-modal']
        return Math.min(acc, Number(_win.style.left.replace(/px$/, '')))
      }, window.innerWidth)
      const _right = _arr.reduce((acc, cur) => {
        const _win = cur.$refs['vue-window-modal']
        return Math.max(acc, Number(_win.style.left.replace(/px$/, '')) + Number(cur.width.replace(/px$/, '')))
      }, 0)
      // 기본은 오른쪽
      if (_right + Number(this.width.replace(/px$/, '')) < window.innerWidth) {
        _window.style.top = _top + 'px'
        _window.style.left = (_right + 1) + 'px'
      } else {
        _window.style.top = _top + 'px'
        _window.style.left = (_left - Number(this.width.replace(/px$/, '')) - 1) + 'px'
      }
    },
    closeModalPopupBefore (e) {
      e.stopPropagation()
    }
  },
  mounted () {
    this.centerWindow()
    this.focusPopup()
    this.dragElement()
  }
}
