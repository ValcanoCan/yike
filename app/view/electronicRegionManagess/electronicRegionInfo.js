angular.module("FMsainuoyi").controller('electronicRegionInfoCtrl', function (electronicRegion, systemUser, vehicleManagess, $scope, ngDialog) {
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModel.startPage = $scope.paginationConf.page
        $scope.selectModel.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    // 百度地图API功能
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 5);
    map.enableScrollWheelZoom(true);

    //获取所有电子围栏信息
    $scope.loadData = function () {
        electronicRegion.fence_find({offset: 100}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.allRailsInfo = res.data.data[0]
            }
        })
    }
    $scope.loadData();

    //画行政区域地图方法
    function getBoundary(cityName) {
        var bdary = new BMap.Boundary();
        bdary.get(cityName, function (rs) {       //获取行政区域
            map.removeOverlay($scope.ply);        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                //alert('未能获取当前输入行政区域');
                //return ;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {
                    strokeWeight: 2,
                    strokeColor: "#ff0000",
                    fillOpacity: 0.2,
                    fillColor: "deeppink"
                }); //建立多边形覆盖物
                $scope.ply = ply;
                map.addOverlay($scope.ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
            //map.setViewport(pointArray);    //调整视野
        });
    }

    //点击电子围栏显示所属城市区域方法
    function getBoundaryInner(cityName) {
        var bdary = new BMap.Boundary();
        bdary.get(cityName, function (rs) {       //获取行政区域
            //map.clearOverlays();        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                //alert('未能获取当前输入行政区域');
                //return ;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {
                    strokeWeight: 2, strokeColor: "#000", fillOpacity: 0.0, fillColor: "none",
                }); //建立多边形覆盖物
                map.addOverlay(ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
            //map.setViewport(pointArray);    //调整视野
        });
    }

    //画多边形地图方法
    function getpolygon(pointArr, thisRail) {
        map.removeOverlay($scope.ply);
        setTimeout(function () {
            var convertor = new BMap.Convertor();
            convertor.translate(pointArr, 1, 5)
            map.removeOverlay($scope.ply);
        }, 1000);
        var polygon = new BMap.Polygon(pointArr, {
            strokeColor: "#009900",
            fillOpacity: 0.2,
            fillColor: "#66FFFF",
            strokeWeight: 3,
            strokeOpacity: 0,
        });
        map.addOverlay(polygon);
        //polygon.addEventListener('click', function () {
        //    var mapArr=map.getOverlays();
        //    var clearMapArr=mapArr.splice(2,mapArr.length);
        //    for(var i=0;i<clearMapArr.length;i++){
        //        map.removeOverlay(clearMapArr[i]);
        //    }
            console.log(thisRail)
            //getBoundaryInner(thisRail.cityName)
            $scope.selectModel.fenceId = thisRail.id;
            $scope.railVehicleData();

            //获取电子围栏内还车点信息
            $scope.getPointsParam.fenceId = thisRail.id;
            $scope.getReturnPointsData();

            setTimeout(function () {
                //for (var i = 0; i < $scope.vehiclesInfo.length; i++) {
                //    var point = new BMap.Point($scope.vehiclesInfo[i].lon, $scope.vehiclesInfo[i].lat);
                //    addBike(point)
                //}
                for (var i = 0; i < $scope.vehiclesInfo.length; i++) {
                    if ($scope.vehiclesInfo[i].fenceId == thisRail.id) {
                        var point = new BMap.Point($scope.vehiclesInfo[i].lon, $scope.vehiclesInfo[i].lat);
                        //setTimeout(function(){
                        var convertor = new BMap.Convertor();
                        var pointArray = [];
                        pointArray.push(point);
                        convertor.translate(pointArray, 1, 5, addBikeCallback)
                        //}, 1000);
                        //addBike(point)
                    }
                }
            }, 1000)

            //画出还车点
            //setTimeout(function () {
            //    for (var i = 0; i < $scope.returnPointsInfo.length; i++) {
            //        var point = new BMap.Point($scope.returnPointsInfo[i].lng, $scope.returnPointsInfo[i].lat);
            //        var myIcon = new BMap.Icon("static/images/end.png", new BMap.Size(35, 40))
            //        var marker = new BMap.Marker(point, {icon: myIcon});
            //        map.addOverlay(marker);
            //        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            //    }
            //}, 1000)
            setTimeout(function () {
                for (var i = 0; i < $scope.returnPointsInfo.length; i++) {
                    var point = new BMap.Point($scope.returnPointsInfo[i].lng, $scope.returnPointsInfo[i].lat);
                    //railAddBike(point)
                    //var convertor = new BMap.Convertor();
                    //var pointArray = [];
                    //pointArray.push(point);
                    //convertor.translate(pointArray, 1, 5, returnPointCallback)
                    getPoints(point, i,map);
                }
            }, 1000)
        //})
    }


    //获取车辆数据
    $scope.getCitysData = function () {
        electronicRegion.fence_getCitys().then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                console.log(res.data.data[0])
            }
        })
    }
    //$scope.getCitysData();

    //地图显示城市方法
    function getCities(point, order) {
        var myIcon = new BMap.Icon("static/images/cityInfo.png", new BMap.Size(100, 100))
        var cityLabel = new BMap.Label($scope.labelsModel.name, {offset: new BMap.Size(23, 15)})
        //console.log($scope.labelsModel.name)
        //var normalLabel= new BMap.Label($scope.labelsModel.totalVehicle + '辆', {offset: new BMap.Size(25, 28)})
        //var alertLabel= new BMap.Label($scope.labelsModel.alert + '辆', {offset: new BMap.Size(25, 43)})
        cityLabel.setStyle({
            "color": "black",
            "fontSize": "12px",
            "textAlign": "center",
            "border": "0",
            "fontWeight": 700,
            "cursor": "pointer",
        });
        //normalLabel.setStyle({
        //    "color": "black",
        //    "fontSize": "12px",
        //    "textAlign": "center",
        //    "border": "0",
        //    "fontWeight": 700,
        //    "cursor": "pointer",
        //});
        //alertLabel.setStyle({
        //    "color": "red",
        //    "fontSize": "12px",
        //    "textAlign": "center",
        //    "border": "0",
        //    "fontWeight": 700,
        //    "cursor": "pointer",
        //});
        //var circle = new BMap.Circle(point,30000,{fillColor:"#00FFFF", strokeWeight:2, strokeOpacity:0.5}); //创建圆
        //map.addOverlay(circle);            //增加圆
        //map.addOverlay(cityLabel);
        //var marker = new BMap.Marker(point, circle);
        var marker = new BMap.Marker(point, {icon: myIcon});
        marker.cityName=$scope.labelsModel.name;
        map.addOverlay(marker);
        marker.setLabel(cityLabel);
        //circle.setLabel(normalLabel);
        //circle.setLabel(alertLabel);

        //点击城市查看电子围栏
        marker.addEventListener('click', function () {
            map.clearOverlays();
            //$scope.railVehicleData();
            console.log($scope.allRailsInfo)
            for (var i = 0; i < $scope.allRailsInfo.length; i++) {
                $scope.arr = new Array()
                //$scope.str = ''
                if ($scope.allRailsInfo[i].cityName == $scope.railCityName) {
                    for (var j = 0; j < $scope.allRailsInfo[i].fenceDetails.length; j++) {
                        $scope.arr.push(new BMap.Point($scope.allRailsInfo[i].fenceDetails[j].lng, $scope.allRailsInfo[i].fenceDetails[j].lat))
                        //$scope.str+=$scope.allRailsInfo[i].fenceDetails[j].lng+','+$scope.allRailsInfo[i].fenceDetails[j].lat+';';
                    }
                }
                //console.log($scope.arr)
                //console.log($scope.str)
                getpolygon($scope.arr, $scope.allRailsInfo[i])
                //var str=$scope.str
                //str=str.substring(0,str.length-1);
                //getpolygon(str, $scope.allRailsInfo[i])
            }
            var point = new BMap.Point($scope.citiesInfo[order].lon, $scope.citiesInfo[order].lat);
            map.centerAndZoom(point, 11);

            //for(var i=0;i<$scope.vehiclesInfo.length;i++){
            //    var point = new BMap.Point($scope.vehiclesInfo[i].lon, $scope.vehiclesInfo[i].lat);
            //    addBike(point)
            //}
        });

        //鼠标经过城市查看城市行政区域
        marker.addEventListener('onmouseover', function () {
            //$scope.railCityName = marker.z.label.content;
            $scope.railCityName = marker.cityName;
            map.removeOverlay($scope.ply);

            //$scope.railVehicleData();
            //for (var i = 0; i < $scope.citiesInfo.length; i++) {
            //    getBoundary($scope.citiesInfo[i].name)
            //}
            //getBoundary(marker.z.label.content)
            getBoundary(marker.cityName)
            //var point = new BMap.Point($scope.citiesInfo[order].lon, $scope.citiesInfo[order].lat);
            //var point = new BMap.Point(marker.point.lng, marker.point.lat);
            //map.centerAndZoom(point, 8);

        })
        marker.addEventListener('onmouseout', function () {
            //var allOverlay = map.getOverlays();
            map.removeOverlay($scope.ply);

        })
    }

    //地图缩放方法
    map.addEventListener("zoomend", function () {
        //$scope.railVehicleData();
        if (this.getZoom() <= 7) {
            map.clearOverlays();
            for (var i = 0; i < $scope.citiesInfo.length; i++) {
                $scope.labelsModel = $scope.citiesInfo[i];
                var point = new BMap.Point($scope.citiesInfo[i].lon, $scope.citiesInfo[i].lat);
                getCities(point, i)
            }
        } else if (this.getZoom > 7) {
            map.clearOverlays();
            var point = new BMap.Point($scope.vehiclesInfo[0].lon, $scope.vehiclesInfo[0].lat);
            map.centerAndZoom(point, 11);
            for (var i = 0; i < $scope.vehiclesInfo.length; i++) {
                var point = new BMap.Point($scope.vehiclesInfo[i].lon, $scope.vehiclesInfo[i].lat);
                //addBike(point)
                var convertor = new BMap.Convertor();
                var pointArray = [];
                pointArray.push(point);
                convertor.translate(pointArray, 1, 5, addBikeCallback)
            }
        }
    });

    //列表点击查看电子围栏
    function getRails(singleRail, cityName, fenceId) {
        $scope.arr = new Array()
        for (var j = 0; j < singleRail.length; j++) {
            $scope.arr.push(new BMap.Point(singleRail[j].lng, singleRail[j].lat))
        }
        //console.log($scope.arr)
        railGetpolygon($scope.arr, cityName, fenceId)
    }

    //获取还车点,点击还车点删除
    function getPoints(point, i,thisMap) {

        //画还车点范围
        //var pointCenter = thisMap.getCenter();
        //创建圆对象
        var circle = new BMap.Circle(point, $scope.returnPointsInfo[i].distance, {
            strokeColor: "#3de1ad",
            strokeWeight: 2,
            fillColor: "#f00056",
            fillOpacity: 0.2
        });

        //画到地图上面
        thisMap.addOverlay(circle);

        var myIcon = new BMap.Icon("static/images/point.png", new BMap.Size(35, 40))
        var pointmarker = new BMap.Marker(point, {icon: myIcon});
        var pointLabel = new BMap.Label($scope.returnPointsInfo[i].name + ':点击详情', {offset: new BMap.Size(-20, -20)})
        pointLabel.setStyle({
            "color": "#fff",
            "border": '2px solid #0000ff',
            "backgroundColor": '#4b5cc4',
            "fontSize": "14px",
            "textAlign": "center",
            "border": "0",
            "fontWeight": 700,
            "cursor": "pointer",
        });
        //railmap.addOverlay(pointmarker);
        //map.addOverlay(pointmarker);
        thisMap.addOverlay(pointmarker);
        //pointmarker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        pointmarker.setLabel(pointLabel)

        pointmarker.pointId = $scope.returnPointsInfo[i].id;
        pointmarker.itemPoint = $scope.returnPointsInfo[i];
        //console.log(pointmarker.itemPoint)

        //获取还车点位置
        var getLocation = new BMap.Geocoder();
        getLocation.getLocation(point, function(rs){
            var thisAddress = rs.addressComponents;
            $scope.pointAddress= thisAddress.district+thisAddress.street +thisAddress.streetNumber;
            //console.log($scope.pointAddress)
            //设置删除弹框
            var content = '<div class="detailsMenu" style="width:360px;min-height:50px;margin: 0;padding: 0;">';
            content += ' <h4 style="width: 100%;box-sizing:border-box;font-weight: 700;border-bottom:2px solid #000;padding-left: 10px;height: 40px;line-height: 40px;">还车点详情信息</h4>';
            content += '<ul style="list-style: none;padding: 0;margin: 0;">';
            content += ' <li><span class="title">还车点名称：</span><span style="font-weight: 200;">' + pointmarker.itemPoint.name + '</span></li>';
            content += ' <li><span class="title">还车点半径距离(米)：</span><span style="font-weight: 200;">' + pointmarker.itemPoint.distance + '</span></li>';
            content += ' <li><span class="title">还车点中心位置：</span><span style="font-weight: 200;">' + $scope.pointAddress + '</span></li>';
            content += ' <li><button id="del-point" style="position: absolute;left: 120px;margin-top: -10px;border:none;width: 120px;height: 25px;background-color: #D70C18;color:#fff;border-radius: 5px">确认删除还车点</button></li>';

            //content += ' <li><span class="title">在线状态：</span><span style="font-weight: 200;">' + ($scope.infoModel.onlineStatus == 1 ? "在线" : "离线") + '</span></li>';
            content += ' </ul>';
            content += '</div>';
            //$compile(content)($scope)
            //content = $compile(content)($scope);
            //var infowindow = new BMap.InfoWindow(content);
            var infoBox = new BMapLib.InfoBox(thisMap,content,{windowSize:{
            },closeIconMargin: "18px 5px 0 0"
                ,enableAutoPan: true
                ,align: INFOBOX_AT_TOP});

            //还车点点击显示详细信息
            pointmarker.addEventListener('click', function () {
                infoBox.open(pointmarker);
                //this.openInfoWindow(infowindow);
                var delPointBtn = document.getElementById('del-point');
                delPointBtn.addEventListener('click', function () {
                    electronicRegion.point_del({id: pointmarker.pointId}).then(function (res) {
                        if (res.data.RESULT == 'SUCCESS') {
                            $scope.returnPointsInfo.splice($scope.returnPointsInfo.indexOf(pointmarker.itemPoint, 1));
                            $scope.promptContent='删除还车点成功';
                            ngDialog.openConfirm({
                                template: 'view/diag/promptDiag.html',
                                className: 'ngdialog-theme-default',
                                preCloseCallback: 'preCloseCallbackOnScope',
                                scope: $scope,
                            })
                        }
                    })
                    //railmap.removeOverlay(pointmarker);
                    //map.removeOverlay(pointmarker);
                    thisMap.removeOverlay(pointmarker);
                    thisMap.removeOverlay(circle);
                });
            })
        });

    }

    //列表点击画出电子围栏
    function railGetpolygon(pointArr, thisRail, fenceId) {
        var polygon = new BMap.Polygon(pointArr, {
            strokeColor: "#009900",
            fillOpacity: 0.2,
            fillColor: "#66FFFF",
            strokeWeight: 3,
            strokeOpacity: 0,
        });
        railmap.addOverlay(polygon);
        //returnmap.addOverlay(polygon);
        //polygon.addEventListener('click', function () {
            var mapArr=railmap.getOverlays();
            var clearMapArr=mapArr.splice(2,mapArr.length);
            for(var i=0;i<clearMapArr.length;i++){
                railmap.removeOverlay(clearMapArr[i]);
            }

            getBoundaryInner(thisRail)
            $scope.selectModel.fenceId = fenceId;
            $scope.railVehicleData();
            setTimeout(function () {
                for (var i = 0; i < $scope.vehiclesInfo.length; i++) {
                    if ($scope.vehiclesInfo[i].fenceId == fenceId) {
                        var point = new BMap.Point($scope.vehiclesInfo[i].lon, $scope.vehiclesInfo[i].lat);
                        //railAddBike(point)
                        var convertor = new BMap.Convertor();
                        var pointArray = [];
                        pointArray.push(point);
                        convertor.translate(pointArray, 1, 5, addRailBikeCallback)
                    }
                }
            }, 1000)
            //railmap.removeOverlay(pointmarker);
            //railmap.removeOverlay(circle);


            //画出还车点
            setTimeout(function () {
                for (var i = 0; i < $scope.returnPointsInfo.length; i++) {
                    var point = new BMap.Point($scope.returnPointsInfo[i].lng, $scope.returnPointsInfo[i].lat);
                    //railAddBike(point)
                    //var convertor = new BMap.Convertor();
                    //var pointArray = [];
                    //pointArray.push(point);
                    //convertor.translate(pointArray, 1, 5, returnPointCallback)
                    getPoints(point, i,railmap);
                }

            }, 1000)

        //})
    }

    //列表点击电子围栏添加车辆
    //function railAddBike(point) {
    //    var myIcon = new BMap.Icon("static/images/bike.png", new BMap.Size(35, 40))
    //    var marker = new BMap.Marker(point, {icon: myIcon});
    //    railmap.addOverlay(marker);
    //}

    // 百度地图API功能
    var railmap = new BMap.Map("railmap");
    var point = new BMap.Point(116.404, 39.915);
    railmap.centerAndZoom(point, 8);
    //railmap.enableScrollWheelZoom(true);

    //列表点击查看单个电子围栏
    $scope.searchRailVehicle = function (item, startPage) {
        $scope.thisRailPage = startPage;
        var railWidth = angular.element('#page-content').width();
        var point = new BMap.Point(item.fenceDetails[0].lng, item.fenceDetails[0].lat);
        railmap.centerAndZoom(point, 11);
        railmap.panBy(railWidth / 2, 260)
        railmap.enableScrollWheelZoom(true);
        angular.element('#page-content').hide();
        angular.element('#container').hide();
        angular.element('#rail-container').show();
        railmap.clearOverlays();

        //获取该电子围栏内的还车点
        $scope.getPointsParam.fenceId = item.id;
        $scope.getReturnPointsData();
        setTimeout(function(){
            getRails(item.fenceDetails, item.cityName, item.id);
        },500)

    }

    //点击回到当前电子围栏页面
    $scope.returnThisRail = function () {
        angular.element('#rail-container').hide();
        angular.element('#return-container').hide();
        angular.element('#container').hide();
        angular.element('#page-content').show();
        $scope.selectModel.startPage = $scope.thisRailPage;
        $scope.pageSelect();
    }

    // 百度地图API功能
    var returnmap = new BMap.Map("returnmap");
    var point = new BMap.Point(116.404, 39.915);
    returnmap.centerAndZoom(point, 8);
    //railmap.enableScrollWheelZoom(true);

    //电子围栏添加还车点
    function getRailsPoint(singleRail, cityName, fenceId) {
        $scope.arr = new Array()
        for (var j = 0; j < singleRail.length; j++) {
            $scope.arr.push(new BMap.Point(singleRail[j].lng, singleRail[j].lat))
        }
        //console.log($scope.arr)
        railPointGetpolygon($scope.arr, cityName, fenceId)
    }

    //添加还车点画出电子围栏
    function railPointGetpolygon(pointArr, thisRail, fenceId) {
        var polygon = new BMap.Polygon(pointArr, {
            strokeColor: "#009900",
            fillOpacity: 0.2,
            fillColor: "#66FFFF",
            strokeWeight: 3,
            strokeOpacity: 0,
        });
        returnmap.addOverlay(polygon);
    }

    //添加还车点
    $scope.addReturnPoint = function (item, startPage) {
        $scope.returnPointParams.fenceId = item.id;
        $scope.thisRailPage = startPage;
        var returnWidth = angular.element('#page-content').width();
        var point = new BMap.Point(item.fenceDetails[0].lng, item.fenceDetails[0].lat);
        returnmap.centerAndZoom(point, 11);
        returnmap.panBy(returnWidth / 2, 260)
        returnmap.enableScrollWheelZoom(true);
        angular.element('#page-content').hide();
        angular.element('#container').hide();
        angular.element('#rail-container').hide();
        angular.element('#return-container').show();
        returnmap.clearOverlays();
        setTimeout(function(){
            getRailsPoint(item.fenceDetails, item.cityName, item.id);
        },500)


        var overlays = [];
        var overlaycomplete = function (e) {
            console.log(e.overlay)
            overlays.push(e.overlay);
            //var path = e.overlay.getPath();//Array<Point> 返回点数组
            $scope.returnPointParams.lng = e.overlay.point.lng;
            $scope.returnPointParams.lat = e.overlay.point.lat;
        };
        var styleOptions = {
            strokeColor: "red",    //边线颜色。
            fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
        //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(returnmap, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: true, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
                drawingModes: [
                    BMAP_DRAWING_MARKER,
                ]
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        });
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        $scope.clearParams = function () {
            for (var i = 0; i < overlays.length; i++) {
                returnmap.removeOverlay(overlays[i]);
            }
            overlays.length = 0;
            $scope.returnPointParams.name = null;
            $scope.returnPointParams.lng = null;
            $scope.returnPointParams.lat = null;
            //console.log($scope.createParams)
            $("#cleardrawParams").tips({
                side: 1,
                msg: '清除参数成功',
                bg: '#e59729',
                time: 2
            });
        }
    }

    //创建还车点传参配置
    $scope.returnPointParams = {
        name: null,
        distance: null,
        fenceId: null,
        lng: null,
        lat: null,

    }

    //创建还车点名称、距离变化监测
    $scope.nameDistanceChange = function (name, distance) {
        $scope.returnPointParams.name = name;
        $scope.returnPointParams.distance = distance;
    }

    //确认创建还车点
    $scope.createPointSave = function () {
        electronicRegion.point_add($scope.returnPointParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '创建还车点成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
        })
    }

    //获取单个电子围栏还车点
    $scope.getPointsParam = {
        fenceId: null
    }
    $scope.getReturnPointsData = function () {
        electronicRegion.point_list($scope.getPointsParam).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.returnPointsInfo = res.data.data[0];
                console.log($scope.returnPointsInfo)
            }
        })
    }

    //删除电子围栏还车点
    $scope.delReturnPoint = function (item, startPage) {
        electronicRegion.point_del({fenceId: item.id}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '删除还车点成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            $scope.selectModel.startPage = startPage;
            $scope.pageSelect();
        })
    }

    //获取城市信息
    $scope.railCitiesData = function () {
        electronicRegion.fenceCity_list({offset: 100}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.citiesInfo = res.data.data[0];
                console.log($scope.citiesInfo)
            }
        })
    }
    $scope.railCitiesData();

    //获取车辆列表传参配置
    $scope.selectModel = {
        fenceId: null,
        startPage: $scope.paginationConf.currentPage,
        offset: null
    }

    //获取上线车辆数据
    $scope.railVehicleData = function () {
        $scope.selectModel.offset = 100000;
        electronicRegion.fenceVehicle_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.vehiclesInfo = res.data.data[0];
                console.log($scope.vehiclesInfo)
            }
        })
    }
    //$scope.railVehicleData();

    //function addBike(point) {
    //    var myIcon = new BMap.Icon("static/images/bike.png", new BMap.Size(35, 40))
    //    var marker = new BMap.Marker(point, {icon: myIcon});
    //    map.addOverlay(marker);
    //}

    addBikeCallback = function (data) {
        if (data.status === 0) {
            var myIcon = new BMap.Icon("static/images/bike.png", new BMap.Size(35, 40))
            var marker = new BMap.Marker(data.points[0], {icon: myIcon});
            map.addOverlay(marker);
            //map.setCenter(data.points[0]);
        }
    }

    addRailBikeCallback = function (data) {
        if (data.status === 0) {
            var myIcon = new BMap.Icon("static/images/bike.png", new BMap.Size(35, 40))
            var marker = new BMap.Marker(data.points[0], {icon: myIcon});
            railmap.addOverlay(marker);
            railmap.setCenter(data.points[0]);
        }
    }

    returnPointCallback = function (data) {
        if (data.status === 0) {
            var myIcon = new BMap.Icon("static/images/start.png", new BMap.Size(35, 40))
            var marker = new BMap.Marker(data.points[0], {icon: myIcon});
            railmap.addOverlay(marker);
            railmap.setCenter(data.points[0]);
        }
    }

    //点击地图查看按钮
    angular.element('#container').hide();
    angular.element('#rail-container').hide();
    angular.element('#return-container').hide();
    $scope.mapCheck = function () {
        angular.element('#page-content').hide();
        angular.element('#return-container').hide();
        angular.element('#rail-container').hide();
        angular.element('#container').show();
        map.clearOverlays();
        setTimeout(function(){
            for (var i = 0; i < $scope.citiesInfo.length; i++) {
                $scope.labelsModel = $scope.citiesInfo[i];
                $scope.labelsModel.index = i;
                var point = new BMap.Point($scope.citiesInfo[i].lon, $scope.citiesInfo[i].lat);
                getCities(point, i)
            }
        },500)

    }

    //点击列表查看按钮
    $scope.listCheck = function () {
        angular.element('#page-content').show();
        angular.element('#container').hide();
        angular.element('#rail-container').hide();
        angular.element('#return-container').hide();
    }

    //坐标创建电子围栏
    $scope.createRail = function () {
        ngDialog.openConfirm({
            template: "createRailDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function () {

        })
    }

    //坐标电子围栏名称变化监测
    $scope.railNameCityChange = function (city, railName) {
        $scope.createParams.cityId = city;
        $scope.createParams.name = railName;
    }

    $scope.addParamsArr = [];

    //坐标保存参数操作
    $scope.addSaveParams = function () {
        var railLng = $('#railLng').val();
        var railLat = $('#railLat').val();
        var railOrder = $('#railOrder').val();
        var obj = {};
        obj.lng = railLng;
        obj.lat = railLat;
        obj.order = railOrder;
        $scope.addParamsArr.push(obj);
        $("#addSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 2
        });
        console.log($scope.addParamsArr)
        $scope.createParams.fenceDetails = $scope.addParamsArr;
    }

    //坐标清除参数操作
    $scope.addClearParams = function () {
        $scope.addParamsArr = [];
        $("#addClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //信息列表传参配置
    $scope.selectModel = {
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage
    }

    //加载电子围栏列表信息
    $scope.pageSelect = function () {
        jzts();
        electronicRegion.fence_find($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.railsInfo = res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.railsInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    data.modifyTime = transTime(data.modifyTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
                console.log($scope.railsInfo)
            }
            hangge();
        })
    }

    //坐标创建电子围栏 传参配置
    $scope.createParams = {
        cityId: null,
        name: null,
        fenceDetails: [],
    }

    //坐标确认创建电子围栏
    $scope.createRailSave = function () {
        console.log($scope.createParams)
        if ($scope.createParams.name == '' || $scope.createParams.name == null || $scope.createParams.name == 'undefind' ||
            $scope.createParams.cityId == '' || $scope.createParams.cityId == null || $scope.createParams.cityId == 'undefind' ||
            $scope.createParams.fenceDetails.length == 0 || $('#railLng').val() == '' || $('#railLat').val() == '' || $('#railOrder').val() == '') {
            $scope.promptContent = '请传入正确的必要参数,并按保存按钮进行保存';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            return;
        }
        electronicRegion.fence_add($scope.createParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '创建电子围栏成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
            $scope.pageSelect();
            $scope.loadData();
        })
    }

    //删除电子围栏
    $scope.railsDel = function (item, startPage) {
        electronicRegion.fence_del({id: item.id}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '删除成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                    closeByDocument:false
                })
                $scope.railsInfo.splice($scope.railsInfo.indexOf(item, 1))
            }
            $scope.selectModel.startPage = $scope.startPage;
            $scope.pageSelect();
            $scope.loadData();
        })
    }

    //编辑电子围栏操作
    $scope.railEdit = function (item) {
        $scope.preParams = item;
        $scope.editParams.id = item.id;
        ngDialog.openConfirm({
            template: 'editRailDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function (res) {

        })
    }

    //编辑电子围栏名称变化监测
    $scope.editRailNameChange = function (editRailName) {
        $scope.editParams.name = editRailName;
    }

    //编辑电子围栏传参配置
    $scope.editParams = {
        id: null,
        name: null,
        fenceDetails: []
    }

    $scope.editParamsArr = [];

    //编辑保存参数操作
    $scope.editSaveParams = function () {
        var railLng = $('#editRailLng').val();
        var railLat = $('#editRailLat').val();
        var railOrder = $('#editRailOrder').val();
        var obj = {};
        obj.lng = railLng;
        obj.lat = railLat;
        obj.order = railOrder;
        $scope.editParamsArr.push(obj);
        $("#editParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 2
        });
        console.log($scope.editParamsArr)
        $scope.editParams.fenceDetails = $scope.editParamsArr;
    }

    //编辑清除参数操作
    $scope.editClearParams = function () {
        $scope.editParamsArr = [];
        $("#editClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //确认修改电子围栏
    $scope.editRailSave = function () {
        electronicRegion.fence_edit($scope.editParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '修改电子围栏成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            $scope.selectModel.startPage = $scope.startPage;
            $scope.pageSelect();
        })
    }

    //查看电子围栏坐标信息
    $scope.railCoordinate = function (item) {
        console.log(item.fenceDetails)
        $scope.fenceDetailsInfo = item.fenceDetails;
        ngDialog.openConfirm({
            template: 'railCoordinateDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
        })
    }

    //画图创建电子围栏
    $scope.drawRail = function () {
        var href = window.location.href.split('index.html')
        window.location.href = href[0] + 'view/electronicRegionManagess/drawRailMap.html';
    }

    //获取系统管理用户信息
    $scope.systemUserData = function () {
        systemUser.sysuser_list({offset: 10000}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.systemUserInfo = res.data.data[0];
                console.log($scope.systemUserInfo)
            }
        })
    }
    $scope.systemUserData();

    //创建电子围栏人员
    $scope.addRailStaff = function (item) {
        console.log(item)
        //$scope.addStaffParams.fenceId=item.fenceDetails[0].fenceId;
        $scope.addStaffParams.fenceId = item.id;
        ngDialog.openConfirm({
            template: 'addRailStaffDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function (res) {

        })
    }

    //添加人员名称变化监测
    $scope.addUserNameChange = function (userId) {
        $scope.addUserId = userId;
        console.log(userId);
    }

    //保存人员传参配置
    $scope.addStaffParams = {
        fenceId: null,
        sysUserIds: []
    }

    $scope.addUserIdArr = [];
    //保存人员名称参数
    $scope.addStaffSaveParams = function () {
        $scope.addUserIdArr.push($scope.addUserId);
        $scope.addStaffParams.sysUserIds = $scope.addUserIdArr;
        console.log($scope.addStaffParams)
        $("#addStaffSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 2
        });
    }

    //清空人员名称参数
    $scope.addStaffClearParams = function () {
        $scope.addStaffParams.sysUserIds = [];
        $("#addStaffClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //确认添加电子围栏人员
    $scope.addStaffSave = function () {
        if ($scope.addStaffParams.sysUserIds.length == 0) {
            $scope.promptContent = '请选择添加人员';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        electronicRegion.fenceUser_add($scope.addStaffParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '添加人员成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
            $scope.pageSelect();
            $scope.systemUserData();
        })
    }

    //修改电子围栏人员
    $scope.editRailStaff = function (item) {
        //$scope.editStaffParams.fenceId=item.fenceDetails[0].fenceId;
        $scope.editStaffParams.fenceId = item.id;
        ngDialog.openConfirm({
            template: 'editRailStaffDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function (res) {

        })
    }

    //修改人员名称变化监测
    $scope.editUserNameChange = function (userId) {
        $scope.editUserId = userId;
    }

    //保存人员传参配置
    $scope.editStaffParams = {
        fenceId: null,
        sysUserIds: []
    }

    $scope.editUserIdArr = [];
    //保存人员名称参数
    $scope.editStaffSaveParams = function () {
        $scope.editUserIdArr.push($scope.editUserId);
        $scope.editStaffParams.sysUserIds = $scope.editUserIdArr;
        $("#editStaffSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 2
        });
    }

    //清空人员名称参数
    $scope.editStaffClearParams = function () {
        $scope.editStaffParams.sysUserIds = [];
        $("#editStaffClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //确认修改电子围栏人员
    $scope.editStaffSave = function () {
        if ($scope.editStaffParams.sysUserIds.length == 0) {
            $scope.promptContent = '请选择修改人员';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        electronicRegion.fenceUser_edit($scope.editStaffParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '修改人员成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
            $scope.selectModel.startPage = $scope.startPage;
            $scope.pageSelect();
            $scope.systemUserData();
        })
    }

    //删除操作获取所有人员
    $scope.delStaffData = function () {
        electronicRegion.fenceUser_list({fenceId: $scope.delStaffParams.fenceId, offset: 10000}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.delStaffInfo = res.data.data[0];
            }
        })
    }

    //删除电子围栏人员
    $scope.delRailStaff = function (item) {
        //$scope.delStaffParams.fenceId=item.fenceDetails[0].fenceId;
        $scope.delStaffParams.fenceId = item.id;
        $scope.delStaffData();
        ngDialog.openConfirm({
            template: 'delRailStaffDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function (res) {

        })
    }

    //删除人员名称变化监测
    $scope.delUserNameChange = function (userId) {
        $scope.delUserId = userId;
        console.log(userId);
    }

    //保存人员传参配置
    $scope.delStaffParams = {
        fenceId: null,
        sysUserIds: []
    }

    $scope.delUserIdArr = [];
    //保存人员名称参数
    $scope.delStaffSaveParams = function () {
        $scope.delUserIdArr.push($scope.delUserId);
        $scope.delStaffParams.sysUserIds = $scope.delUserIdArr;
        $("#delStaffSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 2
        });
    }

    //清空人员名称参数
    $scope.delStaffClearParams = function () {
        $scope.editStaffParams.sysUserIds = [];
        $("#delStaffClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //确认删除电子围栏人员
    $scope.delStaffSave = function () {
        electronicRegion.fenceUser_del($scope.delStaffParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                if ($scope.delStaffParams.sysUserIds.length == 0) {
                    $scope.promptContent = '成功删除所有人员';
                    ngDialog.openConfirm({
                        templateUrl: 'view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                } else {
                    $scope.promptContent = '删除人员成功';
                    ngDialog.openConfirm({
                        templateUrl: 'view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                }

            }
            $scope.pageSelect();
            $scope.systemUserData();
        })
    }

    //查看电子围栏中人员列表信息
    $scope.railStaffList = function (item) {
        //localStorage.setItem('railStaffFenceId',item.fenceDetails[0].fenceId)
        localStorage.setItem('railStaffFenceId', item.id)
        var href = window.location.href.split('#/');
        window.location.href = href[0] + '#/railStaffList';
    }


    //车辆部分

    //获取车辆信息
    $scope.vehicleData = function () {
        vehicleManagess.vehicle_list({offset: 100000}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.vehicleInfo = res.data.data[0];
            }
        })
    }
    $scope.vehicleData();

    //添加电子围栏中的车辆
    //创建电子围栏中车辆
    $scope.addRailVehicle = function (item) {
        console.log(item)
        //$scope.addVehicleParams.fenceId=item.fenceDetails[0].fenceId;
        $scope.addVehicleParams.fenceId = item.id;
        ngDialog.openConfirm({
            template: 'addRailVehicleDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function (res) {

        })
    }

    //添加车辆编号变化监测
    $scope.addVehicleNoChange = function (vehicleId) {
        $scope.addVehicleId = vehicleId;
        console.log(vehicleId);
    }

    //保存车辆传参配置
    $scope.addVehicleParams = {
        fenceId: null,
        vehicleIds: []
    }

    $scope.addVehicleIdArr = [];
    //保存车辆编号参数
    $scope.addVehicleSaveParams = function () {
        $scope.addVehicleIdArr.push($scope.addVehicleId);
        $scope.addVehicleParams.vehicleIds = $scope.addVehicleIdArr;
        console.log($scope.addVehicleParams)
        $("#addVehicleSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 2
        });
    }

    //清空车辆编号参数
    $scope.addVehicleClearParams = function () {
        $scope.addVehicleParams.vehicleIds = [];
        $("#addVehicleClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //确认添加电子围栏车辆
    $scope.addVehicleSave = function () {
        if ($scope.addVehicleParams.vehicleIds.length == 0) {
            $scope.promptContent = '请选择添加车型';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        electronicRegion.fenceVehicle_add($scope.addVehicleParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '添加车辆成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
            $scope.pageSelect();
            $scope.vehicleData();
        })
    }

    //修改电子围栏车辆
    $scope.editRailVehicle = function (item) {
        //$scope.editVehicleParams.fenceId=item.fenceDetails[0].fenceId;
        $scope.editVehicleParams.fenceId = item.id;
        ngDialog.openConfirm({
            template: 'editRailVehicleDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function (res) {

        })
    }

    //修改车辆编号变化监测
    $scope.editVehicleNoChange = function (vehicleId) {
        $scope.editVehicleId = vehicleId;
    }

    //保存车辆编号传参配置
    $scope.editVehicleParams = {
        fenceId: null,
        vehicleIds: []
    }

    $scope.editVehicleIdArr = [];
    //保存车辆编号参数
    $scope.editVehicleSaveParams = function () {
        $scope.editVehicleIdArr.push($scope.editVehicleId);
        $scope.editVehicleParams.vehicleIds = $scope.editVehicleIdArr;
        $("#editVehicleSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 2
        });
    }

    //清空车辆编号参数
    $scope.editVehicleClearParams = function () {
        $scope.editVehicleParams.vehicleIds = [];
        $("#editVehicleClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //确认修改电子围栏车辆
    $scope.editVehicleSave = function () {
        if ($scope.editVehicleParams.vehicleIds.length == 0) {
            $scope.promptContent = '请选择修改车辆编号';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        electronicRegion.fenceVehicle_edit($scope.editVehicleParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '修改车辆成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
            $scope.selectModel.startPage = $scope.startPage;
            $scope.pageSelect();
            $scope.vehicleData();
        })
    }

    //删除操作获取所有车辆
    $scope.delVehicleData = function () {
        electronicRegion.fenceVehicle_list({
            fenceId: $scope.delVehicleParams.fenceId,
            offset: 10000
        }).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.delVehicleInfo = res.data.data[0];
            }
        })
    }

    //删除电子围栏车辆
    $scope.delRailVehicle = function (item) {
        //$scope.delVehicleParams.fenceId=item.fenceDetails[0].fenceId;
        $scope.delVehicleParams.fenceId = item.id;
        $scope.delVehicleData();
        ngDialog.openConfirm({
            template: 'delRailVehicleDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
        }).then(function (res) {

        })
    }

    //删除车辆编号变化监测
    $scope.delVehicleNoChange = function (vehicleId) {
        $scope.delVehicleId = vehicleId;
    }

    //保存人员传参配置
    $scope.delVehicleParams = {
        fenceId: null,
        vehicleIds: []
    }

    $scope.delVehicleIdArr = [];
    //保存车辆编号参数
    $scope.delVehicleSaveParams = function () {
        $scope.delVehicleIdArr.push($scope.delVehicleId);
        $scope.delVehicleParams.vehicleIds = $scope.delVehicleIdArr;
        $("#delVehicleSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 2
        });
    }

    //清空车辆编号参数
    $scope.delVehicleClearParams = function () {
        $scope.editVehicleParams.vehicleIds = [];
        $("#delVehicleClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 2
        });
    }

    //确认删除电子围栏车辆
    $scope.delVehicleSave = function () {

        electronicRegion.fenceVehicle_del($scope.delVehicleParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                if ($scope.delVehicleParams.vehicleIds.length == 0) {
                    $scope.promptContent = '成功删除所有车辆';
                    ngDialog.openConfirm({
                        templateUrl: 'view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                } else {
                    $scope.promptContent = '删除车辆成功';
                    ngDialog.openConfirm({
                        templateUrl: 'view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                }
            }
            $scope.pageSelect();
            $scope.vehicleData();
        })
    }

    //查看电子围栏中车辆列表信息
    $scope.railVehicleList = function (item) {
        //localStorage.setItem('railVehicleFenceId',item.fenceDetails[0].fenceId)
        localStorage.setItem('railVehicleFenceId', item.id)
        var href = window.location.href.split('#/');
        window.location.href = href[0] + '#/railVehicleList';
    }

})
