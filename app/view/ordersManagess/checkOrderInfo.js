angular.module("FMsainuoyi").controller('checkOrderInfoCtrl', function ($scope, ordersManagess, ngDialog, $http) {
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //页面变化监测
    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModel.startPage = $scope.paginationConf.page
        $scope.selectModel.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });


    //获得查看分享订单当前页和标志位
    //$scope.thisPage=localStorage.getItem('shareStartPage');
    //$scope.thisFlag=localStorage.getItem('shareFlag');

    //传参配置
    $scope.selectModel = {
        keyword: null,
        startTime: null,
        endTime: null,
        orderStatus: null,
        startPage:$scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    //加载订单信息页面数据
    $scope.pageSelect = function () {
        jzts()
        //if($scope.thisFlag){
        //    $scope.selectModel.startPage=$scope.thisPage;
        //    //$scope.paginationConf.page=$scope.thisPage;
        //}
        ordersManagess.order_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.ordersInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                //console.log($scope.ordersInfo)
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.ordersInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    data.overTime = transTime(data.overTime);
                    //$scope.orderStatusModel.push(data.orderStatus);
                    if ($scope.startPage > 1) {
                        data.orderNumber = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNumber = index + 1;
                    }
                })

                //function undouble(arr){
                //    $scope.orderStatusArr = [];
                //    for(var i=0; i<arr.length; i++){
                //        if($scope.orderStatusArr.indexOf(arr[i]) == -1){
                //            $scope.orderStatusArr.push(arr[i]);
                //        }
                //    }
                //    return $scope.orderStatusArr;
                //}
                //undouble($scope.orderStatusModel)
            }
            hangge()
            //localStorage.removeItem('shareStartPage');
            //localStorage.removeItem('shareFlag');
        })
    }

    //清除标志位

    //点击模糊查询
    $scope.orderSearch = function () {
        $scope.selectModel.keyword = $scope.keyword;
        if ($scope.selectModel.keyword == '' || $scope.selectModel.keyword == null || $scope.selectModel.keyword == 'undefiend') {
            //alert('请输入订单ID、用户名、手机号或车辆ID进行查询')
            $scope.promptContent = '请输入用户名、手机号订单号或车牌号进行查询';
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            //return;
        }
        //else{
        $scope.pageSelect()
        //}
    }

    //按时间、订单状态查询订单信息
    $scope.timeStatusChange = function (startTime, endTime, status) {
        $scope.selectModel.startTime = startTime;
        $scope.selectModel.endTime = endTime;
        $scope.selectModel.orderStatus = status;
        $scope.pageSelect();
    }

    //点击查看订单详情
    //$scope.orderDetails=function(item){
    //    //jzts();
    //    console.log(item)
    //    $scope.orderDetailsModel=item;
    //
    //    ngDialog.openConfirm({
    //        template: "orderDetailsDiag",
    //        className: 'ngdialog-theme-default',
    //        preCloseCallback: 'preCloseCallbackOnScope',
    //        scope: $scope,
    //    }).then(function(){
    //
    //    })
    //}

    //结束订单
    $scope.finishOrder = function (order) {
        if(order.orderStatus==2){
            $scope.promptContent='订单已结束，请勿重复操作';
            ngDialog.openConfirm({
                templateUrl:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope,
            })
            return;
        }
        ordersManagess.order_finish({id: order.id}).then(function (res) {
            //console.log(res)
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '您已成功结束订单';
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
                $scope.pageSelect();
            } else if (res.data.RESULT == 'FAIL') {
                $scope.promptContent = '结束订单失败';
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
            }
        })
    }

    //查看分享订单详情信息
    $scope.orderShareInfo=function(item,startPage){
        localStorage.setItem('orderName', item.realName)
        localStorage.setItem('startPage', startPage)
        var href = window.location.href.split('index.html')

        window.location.href = href[0] + 'view/ordersManagess/orderShareInfo.html?id=' + item.id+'&type='+2;
        //localStorage.setItem('userGuideTitle', title)
    }

    //邀请好友操作
    $scope.friendInviate=function(item,startPage){
        localStorage.setItem('orderName', item.realName)
        //localStorage.setItem('startPage', startPage)
        var href = window.location.href.split('index.html')
        window.location.href = href[0] + 'view/ordersManagess/friendInvitation.html?id=' + item.realName;
        //localStorage.setItem('userGuideTitle', title)
    }

    // 百度地图API功能
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 8);
    map.enableScrollWheelZoom(true);

    //查看车辆轨迹
    angular.element('#map-container').hide();
    $scope.searchVehiclePrints = function (item,startPage) {
        $scope.orderId = item.id;
        $scope.thisOrderPage = startPage;
        $scope.thisOrder=item.realName;
        //var railWidth = angular.element('#page-content').width();
        //var point = new BMap.Point(item.fenceDetails[0].lng, item.fenceDetails[0].lat);
        //var point = new BMap.Point(item.fenceDetails[0].lng, item.fenceDetails[0].lat);
        //railmap.centerAndZoom(point, 11);
        //railmap.panBy(railWidth / 2, 260)
        map.enableScrollWheelZoom(true);
        angular.element('#page-content').hide();
        angular.element('#map-container').show();
        map.clearOverlays();
        $http(
            {
                url: 'http://121.43.32.168:8080/admin/order/share',
                method: 'post',
                data: {id: $scope.orderId,type:2},
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
                var str='116.483438,39.895278;116.483466,39.895115;116.483393,39.894945;116.483458,39.894755;116.483445,39.89452;116.483454,39.89437;116.483491,39.894183;116.483508,39.893995;116.483495,39.89383;116.483544,39.893653;116.483408,39.893383;116.483428,39.893231;116.483393,39.89306;116.483331,39.892896;116.483293,39.89271;116.483285,39.892515;116.483311,39.892356;116.483315,39.89229;116.48324,39.892176;116.483166,39.892106;116.483161,39.892098;116.483161,39.892098;116.483161,39.892098;116.48315,39.892046;116.48316,39.891963;116.483156,39.891958;116.483154,39.891958;116.483183,39.891821;116.483183,39.891633;116.483186,39.891495;116.483181,39.891436;116.483053,39.891351;116.482875,39.8912;116.48277,39.891061;116.482755,39.890903;116.482848,39.890685;116.482833,39.890585;116.483061,39.890436;116.483055,39.890319;116.483045,39.890255;116.483103,39.890296;116.483113,39.890303;116.483111,39.890305;116.483111,39.890305;116.483111,39.890305'
                var zuobiao = str.split(';')
                var countiesArr = [];
                for (var i = 0; i < zuobiao.length; i++) {
                    var counties = new BMap.Point();
                    counties.lng = parseFloat(zuobiao[i].split(',')[0]);
                    //counties.lat = parseFloat(zuobiao[i].split(',')[1].split(' ')[1]);
                    counties.lat = parseFloat(zuobiao[i].split(',')[1]);
                    countiesArr.push(counties)
                }
                console.log(countiesArr)
                $scope.thisOrderInfo.points=countiesArr;

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


    }

    //点击回到当前订单页面
    $scope.returnThisOrder = function () {
        angular.element('#map-container').hide();
        angular.element('#page-content').show();
        $scope.selectModel.startPage = $scope.thisOrderPage;
        $scope.pageSelect();
    }

    //转化时间
    function formatSeconds(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if(secondTime > 60000) {
            minuteTime = parseInt(secondTime/60000);
            secondTime = parseInt(secondTime%60000);
            if(minuteTime > 60) {
                //hourTime = parseInt(minuteTime/60);
                minuteTime = parseInt(minuteTime%60);
            }
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

    addPrintsCallback = function (data) {
        if (data.status === 0) {
            var startIcon = new BMap.Icon("static/images/start.png", new BMap.Size(35, 40))
            var endIcon = new BMap.Icon("static/images/end.png", new BMap.Size(35, 40))
            var marker1 = new BMap.Marker(new BMap.Point($scope.thisOrderInfo.points[0].lng, $scope.thisOrderInfo.points[0].lat), {icon: startIcon});
            var marker2 = new BMap.Marker(new BMap.Point($scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length - 1].lng, $scope.thisOrderInfo.points[$scope.thisOrderInfo.points.length - 1].lat), {icon: endIcon});
            map.addOverlay(marker1);
            map.addOverlay(marker2);
            map.setCenter(data.points[0]);
        }
    }

//    var points = [
//        new BMap.Point(116.40100, 39.910000), new BMap.Point(116.40130, 39.910000),
//        new BMap.Point(116.40160, 39.910000), new BMap.Point(116.40200, 39.910000),
//        new BMap.Point(116.40300, 39.910500), new BMap.Point(116.40400, 39.910000),
//        new BMap.Point(116.40500, 39.910000), new BMap.Point(116.40505, 39.919800),
//        new BMap.Point(116.40510, 39.910000), new BMap.Point(116.40515, 39.910000),
//        new BMap.Point(116.40525, 39.910400), new BMap.Point(116.40537, 39.919500)
//    ];
//
//    //通过DrivingRoute获取一条路线的point
//    var driving = new BMap.DrivingRoute(map);
//    driving.search(new BMap.Point(116.40100, 39.910000), new BMap.Point(115.95100, 39.550000));
//    driving.setSearchCompleteCallback(function () {
////得到路线上的所有point
//        points = driving.getResults().getPlan(0).getRoute(0).getPath();
////画面移动到起点和终点的中间
//        centerPoint = new BMap.Point((points[0].lng + points[points.length - 1].lng) / 2, (points[0].lat + points[points.length - 1].lat) / 2);
//        map.panTo(centerPoint);
////连接所有点
//        map.addOverlay(new BMap.Polyline(points, {strokeColor: "black", strokeWeight: 5, strokeOpacity: 1}));
//    });
//
//    var startIcon = new BMap.Icon("static/images/start.png", new BMap.Size(35, 40))
//    var endIcon = new BMap.Icon("static/images/end.png", new BMap.Size(35, 40))
//    var marker1 = new BMap.Marker(new BMap.Point(116.40100, 39.910000),{icon: startIcon});
//    var marker2 = new BMap.Marker(new BMap.Point(115.95100, 39.550000),{icon: endIcon});
//    map.addOverlay(marker1);
//    map.addOverlay(marker2);

    //显示时间弹框
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();

})