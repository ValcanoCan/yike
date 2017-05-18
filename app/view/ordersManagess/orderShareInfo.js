angular.module("orderShareInfo", []).controller('orderShareInfoCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    //转化时间
    function formatSeconds(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if(secondTime > 60000) {
            minuteTime = parseInt(secondTime/60000);
            secondTime = parseInt(secondTime%60000);
            //if(minuteTime > 60) {
            //    //hourTime = parseInt(minuteTime/60);
            //    minuteTime = parseInt(minuteTime%60);
            //}
        }
        //var result = ""+parseInt(secondTime/1000)+"秒";
        var result = "";
        if(secondTime<60000){
            result=1;
        }
        if(minuteTime > 0&&parseInt(secondTime%60000)!=0) {
            result = parseInt(minuteTime)+1;
        }
        //if(hourTime > 0) {
        //    result = ""+parseInt(hourTime)+"小时"+result;
        //}
        return result;
    }

    var map = new BMap.Map("allmap");
    //查看分享订单详细信息
    //$scope.orderId = decodeURI(window.location.href.split('id=')[1]);
    $scope.orderId=decodeURI (window.location.href.split('id=')[1].split('&type=')[0]);
    $scope.type=decodeURI (window.location.href.split('id=')[1].split('&type=')[1]);
    $http(
        {
            url: 'http://121.43.32.168:8080/admin/order/share',
            method: 'post',
            data: {id: $scope.orderId,type:$scope.type},
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
        }).success(function (res) {
            if (res.RESULT == 'SUCCESS') {
                $scope.thisOrderInfo = res.data[0];
                $scope.thisOrderInfo.rideTime=formatSeconds($scope.thisOrderInfo.overTime-$scope.thisOrderInfo.createTime);
                console.log($scope.thisOrderInfo)
            }
            $scope.thisOrderInfo.points = [
                new BMap.Point(116.42100, 39.910000), new BMap.Point(116.40130, 39.910000),
                new BMap.Point(116.40160, 39.910000), new BMap.Point(116.40200, 39.910000),
                new BMap.Point(116.40300, 39.910500), new BMap.Point(116.40400, 39.910000),
                new BMap.Point(116.40500, 39.910000), new BMap.Point(116.40505, 39.919800),
                new BMap.Point(116.40510, 39.910000), new BMap.Point(116.40515, 39.910000),
                new BMap.Point(116.40525, 39.910400), new BMap.Point(116.40537, 39.915500)
            ];

            // 百度地图API功能
            var point = new BMap.Point($scope.thisOrderInfo.points[Math.floor($scope.thisOrderInfo.points.length/2)].lng, $scope.thisOrderInfo.points[Math.floor($scope.thisOrderInfo.points.length/2)].lat);
            map.centerAndZoom(point, 14);
            map.enableScrollWheelZoom(true);
            //通过DrivingRoute获取一条路线的point
            var driving = new BMap.DrivingRoute(map);
            driving.search(new BMap.Point($scope.thisOrderInfo.points[0].lng, $scope.thisOrderInfo.points[0].lat), new BMap.Point($scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length - 1].lng, $scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length - 1].lat));
            driving.setSearchCompleteCallback(function () {
            //得到路线上的所有point
                $scope.thisOrderInfo.points = driving.getResults().getPlan(0).getRoute(0).getPath();
            //画面移动到起点和终点的中间
                centerPoint = new BMap.Point(($scope.thisOrderInfo.points[0].lng + $scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length - 1].lng) / 2, ($scope.thisOrderInfo.points[0].lat + $scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length - 1].lat) / 2);
                map.panTo(centerPoint);
            //连接所有点
                map.addOverlay(new BMap.Polyline($scope.thisOrderInfo.points, {
                    strokeColor: "black",
                    strokeWeight: 5,
                    strokeOpacity: 1
                }));
            });
            for(var i=0;i<$scope.thisOrderInfo.points.length;i++){
                var point = new BMap.Point($scope.thisOrderInfo.points[i].lng, $scope.thisOrderInfo.points[i].lat);
                var convertor = new BMap.Convertor();
                $scope.pointArray = [];
                $scope.pointArray.push(point);
                convertor.translate($scope.pointArray, 1, 5, addPrintsCallback)
            }


        })

    addPrintsCallback = function (data) {
        if (data.status === 0) {
            var startIcon = new BMap.Icon("../../static/images/start.png", new BMap.Size(35, 40))
            var endIcon = new BMap.Icon("../../static/images/end.png", new BMap.Size(35, 40))
            var marker1 = new BMap.Marker(new BMap.Point($scope.thisOrderInfo.points[0].lng, $scope.thisOrderInfo.points[0].lat), {icon: startIcon});
            var marker2 = new BMap.Marker(new BMap.Point($scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length - 1].lng, $scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length - 1].lat), {icon: endIcon});
            map.addOverlay(marker1);
            map.addOverlay(marker2);
            map.setCenter(data.points[0]);
        }
    }

    $scope.realName = localStorage.getItem('orderName');
    $scope.startPage = localStorage.getItem('startPage');

    //点击回到当前订单页面
    $scope.returnThisOrder = function () {
        var href = window.location.href.split('app')
        window.location.href = href[0] + 'app/index.html#/orderInfo';
        $scope.flag = true;
        localStorage.setItem('shareStartPage', $scope.startPage)
        localStorage.setItem('shareFlag', $scope.flag)
    }

}])