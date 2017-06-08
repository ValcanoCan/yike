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
            //$scope.thisOrderInfo.points = [
            //    new BMap.Point(116.42100, 39.910000), new BMap.Point(116.40130, 39.910000),
            //    new BMap.Point(116.40160, 39.910000), new BMap.Point(116.40200, 39.910000),
            //    new BMap.Point(116.40300, 39.910500), new BMap.Point(116.40400, 39.910000),
            //    new BMap.Point(116.40500, 39.910000), new BMap.Point(116.40505, 39.919800),
            //    new BMap.Point(116.40510, 39.910000), new BMap.Point(116.40515, 39.910000),
            //    new BMap.Point(116.40525, 39.910400), new BMap.Point(116.40537, 39.915500)
            //];

            //console.log($scope.thisOrderInfo.points)

            //var str='116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504933,39.895648;116.504931,39.89565;116.504933,39.895653;116.504933,39.895653;116.504933,39.895653;116.504933,39.895653;116.504933,39.895653;116.504933,39.895653;116.504933,39.895653;116.504933,39.895653;116.504933,39.895653;116.504933,39.895653;116.504951,39.89566;116.504938,39.895676;116.5043,39.895371;116.504291,39.895398;116.504335,39.895433;116.504326,39.895413;116.504339,39.895456;116.504455,39.895796;116.504563,39.895855;116.504576,39.895845;116.504585,39.895848;116.504588,39.895848;116.504591,39.89585;116.504591,39.89585;116.504591,39.89585;116.504591,39.89585;116.5046,39.895846;116.504601,39.895845;116.504601,39.895845;116.504616,39.895845;116.504586,39.8959;116.504548,39.895995;116.504548,39.896091;116.504579,39.896243;116.504585,39.89639;116.504615,39.896516;116.504625,39.896716;116.50462,39.896863;116.504606,39.897025;116.504618,39.897131;116.504701,39.89731;116.504745,39.897456;116.504731,39.897641;116.504723,39.89776;116.504731,39.897923;116.504723,39.898038;116.504708,39.898248;116.504723,39.898398;116.504701,39.898598;116.504696,39.898741;116.504699,39.898898;116.504676,39.899051;116.504681,39.899244'
            //var str='116.504635,39.895483;116.504635,39.895483;116.504635,39.895483;116.504635,39.895483;116.504635,39.895483;116.504635,39.895483;116.504635,39.895483;116.504635,39.895483;116.504635,39.895483;116.504676,39.895486;116.504676,39.895486;116.504676,39.895486;116.504676,39.895486;116.504676,39.895486;116.504676,39.895486;116.504699,39.895496;116.504699,39.895496;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498;116.504703,39.895498'
            //var str='116.483438,39.895278;116.483466,39.895115;116.483393,39.894945;116.483458,39.894755;116.483445,39.89452;116.483454,39.89437;116.483491,39.894183;116.483508,39.893995;116.483495,39.89383;116.483544,39.893653;116.483408,39.893383;116.483428,39.893231;116.483393,39.89306;116.483331,39.892896;116.483293,39.89271;116.483285,39.892515;116.483311,39.892356;116.483315,39.89229;116.48324,39.892176;116.483166,39.892106;116.483161,39.892098;116.483161,39.892098;116.483161,39.892098;116.48315,39.892046;116.48316,39.891963;116.483156,39.891958;116.483154,39.891958;116.483183,39.891821;116.483183,39.891633;116.483186,39.891495;116.483181,39.891436;116.483053,39.891351;116.482875,39.8912;116.48277,39.891061;116.482755,39.890903;116.482848,39.890685;116.482833,39.890585;116.483061,39.890436;116.483055,39.890319;116.483045,39.890255;116.483103,39.890296;116.483113,39.890303;116.483111,39.890305;116.483111,39.890305;116.483111,39.890305'
            //
            //var str='116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504843,39.895566;116.504836,39.895593;116.504843,39.895621;116.50475,39.895713;116.504636,39.89576;116.504445,39.895771;116.504365,39.895755;116.504251,39.895734;116.50421,39.895755;116.504828,39.895509;116.504821,39.895556;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.504833,39.895505;116.504911,39.895501;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.504766,39.895591;116.504711,39.895599;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.498326,39.89449;116.504943,39.897138;116.50493,39.897043;116.50484,39.896821;116.504786,39.896719;116.504748,39.896671;116.504748,39.896671;116.504658,39.896308;116.504658,39.896308;116.504648,39.896291;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504645,39.896288;116.504876,39.895603;116.504645,39.896288;116.504645,39.896288;116.50486,39.895585;116.504645,39.896288;116.504645,39.896288;116.504635,39.89626;116.504635,39.89626;116.504639,39.896263;116.504635,39.89626;116.504641,39.896283;116.504658,39.896278;116.504655,39.896285;116.504656,39.896278;116.504486,39.896253;116.504473,39.89625;116.504475,39.896243;116.504465,39.896263;116.504463,39.896243;116.504363,39.895576;116.504381,39.895578;116.504358,39.89555;116.504963,39.895623'
            //var zuobiao = str.split(';')
            //var countiesArr = [];
            //for (var i = 0; i < zuobiao.length; i++) {
            //    var counties = new BMap.Point();
            //    counties.lng = parseFloat(zuobiao[i].split(',')[0]);
            //    //counties.lat = parseFloat(zuobiao[i].split(',')[1].split(' ')[1]);
            //    counties.lat = parseFloat(zuobiao[i].split(',')[1]);
            //    countiesArr.push(counties)
            //}
            //console.log(countiesArr)
            //$scope.thisOrderInfo.points=countiesArr;

            var countiesArr = [];
            for(var i=0;i<$scope.thisOrderInfo.points.length;i++){
                var counties = new BMap.Point();
                counties.lng=$scope.thisOrderInfo.points[i].lon;
                counties.lat=$scope.thisOrderInfo.points[i].lat;
                countiesArr.push(counties)
            }
            $scope.thisOrderInfo.points=countiesArr;
            //console.log($scope.thisOrderInfo.points)
            var getLocation = new BMap.Geocoder();
            getLocation.getLocation($scope.thisOrderInfo.points[0], function(rs) {
                //var startAddress = rs.addressComponents;
                //console.log(rs)
                //$scope.startPointAddress = startAddress.city+startAddress.district + startAddress.street + startAddress.streetNumber+'(商业区：'+rs.business+')';
                $scope.startPointAddress = rs.address+'('+rs.business+')';
                var startAddress=document.getElementById('startAddress');
                startAddress.innerText=$scope.startPointAddress
                console.log(startAddress)
            })

            getLocation.getLocation($scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length-1], function(rs) {
                //var endAddress = rs.addressComponents;
                //$scope.endPointAddress = endAddress.city+endAddress.district + endAddress.street + endAddress.streetNumber+'(商业区：'+rs.business+')';
                $scope.endPointAddress = rs.address+'('+rs.business+')';
                var endAddress=document.getElementById('endAddress');
                endAddress.innerText=$scope.endPointAddress;
                console.log(endAddress)
            })

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