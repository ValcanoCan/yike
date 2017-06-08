angular.module("FMsainuoyi").controller('vehicleMonitorCtrl', function (vehicleManagess, electronicRegion, ngDialog, $scope) {
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 4);
    map.enableScrollWheelZoom(true);

    //获取所有电子围栏信息
    $scope.loadData = function () {
        electronicRegion.fence_find({offset: 100}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.allRailsInfo = res.data.data[0].list
            }
        })
    }
    $scope.loadData();

    //地图显示城市方法
    function getCities(point, order) {
        var myIcon = new BMap.Icon("static/images/cityInfo.png", new BMap.Size(100, 100))
        var cityLabel = new BMap.Label($scope.labelsModel.name, {offset: new BMap.Size(23, 15)})
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
        marker.cityName = $scope.labelsModel.name;
        map.addOverlay(marker);
        marker.setLabel(cityLabel);
        //circle.setLabel(normalLabel);
        //circle.setLabel(alertLabel);

        //点击城市查看电子围栏
        marker.addEventListener('click', function () {
            map.clearOverlays();
            //$scope.railVehicleData();
            for (var i = 0; i < $scope.allRailsInfo.length; i++) {
                $scope.arr = new Array()
                //$scope.str = ''
                if ($scope.allRailsInfo[i].cityName == $scope.railCityName) {
                    for (var j = 0; j < $scope.allRailsInfo[i].fenceDetails.length; j++) {
                        $scope.arr.push(new BMap.Point($scope.allRailsInfo[i].fenceDetails[j].lng, $scope.allRailsInfo[i].fenceDetails[j].lat))
                        //$scope.str+=$scope.allRailsInfo[i].fenceDetails[j].lng+','+$scope.allRailsInfo[i].fenceDetails[j].lat+';';
                    }
                }
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
        //
        //    var clearMapArr=mapArr.splice(2,mapArr.length);
        //    for(var i=0;i<clearMapArr.length;i++){
        //        map.removeOverlay(clearMapArr[i]);
        //    }
        $scope.selectModel.fenceId = thisRail.id;
        $scope.railVehicleData();

        //获取电子围栏内还车点信息
        $scope.getPointsParam.fenceId = thisRail.id;
        $scope.getReturnPointsData();
        //function init3() {
        //    var pAry = document.getElementsByTagName("p");
        //    for( var i=0; i<pAry.length; i++ ) {
        //        (function(arg){
        //            pAry[i].onclick = function() {
        //                alert(arg);
        //            };
        //        })(i);//调用时参数
        //    }
        //}
        setTimeout(function () {
            for (var i = 0; i < $scope.vehiclesInfo.length; i++) {
                if ($scope.vehiclesInfo[i].fenceId == thisRail.id) {
                    (function (arg) {
                        var point = new BMap.Point(arg.lon, arg.lat);
                        $scope.bikeInfo = arg;
                        map.bikeInfo = arg;
                        //getPoints(point,i,map,arg)
                        var convertor = new BMap.Convertor();
                        var pointArray = [];
                        pointArray.push(point);
                        $scope.allbikeInfo = $scope.bikeInfo;
                        convertor.translate(pointArray, 1, 5, addAllBikeCallback(pointArray, $scope.bikeInfo));
                    })($scope.vehiclesInfo[i]);
                }
            }
        }, 2000)

        //})
    }

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

    //获取还车点,点击还车点删除
    function getPoints(point, i, thisMap, bikeInfo) {
        var convertor = new BMap.Convertor();
        var pointArray = [];
        pointArray.push(point);
        $scope.allbikeInfo = bikeInfo;
        convertor.translate(pointArray, 1, 5, addAllBikeCallback);
        //console.log(convertor.translate)

        //console.log(bikeInfo)
        //drawBike(convertor.translate(pointArray, 1, 5, addBikeCallback),bikeInfo)
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
        }
    });

    $scope.selectModel = {
        fenceId: null,
        offset: null
    }

    //获取单个电子围栏还车点
    $scope.getPointsParam = {
        fenceId: null
    }

    $scope.getReturnPointsData = function () {
        electronicRegion.point_list($scope.getPointsParam).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.returnPointsInfo = res.data.data[0].list;
            }
        })
    }

    //获取上线车辆数据
    $scope.railVehicleData = function () {
        $scope.selectModel.offset = 100000;
        electronicRegion.fenceVehicle_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.vehiclesInfo = res.data.data[0].list;
            }
        })
    }

    //获取城市信息
    $scope.citiesInfo = [];
    $scope.allVehiclesArr = [];
    $scope.railCitiesData = function () {
        //electronicRegion.fenceCity_list({offset: 100}).then(function (res) {
        //    if (res.data.RESULT == 'SUCCESS') {
        //        $scope.citiesInfo = res.data.data[0];
        //        for (var i = 0; i < $scope.citiesInfo.length; i++) {
        //            $scope.labelsModel = $scope.citiesInfo[i];
        //            $scope.labelsModel.index = i;
        //            var point = new BMap.Point($scope.citiesInfo[i].lon, $scope.citiesInfo[i].lat);
        //            getCities(point, i)
        //        }
        //    }
        //})
        vehicleManagess.vehicle_list({offset: 1000000}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.vehicleInfo = res.data.data[0].list;
                electronicRegion.fenceCity_list({offset: 100}).then(function (res) {
                    if (res.data.RESULT == 'SUCCESS') {
                        $scope.citiesInfos = res.data.data[0].list;
                        for (var i = 0; i < $scope.vehicleInfo.length; i++) {
                            if ($scope.vehicleInfo[i].fences.length != 0) {
                                //console.log($scope.vehicleInfo[i].fences[0])
                                $scope.allVehiclesArr.push($scope.vehicleInfo[i].fences[0].cityName);
                            }
                            //$scope.allVehiclesArr.push($scope.vehicleInfo[i].fences[0].cityName);
                        }
                        for (var j = 0; j < $scope.citiesInfos.length; j++) {
                            contains($scope.allVehiclesArr, $scope.citiesInfos[j], $scope.citiesInfo)
                        }
                        //判别所含城市
                        function contains(arr, obj, newArr) {
                            var i = arr.length;
                            while (i--) {
                                if (arr[i] === obj.name) {
                                    newArr.push(obj);
                                    return newArr;
                                }
                            }
                            return false;
                        }

                        for (var i = 0; i < $scope.citiesInfo.length; i++) {
                            $scope.labelsModel = $scope.citiesInfo[i];
                            $scope.labelsModel.index = i;
                            var point = new BMap.Point($scope.citiesInfo[i].lon, $scope.citiesInfo[i].lat);
                            getCities(point, i)
                        }
                    }
                })
            }
        })
    }
    $scope.railCitiesData();
    map.clearOverlays();


    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 5,
        pagesLength: 5,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModels.startPage = $scope.paginationConf.page
        $scope.selectModels.offset = $scope.paginationConf.itemsPerPage
        $scope.loadVehicleData()
    });

    //加载车辆列表传参配置
    $scope.selectModels = {
        keyword: null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage
    }

    //获取所有车辆信息
    $scope.loadVehicleData = function () {
        vehicleManagess.vehicle_list($scope.selectModels).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.vehicleInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                //$scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.vehicleInfo, function (data, index) {
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                    //data.createTime = transTime(data.createTime);
                    data.productDate = transTime(data.productDate);
                })
            }
        })
    }

    //模糊查询
    $scope.vehicleSearch = function () {
        $scope.selectModel.keyword = $scope.keyword;
        if ($scope.keyword == '' || $scope.keyword == null || $scope.keyword == 'undefind') {
            $scope.promptContent = '请输入车型、车辆颜色、车辆编号或电机号进行查询';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
        }
        $scope.loadVehicleData();
    }

    //显示车辆列表
    angular.element('#vehicle-list').hide();
    $scope.isOpen = false;
    $scope.showVehicleList = function () {
        $scope.isOpen = !$scope.isOpen;
        if ($scope.isOpen == true) {
            angular.element('#vehicle-list').show();
            $scope.loadVehicleData()
            angular.element('#rotate').addClass('rotate')
        } else if ($scope.isOpen == false) {
            angular.element('#vehicle-list').hide();
            $scope.loadVehicleData()
            angular.element('#rotate').removeClass('rotate');
        }
    }

    //刷新车辆列表
    $scope.renovateVehicleList = function () {
        angular.element('#vehicle-list').show();
        $scope.loadVehicleData()
    }

    //点击查看车辆位置
    $scope.searchVehicle = function (item) {
        vehicleManagess.vehicle_find({id: item.id}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                angular.element('#vehicle-list').hide();
                $scope.loadVehicleData()
                //console.log(res.data.data)
                $scope.thisVehicleInfo = res.data.data[0];
                map.clearOverlays();
                var vehiclePoint = new BMap.Point($scope.thisVehicleInfo.lon, $scope.thisVehicleInfo.lat);
                if ($scope.thisVehicleInfo.lon == null || $scope.thisVehicleInfo.lat == null) {
                    $scope.promptContent = '该车辆未加入电子围栏,不能在地图显示';
                    ngDialog.openConfirm({
                        templateUrl: 'view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                    return;
                }
                map.centerAndZoom(vehiclePoint, 14);
                $scope.bikeInfo = $scope.thisVehicleInfo;

                var convertor = new BMap.Convertor();
                var pointArray = [];
                pointArray.push(vehiclePoint);
                convertor.translate(pointArray, 1, 5, addBikeCallback)
                //获取车辆当前位置
                //var getLocation = new BMap.Geocoder();
                //getLocation.getLocation(vehiclePoint, function(rs) {
                //    var thisAddress = rs.addressComponents;
                //    $scope.pointAddress = thisAddress.district + thisAddress.street + thisAddress.streetNumber;
                //    var convertor = new BMap.Convertor();
                //    var pointArray = [];
                //    pointArray.push(vehiclePoint);
                //    convertor.translate(pointArray, 1, 5, addBikeCallback)
                //})
            }
        })
    }

    addBikeCallback = function (data) {
        if (data.status === 0) {
            var myIcon = new BMap.Icon("static/images/bike.png", new BMap.Size(35, 40))
            var marker = new BMap.Marker(data.points[0], {icon: myIcon});
            map.addOverlay(marker);
            //map.setCenter(data.points[0]);

            console.log(data.points[0])

            //console.log($scope.bikeInfo)
            marker.bikeInfo = $scope.bikeInfo;
            //marker.pointAddress=$scope.pointAddress;
            //获取车辆当前位置
            var getLocation = new BMap.Geocoder();
            getLocation.getLocation(data.points[0], function (rs) {
                var thisAddress = rs.addressComponents;
                $scope.pointAddress = thisAddress.district + thisAddress.street + thisAddress.streetNumber;
                marker.pointAddress = $scope.pointAddress;
            })
            //console.log(marker)

            //还车点点击显示详细信息
            marker.addEventListener('click', function () {

                $scope.uploadTime = '';
                marker.bikeInfo.electrombileRunning.infoTime = marker.bikeInfo.electrombileRunning.infoTime.toString();
                var Ystr, Mstr, Dstr, Hstr, mstr, sstr;
                Ystr = marker.bikeInfo.electrombileRunning.infoTime.slice(0, 4);
                Mstr = marker.bikeInfo.electrombileRunning.infoTime.slice(4, 6);
                Dstr = marker.bikeInfo.electrombileRunning.infoTime.slice(6, 8);
                Hstr = marker.bikeInfo.electrombileRunning.infoTime.slice(8, 10);
                mstr = marker.bikeInfo.electrombileRunning.infoTime.slice(10, 12);
                sstr = marker.bikeInfo.electrombileRunning.infoTime.slice(12, 14);
                $scope.infoTime = Ystr + '-' + Mstr + '-' + Dstr + '  ' + Hstr + ':' + mstr + ':' + sstr;

                var content = '<div class="bikeInfoMenu" style="min-width:360px;min-height:80px;margin: 0;padding: 0;">';
                content += ' <h4 style="width: 100%;border-bottom:2px solid #000;padding-left: 10px;box-sizing:border-box;height: 40px;line-height: 40px;font-weight: 700;">车辆详情信息</h4>';
                content += '<ul style="list-style: none;padding: 0;margin: 0;">';
                content += ' <li><span class="title">车辆当前位置：</span><span style="font-weight: 200;">' + marker.pointAddress + '</span></li>';
                content += ' <li><span class="title">车辆编号：</span><span style="font-weight: 200;">' + marker.bikeInfo.carNo + '</span></li>';
                content += ' <li><span class="title">车速(m/s)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.speed + '</span></li>';
                content += ' <li><span class="title">电池温度(℃)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.batteryTemp + '</span></li>';
                content += ' <li><span class="title">当前电量(%)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.soc + '</span></li>';
                content += ' <li><span class="title">总电流(A)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalCurrent + '</span></li>';
                content += ' <li><span class="title">总电压(V)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalVoltage + '</span></li>';
                content += ' <li><span class="title">设备标识号：</span><span class="vehicle-status" style="font-weight: 200;">' + marker.bikeInfo.electrombileStatus.deviceId + '</span></li>';
                content += ' <li><span class="title">删除状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.status == 1 ? "未删除" : "已删除") + '</span></li>';
                content += ' <li><span class="title">累积里程(km)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalMileage + '</span></li>';
                content += ' <li><span class="title">电池盒锁状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.batteryBoxLockStatus == 0 ? "锁关闭" : (marker.bikeInfo.electrombileRunning.batteryBoxLockStatus == 1 ? "锁开启" : "未知")) + '</span></li>';
                content += ' <li><span class="title">车锁状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.lockStatus == 0 ? "锁关闭" : (marker.bikeInfo.electrombileRunning.lockStatus == 1 ? "锁开启" : "未知")) + '</span></li>';
                content += ' <li><span class="title">充电状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.chargeStatus == 0 ? "放电" : (marker.bikeInfo.electrombileRunning.chargeStatus == 1 ? "充电" : "未知")) + '</span></li>';
                content += ' <li><span class="title">在线状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.onlineStatus == 1 ? "在线" : (marker.bikeInfo.electrombileRunning.onlineStatus == 2 ? "离线" : "未知")) + '</span></li>';
                content += ' <li><span class="title">力矩(Nm)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.torque + '</span></li>';
                content += ' <li><span class="title">充放电次数(次)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.chargeNum + '</span></li>';
                content += ' <li><span class="title">电源状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileStatus.power == 0 ? "异常" : (marker.bikeInfo.electrombileStatus.power == 1 ? "正常" : "未知")) + '</span></li>';
                content += ' <li><span class="title">告警状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileStatus.warning == 0 ? "异常" : (marker.bikeInfo.electrombileStatus.warning == 1 ? "正常" : "未知")) + '</span></li>';
                content += ' <li><span class="title">SIM卡状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileStatus.sim == 0 ? "异常" : (marker.bikeInfo.electrombileStatus.sim == 1 ? "正常" : "未知")) + '</span></li>';
                content += ' <li><span class="title">acc状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileStatus.acc == 0 ? "断电" : (marker.bikeInfo.electrombileStatus.acc == 1 ? "通电" : "未知")) + '</span></li>';
                content += ' <li><span class="title">上报时间：</span><span style="font-weight: 200;">' + $scope.infoTime + '</span></li>';
                //content += ' <li><span class="title">在线状态：</span><span style="font-weight: 200;">' + ($scope.infoModel.onlineStatus == 1 ? "在线" : "离线") + '</span></li>';
                content += ' </ul>';
                //content += ' <button id="del-point" style="position: absolute;left: 120px;margin-top: 10px;width: 120px;height: 25px;background-color: #D70C18;color:#fff;border-radius: 5px">确认删除还车点</button>';
                content += '</div>';
                //$compile(content)($scope)
                //content = $compile(content)($scope);
                //var windowSize = {
                //    background: 'url("static/login/images/banner_slide_03.jpg")'
                //}
                //var infowindow = new BMap.InfoWindow(content,windowSize);
                //this.openInfoWindow(infowindow);
                var infoBox = new BMapLib.InfoBox(map, content, {
                    windowSize: {
                        //width:'360px',
                        //height:'500px',
                    }, closeIconMargin: "18px 5px 0 0"
                    , enableAutoPan: true
                    , align: INFOBOX_AT_TOP
                });
                infoBox.open(marker);
                marker.enableDragging();

                var vehicleDetails = angular.element('.vehicle-status');
                for (var i = 0; i < vehicleDetails.length; i++) {
                    switch (vehicleDetails[i].innerHTML) {
                        case '异常':
                            vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                            //console.log(vehicleDetails[i].className)
                            break;
                        case '断电':
                            vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                            break;
                        case '离线':
                            vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                            break;
                        case '已删除':
                            vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                            break;
                        case '锁开启':
                            vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                            break;
                    }
                }
            })
        }
    }

    function addAllBikeCallback(data, bikeInfo) {
        $scope.allbikeInfo = bikeInfo;
        data = GpsToBaiduPoints(data)
        var myIcon = new BMap.Icon("static/images/bike.png", new BMap.Size(35, 40))
        var marker = new BMap.Marker(data[0], {icon: myIcon});
        //map.setCenter(data.points[0]);

        marker.bikeInfo = $scope.allbikeInfo;
        var getLocation = new BMap.Geocoder();
        getLocation.getLocation(data[0], function (rs) {
            var thisAddress = rs.addressComponents;
            $scope.pointAddress = thisAddress.district + thisAddress.street + thisAddress.streetNumber;
            marker.pointAddress = $scope.pointAddress;
        })
        //console.log(marker)

        //还车点点击显示详细信息
        marker.addEventListener('click', function () {

            $scope.uploadTime = '';
            marker.bikeInfo.electrombileRunning.infoTime = marker.bikeInfo.electrombileRunning.infoTime.toString();
            var Ystr, Mstr, Dstr, Hstr, mstr, sstr;
            Ystr = marker.bikeInfo.electrombileRunning.infoTime.slice(0, 4);
            Mstr = marker.bikeInfo.electrombileRunning.infoTime.slice(4, 6);
            Dstr = marker.bikeInfo.electrombileRunning.infoTime.slice(6, 8);
            Hstr = marker.bikeInfo.electrombileRunning.infoTime.slice(8, 10);
            mstr = marker.bikeInfo.electrombileRunning.infoTime.slice(10, 12);
            sstr = marker.bikeInfo.electrombileRunning.infoTime.slice(12, 14);
            $scope.infoTime = Ystr + '-' + Mstr + '-' + Dstr + '  ' + Hstr + ':' + mstr + ':' + sstr;

            var content = '<div class="bikeInfoMenu" style="min-width:360px;min-height:80px;margin: 0;padding: 0;">';
            content += ' <h4 style="width: 100%;border-bottom:2px solid #000;padding-left: 10px;box-sizing:border-box;height: 40px;line-height: 40px;font-weight: 700;">车辆详情信息</h4>';
            content += '<ul style="list-style: none;padding: 0;margin: 0;">';
            content += ' <li><span class="title">车辆当前位置：</span><span style="font-weight: 200;">' + marker.pointAddress + '</span></li>';
            content += ' <li><span class="title">车辆编号：</span><span style="font-weight: 200;">' + marker.bikeInfo.carNo + '</span></li>';
            content += ' <li><span class="title">车速(m/s)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.speed + '</span></li>';
            content += ' <li><span class="title">电池温度(℃)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.batteryTemp + '</span></li>';
            content += ' <li><span class="title">当前电量(%)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.soc + '</span></li>';
            content += ' <li><span class="title">总电流(A)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalCurrent + '</span></li>';
            content += ' <li><span class="title">总电压(V)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalVoltage + '</span></li>';
            content += ' <li><span class="title">设备标识号：</span><span class="vehicle-status" style="font-weight: 200;">' + marker.bikeInfo.electrombileStatus.deviceId + '</span></li>';
            content += ' <li><span class="title">删除状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.status == 1 ? "未删除" : "已删除") + '</span></li>';
            content += ' <li><span class="title">累积里程(km)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalMileage + '</span></li>';
            content += ' <li><span class="title">电池盒锁状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.batteryBoxLockStatus == 0 ? "锁关闭" : (marker.bikeInfo.electrombileRunning.batteryBoxLockStatus == 1 ? "锁开启" : "未知")) + '</span></li>';
            content += ' <li><span class="title">车锁状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.lockStatus == 0 ? "锁关闭" : (marker.bikeInfo.electrombileRunning.lockStatus == 1 ? "锁开启" : "未知")) + '</span></li>';
            content += ' <li><span class="title">充电状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.chargeStatus == 0 ? "放电" : (marker.bikeInfo.electrombileRunning.chargeStatus == 1 ? "充电" : "未知")) + '</span></li>';
            content += ' <li><span class="title">在线状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileRunning.onlineStatus == 1 ? "在线" : (marker.bikeInfo.electrombileRunning.onlineStatus == 2 ? "离线" : "未知")) + '</span></li>';
            content += ' <li><span class="title">力矩(Nm)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.torque + '</span></li>';
            content += ' <li><span class="title">充放电次数(次)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.chargeNum + '</span></li>';
            content += ' <li><span class="title">电源状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileStatus.power == 0 ? "异常" : (marker.bikeInfo.electrombileStatus.power == 1 ? "正常" : "未知")) + '</span></li>';
            content += ' <li><span class="title">告警状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileStatus.warning == 0 ? "异常" : (marker.bikeInfo.electrombileStatus.warning == 1 ? "正常" : "未知")) + '</span></li>';
            content += ' <li><span class="title">SIM卡状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileStatus.sim == 0 ? "异常" : (marker.bikeInfo.electrombileStatus.sim == 1 ? "正常" : "未知")) + '</span></li>';
            content += ' <li><span class="title">acc状态：</span><span class="vehicle-status" style="font-weight: 200;">' + (marker.bikeInfo.electrombileStatus.acc == 0 ? "断电" : (marker.bikeInfo.electrombileStatus.acc == 1 ? "通电" : "未知")) + '</span></li>';
            content += ' <li><span class="title">上报时间：</span><span style="font-weight: 200;">' + $scope.infoTime + '</span></li>';
            //content += ' <li><span class="title">在线状态：</span><span style="font-weight: 200;">' + ($scope.infoModel.onlineStatus == 1 ? "在线" : "离线") + '</span></li>';
            content += ' </ul>';
            //content += ' <button id="del-point" style="position: absolute;left: 120px;margin-top: 10px;width: 120px;height: 25px;background-color: #D70C18;color:#fff;border-radius: 5px">确认删除还车点</button>';
            content += '</div>';
            //$compile(content)($scope)
            //content = $compile(content)($scope);
            //var windowSize = {
            //    background: 'url("static/login/images/banner_slide_03.jpg")'
            //}
            //var infowindow = new BMap.InfoWindow(content,windowSize);
            //this.openInfoWindow(infowindow);
            var infoBox = new BMapLib.InfoBox(map, content, {
                windowSize: {
                    //width:'360px',
                    //height:'500px',
                }, closeIconMargin: "18px 5px 0 0"
                , enableAutoPan: true
                , align: INFOBOX_AT_TOP
            });
            infoBox.open(marker);
            marker.enableDragging();

            var vehicleDetails = angular.element('.vehicle-status');
            for (var i = 0; i < vehicleDetails.length; i++) {
                switch (vehicleDetails[i].innerHTML) {
                    case '异常':
                        vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                        //console.log(vehicleDetails[i].className)
                        break;
                    case '断电':
                        vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                        break;
                    case '离线':
                        vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                        break;
                    case '已删除':
                        vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                        break;
                    case '锁开启':
                        vehicleDetails[i].className = 'vehicle-status' + ' ' + 'inclose';
                        break;
                }
            }
        })
        map.addOverlay(marker);

    }
})
