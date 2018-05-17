$(window).ready(function () {
    window.login_state = false;
    $.ajax({
        type: 'post',
        url: '/api/user/islogin',
        success: function (msg) {
            if (msg.states === 1) {
                window.login_state = true;
                window.user_info = msg.data;
            } else if (msg.states < 1) {
                window.login_state = false;
            }
            bind();
        },
        error: function () {
            hint('server busy!╰(*°▽°*)╯');
        }
    });
});

// 主要用于登录和没登录后能做那些事情
function bind() {
    var login = window.login_state;

    // 投稿点击
    $('.post-up').on('click', function () {
        if (!login) {
            window.location.href = '/user/login';
            return hint('need login first！');
        }
        window.location.href = '/post/up';
    });
}


// 上传帖子图片
function uploadPostImg(input, img) {
    uploadAvatar(input, img, function () {
        $('#form-img').css('display', 'none');
        $('.show-img').css('display', 'block');
    })
}


function uploadPost(title, content, location, lat, lng, category) {

    console.log(title, content);
    if (!title)
        return hint('need description!');

    if (!category)
        return hint('need to choose category');

    if (title.length < 2)
        return hint('description is too short!');

    if (!content)
        return hint('need image!');
    if (!location)
        return hint('need location!');
    data = 'title=' + title + '&content=' + content + '&location=' + location + '&lat=' + lat + '&lng=' + lng + '&category=' + category;
    $.ajax({
        type: 'POST',
        url: '/api/post/new',
        data: data,
        success: function (msg) {
            hint(msg.hint);
            window.location.href = '/';
        },
        error: function () {
            hint('server error!');
        }
    });
}

// 上传头像
function uploadAvatar(input, img, callback) {
    callback = callback || function () {
    };
    $(input).on('change', function () {
        var login = window.login_state;
        if (!login) {
            window.location.href = '/user/login';
            return hint('need login first！');
        }
        if (this.files !== undefined) {
            var file = this.files[0];
            var type = ['image/png', 'image/jpeg', 'image/gif'];
            if (file.size > 1024 * 1024 * 3) {
                hint('size over 3M');
                return;
            }
            if (type.indexOf(file.type) === -1) {
                hint('只能为 jpg, png, gif格式');
                return;
            }
        }
        var iframeAvatar = document.getElementById('iframe-img');
        var $formImg = $('#form-img');
        $formImg.submit();
        $formImg.append('<div class="spinner spinner-position spinner-blue"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
        var url = '';

        var time = setInterval(function () {
            url = iframeAvatar.contentWindow.window.location.href;
            if (url.indexOf('uploadredirect') !== -1) {
                clearInterval(time);
                iframeAvatar.contentWindow.window.location.href = '';
                parseUrl(url, callback);
                $('.spinner').remove();
            }
        }, 100)
    });

    function parseUrl(url, callback) {
        var prefix = 'uploadredirect/';
        url = url.substring(url.indexOf(prefix) + prefix.length);
        url = url.split('/');
        if (url.length !== 3) {
            hint('图片上传错误');
            return;
        }
        url[1] = decodeURIComponent(url[1]);
        if (url[0] < 1) {
            hint(url[1]);
            return;
        }
        if (url[0] > 0) {
            url[2] = decodeURIComponent(url[2]);
            $(img).attr('src', url[2]);
            callback();
        }
    }
}

// 获得一组没有通过审核的帖子
function getNotPass(callback) {
    $.ajax({
        type: 'get',
        url: '/api/post/notpass',
        success: function (msg) {
            callback(null, msg.topic)
        },
        error: function () {
            callback(true, null);
        }
    });
}

// 帖子通过加1
function allowPass(id, callback) {
    $.ajax({
        type: 'post',
        url: '/api/post/allowPass',
        data: '_id=' + id,
        success: function (msg) {
            callback(null, msg);
        },
        error: function () {
            callback(true, null);
        }
    })
}

// 帖子不通过加一
function notPass(id, callback) {
    $.ajax({
        type: 'post',
        url: '/api/post/notpass',
        data: '_id=' + id,
        success: function (msg) {
            callback(null, msg);
        },
        error: function () {
            callback(true, null);
        }
    })
}

// 增加留言
function addReply(id, content, callback) {
    var data = '_id=' + id + '&content=' + content;
    $.ajax({
        type: 'post',
        url: '/api/post/addreply',
        data: data,
        success: function (msg) {
            callback(null, msg)
        },
        error: function () {
            callback(true, null);
        }
    });
}

// 获取留言
function getReply(topicId, callback) {

    var data = '_id=' + topicId;
    $.ajax({
        type: 'post',
        url: '/api/post/getreply',
        data: data,
        success: function (msg) {
            callback(null, msg);
        },
        error: function () {
            callback(true, null);
        }
    });
}

// 喜欢一条帖子
function like(topicId, callback) {
    var data = '_id=' + topicId;
    $.ajax({
        type: 'post',
        url: '/api/post/like',
        data: data,
        success: function (msg) {
            callback(null, msg);
        },
        error: function () {
            callback(true, null);
        }
    });
}
//删除一个帖子

// 喜欢一条评论
function likeReply(replyId, callback) {
    var data = '_id=' + replyId;
    $.ajax({
        type: 'post',
        url: '/api/post/likereply',
        data: data,
        success: function (msg) {
            callback(null, msg);
        },
        error: function () {
            callback(true, null);
        }
    });
}

function getNewTopic(text, callback){
    data = 'text=' + text
    $.ajax({
        type: 'post',
        url: '/',
        data: data,
        success: function (data) {
            location.reload();
          },
        error: function () {
            callback(true, null);
        }
    });
}