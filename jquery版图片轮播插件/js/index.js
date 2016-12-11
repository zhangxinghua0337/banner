~function (jQuery) {
    function banner(url, interval) {
//    获取需要操作的元素
        var $banner = $(this);
        var $bannerInner = $banner.children('.bannerInner'),
            $bannerTip = $banner.children('.bannerTip'),
            $btnLeft = $banner.children('.btnLeft'),
            $btnRight = $banner.children('.btnRight');

        var $divList = null, $imgList = null, $oLis = null;

//  1. ajax 读取数据和绑定数据
        var jsonData = null;
        $.ajax({
            url: url + '?_=' + Math.random(),
            type: 'get',
            dataType: 'json',
            async: false,//当前的请求是同步的
            success: function (data) {
                jsonData = data;
            }
        });
//    2.实现数据的绑定
        bindData();
        function bindData() {
            var str = '', str2 = '';
            $.each(jsonData, function (index, item) {
                str += " <div><img src='' trueImg='" + item["img"] + "' alt=''></div>";
                index === 0 ? str2 += "<li class='bg'></li>" : str2 += "<li></li>";
            });
            $bannerInner.html(str);
            $bannerTip.html(str2);
        }

        //绑定数据完成重新获取需要操作的元素集合
        $divList = $bannerInner.children('div');
        $imgList = $bannerInner.find('img');
        $oLis = $bannerTip.children('li');

// 3.实现图片的延迟加载
        window.setTimeout(lazyImg, 500);
        function lazyImg() {
            $imgList.each(function (index, item) {
                var oImg = new Image();
                oImg.src = $(item).attr('trueImg');
                oImg.onload = function () {
                    $(item).prop('src', this.src).css("display", "block");
                }
            });
            $divList.eq(0).css("zIndex", 1).animate({opacity: 1}, 300);
        }

//    封装一个轮播图切换的效果
        function changeBanner() {
            var $curDiv = $divList.eq(step);
            $curDiv.css('zIndex', 1).siblings().css('zIndex', 0);
            $curDiv.animate({opacity: 1}, 300, function () {
                $(this).siblings().css('opacity', 0);
            });
            var $curLi = $oLis.eq(step);
            $curLi.addClass('bg').siblings().removeClass('bg');
        }

//    4.实现自动轮播
        interval = interval || 3000;
        var step = 0, autoTimer = null;
        autoTimer = window.setInterval(autoMove, interval);
        function autoMove() {
            if (step === jsonData.length - 1) {
                step = -1;
            }
            step++;
            changeBanner();
        }

//    5.控制作用按钮的显示隐藏和自动轮播的开始和暂停
        $banner.on('mousemove', function () {
            window.clearInterval(autoTimer);
            $($btnLeft).css("display", "block");
            $($btnRight).css("display", "block");
        }).on('mouseout', function () {
            autoTimer = window.setInterval(autoMove, interval);
            $($btnLeft).css("display", "none");
            $($btnRight).css("display", "none");
        });
//    6.实现焦点切换
        $oLis.on('click', function () {
            step = $(this).index();
            changeBanner();
        });
//    7.实现左右切换
        $btnLeft.on('click', function () {
            if (step === 0) {
                step = jsonData.length;
            }
            step--;
            changeBanner();
        });
        $btnRight.on('click', autoMove)
    }
//  在jQuery的原型上扩展一个方法，调用的时候使用$().banner();
    jQuery.fn.extend({
        banner: banner
    })
}(jQuery);