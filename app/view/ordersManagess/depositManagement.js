angular.module("FMsainuoyi")
    .service('saveParam', function () {
        return {
            reason: null,
            change: null
        }
    })
    .controller('temCtrl', function (saveParam, $scope) {
        //扣款金额变化监测
        $scope.sumChange = function (item) {
            saveParam.change = item;
        }

        //扣款原因变化监测
        $scope.reasonChange = function (item) {
            saveParam.reason = item;
        }
    })
    .controller('depositManagementCtrl', function (ordersManagess, saveParam,$scope, ngDialog) {
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

        //传参设置
        $scope.selectModel = {
            keyword: null,
            startPage: $scope.paginationConf.currentPage,
            offset: $scope.paginationConf.itemsPerPage,
        }

        //押金分页管理页面加载
        $scope.pageSelect = function () {
            jzts()
            ordersManagess.deposit_list($scope.selectModel).then(function (res) {
                if (res.data.RESULT == 'SUCCESS') {
                    $scope.depositInfo = res.data.data[0].list;
                    //console.log($scope.depositInfo);
                    $scope.confTotalItems=res.data.data[0].pagenation.totalCount;
                    $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                    $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                    $scope.startPage=res.data.data[0].pagenation.startPage;
                    angular.forEach($scope.depositInfo,function(data,index){
                        data.createTime=transTime(data.createTime)
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

        //押金查询
        $scope.depositSearch = function () {
            $scope.selectModel.keyword = $scope.keyword;
            if ($scope.keyword == null || $scope.keyword == '' || $scope.keyword == 'undefined') {
                $scope.promptContent = '请输入用户名或者手机号查询'
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
            }
            $scope.pageSelect()
        }

        //点击增加扣费
        $scope.chargeManage = function (charge) {
            if(charge.payAmount<=0){
                $scope.promptContent='押金不足，请提醒用户充值押金';
                ngDialog.openConfirm({
                    templateUrl:'view/diag/promptDiag.html',
                    className:'ngdialog-theme-default',
                    preCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope,
                })
                return;
            }
            saveParam.userId=charge.userId;
            ngDialog.openConfirm({
                template: 'chargeManagementDiag',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
                closeByDocument:false
            }).then(function () {

            })
        }

        //保存新增扣费
        var clicktag = 0;
        $scope.addSave = function () {
            //传参设置
            $scope.deductMoneyParam = {
                userId: saveParam.userId,
                reason: saveParam.reason,
                change: saveParam.change,
            }
            //console.log($scope.deductMoneyParam)
            if ($scope.deductMoneyParam.reason == null||$scope.deductMoneyParam.reason==''||$scope.deductMoneyParam.reason=='undefined' ) {
                $scope.promptContent = '请输入扣款原因'
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: "ngdialog-theme-default",
                    preCloseCallback: "preCloseCallbackOnScope",
                    scope: $scope,
                })
                return;
            }
            if ($scope.deductMoneyParam.change == null||$scope.deductMoneyParam.change==''||$scope.deductMoneyParam.change=='undefined') {
                $scope.promptContent = '请输入扣款金额'
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: "ngdialog-theme-default",
                    preCloseCallback: "preCloseCallbackOnScope",
                    scope: $scope,
                })
                return;
            }
            if (clicktag == 0) {
                //alert(clicktag)
                clicktag = 1;
                ordersManagess.charging_sub($scope.deductMoneyParam).then(function (res) {
                    if (res.data.RESULT=='SUCCESS'&&res.data.resultCode == 0) {
                        $scope.promptContent = '扣费成功'
                        ngDialog.openConfirm({
                            templateUrl: "view/diag/promptDiag.html",
                            className: 'ngdialog-theme-default',
                            preCloseCallback: 'preCloseCallbackOnScope',
                            scope: $scope,
                        })
                        ngDialog.closeAll();
                        $scope.selectModel.startPage=$scope.startPage;
                        $scope.pageSelect();
                    }else if(res.data.RESULT=='SUCCESS'&&res.data.resultCode==10){
                        $scope.promptContent='押金余额不足,请提醒用户充值';
                        ngDialog.openConfirm({
                            templateUrl:'view/diag/promptDiag.html',
                            calssName:'ngdialog-theme-default',
                            preCloseCallback:'preCloseCallbackOnScope',
                            scope:$scope,
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

    ////点击查看退押金页面
    //    $scope.returnDepositManage=function(){
    //        var href=window.location.href.split('#/')[0];
    //        window.location.href=href+'#/returnDeposit';
    //    }
    })