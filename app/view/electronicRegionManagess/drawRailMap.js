angular.module("drawRailMap", ['ngDialog']).controller('drawRailMapCtrl', ['$scope', '$http', 'ngDialog', function ($scope, $http, ngDialog) {
    // 百度地图API功能
    var map = new BMap.Map('map');
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 12);//设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); //启用鼠标滚动对地图放大缩小

    //鼠标绘制完成回调方法   获取各个点的经纬度
    var overlays = [];
    var overlaycomplete = function (e) {
        overlays.push(e.overlay);
        var path = e.overlay.getPath();//Array<Point> 返回多边型的点数组
        console.log(path[0])
        for (var i = 0; i < path.length; i++) {
            path[i].order = $scope.paramObj.order;
            console.log("lng:" + path[i].lng + "\n lat:" + path[i].lat);
        }
        $scope.createParams.fenceDetails = path;
        console.log($scope.createParams);
    };
    var styleOptions = {
        strokeColor: "red",    //边线颜色。
        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,       //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingMode: BMAP_DRAWING_POLYGON,//绘制模式  多边形
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes: [
                BMAP_DRAWING_POLYGON
            ]
        },
        polygonOptions: styleOptions //多边形的样式
    });

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    $scope.clearParams = function () {
        for (var i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
        }
        overlays.length = 0;
        $scope.createParams.name = null;
        $scope.createParams.fenceDetails = [];
        //console.log($scope.createParams)
        $("#cleardrawParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //获取城市信息
    $scope.railCitiesData = function () {
        $http(
            {
                url: 'http://121.43.32.168:8080/admin/fenceCity/list',
                method: 'post',
                data: {offset: 100},
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
            }).success(function (res) {
                if (res.RESULT == 'SUCCESS') {
                    $scope.railCitiesInfo = res.data[0];
                    console.log($scope.railCitiesInfo)
                    $scope.railCountiesData();
                }
            })
    }
    $scope.railCitiesData();

    //获取县区地级市数据
    $scope.railCountiesData=function(){
        $http(
            {
                url: 'http://121.43.32.168:8080/admin/fenceCity/districtsList',
                method: 'post',
                data: {id:$scope.createParams.cityId},
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
            }).success(function (res) {
                if (res.RESULT == 'SUCCESS') {
                    $scope.countiesInfo = res.data[0];
                }
            })
    }

    //县区数据
    //$scope.countiesInfo = [
    //    {name: '朝阳区'},
    //    {name: '虹口区'},
    //    {name: '徐汇区'},
    //    {name: '白云区'},
    //]
    function getBoundary(cityName) {
        map.removeOverlay($scope.ply);
        $scope.bdary = new BMap.Boundary();
        $scope.bdary.get(cityName, function (rs) {       //获取行政区域
            //map.clearOverlays();        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            var zuobiao = rs.boundaries[0].split(';')
            var countiesArr = [];
            for (var i = 0; i < zuobiao.length; i++) {
                var counties = {};
                counties.lng = parseFloat(zuobiao[i].split(',')[0]);
                counties.lat = parseFloat(zuobiao[i].split(',')[1].split(' ')[1]);
                counties.order = $scope.paramObj.order;
                countiesArr.push(counties)
            }
            console.log(countiesArr)
            $scope.countyParams.fenceDetails = countiesArr;
            if (count === 0) {
                //alert('未能获取当前输入行政区域');
                //return ;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                console.log(rs.boundaries[i])
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#009900",fillOpacity: 0.2, fillColor: "#66FFFF"}); //建立多边形覆盖物
                $scope.ply=ply;
                map.addOverlay(ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
            //map.setViewport(pointArray);    //调整视野
        });
    }

    //县区行政区域坐标参数
    $scope.countyParams = {
        name: null,
        cityId: null,
        fenceDetails: []
    }

    //县区变化监测
    $scope.countyChange = function (county) {
        var turnCounty = JSON.parse(county);
        getBoundary(turnCounty.name)
    }

    //画图创建电子围栏，传参配置
    $scope.createParams = {
        cityId: null,
        name: null,
        fenceDetails: []
    }

    $scope.paramObj = {};

    //电子围栏名称和位号变化监测
    $scope.nameOrderChange = function (city, railName, railOrder) {
        var turnCity = JSON.parse(city);
        $scope.createParams.cityId = turnCity.id;
        $scope.createParams.name = railName;
        $scope.paramObj.order = railOrder;
        var point = new BMap.Point(turnCity.lon, turnCity.lat);
        console.log(point)
        map.centerAndZoom(point, 12);
        console.log($scope.createParams)

        $scope.countyParams.name = railName;
        $scope.countyParams.cityId = turnCity.id;
        $scope.railCitiesData();
    }

    //画图确认创建电子围栏
    $scope.createRailSave = function () {
        console.log($scope.createParams)
        if ($scope.createParams.name == '' || $scope.createParams.name == null || $scope.createParams.name == 'undefind' ||
            $scope.paramObj.order == '' || $scope.paramObj.order == null || $scope.paramObj == 'undefind' ||
            $scope.createParams.fenceDetails.length == 0) {
            $scope.promptContent = '请传入正确的必要参数,并画出多边形区域';
            ngDialog.openConfirm({
                templateUrl: '../../view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            return;
        }
        $http(
            {
                url: 'http://121.43.32.168:8080/admin/fence/add',
                method: 'post',
                data: $scope.createParams,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
            }).success(function (res) {
                if (res.RESULT == 'SUCCESS') {
                    $scope.promptContent = '创建电子围栏成功';
                    ngDialog.openConfirm({
                        templateUrl: '../../view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                }
            })
    }

    $scope.countySave = function () {
        if ($scope.countyParams.name == '' || $scope.countyParams.name == null || $scope.countyParams.name == 'undefind' ||
            $scope.paramObj.order == '' || $scope.paramObj.order == null || $scope.paramObj == 'undefind' ||
            $scope.countyParams.fenceDetails.length == 0) {
            $scope.promptContent = '请传入正确的必要参数,并画出多边形区域';
            ngDialog.openConfirm({
                templateUrl: '../../view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            return;
        }
        console.log($scope.countyParams)
        $http(
            {
                url: 'http://121.43.32.168:8080/admin/fence/add',
                method: 'post',
                data: $scope.countyParams,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
            }).success(function (res) {
                if (res.RESULT == 'SUCCESS') {
                    $scope.promptContent = '创建县区电子围栏成功';
                    ngDialog.openConfirm({
                        templateUrl: '../../view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                }
            })
    }

    //返回列表页面操作
    $scope.returnList = function () {
        var href = window.location.href.split('view')
        window.location.href = href[0] + 'index.html#/electronicRegionInfo'
    }

    $(function () {
        var clicktag = 0;
        $("#freedom-btn").click(function () {
            if (clicktag == 0) {
                clicktag = 1;
                $scope.createRailSave();
                setTimeout(function () { clicktag = 0 }, 6000);
            }
            else{
                alert('请勿频繁点击！');
            }
        });
        $("#county-btn").click(function () {
            if (clicktag == 0) {
                clicktag = 1;
                $scope.countySave();
                setTimeout(function () { clicktag = 0 }, 6000);
            }
            else{
                alert('请勿频繁点击！');
            }
        });
    });
}])
