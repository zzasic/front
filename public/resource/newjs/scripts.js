
$(document).ready(function(){
    // front. function load
    venderCheck();
    gnbUi();
    gridUi();
    tabUi();
    modalUi();
    alertSize();
    buttonUi();
    if ($('.datepicker').length){libDatepicker();} // datepicker lib
    if ($('.main-calendar').length){libDatepickerCalendar();} // main calendar datepicker lib
});

$(window).on('load resize', function(){
    modalUi();
    var winWidth = $(document).width();
    // responsive error

    if(winWidth >= 1024){
        $('.left-bar,.container').addClass('no-motion');
        setTimeout(function() {
            $('.left-bar,.container').removeClass('no-motion');
        }, 500);
        // $('.left-bar').css('transition','none');
    }
});



function venderCheck(){
    var ua = window.navigator.userAgent;
    var other = 999;
    var msie = ua.indexOf('MSIE ');



    if($('.animate').length > 0){
        $('html').addClass('main');
    }

    // check Mobile
    if(ua.indexOf('Mobile') != -1){
        $('html').addClass('mobile');
    }


    // check Browser
    if(ua.toLowerCase().indexOf('safari') != -1){

        if(ua.toLowerCase().indexOf('chrome') != -1){
            $('html').addClass('chrome');

        } else {
            $('html').addClass('safari');
        }

    } else if(ua.toLowerCase().indexOf('firefox') != -1){
        $('html').addClass('firefox');

    } else if(ua.toLowerCase().indexOf('msie 6.0') != -1){
        $('html').addClass('ie ie6');

    } else if(ua.toLowerCase().indexOf('msie 7.0') != -1){
        $('html').addClass('ie ie7');

    } else if(ua.toLowerCase().indexOf('msie 8.0') != -1){
        $('html').addClass('ie ie8');

    } else if(ua.toLowerCase().indexOf('msie 9.0') != -1){
        $('html').addClass('ie ie9');

    } else if(ua.toLowerCase().indexOf('msie 10.0') != -1){
        $('html').addClass('ie ie10');

    } else if(ua.toLowerCase().indexOf('rv:11.0') != -1){
        $('html').addClass('ie ie11');
    }


    // check OS
    if( ua.toLowerCase().indexOf('os x') != -1 ){
    /* check OS */
    }
}
function gnbUi(){
    var gnbWidth = $('.left-bar').width();
    // change layout position
    $('.gnb-toggle').on('click',function(e){
        e.preventDefault();
        $('.depth-1 > li').removeClass('active');
        $(this).toggleClass('on');
        $('.left-bar').toggleClass('active-simple');

        if($(this).hasClass('on')){
            $('.container, .gnb-toggle-wrap').css({
                marginLeft : 60+'px'
            });
        } else{
            $('.container, .gnb-toggle-wrap').css({
                marginLeft : 242+'px'
            });
        }
        // for loading error
        if($(this).hasClass('on')){
            if($('.left-bar').hasClass('active-simple')){
                // $(this).parent().addClass('active').siblings().removeClass('active');
                $('.depth-1 > li').on('click', function(){
                    $(this).toggleClass('active-resize').siblings().removeClass('active');
                });
            }
        }

        $('.depth-1 > li > a, .depth-2').addClass('load');
        setTimeout(function() {
            $('.depth-1 > li > a, .depth-2').removeClass('load');
        }, 1500);
    });

    // gnb action!
    $('.depth-1 > li > a').on('click',function(e){
        e.preventDefault();
        $(this).parent().toggleClass('active').siblings().removeClass('active');
    });
}
function gridUi(){
    mainColor = $('body').css('background-color');
    $('.component-header').css('background-color',mainColor);
    $('.grid .column').css('border-color',mainColor);
    // if($('.develop-component').height() < 720){
    //     $('.footer').addClass('bottom');
    // }

}
function tabUi(){
    var tabCurrent = $('.tab-lst').find('li');
        tabCurrentLength  = tabCurrent.length;
        tabCurrent.css('width', 100/tabCurrentLength + '%');


    var idx = $('.tab-cont').index();
    $('.tab-cont').not(':eq('+idx+')').hide(); // tab_cont :: all hide

    $('.tab-lst').each(function(){ // tab_lst li first :: on
        var $this = $(this);
        var $first_lst = $(this).children('li').eq(0);
        $first_lst.addClass('on');
    });

    $('.tab-container').each(function () { // tab_cont first :: on
        var $this = $(this);
        var $first_tab = $(this).children('.tab-cont').eq(0);
        $first_tab.show();
    });

    var $btn_tab = $('.tab-lst').find('li');
    $btn_tab.on('click', function(e){
        e.preventDefault();

        var $this = $(this),
            $thisrel = $this.attr('rel'); // tab_lst li :: rel
            $thisClass = $('.'+ $thisrel); // tab_cont :: class
            target = $thisClass.parent('.tab-container').attr('id'); // tab_container :: id

            $('#' + target).find('.tab-cont').hide();
            $('#' + target + ' .' + $thisrel).fadeIn();

            $this.addClass('on').siblings().removeClass('on'); // tab_lst li :: on
    });
}
function modalUi(){
        var $window = $(window);
        // open modal
        var $btn_modal = $('.btn_modal');
        $btn_modal.on('click', function (e) {
            e.preventDefault();
            var $this = $(this),
                target = $this.attr('href');

            // Modal event
            if ($(target).length) {
                var layerHeight, scrollHeight, layerWidth;
                    layerWidth = $(target).outerWidth();
                    layerHeight = $(target).outerHeight();
                    $(target).css('margin-left', -layerWidth/2);
                    $(target).css('margin-top', -layerHeight/2);
                    if (!$('.newmodal_bg').length) {
                        $('.container').append('<div class="newmodal_bg"></div>');
                    }
                    $(target + ', .newmodal_bg').fadeIn(250);
            }
        });

        // close modal
        $('.newmodal .close').on('click', function (e) {
            e.preventDefault();
            var target = '#' + $(this).parents('.newmodal').attr('id');

            var isVisible = $(target).is(':visible');
            var modalLength = $('.newmodal:visible').length;

            if (isVisible) {
                if (modalLength > 1) {
                $(target).fadeOut(250);
                } else {
                $(target + ', .newmodal_bg').fadeOut(250);
                }
            }
        });
    }
