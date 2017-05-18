angular.module("FMsainuoyi").controller('roleUsersListCtrl',function(powerManagess,systemUser,$scope,ngDialog){

    $scope.userRoleId=localStorage.getItem('userRoleId');
    $scope.userRoleName=localStorage.getItem('userRoleName');

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.pageSelect();
    });

    //加载权限列表信息
    $scope.pageSelect=function(){
        jzts();
        powerManagess.rUserMap_list({roleId:$scope.userRoleId}).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.roleUsersInfo=res.data.data[0];
                angular.forEach($scope.roleUsersInfo, function (data, index) {
                    data.orderNo=index+1;
                    data.createTime = transTime(data.createTime);
                    data.modifyTime = transTime(data.modifyTime);
                })
            }
            hangge();
        })
    }

    //获取运维人员
    systemUser.sysuser_list({offset:10000}).then(function (res) {
        if (res.data.RESULT == 'SUCCESS') {
            $scope.systemUserInfo = res.data.data[0];
        }
    })

    //权限和运维人员修改传参配置
    $scope.roleUserBindEditParams={
        id:null,
        roleId:$scope.userRoleId,
        userId:null
    }

    //权限与运维人员修改弹框
    $scope.roleUserBindEdit=function(item){
        $scope.roleUserBindEditParams.id=item.id;
        ngDialog.openConfirm({
            template:'roleNavBindEditDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope
        }).then(function(res){

        })
    }

    //权限与运维人员修改 运维人员变化监测
    $scope.bindEditUsersChange=function(id){
        $scope.roleUserBindEditParams.userId=id;
    }

    //确认权限与运维人员修改
    $scope.roleUserBindEditSave=function(){
        powerManagess.rUserMap_edit($scope.roleUserBindEditParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent = '权限与菜单修改成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            $scope.pageSelect();
        })
    }

    //权限与运维人员解绑
    $scope.roleUserBindDel=function(item){
        powerManagess.rUserMap_del({id:item.id}).then(function(res){
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '权限与运维人员解绑成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.roleUsersInfo.splice($scope.roleUsersInfo.indexOf(item, 1))
            }
            $scope.pageSelect();
        })
    }

})