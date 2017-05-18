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
                $scope.ordersInfo = res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                console.log($scope.ordersInfo)
                //console.log($scope.paginationConf.totalItems)
                //console.log($scope.paginationConf.itemsPerPage)

                //$scope.orderStatusModel=[];//提取状态
                $scope.startPage = res.data.data[1].startPage;
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
    $scope.finishOrder = function (id) {
        ordersManagess.order_finish({id: id}).then(function (res) {
            console.log(res)
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
                data: {id: $scope.orderId},
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