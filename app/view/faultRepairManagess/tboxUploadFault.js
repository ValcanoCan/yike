angular.module("FMsainuoyi").controller('tboxUploadFaultCtrl',function(repairWorkOrders,$scope,ngDialog){
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
        $scope.selectParams.startPage = $scope.paginationConf.page
        $scope.selectParams.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    //传参配置
    $scope.selectParams={
        startTime:null,
        confirmStatus:null,
        startPage:$scope.paginationConf.page,
        offset:$scope.paginationConf.itemsPerPage,
    }

    //加载故障修理列表
    $scope.pageSelect=function(){
        jzts()
        repairWorkOrders.loadFault_list($scope.selectParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.vehicleAlarmInfo=res.data.data[0].list;
                $scope.confTotalItems=res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems=res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage=res.data.data[0].pagenation.offset;
                $scope.startPage=res.data.data[0].pagenation.startPage;
                angular.forEach($scope.vehicleAlarmInfo,function(data,index){
                    data.createTime=transTime(data.createTime);
                    if($scope.startPage>1){
                        data.orderNo=($scope.startPage-1)*10+index+1;
                    }else{
                        data.orderNo=index+1;
                    }
                })
            }
            hangge()
        })
    }

    //下发任务
    $scope.issueTask=function(item){
        var isDispatch=angular.element('#isDispatch').innerHTML;
        if(isDispatch=='未下发'){
            repairWorkOrders.loadFault_dispatch({deviceIds:item.deviceIds}).then(function(res){
                if (res.data.RESULT == 'SUCCESS') {
                    $scope.promptContent = '下发任务成功';
                    ngDialog.openConfirm({
                        templateUrl: 'view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                }
            })
        }else if(isDispatch=='已下发'){
            $scope.promptContent = '任务已下发，请勿重复发送';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
        }
    }

    //日期插件
    $('#datetimepicker1').datetimepicker();
})