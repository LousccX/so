$(function() {
    $('.dialogBox').css('height', ($(window).height()) * 0.8);
    if (!localStorage.getItem('apikey')) {
        $('.apikey').show();
        $('.cover').show();
        $('body').css('overflow', 'hidden');
    }

    $('.apikeyBtn').click(() => {
        if ($('.apikeyInput').val()) {
            localStorage.setItem('apikey', $('.apikeyInput').val());
            $('.apikey').hide(300);
            $('.cover').hide();
            $('body').css('overflow', 'visible');
        }
    });

    $('.header img').on({
        mousedown: headerDown,
        touchstart: headerDown
    });
    $('.send').click(getData);
    $('.apikeyInput').keydown(e => {
        if (e.keyCode == 13) $('.apikeyBtn').click();
    });
    $('.text').keydown(e => {
        if (e.keyCode == 13) getData();
    });

    function nowTime() {
        let time = new Date(),
            zeroPadding = num => (num < 10 ? '0' + num : num);
        time = zeroPadding(time.getHours()) + ':' + zeroPadding(time.getMinutes()) + ':' + zeroPadding(time.getSeconds());
        return time;
    }

    $('.dialogBox .left:first-child .time').html(nowTime());

    // 得到回复信息
    function getData() {
        var text = $.trim($('.text').val());
        if (!text) return;
        $('.dialogBox').append('<p class="right"><span class="time">' + nowTime() + '</span><img src="./images/logo.png" alt="logo"></p><p class="rightContent"><textarea class="rightText" disabled>' + text + '</textarea></p><p class="left"><img src="./images/chatGPT.png" alt="chatGPT-log"><span class="time"></span></p><p class="leftContent"><textarea class="leftText" disabled>chatGPT正在思考中...</textarea></p>');
        $('.text').val("");
        $('.dialogBox .rightText:last').css('height', $('.dialogBox .rightText:last').prop('scrollHeight'));
        $('.dialogBox').scrollTop($('.dialogBox').prop('scrollHeight'));
        let Authorization = 'Bearer ' + localStorage.getItem('apikey'),
            data = JSON.stringify({
                model: 'text-davinci-003',
                user: '1',
                max_tokens: 1000,
                temperature: 0.5,
                frequency_penalty: 0,
                presence_penalty: 0,
                prompt: text
            });
        $.ajax({
            url: 'http://api.openai.com/v1/completions/',
            type: 'post',
            dataType: 'json',
            headers: {
                Authorization: Authorization,
                'Content-Type': 'application/json'
            },
            data: data,
            success: res => {
                $('.dialogBox .leftText:last').html($.trim(res.choices[0].text)).css('height', $('.dialogBox .leftContent:last-child .leftText').prop('scrollHeight'))
                $('.dialogBox .left:nth-last-child(2) .time').html(nowTime());
                $('.dialogBox').scrollTop($('.dialogBox').prop('scrollHeight'));
            },
            error: err => {
                err = JSON.parse(err.responseText);
                $('.dialogBox .leftText:last').html($.trim(err.error.message)).css('height', $('.dialogBox .leftContent:last-child .leftText').prop('scrollHeight'));
                $('.dialogBox .left:nth-last-child(2) .time').html(nowTime());
                $('.dialogBox').scrollTop($('.dialogBox').prop('scrollHeight'));
            }
        });
    }

    // 长按效果
    function headerDown() {
        let count = 0,
            timer;
        timer = setInterval(() => {
            count++;
            if (count == 2) {
                count = 0;
                clearInterval(timer);
                $('.apikey').fadeIn(300);
                $('.cover').show();
                $('body').css('overflow', 'hidden');
            }
        }, 1000);
    }
});

const setFontSize = () => {
    let baseFont = window.screen.availWidth;
    document.querySelector('html').style.fontSize = baseFont / 25 + 'px';
}

setFontSize();

window.addEventListener('resize', () => {
    setFontSize();
});