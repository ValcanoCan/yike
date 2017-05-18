angular.module("FMsainuoyi").controller('balanceRechargeRecordCtrl',function(userManagess,ngDialog,$scope){
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 20,
        pagesLength: 20,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //获取余额充值记录的userId,realName
    $scope.customerUserId=localStorage.getItem('customerUserId')
    $scope.customerRealName=localStorage.getItem('customerRealName')

    //传参配置
    $scope.selectModel={
        userId:$scope.customerUserId,
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

    //分页加载押金充值记录页面
    $scope.pageSelect=function(){
        jzts()
        userManagess.user_recharge_currList($scope.selectModel).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.rechargeInfo=res.data.data[0];
                $scope.confTotalItems=res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage=res.data.data[1].startPage;
                angular.forEach($scope.rechargeInfo,function(data,index){
                    data.createTime=transTime(data.createTime)
                    if($scope.startPage>1){
                        data.orderNo=($scope.startPage-1)*10+index+1;
                    }else{
                        data.orderNo=index+1;
                    }
                })
                console.log($scope.rechargeInfo)
            }else if(res.data.RESULT=='FAIL'){
                $scope.promptContent='获取数据失败';
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
})