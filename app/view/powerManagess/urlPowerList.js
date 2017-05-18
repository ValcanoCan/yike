angular.module("FMsainuoyi").controller('urlPowerListCtrl',function(powerManagess,$scope,ngDialog){
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //传参配置
    $scope.selectModel = {
        parentId:4,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModel.startPage = $scope.paginationConf.page
        $scope.selectModel.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect();
    });

    //加载权限列表信息
    $scope.pageSelect=function(){
        //jzts();
        powerManagess.url_list($scope.selectModel).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.urlsInfo=res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.urlsInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    data.modifyTime = transTime(data.modifyTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
            }
            //hangge();
        })
    }

    //按名称查询权限
    $scope.roleSearch=function(){
        if($scope.name==''||$scope.name==null||$scope.name=='undefind'){
            $scope.promptContent='请输入权限名称';
            ngDialog.openConfirm({
                template:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope
            })
            return;
        }
        $scope.selectModel.name=$scope.name;
        //$scope.selectModel.startPage=$scope.startPage;
        //$scope.paginationConf.page=$scope.startPage;
        $scope.pageSelect();
    }

    //创建权限弹框
    $scope.addRole=function(){
        ngDialog.openConfirm({
            template:'roleAddDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope
        }).then(function(res){

        })
    }

    //创建权限名称变化监测
    $scope.roleAddChange=function(name){
        $scope.roleAddName=name;
        console.log($scope.roleAddName);
    }

    //确认创建权限
    $scope.roleAddSave=function(){
        if($scope.roleAddName==''||$scope.roleAddName==null||$scope.roleAddName=='undefind'){
            $scope.promptContent='请输入权限名称';
            ngDialog.openConfirm({
                templateUrl:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope
            })
            return;
        }
        powerManagess.role_add({name:$scope.roleAddName}).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent='创建权限成功';
                ngDialog.openConfirm({
                    template: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
            }
        })
    }

    //修改权限传参配置
    $scope.editRoleParams={
        id:null,
        name:null
    }

    //修改权限弹框
    $scope.editRole=function(item){
        $scope.editRoleInfo=item;
        $scope.editRoleParams.id=item.id;
        ngDialog.openConfirm({
            template:'roleEditDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope
        }).then(function(res){

        })
    }

    //修改权限名称变化监测
    $scope.roleEditChange=function(name){
        $scope.editRoleParams.name=name;
    }

    //确认修改权限
    $scope.roleEditSave=function(){
        if($scope.editRoleParams.name==''||$scope.editRoleParams.name==null||$scope.editRoleParams.name=='undefind'){
            $scope.promptContent='请输入修改权限名称';
            ngDialog.openConfirm({
                template:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preClsoeCloseCallback:'preCloseCallbackOnScope',
                scope:$scope
            })
            return;
        }
        powerManagess.role_edit($scope.editRoleParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent='修改权限成功';
                ngDialog.openConfirm({
                    template:'view/diag/promptDiag.html',
                    className:'ngdialog-theme-default',
                    preClsoeCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope
                })
            }
            $scope.selectModel.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }

    //删除权限
    $scope.delRole=function(item){
        powerManagess.role_del({id:item.id}).then(function(res){
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '删除权限成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.rolesInfo.splice($scope.rolesInfo.indexOf(item, 1))
            }
            $scope.selectModel.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }

})