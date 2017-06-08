angular.module("FMsainuoyi").controller('depositRechargeRecordCtrl',function(userManagess,ngDialog,$scope){
    console.log('押金充值缴费记录')
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //获取押金充值记录的userId,realName
    $scope.depositUserId=localStorage.getItem('depositUserId')
    $scope.depositRealName=localStorage.getItem('depositRealName')
    //console.log($scope.depositUserId)
    //传参配置
    $scope.selectModel={
        userId:$scope.depositUserId,
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
        userManagess.user_deposit_currList($scope.selectModel).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.depositInfo=res.data.data[0].list;
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
                //console.log($scope.depositInfo)
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