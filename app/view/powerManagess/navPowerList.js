angular.module("FMsainuoyi").controller('navPowerListCtrl',function(powerManagess,systemUser,$scope,ngDialog){
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
        name: null,
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
        jzts();
        powerManagess.role_listRole($scope.selectModel).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.rolesInfo=res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.rolesInfo, function (data, index) {
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
            scope:$scope,
            closeByDocument:false
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
                ngDialog.closeAll();
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
            scope:$scope,
            closeByDocument:false
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
                ngDialog.closeAll();
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

    //权限和菜单绑定传参配置
    $scope.roleNavBindParams={
        roleId:null,
        urlIds:[]
    }

    //权限与菜单绑定弹框
    $scope.roleNavBind=function(item){
        $scope.roleNavBindParams.roleId=item.id;
        ngDialog.openConfirm({
            template:'roleNavBindDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope,
            closeByDocument:false
        }).then(function(res){

        })
    }

    //权限与菜单绑定 菜单变化监测
    $scope.bindNavsChange=function(id){
        $scope.bindId=id;
    }

    //权限与菜单绑定 菜单参数保存
    $scope.bindIdsArr=[];
    $scope.roleNavBindSaveParams=function(){
        $scope.bindIdsArr.push($scope.bindId);
        $scope.roleNavBindParams.urlIds=$scope.bindIdsArr;
        $("#roleNavBindSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 1
        });
    }

    //确认权限与菜单绑定
    $scope.roleNavBindSave=function(){
        if($scope.roleNavBindParams.urlIds.length==0){
            $scope.promptContent = '请选择该权限要绑定的菜单，并保存';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                calssName: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        powerManagess.rUrlMap_add($scope.roleNavBindParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent = '权限与菜单绑定成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
        })
    }

    //查看权限和菜单绑定列表
    var locat=getLocat();
    $scope.roleNavBindList=function(nav){
        localStorage.setItem('navRoleId', nav.id)
        localStorage.setItem('navRoleName', nav.name)
        window.location.href = locat + '/app/index.html#/roleNavsList';
    }

    //获取运维人员
    systemUser.sysuser_list({offset:10000}).then(function (res) {
        if (res.data.RESULT == 'SUCCESS') {
            $scope.systemUserInfo = res.data.data[0];
        }
    })

    //权限和运维人员绑定传参配置
    $scope.roleUserBindParams={
        roleId:null,
        userIds:[]
    }

    //权限与运维人员绑定弹框
    $scope.roleUserBind=function(item){
        $scope.roleUserBindParams.roleId=item.id;
        ngDialog.openConfirm({
            template:'roleUserBindDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope,
            closeByDocument:false
        }).then(function(res){

        })
    }

    //权限与运维人员绑定运维人员变化监测
    $scope.bindUsersChange=function(id){
        $scope.bindUserId=id;
    }

    //权限与运维人员绑定 运维人员参数保存
    $scope.bindUserIdsArr=[];
    $scope.roleUserBindSaveParams=function(){
        $scope.bindUserIdsArr.push($scope.bindUserId);
        $scope.roleUserBindParams.userIds=$scope.bindUserIdsArr;
        $("#roleUserBindSaveParams").tips({
            side: 1,
            msg: '保存参数成功',
            bg: '#629b58',
            time: 1
        });
    }

    //确认权限与运维人员绑定
    $scope.roleUserBindSave=function(){
        if($scope.roleUserBindParams.urlIds.length==0){
            $scope.promptContent = '请选择该权限要绑定的人员，并保存';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                calssName: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        powerManagess.rUserMap_add($scope.roleUserBindParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent = '权限与运维人员绑定成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                ngDialog.closeAll();
            }
        })
    }

    //查看权限和运维人员绑定列表
    $scope.roleUserBindList=function(user){
        localStorage.setItem('userRoleId', user.id)
        localStorage.setItem('userRoleName', user.name)
        window.location.href = locat + '/app/index.html#/roleUsersList';
    }
})