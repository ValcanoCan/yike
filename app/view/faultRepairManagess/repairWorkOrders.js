angular.module("FMsainuoyi").controller('repairWorkOrdersCtrl',function(repairWorkOrders,$scope,ngDialog){
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
        repairWorkOrders.maintain_list($scope.selectParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.repairWorkInfo=res.data.data[0].list;
                $scope.confTotalItems=res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems=res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage=res.data.data[0].pagenation.offset;
                $scope.startPage=res.data.data[0].pagenation.startPage;
                angular.forEach($scope.repairWorkInfo,function(data,index){
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

    //按时间和审核状态查询
    $scope.timeStatusChange=function(createTime,status){
        $scope.selectParams.startTime=createTime;
        $scope.selectParams.confirmStatus=status;
        $scope.pageSelect();
    }

    //审核工单传参配置
    $scope.auditParams={
        id:null,
        confirmStatus:null
    }

    //审核工单同意
    $scope.auditWorkAgree=function(item){
        $scope.auditParams.id=item.id;
        $scope.auditParams.confirmStatus=1;
        var status=angular.element('#confirmStatus'+item.orderNo).html();
        if(status=='同意'){
            $scope.promptContent='已同意，请勿重复操作';
            ngDialog.openConfirm({
                templateUrl:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope,
            })
            return;
        }
        repairWorkOrders.maintain_approve($scope.auditParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent='审核同意';
                ngDialog.openConfirm({
                    templateUrl:'view/diag/promptDiag.html',
                    className:'ngdialog-theme-default',
                    preCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope,
                })
            }
            $scope.pageSelect();
        })
    }

    //审核工单拒绝
    $scope.auditWorkRefuse=function(item){
        $scope.auditParams.id=item.id;
        $scope.auditParams.confirmStatus=2;
        var status1=angular.element('#confirmStatus'+item.orderNo).html();
        if(status1=='拒绝'){
            $scope.promptContent='已拒绝，请勿重复操作';
            ngDialog.openConfirm({
                templateUrl:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope,
            })
            return;
        }
        repairWorkOrders.maintain_approve($scope.auditParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent='审核拒绝';
                ngDialog.openConfirm({
                    templateUrl:'view/diag/promptDiag.html',
                    className:'ngdialog-theme-default',
                    preCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope
                })
            }
            $scope.pageSelect();
        })
    }

    //下发工单
    $scope.worksheetIssued=function(id){
        repairWorkOrders.maintain_assign().then(function(res){
            console.log(res)
        })
    }

    //显示图片弹出框
    $scope.showImage = function (item) {
        if(item.imagePath==null||item.imagePath==''||item.imagePath=='undefind'){
            $scope.promptContent='该工单无图片';
            ngDialog.openConfirm({
                templateUrl:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope
            })
            return;
        }
        $scope.thisImagePath=item.imagePath;
        ngDialog.openConfirm({
            template: "showImageDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function(res){

        })
    }

    //日期插件
    $('#datetimepicker1').datetimepicker();
})