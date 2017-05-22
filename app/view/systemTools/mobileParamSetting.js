angular.module("FMsainuoyi").controller('mobileParamSettingCtrl', function (systemTools, $scope, ngDialog) {
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 20,
        pagesLength: 20,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //页面变化监测
    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModel.startPage = $scope.paginationConf.page
        $scope.selectModel.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    //传参配置
    $scope.selectModel = {
        type:null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage
    }

    //加载移动端参数列表页面
    $scope.pageSelect = function () {
        jzts()
        systemTools.mobile_find($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.mobileParamInfo = res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.mobileParamInfo, function (data, index) {
                    data.createTime=transTime(data.createTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
                console.log($scope.mobileParamInfo)
            }
            hangge()
        })
    }

    //新增移动端参数
    $scope.mobileParamAdd = function () {
        ngDialog.openConfirm({
            template: "mobileParamSettingDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function () {

        })
    }

    //新增传参配置
    $scope.addParams = {
        name: null,
        value: null,
        //type: null,
        annotation: null,
    }

    //新增参数变化监测
    $scope.addParamsChange = function (name, value, annotation) {
        $scope.addParams.name = name;
        $scope.addParams.value = value;
        //$scope.addParams.type = type;
        $scope.addParams.annotation = annotation;
        console.log($scope.addParams)
    }

    //保存新增参数
    $scope.mobileParamAddSave = function () {
        systemTools.mobile_add($scope.addParams).then(function (res) {
            if ($scope.addParams.name == null || $scope.addParams.name == '' || $scope.addParams.name == 'undefind' ||
                $scope.addParams.value == null || $scope.addParams.value == '' || $scope.addParams.value == 'undefind' ||
                //$scope.addParams.type == null || $scope.addParams.type == '' || $scope.addParams.type == 'undefind' ||
                $scope.addParams.annotation == null || $scope.addParams.annotation == '' || $scope.addParams.annotation == 'undefind') {
                $scope.promptContent = '请输入必填参数';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            else if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 17) {
                $scope.promptContent = '改参数已存在,请重新输入';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            else if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 0) {
                $scope.promptContent = '新增参数成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
                $scope.pageSelect();
            }
        })
    }

    //修改传参配置
    $scope.editParams = {
        id: null,
        name: null,
        value: null,
        //type: null,
        annotation: null
    }

    //更改参数设置
    $scope.mobileParamEdit = function (item) {
        $scope.editId = item.id;
        $scope.editMobileParams=item;
        ngDialog.openConfirm({
            template: "mobileParamEditDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        })
    }

    //修改参数变化监测
    $scope.editParamsChange = function (id, value, annotation) {
        $scope.editParams.id = $scope.editId;
        //$scope.editParams.name = name;
        $scope.editParams.value = value;
        //$scope.editParams.type = type;
        $scope.editParams.annotation = annotation;
        console.log($scope.editParams)
    }

    //保存修改参数
    $scope.mobileParamEditSave = function () {
        systemTools.mobile_edit($scope.editParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 0) {
                $scope.promptContent = '修改参数成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.pageSelect();
            }
            else if (res.data.RESULT == 'FAIL') {
                $scope.promptContent = '修改参数失败';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
        })
    }

    //删除参数操作
    $scope.mobileParamDel = function (item) {
        systemTools.mobile_del({id:item.id}).then(function(res){
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '删除移动参数成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.mobileParamInfo.splice($scope.mobileParamInfo.indexOf(item, 1))
            }
            $scope.selectModel.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }

    //根据参数类型选择
    $scope.mobileTypeChange=function(){
        $scope.selectModel.type=$scope.type;
        $scope.pageSelect();
    }

})