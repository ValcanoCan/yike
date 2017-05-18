
angular.module('FMsainuoyi').config(function($httpProvider){
    var num=0;
    function getCookie(token) {
        var arr, reg = new RegExp("(^| )" + token + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        }
        else{
            if(num==0){
                alert("登录状态失效，请重新登录")
            }
            num++;
            window.location.href="view/login/login.html"
        }
    }
    $httpProvider.defaults.headers.post['token'] = getCookie('token');
    $httpProvider.defaults.headers.post['userId'] = getCookie('userId');
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    //$httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
})

angular.module('FMsainuoyi').factory('DB',['$http','$q','$cookies',function(
    $http,$q,$cookies){
    return{
        basePost:function(url,model,value){
            if(!model){
                model={}
            }
            return $http.post(url,JSON.stringify(model),{
                ignoreLoadingBar: true
            }).then(function(res){
                if(res.data.resultCode==12){
                    alert("登录状态失效，请重新登录")
                    window.location.href="view/login/login.html"
                }
                if(value){
                    value=res
                }
                return res
            })
        },

    }

}])