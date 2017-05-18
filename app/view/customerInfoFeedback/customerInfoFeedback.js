angular.module("FMsainuoyi").controller('customerInfoFeedbackCtrl',function(repairWorkOrders,$scope){
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 20,
        pagesLength: 20,
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
        endTime:null
    }

    //加载用户反馈列表数据信息
    $scope.pageSelect = function () {
        jzts()
        repairWorkOrders.feedback_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.feedbackInfo = res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.feedbackInfo, function (data, index) {
                    data.createTime = transTime(data.createTime)
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
                console.log($scope.feedbackInfo)
            }
            hangge()
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
