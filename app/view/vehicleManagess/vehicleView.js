angular.module("FMsainuoyi").controller('vehicleViewCtrl', function (vehicleManagess, $scope, ngDialog,$http) {
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

    //加载车辆列表传参配置
    $scope.selectModel = {
        keyword: null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage
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
        $scope.pageSelect();
    }

    //加载车辆列表信息
    $scope.pageSelect = function () {
        jzts()
        vehicleManagess.vehicle_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.vehicleInfo = res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.vehicleInfo, function (data, index) {
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                    //data.createTime = transTime(data.createTime);
                    data.productDate = transTime(data.productDate);
                })
                //console.log($scope.vehicleInfo)
            }
            hangge()
        })
    }


    //删除车辆
    $scope.vehicleDel = function (item) {
        vehicleManagess.vehicle_del({id: item.id}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '删除车辆成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.vehicleInfo.splice($scope.vehicleInfo.indexOf(item, 1))
            }
            $scope.selectModel.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }

    //车辆信息修改
    $scope.vehicleInfoEdit = function (item) {
        $scope.editParamsBefore = item;
        $scope.editParams.id = item.id;
        ngDialog.openConfirm({
            template: "vehicleInfoEditDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function (res) {})
    }

    //车辆信息修改传参配置
    $scope.editParams = {
        id: null,
        carType: null,
        carColor: null,
        carNo: null,
        vin: null,
        productDate: null,
        engineNo: null,
        simCode: null
    }

    //车辆信息修改参数变化监测
    $scope.editParamsChange = function (carType, carColor, carNo, productDate, vin, engineNo, simCode) {
        $scope.editParams.carType = carType;
        $scope.editParams.carColor = carColor;
        $scope.editParams.carNo = carNo;
        $scope.editParams.productDate = productDate;
        $scope.editParams.vin = vin;
        $scope.editParams.engineNo = engineNo;
        $scope.editParams.simCode = simCode;
    }

    //车辆信息修改
    $scope.editSave = function () {
        vehicleManagess.vehicle_edit($scope.editParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '修改车辆信息成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            $scope.selectModel.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }

    //车辆注册
    $scope.vehicleRegister = function () {
        ngDialog.openConfirm({
            template: 'vehicleRegistrationDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function () {

        })
    }

    //车辆注册传参配置
    $scope.registerParams = {
        carType: null,
        carColor: null,
        carNo: null,
        productDate: null,
        vin: null,
        engineNo: null,
        simCode: null
    }

    //车辆注册参数变化监测
    $scope.registerParamsChange = function (carType, carColor, carNo, productDate, vin, engineNo, simCode) {
        $scope.registerParams.carType = carType;
        $scope.registerParams.carColor = carColor;
        $scope.registerParams.carNo = carNo;
        $scope.registerParams.productDate = productDate;
        $scope.registerParams.vin = vin;
        $scope.registerParams.engineNo = engineNo;
        $scope.registerParams.simCode = simCode;
        var str=$scope.registerParams.carNo;
        var regex1=/^\d{9}$/g;
        var regex2=/^(-)?\d+$/g;
        $scope.number=regex1.test(str);
        $scope.integer=regex2.test(str);
    }

    //确认注册车辆
    $scope.registerSave = function () {
        if ($scope.registerParams.carType == '' || $scope.registerParams.carType == null || $scope.registerParams.carType == 'undefind' ||
            $scope.registerParams.carColor == '' || $scope.registerParams.carColor == null || $scope.registerParams.carColor == 'undefind' ||
            $scope.registerParams.carNo == '' || $scope.registerParams.carNo == null || $scope.registerParams.carNo == 'undefind' ||
            $scope.registerParams.productDate == '' || $scope.registerParams.productDate == null || $scope.registerParams.productDate == 'undefind' ||
            $scope.registerParams.vin == '' || $scope.registerParams.vin == null || $scope.registerParams.vin == 'undefind' ||
            $scope.registerParams.engineNo == '' || $scope.registerParams.engineNo == null || $scope.registerParams.engineNo == 'undefind' ||
            $scope.registerParams.simCode == '' || $scope.registerParams.simCode == null || $scope.registerParams.simCode == 'undefind') {

            $scope.promptContent = '请确认输入车型、车辆颜色等必要参数';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
                //closeByDocument:false
            })
            return;
        }
        if($scope.number==false||$scope.integer==false){
            $scope.promptContent = '车辆编号必须为9位数字';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        //if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test($scope.registerParams.simCode))){
        //    $scope.promptContent = '不是完整的11位手机号或者正确的手机号前七位';
        //    ngDialog.openConfirm({
        //        templateUrl: 'view/diag/promptDiag.html',
        //        className: 'ngdialog-theme-default',
        //        preCloseCallback: 'preCloseCallbackOnScope',
        //        scope: $scope
        //    })
        //    return;
        //}
        vehicleManagess.vehicle_add($scope.registerParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 1) {
                $scope.promptContent = '车辆VIN号重复,请重新输入';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preClsoeCallbackOnScope',
                    scope: $scope
                })
                return;
            }else if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 2) {
                $scope.promptContent = '车辆编号重复,请重新输入';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preClsoeCallbackOnScope',
                    scope: $scope
                })
                return;
            }else if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 3) {
                $scope.promptContent = '发动机编号重复,请重新输入';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preClsoeCallbackOnScope',
                    scope: $scope
                })
                return;
            }
           else if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 0) {
                $scope.promptContent = '添加车辆成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preClsoeCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
            setTimeout(function () {
                $scope.pageSelect();
            }, 500)
            if (res.data.RESULT == 'FAIL') {
                $scope.promptContent = '添加车辆失败';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preClsoeCallbackOnScope',
                    scope: $scope
                })
            }
        })
    }

    //车辆批量添加
    $scope.vehicleBatchRegister = function () {
        ngDialog.openConfirm({
            template: "vehicleBatchRegistrationDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        })
    }

    //上传文件Excel批量注册
    $scope.uploadFile = function () {
        if(document.querySelector('.path').value==''){
            $scope.promptContent = '请选择上传文件';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        console.log(document.querySelector('.path'))
        var fd = new FormData();
        var url = 'http://121.43.32.168:8080/admin/vehicle/import';
        var file = document.querySelector('input[type=file]').files[0];
        console.log(file);
        fd.append('file', file);
        $http({
            method: 'POST',
            url: url,
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(function (res) {
            $scope.uploadFileModel = res.data;
            console.log($scope.uploadFileModel)
            $scope.promptContent = '批量添加车辆成功';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            $scope.pageSelect();
        });
    }

    //获取车辆信息
    $scope.vehicleData = function () {
        vehicleManagess.vehicle_list({offset: 100000}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.vehicleInfo = res.data.data[0];
            }
        })
    }
    $scope.vehicleData();

    //注册车辆到IOT
    $scope.registerToIOT = function (item) {
        ngDialog.openConfirm({
            template: 'registerToIOTDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function (res) {

        })
    }

    //注册车辆编号变化监测
    $scope.registerVehicleNoChange = function (id) {
        $scope.registerId = id;
    }

    //保存车辆传参配置
    $scope.registerVehicleParams = {
        vechicleIds: []
    }

    $scope.registervechicleIdsArr = [];
    //保存车辆编号参数
    $scope.registerVehicleSaveParams = function () {
        $scope.registervechicleIdsArr.push($scope.registerId);
        $scope.registerVehicleParams.vechicleIds = $scope.registervechicleIdsArr;
        console.log($scope.registerVehicleParams)
        $("#registerVehicleSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 1
        });
    }

    //清空车辆编号参数
    $scope.registerVehicleClearParams = function () {
        $scope.registerVehicleParams.vechicleIds = [];
        $("#registerVehicleClearParams").tips({
            side: 1,
            msg: '清除参数成功',
            bg: '#e59729',
            time: 1
        });
    }

    //确认注册车辆到IOT
    $scope.registerVehicleSave = function () {
        if ($scope.registerVehicleParams.vechicleIds.length == 0) {
            $scope.promptContent = '请选择注册车辆';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        vehicleManagess.vehicle_reg($scope.registerVehicleParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '注册车辆成功';
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
        $scope.registerVehicleParams.vechicleIds.length = 0;
    }

    //查看车辆位置
    angular.element('#map-container').hide();
    // 百度地图API功能
    //var map = new BMap.Map("allmap");

    var map;
    function initMap() {
        // 添加百度地图
        map = new BMap.Map("allmap");
        map.enableScrollWheelZoom(true);
    }

    //查看车辆轨迹
    $scope.searchVehicle = function (item,startPage) {
        $scope.thisVehiclePage = startPage;
        $scope.thisVehicle=item.carNo;
        angular.element('#page-content').hide();
        angular.element('#map-container').show();
        initMap()
        vehicleManagess.vehicle_find({id:item.id}).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.thisVehicleInfo=res.data.data[0];
                map.clearOverlays();
                if($scope.thisVehicleInfo.lon==null||$scope.thisVehicleInfo.lat==null){
                    $scope.promptContent = '该车辆未加入电子围栏,不能在地图显示';
                    ngDialog.openConfirm({
                        templateUrl: 'view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                    return;
                }
                var vehiclePoint = new BMap.Point($scope.thisVehicleInfo.lon, $scope.thisVehicleInfo.lat);
                map.centerAndZoom(vehiclePoint, 14);
                $scope.bikeInfo=$scope.thisVehicleInfo;

                var convertor = new BMap.Convertor();
                var pointArray = [];
                pointArray.push(vehiclePoint);
                convertor.translate(pointArray, 1, 5, addBikeCallback)
            }
        })
    }

    addBikeCallback = function (data) {
        if (data.status === 0) {
            var myIcon = new BMap.Icon("static/images/bike.png", new BMap.Size(35, 40))
            var marker = new BMap.Marker(data.points[0], {icon: myIcon});
            map.addOverlay(marker);
            map.setCenter(data.points[0]);

            marker.bikeInfo=$scope.bikeInfo;
            //marker.pointAddress=$scope.pointAddress;
            //获取车辆当前位置
            var getLocation = new BMap.Geocoder();
            getLocation.getLocation(data.points[0], function(rs) {
                var thisAddress = rs.addressComponents;
                $scope.pointAddress = thisAddress.district + thisAddress.street + thisAddress.streetNumber;
                marker.pointAddress=$scope.pointAddress;
            })
            //console.log(marker)

            //还车点点击显示详细信息
            marker.addEventListener('click', function () {

                $scope.uploadTime='';
                marker.bikeInfo.electrombileStatus.uploadTime=marker.bikeInfo.electrombileStatus.uploadTime.toString();
                var Ystr,Mstr,Dstr,Hstr,mstr,sstr;
                Ystr=marker.bikeInfo.electrombileStatus.uploadTime.slice(0,4);
                Mstr=marker.bikeInfo.electrombileStatus.uploadTime.slice(4,6);
                Dstr=marker.bikeInfo.electrombileStatus.uploadTime.slice(6,8);
                Hstr=marker.bikeInfo.electrombileStatus.uploadTime.slice(8,10);
                mstr=marker.bikeInfo.electrombileStatus.uploadTime.slice(10,12);
                sstr=marker.bikeInfo.electrombileStatus.uploadTime.slice(12,14);
                $scope.uploadTime=Ystr+'-'+Mstr+'-'+Dstr+'  '+Hstr+':'+mstr+':'+sstr;

                var content = '<div class="bikeInfoMenu" style="min-width:360px;min-height:80px;margin: 0;padding: 0;">';
                content += ' <h4 style="width: 100%;border-bottom:2px solid #000;padding-left: 10px;box-sizing:border-box;height: 40px;line-height: 40px;font-weight: 700;">车辆详情信息</h4>';
                content += '<ul style="list-style: none;padding: 0;margin: 0;">';
                content += ' <li><span class="title">车辆当前位置：</span><span style="font-weight: 200;">' + marker.pointAddress + '</span></li>';
                content += ' <li><span class="title">设备号：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.vehicleCode + '</span></li>';
                content += ' <li><span class="title">车速(m/s)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.speed + '</span></li>';
                content += ' <li><span class="title">电池温度(℃)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.batteryTemp + '</span></li>';
                content += ' <li><span class="title">当前电量(%)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.soc + '</span></li>';
                content += ' <li><span class="title">总电流(A)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalCurrent + '</span></li>';
                content += ' <li><span class="title">总电压(V)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalVoltage + '</span></li>';
                content += ' <li><span class="title">删除状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileRunning.status==1]">' + (marker.bikeInfo.electrombileRunning.status==1?"未删除":"已删除") + '</span></li>';
                content += ' <li><span class="title">累积里程(km)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.totalMileage + '</span></li>';
                content += ' <li><span class="title">电池盒锁状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileRunning.batteryBoxLockStatus==1]">' + (marker.bikeInfo.electrombileRunning.batteryBoxLockStatus==0?"锁关闭":(marker.bikeInfo.electrombileRunning.batteryBoxLockStatus==1?"锁开启":"未知")) + '</span></li>';
                content += ' <li><span class="title">车锁状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileRunning.lockStatus==1]">' + (marker.bikeInfo.electrombileRunning.lockStatus==0?"锁关闭":(marker.bikeInfo.electrombileRunning.lockStatus==1?"锁开启":"未知")) + '</span></li>';
                content += ' <li><span class="title">充电状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileRunning.chargeStatus==1]">' + (marker.bikeInfo.electrombileRunning.chargeStatus==0?"放电":(marker.bikeInfo.electrombileRunning.chargeStatus==1?"充电":"未知")) + '</span></li>';
                content += ' <li><span class="title">在线状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileRunning.onlineStatus==1]">' + (marker.bikeInfo.electrombileRunning.onlineStatus==1?"在线":(marker.bikeInfo.electrombileRunning.onlineStatus==2?"离线":"未知")) + '</span></li>';
                content += ' <li><span class="title">力矩(Nm)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.torque + '</span></li>';
                content += ' <li><span class="title">充放电次数(次)：</span><span style="font-weight: 200;">' + marker.bikeInfo.electrombileRunning.chargeNum + '</span></li>';
                content += ' <li><span class="title">电源状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileStatus.power==1]">' + (marker.bikeInfo.electrombileStatus.power==0?"电源异常":(marker.bikeInfo.electrombileStatus.power==1?"电源正常":"未知")) + '</span></li>';
                content += ' <li><span class="title">告警状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileStatus.warning==1]">' + (marker.bikeInfo.electrombileStatus.warning==0?"告警异常":(marker.bikeInfo.electrombileStatus.warning==1?"告警正常":"未知")) + '</span></li>';
                content += ' <li><span class="title">SIM卡状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileStatus.sim==1]">' + (marker.bikeInfo.electrombileStatus.sim==0?"SIM卡异常":(marker.bikeInfo.electrombileStatus.sim==1?"SIM卡正常":"未知")) + '</span></li>';
                content += ' <li><span class="title">acc状态：</span><span style="font-weight: 200;" ng-class="{true:statistic,false:inclose}[marker.bikeInfo.electrombileStatus.acc==1]">' + (marker.bikeInfo.electrombileStatus.acc==0?"断电":(marker.bikeInfo.electrombileStatus.acc==1?"通电":"未知")) + '</span></li>';
                content += ' <li><span class="title">上报时间：</span><span style="font-weight: 200;">' + $scope.uploadTime + '</span></li>';
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
                var infoBox = new BMapLib.InfoBox(map,content,{windowSize:{
                    //width:'360px',
                    //height:'500px',
                },closeIconMargin: "18px 5px 0 0"
                    ,enableAutoPan: true
                    ,align: INFOBOX_AT_TOP});
                infoBox.open(marker);
                //marker.enableDragging();
            })
        }
    }

    //点击回到当前车辆列表页面
    $scope.returnThisVehicle = function () {
        angular.element('#map-container').hide();
        angular.element('#page-content').show();
        $scope.selectModel.startPage = $scope.thisVehiclePage;
        $scope.pageSelect();
    }

    //日期弹出框
    $scope.$on('ngDialog.opened', function () {
        $('#datetimepicker1').datetimepicker({
            locale: 'ru'
        });
        $('#datetimepicker2').datetimepicker({
            locale: 'ru'
        });
        $('#datetimepicker3').datetimepicker({
            locale: 'ru'
        });
        $('#datetimepicker4').datetimepicker({
            locale: 'ru'
        });
    })
})

