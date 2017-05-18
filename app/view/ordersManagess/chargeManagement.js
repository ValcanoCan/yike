angular.module("FMsainuoyi")
    .service('saveParam',function(){
        return {
            reason:null,
            change:null
        }
    })
    .controller('temCtrl',function(saveParam,$scope){
        //扣款金额变化监测
        $scope.sumChange=function(item){
            saveParam.change=item;
        }

        //扣款原因变化监测
        $scope.reasonChange=function(item){
            saveParam.reason=item;
        }
    })
    .controller('chargeManagementCtrl',function(saveParam,ordersManagess,$scope,ngDialog){
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
        //$scope.tboxModel.currentPage = $scope.paginationConf.page
        //$scope.tboxModel.pageSize = $scope.paginationConf.itemsPerPage
        ////$scope.initData()
        $scope.pageSelect()
    });

    //加载扣费管理页面
    $scope.pageSelect=function(){
        ordersManagess.charging_sub().then(function(res){
            console.log(res)
        })
    }

    //新增按钮
    $scope.chargeAdd=function(){
        ngDialog.openConfirm({
            template: "chargeManagementDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function(){

        })
    }

    //保存新增
    $scope.addSave=function(){
        //传参设置
        var userInfo=getCookie()
        $scope.deductMoneyParam={
            userId:userInfo.userId,
            reason:saveParam.reason,
            change:saveParam.change,
        }
        console.log($scope.deductMoneyParam)
        if($scope.deductMoneyParam.reason==null||$scope.deductMoneyParam.change==null){
            $scope.promptContent='请输入扣款原因、扣款金额'
            ngDialog.openConfirm({
                templateUrl:"view/diag/promptDiag.html",
                className:"ngdialog-theme-default",
                preCloseCallback:"preCloseCallbackOnScope",
                scope:$scope,
            })
        }
        ordersManagess.charging_sub($scope.deductMoneyParam).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                //alert('you have add successfully!')
                $scope.promptContent='接口调用成功，数据未添加到列表'
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
            }
        })

    }

    //显示日期弹框
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();

    //开始日期变化监测
    $scope.startTimeChange=function(time){
        console.log(time);
    }

    //结束日期变化监测
    $scope.endTimeChange=function(time){
        console.log(time);
    }

    //扣费查询
    $scope.chargeSearch=function(){
        alert('please call interface first! ')
    }
})