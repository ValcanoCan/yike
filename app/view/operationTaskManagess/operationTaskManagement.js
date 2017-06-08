angular.module("FMsainuoyi").controller('operationTaskManagementCtrl', function (operationTask, systemUser, $scope, ngDialog) {
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

    //运维任务列表传参配置
    $scope.selectModel = {
        keyword: null,
        status: null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage
    }

    //加载运维任务列表信息
    $scope.pageSelect = function () {
        jzts();
        operationTask.task_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.taskInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.taskInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    data.modifyTime = transTime(data.modifyTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
            }
            hangge();
        })
    }

    //模糊查询
    $scope.taskSearch = function () {
        $scope.selectModel.keyword = $scope.keyword;
        if ($scope.keyword == null || $scope.keyword == 'undefind' || $scope.keyword == '') {
            $scope.promptContent = '请输入任务标题、任务描述或备注进行查询'
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
        }
        $scope.pageSelect();
    }

    //任务状态查询
    $scope.taskStatusChange = function (status) {
        $scope.selectModel.status = status;
        $scope.pageSelect();
    }

    //修改运维任务
    $scope.operationTaskEdit = function (item) {
        $scope.editTaskParams.id = item.id;
        $scope.editTaskInfo = item;
        ngDialog.openConfirm({
            template: 'operationTaskEditDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument: false
        }).then(function (res) {

        })
    }

    //修改运维任务传参配置
    $scope.editTaskParams = {
        id: null,
        title: null,
        vehicleId: null,
        mainbody: null,
        status: null,
        remark: null
    }

    //修改运维任务参数变化监测
    $scope.editTaskParamChange = function (editTitle, editVehicleId, editDescription, status, editRemark) {
        $scope.editTaskParams.title = editTitle;
        $scope.editTaskParams.vehicleId = editVehicleId;
        $scope.editTaskParams.mainbody = editDescription;
        $scope.editTaskParams.status = status;
        $scope.editTaskParams.remark = editRemark;
    }

    //确认修改运维任务
    $scope.editTaskSave = function () {
        operationTask.task_edit($scope.editTaskParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '修改运维任务成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            $scope.pageSelect();
        })
    }

    //删除运维任务
    $scope.operationTaskDel = function (item) {
        operationTask.task_del({id: item.id}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '删除成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.taskInfo.splice($scope.taskInfo.indexOf(item, 1))
            }
            $scope.pageSelect();
        })
    }

    //新增运维任务
    $scope.operationTaskAdd = function () {
        ngDialog.openConfirm({
            template: "operationTaskAddDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument: false
        }).then(function (res) {

        })
    }

    //新增运维任务传参配置
    $scope.addTaskParams = {
        title: null,
        vehicleId: null,
        mainBody: null,
        remark: null
    }

    //新增任务参数变化监测
    $scope.addTaskParamChange = function (addTitle, addVehicleId, addDescription, addRemark) {
        $scope.addTaskParams.title = addTitle;
        $scope.addTaskParams.vehicleId = addVehicleId;
        $scope.addTaskParams.mainbody = addDescription;
        $scope.addTaskParams.remark = addRemark;
    }

    //确认新增运维任务
    $scope.addTaskSave = function () {
        if ($scope.addTaskParams.title == '' || $scope.addTaskParams.title == null || $scope.addTaskParams.title == 'undefind' ||
                //$scope.addTaskParams.vehicleId==''||$scope.addTaskParams.vehicleId==null||$scope.addTaskParams.vehicleId=='undefind'||
            $scope.addTaskParams.mainbody == '' || $scope.addTaskParams.mainbody == null || $scope.addTaskParams.mainbody == 'undefind') {
            $scope.promptContent = '请传入必要参数,再新增';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        operationTask.task_add($scope.addTaskParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '新增运维任务成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
            $scope.pageSelect();
        })
    }

    //获取系统管理用户信息
    $scope.systemUserData = function () {
        systemUser.sysuser_list({offset: 10000}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.systemUserInfo = res.data.data[0].list;
                console.log($scope.systemUserInfo)
            }
        })
    }
    $scope.systemUserData();

    //分配下发运维任务
    $scope.addTaskStaff = function (item) {
        //console.log(item)
        $scope.addStaffParams.taskId = item.id;
        ngDialog.openConfirm({
            template: 'addTaskStaffDiag',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument: false
        }).then(function (res) {

        })
    }

    //添加人员名称变化监测
    $scope.addUserNameChange = function (userId) {
        $scope.addStaffParams.userId = userId;
        console.log(userId);
    }

    //保存人员传参配置
    $scope.addStaffParams = {
        taskId: null,
        userId: null
    }


    //确认添加电子围栏人员
    var clicktag = 0;
    $scope.addStaffSave = function () {
        if ($scope.addStaffParams.userId == '' || $scope.addStaffParams.userId == null || $scope.addStaffParams.userId == 'undefind') {
            $scope.promptContent = '请选择执行任务人员';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        if (clicktag == 0) {
            //alert(clicktag)
            clicktag = 1;
            operationTask.taskUser_add($scope.addStaffParams).then(function (res) {
                if (res.data.RESULT == 'SUCCESS') {
                    $scope.promptContent = '分配任务成功';
                    ngDialog.openConfirm({
                        templateUrl: 'view/diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })
                    ngDialog.closeAll();
                }
                $scope.pageSelect();
                $scope.systemUserData();
            })
            setTimeout(function () {
                clicktag = 0
            }, 3000);

        }
    };
    //$scope.addStaffSave=function(){
    //    if($scope.addStaffParams.userId==''||$scope.addStaffParams.userId==null||$scope.addStaffParams.userId=='undefind'){
    //        $scope.promptContent='请选择执行任务人员';
    //        ngDialog.openConfirm({
    //            templateUrl:'view/diag/promptDiag.html',
    //            className:'ngdialog-theme-default',
    //            preCloseCallback:'preCloseCallbackOnScope',
    //            scope:$scope
    //        })
    //        return;
    //    }
    //
    //    //if(clicktag==1){
    //        operationTask.taskUser_add($scope.addStaffParams).then(function(res){
    //            if(res.data.RESULT=='SUCCESS'){
    //                $scope.promptContent='分配任务成功';
    //                ngDialog.openConfirm({
    //                    templateUrl:'view/diag/promptDiag.html',
    //                    className:'ngdialog-theme-default',
    //                    preCloseCallback:'preCloseCallbackOnScope',
    //                    scope:$scope
    //                })
    //                ngDialog.closeAll();
    //            }
    //            $scope.pageSelect();
    //            $scope.systemUserData();
    //            //clicktag = 0
    //        })
    //    //}
    //
    //    //if (clicktag == 0) {
    //    //    //alert('clicktag')
    //    //    //clicktag = 1;
    //    //    $scope.promptContent='请勿频繁点击';
    //    //    ngDialog.openConfirm({
    //    //        templateUrl:'view/diag/promptDiag.html',
    //    //        className:'ngdialog-theme-default',
    //    //        preCloseCallback:'preCloseCallbackOnScope',
    //    //        scope:$scope
    //    //    })
    //    //    setTimeout(function () { clicktag = 1 }, 3000);
    //    //}
    //
    //}

    //查看任务描述弹出框
    $scope.showShareContent = function (item) {
        $scope.thisContent = item.mainbody;
        if(item.mainbody==''||item.mainbody==null||item.mainbody=='undefind'){
            $scope.promptContent = '该任务无描述内容';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        ngDialog.openConfirm({
            template: "showContentDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function (res) {

        })
    }

})