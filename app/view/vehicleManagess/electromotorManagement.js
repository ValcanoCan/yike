angular.module("FMsainuoyi").controller('electromotorManagementCtrl',function(vehicleManagess,$scope,ngDialog){
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

    //��ȡ����б�������
    $scope.selectModel = {
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage
    }

    $scope.pageSelect=function(){
        jzts();
        vehicleManagess.battery_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.batteryInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.batteryInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    data.modifyTime = transTime(data.modifyTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
                //console.log($scope.batteryInfo)
            }
            hangge();
        })
    }

    //�����ƷѲ���ɾ��
    $scope.paramDel=function(id){
        alert("��ɾ��ѽ")
    }

    //�����Ʒ��޸ı���
    $scope.editParamSave=function(){
        alert('please call interface first!')
    }

    //�����ƷѲ�������
    $scope.paramAdd=function(){
        ngDialog.openConfirm({
            template:'orderChargingParamAddDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope,
        })
    }

    //�����ƷѲ�������
    $scope.addParamSave=function(){
        alert('you can save the parameters successfully after one step which you call the interface successed!')
    }

    $scope.selectIdArray = function () {
        var selectItems = new Array()
        for (var i = 0; i < $scope.terminalData.length; i++) {
            if ($scope.terminalData[i].ischeck) {
                selectItems.push($scope.terminalData[i])
            }
        }
        return selectItems;
    }

    $scope.excel = function () {
        if ($scope.selectIdArray().length <= 0) {
            ui.info("��ѡ��Ҫ����������");
            return;
        } else {
            if ($scope.ischeck) {
                //console.log($scope.selectIdArray().length)
                //console.log($scope.selectIdArray())
                $scope.ids = [];
                for (var i = 0; i < $scope.selectIdArray().length; i++) {
                    $scope.ids.push($scope.selectIdArray()[i].tboxId)
                }
                //console.log($scope.ids)
                $scope.ids = $scope.ids.join(',')
                $http(
                    {
                        url: FM_RequestUrl.export_tboxExcel,
                        method: 'post',
                        data: {ids: $scope.ids},
                        responseType: 'arraybuffer',
                    }).success(function (data) {
                        var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                        var a = document.createElement('a');
                        a.href = window.URL.createObjectURL(blob);
                        a.setAttribute('download', 'data.xls');
                        a.textContent = '����';
                        document.getElementsByTagName('body')[0].appendChild(a);
                        a.click()
                        a.remove()
                    })
            } else if (!$scope.ischeck) {
                $http(
                    {
                        url: FM_RequestUrl.export_tboxExcel,
                        //url: 'http://60.205.148.181:8083/tsp_operation/tspVehicle/exportVehicleExcel.do',
                        //url: 'http://192.168.1.127:8080/tsp_operation/tspVehicle/exportVehicleExcel.do',
                        method: 'post',
                        data: {ids: $scope.ids},
                        responseType: 'arraybuffer',
                    }).success(function (data) {
                        var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                        var a = document.createElement('a');
                        a.href = window.URL.createObjectURL(blob);
                        a.setAttribute('download', 'data.xls');
                        a.textContent = '����';
                        document.getElementsByTagName('body')[0].appendChild(a);
                        a.click()
                        a.remove()
                    })
            }

        }
        /* if($scope.choseArr[0]==""||$scope.choseArr.length==0){//û��ѡ��һ����ʱ����ʾ
         ui.info("������ѡ��һ�������ڲ�����")
         return;
         };*/

    }

})