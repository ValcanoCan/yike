//var locat = (window.location + '').split('/');
////$(function () {
//if ('main' == locat[3]) {
//    locat = locat[0] + '//' + locat[2];
//    console.log(locat)
//} else {
//    locat = locat[0] + '//' + locat[2] + '/' + locat[3];
//    console.log(locat)
//}
//;
console.log(FM_RequestUrl.login)


//服务器校验
function severCheck() {
    if (check()) {
        $.ajax({
            url: FM_RequestUrl.login,
            type: 'post',
            dataType: 'json',
            cache: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                account: $('#userName').val(),
                password: $('#password').val()
            }),
            success: function (jsondata) {
                if(jsondata.resultCode==11){
                    $("#userName").tips({
                        side: 1,
                        msg: "用户名或密码有误",
                        bg: '#FF5080',
                        time: 10
                    });
                    $("#userName").focus();
                }
                console.log(jsondata.data[0])
                saveToken(jsondata.data[0])
                $.cookie('account',jsondata.data[0].account,{
                    path:"/",
                    domain:""
                });
                window.location.href='../../index.html'
            }
        })
    }

    function saveToken(model) {
        $.cookie("token", model.token,{
            path: "/",
            domain: "",
            //expires: 5000,
        });
        $.cookie("userId", model.id,{
            path: "/",
            domain: "",
            //expires: 5000,
            secure: false
        });
        $.cookie("account", model.account, {
            path: "/",
            domain: "",
            //expires: 5000,
            secure: false
        });
        $.cookie("createTime",model.createTime,{
            path:"/",
            domain:"",
            secure:false
        });
        $.cookie('password',$('#password').val(),{
            path:"/",
            domain:"",
            secure:false
        })
    }
}

$(document).keyup(function (e) {
    if (!e) e = window.event;//兼容IE和谷歌、搜狐
    if ((e.keyCode || e.which) == 13) {
        $("#to-recover").trigger("click");
    }
});

//客户端校验
function check() {

    if ($("#userName").val() == "") {

        $("#userName").tips({
            side: 2,
            msg: '用户名不得为空',
            bg: '#AE81FF',
            time: 3
        });

        $("#userName").focus();
        return false;
    } else {
        $("#userName").val(jQuery.trim($('#userName').val()));
    }

    if ($("#password").val() == "") {

        $("#password").tips({
            side: 2,
            msg: '密码不得为空',
            bg: '#AE81FF',
            time: 3
        });

        $("#password").focus();
        return false;
    }

    $("#loginbox").tips({
        side: 1,
        msg: '正在登录 , 请稍后 ...',
        bg: '#68B500',
        time: 10
    });

    return true;
}

function savePaw() {
    if (!$("#saveid").attr("checked")) {
        $.cookie('account', '', {
            expires: -1
        });
        $.cookie('password', '', {
            expires: -1
        });
        $("#userName").val('');
        $("#password").val('');
    }
}

function saveCookie() {
    if ($("#saveid").attr("checked")) {
        $.cookie('account', $("#userName").val(), {
            expires: 7
        });
        $.cookie('password', $("#password").val(), {
            expires: 7
        });
    }
}

//登录取消操作
function cancel() {
    $("#userName").val('');
    $("#password").val('');
}

//    记住密码
jQuery(function () {
    var userName = $.cookie('account');
    var password = $.cookie('password');
    if (typeof(userName) != "undefined"
        && typeof(password) != "undefined") {
        $("#userName").val(userName);
        $("#password").val(password);
        $("#saveid").attr("checked", true);
        //$("#code").focus();
    }
});