function alertSize(){
        var alertHeight = $('.bot-alert').outerHeight();
        $('.bot-alert').css('margin-top', -alertHeight/2);
        $('.close-alert').on('click',function(e){
            e.preventDefault();
            $(this).parents('.alert-wrap').fadeOut(250);
        });
}
function buttonUi(){
    $('.grid.guide .btnico.close').on('click',function(){
        $(this).parents('.grid.guide').remove();
    });

    // $(".chk-base").change(function(){
    //     if($(this).is(":checked")){
    //         $(this).addClass('checked');
    //     }else{
    //         $(this).removeClass('checked');
    //     }
    // });
    //
    // $(".rdo-base").change(function(){
    //     if($(this).is(":checked")){
    //         $(this).addClass('checked');
    //     }else{
    //         $(this).removeClass('checked');
    //     }
    // });
}
function libDatepicker(){
        $('.datepicker').datepicker({
            showMonthAfterYear : true,
            showOtherMonths : true,
            selectOtherMonths : true,
            dateFormat: "yy.mm.dd",
            prevText : 'p',
            nextText : 'n',
            dayNames : ['월', '화', '수', '목', '금', '토', '일' ],
            dayNamesMin : ['월', '화', '수', '목', '금', '토', '일' ],
            dayNamesShort : ['월', '화', '수', '목', '금', '토', '일' ],
            monthNames : ['. 1', '. 2', '. 3', '. 4', '. 5', '. 6', '. 7', '. 8', '. 9', '. 10', '. 11', '. 12']
        });
}
function libDatepickerCalendar(){
    $('.main-calendar').datepicker({
        inline: true,
        showMonthAfterYear : true,
        showOtherMonths : true,
        selectOtherMonths : true,
        dateFormat: "yy.mm.dd",
        prevText : 'p',
        nextText : 'n',
        dayNames : ['월', '화', '수', '목', '금', '토', '일' ],
        dayNamesMin : ['월', '화', '수', '목', '금', '토', '일' ],
        dayNamesShort : ['월', '화', '수', '목', '금', '토', '일' ],
        monthNames : ['. 1', '. 2', '. 3', '. 4', '. 5', '. 6', '. 7', '. 8', '. 9', '. 10', '. 11', '. 12']
    });
}
