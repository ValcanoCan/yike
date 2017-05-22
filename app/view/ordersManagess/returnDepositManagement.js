angular.module("FMsainuoyi").controller('returnDepositManagementCtrl',function(ordersManagess,saveParam,$scope,ngDialog){
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //传参配置
    $scope.selectModel={
        startTime:null,
        endTime:null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModel.startPage = $scope.paginationConf.page
        $scope.selectModel.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    //分页加载退押金管理页面
    $scope.pageSelect=function(){
        jzts()
        ordersManagess.return_deposit_refList($scope.selectModel).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.returnDepositInfo=res.data.data[0];
                $scope.confTotalItems=res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage=res.data.data[1].startPage;
                angular.forEach($scope.returnDepositInfo,function(data,index){
                    data.createTime=transTime(data.createTime)
                    data.modifyTime=transTime(data.modifyTime)
                    if($scope.startPage>1){
                        data.orderNo=($scope.startPage-1)*10+index+1;
                    }else{
                        data.orderNo=index+1;
                    }
                })
                console.log($scope.returnDepositInfo)
            }
            hangge()
        })
    }

    //退押金编辑
    $scope.returnDepositEdit=function(item){
        saveParam.userId=item.userId;
        ngDialog.openConfirm({
            template: "returnDepositDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function(){

        })
    }

    //退款金额输入变化监测
    $scope.refundSumChange=function(item){
        saveParam.change=item;
    }

    //退款原因输入变化监测
    $scope.refundReasonChange=function(item){
        saveParam.reason=item;
    }

    //确认退还押金操作
    $scope.isReturn=function(){
        //传参设置
        $scope.returnDepositModel={
            userId:saveParam.userId,
            reason:saveParam.reason,
            change:saveParam.change,
        }
        console.log($scope.returnDepositModel)
        if($scope.returnDepositModel.change==null||$scope.returnDepositModel.change==''||$scope.returnDepositModel.change=='undefined'||
            $scope.returnDepositModel.reason==null||$scope.returnDepositModel.reason==''||$scope.returnDepositModel.reason=='undefined'){
            $scope.promptContent='请输入扣款金额、扣款原因'
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            return;
        }
        ordersManagess.return_deposit_refund($scope.returnDepositModel).then(function(res){
            if(res.data.RESULT=='SUCCESS'&&res.data.resultCode==0){
                $scope.promptContent='退还押金成功';
                ngDialog.openConfirm({
                    templateUrl:"view/diag/promptDiag.html",
                    className:'ngdialog-theme-default',
                    preCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope,
                })
                ngDialog.closeAll();
                $scope.selectModel.startPage=$scope.startPage;
                $scope.pageSelect();
            }
            // else if(res.data.RESULT=='SUCCESS'&&res.data.resultCode==10){
            //    $scope.promptContent='超出押金余额,请重新输入';
            //    ngDialog.openConfirm({
            //        templateUrl:'view/diag/promptDiag.html',
            //        className:'ngdialog-theme-default',
            //        preCloseCallback:'preCloseCallbackOnScope',
            //        scope:$scope,
            //    })
            //}
            else if(res.data.RESULT=='FAIL'){
                $scope.promptContent=res.data.resultMsg;
                ngDialog.openConfirm({
                    templateUrl:'view/diag/promptDiag.html',
                    className:'ngdialog-theme-default',
                    preCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope,
                    closeByDocument:false
                })
            }
        })
        saveParam.reason=null;
        saveParam.change=null;
    }

    //退押金审核传参配置
    $scope.auditParams={
        userId:null,
        status:null,
        reason:null
    }

    //退押金审核弹出框
    $scope.auditDeposit=function(item){
        $scope.auditParams.userId=item.userId;
        saveParam.userId=item.userId;
        ngDialog.openConfirm({
            template:'auditDepositDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope,
            closeByDocument:false
        }).then(function(res){})
    }

    //退押金审核状态、原因变化监测
    $scope.auditStatusChange=function(status,reason){
        $scope.auditParams.status=status;
        $scope.auditParams.reason=reason;
    }

    //确认审核
    $scope.auditSave=function(){
        ordersManagess.return_deposit_apply($scope.auditParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                if($scope.auditParams.status!=5){
                    $scope.promptContent='拒绝退还押金';
                    ngDialog.openConfirm({
                        templateUrl:"view/diag/promptDiag.html",
                        className:'ngdialog-theme-default',
                        preCloseCallback:'preCloseCallbackOnScope',
                        scope:$scope,
                    })
                    $scope.pageSelect();
                }
                else if($scope.auditParams.status==5){
                    console.log(1212121)
                    ngDialog.openConfirm({
                        template: "returnDepositDiag",
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope,
                    }).then(function(){

                    })
                }
            }
        })
    }
})