
angular.module("FMsainuoyi").controller('personalOrderInfoCtrl',function($scope,ordersManagess,ngDialog,$http){
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //获取用户充值管理的userId,realName
    $scope.personalOrderInfoUserId=localStorage.getItem('purchaseHistoryUserId')
    $scope.personalOrderInfoRealName=localStorage.getItem('purchaseHistoryrealName')

    //传参配置
    $scope.selectModel={
        userId:$scope.personalOrderInfoUserId,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    //加载订单信息页面数据
    $scope.pageSelect=function(){
        jzts()
        ordersManagess.order_list($scope.selectModel).then(function (res) {
            if(res.data.RESULT=='SUCCESS'){
                $scope.ordersInfo=res.data.data[0].list;
                $scope.confTotalItems=res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                //console.log($scope.ordersInfo)
                //console.log($scope.paginationConf.totalItems)
                //console.log($scope.paginationConf.itemsPerPage)

                //$scope.orderStatusModel=[];//提取状态
                $scope.startPage=res.data.data[0].pagenation.startPage;
                angular.forEach($scope.ordersInfo,function(data,index){
                    //$scope.orderStatusModel.push(data.orderStatus);
                    if($scope.startPage>1){
                        data.orderNumber=($scope.startPage-1)*10+index+1;
                    }else{
                        data.orderNumber=index+1;
                    }
                })

                //function undouble(arr){
                //    $scope.orderStatusArr = [];
                //    for(var i=0; i<arr.length; i++){
                //        if($scope.orderStatusArr.indexOf(arr[i]) == -1){
                //            $scope.orderStatusArr.push(arr[i]);
                //        }
                //    }
                //    return $scope.orderStatusArr;
                //}
                //undouble($scope.orderStatusModel)

                angular.forEach($scope.ordersInfo,function(data,index){
                    data.createTime=transTime(data.createTime);
                    data.overTime=transTime(data.overTime);
                })
            }
            hangge()
        })

    }

    //页面变化监测
    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModel.startPage = $scope.paginationConf.page
        $scope.selectModel.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    //结束订单
    $scope.finishOrder=function(id){
        ordersManagess.order_finish({id:id}).then(function (res) {
            console.log(res)
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent='您已成功结束订单';
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
                $scope.pageSelect();
            }else if(res.data.RESULT=='FAIL'){
                $scope.promptContent='结束订单失败';
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
            }
        })
    }

})