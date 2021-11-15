import vuescroll from 'vuescroll'

const options = {
  ops: {
    vuescroll: {
      mode: 'native',
      sizeStrategy: 'percent',
      detectResize: true,
      pullRefresh: {
        enable: false,
        tips: {
          deactive: 'Pull to Refresh',
          active: 'Release to Refresh',
          start: 'Refreshing...',
          beforeDeactive: 'Refresh Successfully!'
        }
      },
      pushLoad: {
        enable: false,
        tips: {
          deactive: 'Push to Load',
          active: 'Release to Load',
          start: 'Loading...',
          beforeDeactive: 'Load Successfully!'
        },
        auto: false,
        autoLoadDistance: 0
      },
      paging: false,
      zooming: true,
      snapping: {
        enable: false,
        width: 100,
        height: 100
      },
      scroller: {
        /*
          Allow to scroll out of boundaries
          true or false or an array specify which direction can be
          bounced. The options can be:
          ['top','bottom','left','right']
        */
        bouncing: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100
        },
        /** Enable locking to the main axis if user moves only slightly on one of them at start */
        locking: true,
        /** Minimum zoom level */
        minZoom: 0.5,
        /** Maximum zoom level */
        maxZoom: 3,
        /** Multiply or decrease scrolling speed **/
        speedMultiplier: 1,
        /** This configures the amount of change applied to deceleration when reaching boundaries  **/
        penetrationDeceleration: 0.03,
        /** This configures the amount of change applied to acceleration when reaching boundaries  **/
        penetrationAcceleration: 0.08,
        /** Whether call e.preventDefault event when sliding the content or not */
        preventDefault: true,
        /** Whether call preventDefault when (mouse/touch)move**/
        preventDefaultOnMove: true,
        // whether to  disable scroller or not.
        disable: false
      }
    },
    scrollPanel: {
      initialScrollY: true,
      initialScrollX: true,
      scrollingX: true,
      scrollingY: true,
      speed: 300,
      easing: 'easeInQuad',
      verticalNativeBarPos: 'right'
    },
    rail: {
      background: '#01a99a',
      opacity: 0,
      size: '6px',
      specifyBorderRadius: false,
      gutterOfEnds: null,
      gutterOfSide: '2px',
      keepShow: false
    },
    bar: {
      showDelay: 500,
      onlyShowBarOnScroll: true,
      keepShow: false,
      background: '#dae3ed',
      opacity: 0.4,
      hoverStyle: false,
      specifyBorderRadius: false,
      minSize: 0,
      size: '5px',
      disable: false
    },
    scrollButton: {
      enable: false,
      background: 'rgb(3, 185, 118)',
      opacity: 1,
      step: 180,
      mousedownStep: 30
    }
  },
  name: 'vuescroll' // customize component name, default -> vueScroll
}

export default Vue => {
  Vue.use(vuescroll, options)
}
