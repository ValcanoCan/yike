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
                $scope.returnDepositInfo=res.data.data[0].list;
                $scope.confTotalItems=res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                $scope.startPage=res.data.data[0].pagenation.startPage;
                angular.forEach($scope.returnDepositInfo,function(data,index){
                    data.createTime=transTime(data.createTime)
                    data.modifyTime=transTime(data.modifyTime)
                    if($scope.startPage>1){
                        data.orderNo=($scope.startPage-1)*10+index+1;
                    }else{
                        data.orderNo=index+1;
                    }
                })
                //console.log($scope.returnDepositInfo)
            }
            hangge()
        })
    }

    //退押金编辑
    $scope.returnDepositEdit=function(item){
        if(item.payAmount<=0){
            $scope.promptContent='该用户的押金已退完';
            ngDialog.openConfirm({
                templateUrl:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope,
            })
            return;
        }
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
    var clicktag = 0;
    $scope.isReturn=function(item){
        //传参设置
        $scope.returnDepositModel={
            userId:saveParam.userId,
            reason:saveParam.reason,
            change:saveParam.change,
        }
        //console.log($scope.returnDepositModel)
        if($scope.returnDepositModel.change==null||$scope.returnDepositModel.change==''||$scope.returnDepositModel.change=='undefined'){
            $scope.promptContent='请输入退款金额'
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            return;
        }
        if($scope.returnDepositModel.reason==null||$scope.returnDepositModel.reason==''||$scope.returnDepositModel.reason=='undefined'){
            $scope.promptContent='请输入退款原因'
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            return;
        }
        if($scope.returnDepositModel.change<=0){
            $scope.promptContent='退款金额不能低于0元'
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            return;
        }
        if (clicktag == 0) {
            //alert(clicktag)
            clicktag = 1;
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
            setTimeout(function () {
                clicktag = 0
            }, 5000);
        }

        //saveParam.reason=null;
        //saveParam.change=null;
    }

    //退押金审核传参配置
    $scope.auditParams={
        userId:null,
        status:null,
        reason:null
    }

    //退押金审核弹出框
    $scope.auditDeposit=function(item){
        if(item.payAmount<=0){
            $scope.promptContent='该用户的押金已退完';
            ngDialog.openConfirm({
                templateUrl:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope,
            })
            return;
        }
        if(item.status!=5){
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
        else if(item.status==5){
            $scope.auditParams.userId=item.userId;
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
        //else if(item.status==2){
        //    $scope.promptContent='请选择审核状态和审核原因';
        //    ngDialog.openConfirm({
        //        templateUrl:"view/diag/promptDiag.html",
        //        className:'ngdialog-theme-default',
        //        preCloseCallback:'preCloseCallbackOnScope',
        //        scope:$scope,
        //    })
        //    return;
        //}
    }

    //退押金审核状态、原因变化监测
    $scope.auditStatusChange=function(status,reason){
        $scope.auditParams.status=status;
        $scope.auditParams.reason=reason;
    }

    //确认审核
    $scope.auditSave=function(){
        console.log($scope.auditParams.status)
        if($scope.auditParams.status==''||$scope.auditParams.status==null||$scope.auditParams.status=='undefind'||
            $scope.auditParams.reason==''||$scope.auditParams.reason==null||$scope.auditParams.reason=='undefind'){
            $scope.promptContent='请选择审核状态和审核原因';
            ngDialog.openConfirm({
                templateUrl:"view/diag/promptDiag.html",
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope,
            })
            return;
        }
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
                    ngDialog.closeAll();
                    $scope.pageSelect();
                    $scope.auditParams.status='';
                    $scope.auditParams.reason='';
                }
                else if($scope.auditParams.status==5){
                    ngDialog.openConfirm({
                        template: "returnDepositDiag",
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope,
                        closeByDocument:false
                    }).then(function(){

                    })
                }
            }
        })
    }
})