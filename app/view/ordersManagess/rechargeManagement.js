angular.module("FMsainuoyi").controller('rechargeManagementCtrl', function (ordersManagess, $scope, ngDialog) {
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

    //传参配置  
    $scope.selectModel = {
        keyword: null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    //分页加载用户充值管理页面
    $scope.pageSelect = function () {
        jzts()
        ordersManagess.order_currList($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.rechargeInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                //console.log($scope.rechargeInfo)
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.rechargeInfo, function (data, index) {
                    data.createTime=transTime(data.createTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
            } else if (res.data.RESULT == 'FAIL') {
                $scope.promptContent = '获取数据' + res.data.RESULT;
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
            }
            hangge()
        })
    }

    //模糊查询
    $scope.rechargeSearch = function () {
        $scope.selectModel.keyword = $scope.keyword;
        if ($scope.selectModel.keyword == '' || $scope.selectModel.keyword == 'undefind' || $scope.selectModel.keyword == null) {
            $scope.promptContent = '请输入用户名或手机号进行查询';
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
        }
        $scope.pageSelect();
    }

    //查看用户消费记录
    $scope.purchaseHistory = function (item) {
        localStorage.setItem('purchaseHistoryUserId', item.userId)
        localStorage.setItem('purchaseHistoryrealName', item.realName)
        var href = window.location.href.split('#/')
        window.location.href = href[0] + '#/personalOrderInfo';
    }

    //查看用户活动充值记录
    $scope.activityRecharge = function () {
        ngDialog.openConfirm({
            template: "activityRechargeDiag",
            className: "ngdialog-theme-default",
            preCloseCallback: "preCloseCallbackOnScope",
            scope: $scope,
        })
    }

    //点击查看余额充值缴费记录信息
    $scope.balanceRechargeRecord = function (customer) {
        localStorage.setItem('customerUserId', customer.userId)
        localStorage.setItem('customerRealName', customer.realName)
        //console.log(customer)
        window.location.href = window.location.href.split('#/')[0] + '#/balanceRechargeRecord';
    }
})