angular.module("FMsainuoyi").controller('orderChargingParamSettingCtrl',function($scope,ngDialog){
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 20,
        pagesLength: 20,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        //$scope.tboxModel.currentPage = $scope.paginationConf.page
        //$scope.tboxModel.pageSize = $scope.paginationConf.itemsPerPage
        //$scope.initData()
        //$scope.pageSelect()
    });

    //订单计费参数修改
    $scope.paramEdit=function(id){
        ngDialog.openConfirm({
            template: "orderChargingParamEditDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        })
    }

    //订单计费参数删除
    $scope.paramDel=function(id){
        alert("来删我呀")
    }

    //订单计费修改保存
    $scope.editParamSave=function(){
        alert('please call interface first!')
    }

    //新增计费参数设置
    $scope.paramAdd=function(){
        ngDialog.openConfirm({
            template:'orderChargingParamAddDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope,
        })
    }

    //新增计费参数保存
    $scope.addParamSave=function(){
        alert('you can save the parameters successfully after one step which you call the interface successed!')
    }
})