angular.module("FMsainuoyi").controller('serviceChargeSettingCtrl',function($scope,ngDialog){
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
        ////$scope.initData()
        //$scope.pageSelect()
    });

    //修改服务费用设置
    $scope.serviceChargeEdit=function(id){
        ngDialog.openConfirm({
                template: "serviceChargeEditDiag",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
        })
    }

    //修改服务类型变化监测
    $scope.editServiceTypeChange=function(item){
        console.log(item);
    }

    //修改计费参数配置名称变化监测
    $scope.editChargeParamChange=function(item){
        console.log(item);
    }

    //修改服务费用保存
    $scope.editSave=function(){
        alert('please call editSave interface first!')
    }

    //删除服务费用设置
    $scope.serviceChargeDel=function(id){
        alert('no more')
    }

    //新增服务费用设置
    $scope.serviceChargeAdd=function(){
        ngDialog.openConfirm({
            template: "serviceChargeAddDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        })
    }

    //新增服务类型变化监测
    $scope.addServiceTypeChange=function(item){
        console.log(item);
    }

    //新增计费参数配置名称变化监测
    $scope.addChargeParamChange=function(item){
        console.log(item);
    }

    //新增服务费用保存
    $scope.addSave=function(){
        alert('please call addSave interface first!')
    }

})