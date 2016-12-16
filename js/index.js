/* 
* @Author: pengshuang
* @Date:   2016-12-07 22:23:37
* @Last Modified time: 2016-12-14 23:35:22
*/

$(document).ready(function(){
    
    var current = 0,//当前轮播页
    timer,//轮播的定时器
    zindex = -1,//轮播图片容器的定位层级
    page = 0,//当前外层页面位置
    corePage = 0,//当前内层页面位置
    scrollTimer,//滚屏时起阻隔作用的定时器
    personData = [{
        imgSrc: 'img/person1.jpg',
        title: '品牌策略总监',
        name: 'Smith'
    },{
        imgSrc: 'img/person2.jpg',
        title: '客服担当',
        name: 'Hayley'
    },{
        imgSrc: 'img/person3.jpg',
        title: '设计总监',
        name: 'Zane'
    },{
        imgSrc: 'img/person4.jpg',
        title: '程序主创',
        name: 'Tony'
    },{
        imgSrc: 'img/person5.jpg',
        title: '视觉主创',
        name: 'John'
    },{
        imgSrc: 'img/person6.jpg',
        title: '交互主创',
        name: 'TT'
    }],//循环播放人物的数据
    i = 0,//循环播放人物计数器
    personTimer;//计时器


    //初始化图片高度宽度
    $('#page-1 .bg-block').eq(current%4).siblings('.bg-block').css({
        width: 0,
        height: getWH($(window).width(), $(window).height(), 1720, 950).height
    });

    //浏览器窗口尺寸改变时的表现
    $(window).on('resize', function(){
        var w = getWH($(window).width(), $(window).height(), 1720, 950).width;
        var h = getWH($(window).width(), $(window).height(), 1720, 950).height;
        //包裹图片的大小
        $('#page-1 .bg-block').eq(current%4).css({
            width: w,
            height: h
        });
            
        //第一页轮播图动态居中
        $('#page-1 .bg-block').eq(current%4).css({
            marginLeft: -$('#page-1 .bg-block').eq(current%4).width()/2,
            marginTop: -$('#page-1 .bg-block').eq(current%4).height()/2
        });

        $('#page-1 .bg-block img').each(function(){
            if($(window).width()/$(window).height() > 1720/950){
                //不使用百分比作为图片的宽度，影响动画效果
                $(this).css({
                    width: $('#page-1 .bg-block').eq(current%4).width()+'px',
                    height: h
                });
            }else{
                $(this).css({
                    width: w,
                    height: h
                });
            }
        });

        //窗口尺寸改变时重新调整marginTop的值，保持单屏显示
        $('.container>ul').css('marginTop', -$(window).height()*page);
        $('#page-2>.left').css('marginTop', -$(window).height()*corePage);
        $('#page-2>.right').css('marginTop', -$(window).height()*corePage);
        //等动画执行完后再调整
        setTimeout(function(){
            $('.page2Text>.num').css('marginTop', -$('.page2Text').height()*corePage);
            $('.page2Text>.ctrl').css('marginTop', -$('.page2Text').height()*corePage);    
        }, 500);

        //页面二的视频图片响应式尺寸设置
        $('#page-2 .right li video,#page-2 .right li>img').each(function(){
            $(this).css({
                width: getWH($('#page-2 .right').width(), $('#page-2 .right').height(), 656, 976).width,
                height: getWH($('#page-2 .right').width(), $('#page-2 .right').height(), 656, 976).height
            });
            //居中
            $(this).css({
                marginTop: -$(this).height()/2,
                marginLeft: -$(this).width()/2
            });
        });
        
        $('#page-2 .left li video').css({
            top: -$('#page-2 .left li .myVideo').width()/40+'px',
            height: 0.95*($('#page-2 .left li .myVideo').width()*592/1272)+'px'
        });
        $('#page-2 .left li video').css('marginLeft', -$('#page-2 .left li video').width()/2);

    });

    $(window).trigger('resize');//触发resize事件

    /**
     * 获取窗口不同尺寸下，图片的宽高
     */
    function getWH(pWidth, pHeight, cWidth, cHeight){
        var w = pWidth;
        var h = pHeight;
        var data = {width:'',height:''};
        if(w/h > cWidth/cHeight){
            data.width = '100%';
            data.height = w/cWidth*cHeight+'px'
            return data;
        }else{
            data.width = h/cHeight*cWidth;
            data.height = '100%';
            return data;
        }
    }

    //page-1的轮播
    timer = setInterval(autoPlay, 3000);

    function autoPlay(){

        ani((current+1)%4, current);

        current++;
        current %= 4;
        zindex--;
    }

    /**
     * 轮播动画
     * @param   go   下一页面
     * @param   from 开始消失的当前页面
     */
    function ani(go, from){
        //绑定轮播图的介绍文字
        $('.navText>.carouselText>ul>li').eq(go).addClass('show').siblings().removeClass('show');
        //绑定轮播指示器
        $('#page-1 .pagination ol li').eq(go).addClass('active').siblings().removeClass('active');
        $('#page-1 .bg-block').eq(go).css({
            width: getWH($(window).width(), $(window).height(), 1720, 950).width,
            height: getWH($(window).width(), $(window).height(), 1720, 950).height,
            zIndex: zindex
        });
        $('#page-1 .bg-block').eq(go).css({
            marginLeft: -$('#page-1 .bg-block').eq(go).width()/2,
            marginTop: -$('#page-1 .bg-block').eq(go).height()/2
        });
        $('#page-1 .bg-block').eq(from).stop().animate({width:'0'}, 500, 'linear');
    }

    //控制轮播的暂停和开始
    $('#page-1 .pagination i').on('click',function(){
        if($(this).hasClass('pause-btn')){
            $(this).removeClass('pause-btn').addClass('play-btn');
            clearInterval(timer);
        }else{
            $(this).removeClass('play-btn').addClass('pause-btn');
            timer = setInterval(autoPlay, 3000);
        }
    });

    //指示器跳转轮播页面
    $('#page-1 .pagination ol li').each(function(index, item){
        $(this).on('click', function(){
            var i = current;
            var go = $(this).index();
            ani(go, i);
            current = go;
            zindex--;
            //重置定时器
            clearInterval(timer);
            timer = setInterval(autoPlay, 3000);
        });
    });

    //滚轮事件，显示页面切换
    $('body,html').on('mousewheel', function(event, delta){

        //滚动阻隔，防止短时间内滚动次数过多
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(scroller, 300);

        var scrollH = $(window).height(),//窗口高度
        p3H = $('#page-3').outerHeight();//页面三的高度，包含padding、border

        //滚动方法
        function scroller(){
            
            //delta：1 向上滚动  -1 向下滚动
            if(delta === 1){
                //当在最顶页时不执行任何操作
                if(page === 0){
                    return;
                }
                //如果为true,滚动顶层页面    如果为false,滚动第二页包裹的滚动层
                if(page === 1 && corePage === 0 || page === 2){
                    page--;
                    page < 0 ? page = 0 : page;
                    $('.container>ul').stop().animate({'marginTop': -scrollH*page+'px'}, 500);
                }else{
                    corePage--;
                    $('#page-2>.left').stop().animate({'marginTop':-scrollH*corePage}, 500);
                    $('#page-2>.right').stop().animate({'marginTop':-scrollH*corePage}, 600);
                    $('.page2Text>.num').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 500);
                    $('.page2Text>.ctrl').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 600);
                }
                
            }else{

                //true,滚动内层页面   false滚动外层页面
                if(page === 1 && corePage < 4){
                    corePage++;
                    $('#page-2>.left').stop().animate({'marginTop':-scrollH*corePage}, 500);
                    $('#page-2>.right').stop().animate({'marginTop':-scrollH*corePage}, 600);
                    $('.page2Text>.num').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 500);
                    $('.page2Text>.ctrl').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 600);
                }else{
                   page++;
                    page > 2 ? page = 2 : page;
                    if(page == 2){
                        $('.container>ul').stop().animate({'marginTop': -(scrollH+p3H)+'px'}, 500);
                    }else{
                        $('.container>ul').stop().animate({'marginTop': -scrollH*page+'px'}, 500);
                    } 
                }

                //关闭导航按钮
                if(page === 1 && corePage === 0 || page === 2){
                    $('.menu').removeClass('active');
                }
                
            }

            //当页面切换至该视频可见时，开始播放
            playOrPause();

            //导航
            if(page === 0){
                $('.container>nav').removeClass('pageNav2').removeClass('pagesider');
            }else if(page === 1){
                $('.container>nav').addClass('pageNav2').addClass('pagesider').removeClass('pageNav3');
            }else{
                $('.container>nav').addClass('pageNav3');
            }

            //当顶层页面不在第二页时，去除menuShow类
            if(page != 1){
                $('.menu').removeClass('menuShow');
            }

            
        }

    });
    
    function playOrPause(){
        //当页面切换至该视频可见时，开始播放
        if(page === 1 && corePage === 0){
            $('#page-2 .right li video:first').trigger('play');
        }
        if(corePage === 2){
            $('#page-2 .right li video:last').trigger('play');
        }else{
            $('#page-2 .right li video:last').trigger('pause');
        }
    }
    
    //绑定左边导航的指示器，进行跳转内层页面
    $('.ctrl>li>ul>li').each(function(index, item){
        $(this).on('click',function(e){
            corePage = $(this).index();
            $('#page-2>.left').stop().animate({'marginTop':-$(window).height()*corePage}, 500);
            $('#page-2>.right').stop().animate({'marginTop':-$(window).height()*corePage}, 600);
            $('.page2Text>.num').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 500);
            $('.page2Text>.ctrl').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 600);
        });
    });
    
    //页面二中最底页人物循环播放
    personTimer = setInterval(circlePlay, 100);
    // 当鼠标悬停时开始和暂停定时器
    $('#page-2>.right>li:last').hover(function() {
        clearInterval(personTimer);
    }, function() {
        personTimer = setInterval(circlePlay, 100);
    });
    // personTimer定时器的函数
    function circlePlay(){
        $('#page-2>.right>li>img:last').attr('src', personData[i].imgSrc);
        $('#page-2>.right>li>.introduce>.title').html(personData[i].title);
        $('#page-2>.right>li>.introduce>.name').html(personData[i].name);
        i++;
        i %= 6;
    }

    //点击导航按钮切换样式
    var flag = true;
    $('.menuButton').on('click',function(){
        if(flag){
            $('.menu').addClass('active');
        }else{
            $('.menu').removeClass('active');
        }

        if($('nav').hasClass('pageNav2')){
            if(flag){
                $('.menu').addClass('menuShow');
            }else{
                $('.menu').removeClass('menuShow');
            }
        }
        flag = !flag;
    })

    //内层第四页模仿街上人走动效果
    $('#page-2 .left .sv').on('mousemove', function(event){
        var center = $('#page-2 .left').width()/2;
        var moveX = (event.clientX - center)/(center/30)
        $('.street>img').eq(2).css('transform', 'translate3d('+moveX+'px,0,0)');
        $('.street>img').eq(1).css('transform', 'translate3d('+(-moveX)+'px,0,0)');
    });

    //内层页面中鼠标、箭头样式导航
    $('#page-2>.mouse').on('click', scrollDown);
    $('#page-2>.lineNav>.arrowNav>.downBox').on('click', scrollDown);
    $('#page-2>.lineNav>.arrowNav>.upBox').on('click', scrollUp);
    //下一页
    function scrollDown(){
        var scrollH = $(window).height();
        corePage++;
        if(corePage>4){
            corePage = 4;
            page = 2;
            $('.container>ul').stop().animate({'marginTop': -(scrollH+$('#page-3').outerHeight())+'px'}, 500);
            $('.container>nav').addClass('pageNav3');
            $('.menu').removeClass('menuShow');
            return;
        }
        playOrPause();
        $('#page-2>.left').stop().animate({'marginTop':-scrollH*corePage}, 500);
        $('#page-2>.right').stop().animate({'marginTop':-scrollH*corePage}, 600);
        $('.page2Text>.num').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 500);
        $('.page2Text>.ctrl').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 600);
    }
    //上一页
    function scrollUp(){
        var scrollH = $(window).height();
        if(page === 1){
            corePage--;
            if(corePage<0){
                corePage = 0;
                page = 0;
                $('.container>ul').stop().animate({'marginTop': 0}, 500);
                $('.container>nav').removeClass('pageNav2').removeClass('pagesider');
                return;
            }
            playOrPause();
            $('#page-2>.left').stop().animate({'marginTop':-scrollH*corePage}, 500);
            $('#page-2>.right').stop().animate({'marginTop':-scrollH*corePage}, 600);
            $('.page2Text>.num').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 500);
            $('.page2Text>.ctrl').stop().animate({'marginTop':-$('.page2Text').height()*corePage}, 600);
        }
    }
});