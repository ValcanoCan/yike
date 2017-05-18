angular.module("FMsainuoyi").controller('roleNavsListCtrl',function(powerManagess,systemUser,$scope,ngDialog){

    $scope.navRoleId=localStorage.getItem('navRoleId');
    $scope.navRoleName=localStorage.getItem('navRoleName');

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.pageSelect();
    });

    //加载权限列表信息
    $scope.pageSelect=function(){
        jzts();
        powerManagess.rUrlMap_list({roleId:$scope.navRoleId}).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.roleNavsInfo=res.data.data[0];
                angular.forEach($scope.roleNavsInfo, function (data, index) {
                    data.orderNo=index+1;
                    data.createTime = transTime(data.createTime);
                    data.modifyTime = transTime(data.modifyTime);
                })
            }
            hangge();
        })
    }

    //var userInfo=getCookie();
    //powerManagess.role_userUrl({userId:userInfo.userId}).then(function(res){
    //    if(res.data.RESULT=='SUCCESS'){
    //        $scope.navsInfo=res.data.data[0];
    //    }
    //})

    powerManagess.url_list({parentId:0}).then(function(res){
        if(res.data.RESULT=='SUCCESS'){
            $scope.navsInfo=res.data.data[0];
        }
    })

    //权限和菜单修改传参配置
    $scope.roleNavBindEditParams={
        id:null,
        roleId:$scope.navRoleId,
        urlId:null
    }

    //权限与菜单修改弹框
    $scope.roleNavBindEdit=function(item){
        $scope.roleNavBindEditParams.id=item.id;
        ngDialog.openConfirm({
            template:'roleNavBindEditDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope
        }).then(function(res){

        })
    }

    //权限与菜单修改 菜单变化监测
    $scope.bindEditNavsChange=function(id){
        $scope.roleNavBindEditParams.urlId=id;
    }

    //确认权限与菜单修改
    $scope.roleNavBindEditSave=function(){
        powerManagess.rUrlMap_edit($scope.roleNavBindEditParams).then(function(res){
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

    //权限与菜单解绑
    $scope.roleNavBindDel=function(item){
        powerManagess.rUrlMap_del({id:item.id}).then(function(res){
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '权限与菜单解绑成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.roleNavsInfo.splice($scope.roleNavsInfo.indexOf(item, 1))
            }
            $scope.pageSelect();
        })
    }

})