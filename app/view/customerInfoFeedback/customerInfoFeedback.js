angular.module("FMsainuoyi").controller('customerInfoFeedbackCtrl',function(repairWorkOrders,ngDialog,$scope){
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function() {
        $scope.selectModel.currentPage = $scope.paginationConf.page
        $scope.selectModel.pageSize = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    //列表查看传参配置
    $scope.selectModel={
        createTime:null,
        endTime:null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    //加载用户反馈列表数据信息
    $scope.pageSelect = function () {
        jzts()
        repairWorkOrders.feedback_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.feedbackInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.feedbackInfo, function (data, index) {
                    data.createTime = transTime(data.createTime)
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
                //console.log($scope.feedbackInfo)
            }
            hangge()
        })
    }

    //查看分享内容弹出框
    $scope.showShareContent = function (item) {
        if(item.body==''||item.body==null||item.body=='undefind'){
            $scope.promptContent = '该客户无反馈信息';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        $scope.thisContent=item.body;
        ngDialog.openConfirm({
            template: "showContentDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function(res){

        })
    }

    //按时间、查询用户反馈信息
    $scope.timeStatusChange = function (startTime, endTime) {
        $scope.selectModel.startTime = startTime;
        $scope.selectModel.endTime = endTime;
        $scope.pageSelect();
    }

    //显示时间弹框
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();
})
