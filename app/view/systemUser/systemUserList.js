angular.module("FMsainuoyi").controller('systemUserCtrl', function (systemUser, $scope, ngDialog, $http) {
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
        $scope.selectParams.startPage = $scope.paginationConf.page
        $scope.selectParams.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    //列表页面传参配置
    $scope.selectParams = {
        keyword: null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    //模糊查询
    $scope.systemUserSearch=function(){
        $scope.selectParams.keyword=$scope.keyword;
        if ($scope.keyword == null || $scope.keyword == 'undefind' || $scope.keyword == '') {
            $scope.promptContent = '请输入用户名称或用户登录名称进行查询'
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            //return;
        }
        $scope.pageSelect();
    }

    //加载协议列表页面
    $scope.pageSelect = function () {
        jzts();
        systemUser.sysuser_list($scope.selectParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.systemUserInfo = res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.systemUserInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    data.modifyTime=transTime(data.modifyTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
            }else if(res.data.RESULT=='FAIL'){
                    $scope.promptContent = '查询失败';
                    ngDialog.openConfirm({
                        templateUrl: "view/diag/promptDiag.html",
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope,
                    })
            }
            hangge()
        })
    }

    //点击模糊查询
    //$scope.userGuideSearch=function(){
    //    $scope.selectParams.title=$scope.title;
    //    if($scope.selectParams.title==''||$scope.selectParams.title==null||$scope.selectParams.title=='undefiend'){
    //        $scope.promptContent='请输入用户指南标题名称进行查询';
    //        ngDialog.openConfirm({
    //            templateUrl: "../diag/promptDiag.html",
    //            className: 'ngdialog-theme-default',
    //            preCloseCallback: 'preCloseCallbackOnScope',
    //            scope: $scope,
    //        })
    //    }
    //    $scope.pageSelect()
    //}

    //按时间、订单状态查询订单信息
    //$scope.timeStatusChange=function(createTime,modifyTime){
    //    $scope.selectParams.startTime=createTime;
    //    $scope.selectParams.endTime=modifyTime;
    //    $scope.pageSelect();
    //}

    //点击新增设置
    $scope.systemUserAdd = function () {
        ngDialog.openConfirm({
            template:'systemUserAddDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope,
            closeByDocument:false
        }).then(function(res){

        })
    }

    //新增系统用户传参配置
    $scope.addParams = {
        name:null,
        mobileNo:null,
        account:null,
        password:null
    }

    //新增参数变化监测
    $scope.addParamsChange = function (name,mobileNo,account,password) {
        $scope.addParams.name=name;
        $scope.addParams.mobileNo=mobileNo;
        $scope.addParams.account = account;
        $scope.addParams.password = password;
        //console.log($scope.addParams)
    }

    //保存新增设置
    $scope.systemUserAddSave = function () {
        if ($scope.addParams.name ==null||$scope.addParams.name ==''||$scope.addParams.name =='undefind'||
            $scope.addParams.mobileNo ==null||$scope.addParams.mobileNo ==''||$scope.addParams.mobileNo =='undefind'||
            $scope.addParams.account == null || $scope.addParams.account == '' || $scope.addParams.account == 'undefind' ||
            $scope.addParams.password == null || $scope.addParams.password == '' || $scope.addParams.password == 'undefind') {
            $scope.promptContent = '请输入必要参数:用户名、手机号、用户登录名称和密码';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test($scope.addParams.mobileNo))){
            $scope.promptContent = '不是完整的11位手机号或者正确的手机号前七位';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        systemUser.sysuser_add($scope.addParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 19) {
                $scope.promptContent = '账户已存在,请重新设置';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                return;
            }
            else if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 0) {
                $scope.promptContent = '新增系统用户成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
                ngDialog.closeAll();
            }
            $scope.pageSelect();
        })
        $scope.addParams.account = null;
        $scope.addParams.password = null;
    }

    //编辑系统用户
    $scope.systemUserEdit=function(item,startPage){
        $scope.editParams.id=item.id;
        $scope.editSystemUser=item;
        ngDialog.openConfirm({
            template:'systemUserEditDiag',
            className:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope,
            closeByDocument:false
        }).then(function(res){

        })
    }

    //编辑系统用户传参配置
    $scope.editParams={
        id:null,
        name:null,
        password:null
    }

    //编辑系统用户参数变化监测
    $scope.editParamsChange=function(name,password){
        $scope.editParams.name=name;
        $scope.editParams.password=password;
    }

    //确认修改系统用户
    $scope.systemUserEditSave=function(){
        systemUser.sysuser_edit($scope.editParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent='修改系统用户成功';
                ngDialog.openConfirm({
                    templateUrl:'view/diag/promptDiag.html',
                    className:'ngdialog-theme-default',
                    preCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope
                })
            }
            $scope.selectParams.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }

    //删除系统用户操作
    //$scope.systemUserDel=function(item){
    //    systemUser.sysuser_del({id:item.id}).then(function(res){
    //        if (res.data.RESULT == 'SUCCESS') {
    //            $scope.promptContent = '删除系统用户成功';
    //            ngDialog.openConfirm({
    //                templateUrl: 'view/diag/promptDiag.html',
    //                calssName: 'ngdialog-theme-default',
    //                preCloseCallback: 'preCloseCallbackOnScope',
    //                scope: $scope
    //            })
    //            $scope.systemUserInfo.splice($scope.systemUserInfo.indexOf(item, 1))
    //        }
    //$scope.selectModel.startPage=$scope.startPage;
    //        $scope.pageSelect();
    //    })
    //}

})
