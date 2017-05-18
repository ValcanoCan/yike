angular.module("Protocol", []).controller('protocolCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    //$scope.title = localStorage.getItem('userGuideTitle')
    //console.log($scope.title)
    $scope.title=decodeURI (window.location.href.split('title=')[1]);
    $http(
        {
            url: 'http://121.43.32.168:8080/admin/writer/title',
            method: 'post',
            data: {title: $scope.title},
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
        }).success(function (res) {
            if (res.RESULT == 'SUCCESS') {
                $scope.content = res.data[0].mainBody
                var el = $('<div></div>');
                el.html($scope.content);
                $('.guideContent').append(el)
            }
        })

    //$scope.title='服务协议';
    //
    ////切换页面
    //$rootScope.data = {
    //    show: "1",
    //};
    //$rootScope.actions =
    //{
    //    setShow: function (param,item) {
    //        $scope.title=item;
    //        $rootScope.data.show = param;
    //        $scope.showProtocol()
    //    },
    //}
    //
    ////查看文章内容页面
    //$scope.showProtocol=function(){
    //    $http(
    //        {
    //            url: 'http://121.43.32.168:8080/admin/writer/title',
    //            method: 'post',
    //            data: {title:$scope.title},
    //            headers: {'Content-Type': 'application/json;charset=UTF-8'},
    //        }).success(function (res) {
    //            if(res.RESULT=='SUCCESS'){
    //                $scope.content=res.data[0].mainBody
    //                var el = $( '<div></div>' );
    //                el.html($scope.content);
    //                if(res.data[0].title=='服务协议'){
    //                    $('.serviceProtocol').append(el)
    //                }else if(res.data[0].title=='使用协议'){
    //                    $('.useProtocol').append(el)
    //                }else if(res.data[0].title=='扣费协议'){
    //                    $('.depositProtocol').append(el)
    //                }
    //
    //            }
    //        })
    //}
    //$scope.showProtocol();

}])
