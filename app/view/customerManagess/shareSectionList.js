angular.module("FMsainuoyi").controller('shareSectionListCtrl', function (userManagess, $scope, ngDialog, $http) {
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

    //传参配置
    $scope.selectParams = {
        title: null,
        startTime: null,
        endTime: null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    //加载协议列表页面
    $scope.pageSelect = function () {
        jzts();
        userManagess.share_list($scope.selectParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.shareInfo = res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.shareInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    data.modifyTime=transTime(data.modifyTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
            }
            hangge()
        })
    }

    //点击模糊查询
    $scope.userGuideSearch=function(){
        $scope.selectParams.title=$scope.title;
        if($scope.selectParams.title==''||$scope.selectParams.title==null||$scope.selectParams.title=='undefiend'){
            $scope.promptContent='请输入用户指南标题名称进行查询';
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
        }
        $scope.pageSelect()
    }

    //按时间、订单状态查询订单信息
    $scope.timeStatusChange=function(createTime,modifyTime){
        $scope.selectParams.startTime=createTime;
        $scope.selectParams.endTime=modifyTime;
        $scope.pageSelect();
    }

    //点击新增设置
    $scope.shareSectionAdd = function () {
        ngDialog.openConfirm({
            template: "addShareDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        })
    }

    //图片名称、描述变化监测
    $scope.addParamsChange=function(title,describe,type){
        $scope.addParams.shareTitle=title;
        $scope.addParams.shareDescribe=describe;
        $scope.addParams.shareType=type;
    }

    //添加分享传参配置
    $scope.addParams = {
        shareTitle: null,
        shareImgId: null,
        bottomImgId: null,
        shareDescribe: null,
        shareType: null,
    }

    //上传APP分享图片
    $scope.uploadShareImage = function () {
        if(document.querySelector('.share-path').value==''){
            $scope.promptContent = '请选择上传分享图片';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        //console.log(document.querySelector('.path'))
        $scope.addParams.shareImgId=document.querySelector('.share-path').value;
        var fd = new FormData();
        var url = 'http://121.43.32.168:8080/admin/img/upload';
        //var file = document.querySelector('input[type=file]').files[0];
        var file = document.querySelector('#file1').files[0];
        //console.log(file);
        if(Math.ceil(file.size/1024)>600){
            $scope.promptContent = '上传图片不能大于600K';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }

        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)){
            $scope.promptContent = '请确认上传的是图片格式文件';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        $scope.addParams.shareImgName=file.name;
        fd.append('file', file);

        $http({
            method: 'POST',
            url: url,
            data: fd,
            //data:$scope.imgParams,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(function (res) {
            $scope.shareFileModel = res.data;
            //console.log($scope.uploadFileModel)
            $scope.addParams.shareImgId=$scope.shareFileModel[0];
            $scope.promptContent = '上传分享图片成功';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
        });
    }

    //上传Web图片
    $scope.uploadBottomImage = function () {
        if(document.querySelector('.path').value==''){
            $scope.promptContent = '请选择上传APP图片';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        //console.log(document.querySelector('.path'))
        $scope.addParams.bottomImgId=document.querySelector('.path').value;
        var fd = new FormData();
        var url = 'http://121.43.32.168:8080/admin/img/upload';
        //var file = document.querySelector('input[type=file]').files[0];
        var file = document.querySelector('#file').files[0];
        //console.log(file);
        if(Math.ceil(file.size/1024)>600){
            $scope.promptContent = '上传图片不能大于600K';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }

        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)){
            $scope.promptContent = '请确认上传的是图片格式文件';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        $scope.addParams.bottomImgName=file.name;
        fd.append('file', file);

        $http({
            method: 'POST',
            url: url,
            data: fd,
            //data:$scope.imgParams,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(function (res) {
            $scope.bottomFileModel = res.data;
            //console.log($scope.uploadFileModel)
            $scope.addParams.bottomImgId=$scope.bottomFileModel[0];
            $scope.promptContent = '上传APP图片成功';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
        });
    }

    //确认新增分享
    $scope.shareSave=function(){
        if($scope.addParams.shareTitle==null||$scope.addParams.shareTitle==''||$scope.addParams.shareTitle=='undefind'||
            $scope.addParams.shareImgId==null||$scope.addParams.shareImgId==''||$scope.addParams.shareImgId=='undefind'||
            $scope.addParams.bottomImgId==null||$scope.addParams.bottomImgId==''||$scope.addParams.bottomImgId=='undefind'||
            $scope.addParams.shareDescribe==null||$scope.addParams.shareDescribe==''||$scope.addParams.shareDescribe=='undefind'||
            $scope.addParams.shareType==null||$scope.addParams.shareType==''||$scope.addParams.shareType=='undefind'
        ){
            $scope.promptContent = '请传入必要参数，并上传图片';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        userManagess.share_add($scope.addParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent = '添加分享成功';
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

    //显示Web图片弹出框
    $scope.showBottomImage = function (item) {
        $scope.thisImagePath=item.bottomImgPath;
        ngDialog.openConfirm({
            template: "showImageDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function(res){

        })
    }

    //显示APP分享图片弹出框
    $scope.showShareImage = function (item) {
        $scope.thisImagePath=item.shareImgPath;
        ngDialog.openConfirm({
            template: "showImageDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function(res){

        })
    }

    //查看分享内容弹出框
    $scope.showShareContent = function (item) {
        $scope.thisContent=item.shareDescribe;
        ngDialog.openConfirm({
            template: "showContentDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function(res){

        })
    }

    //修改分享操作
    $scope.shareSectionEdit = function (item,startPage) {
        $scope.editParams.id=item.id;
        $scope.editShareInfo=item;
        $scope.curPage=startPage;
        ngDialog.openConfirm({
            template: "editShareDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function(res){})
    }

    //修改分享传参配置
    $scope.editParams = {
        id:null,
        shareTitle: null,
        shareImgId: null,
        bottomImgId: null,
        shareDescribe: null,
        shareType: null,
    }

    //修改名称、描述变化监测
    $scope.editParamsChange=function(title,describe,type){
        $scope.editParams.shareTitle=title;
        $scope.editParams.shareDescribe=describe;
        $scope.editParams.shareType=type;
    }

    //修改上传APP分享图片
    $scope.editUploadShareImage = function () {
        if(document.querySelector('.edit-share-path').value==''){
            $scope.promptContent = '请选择上传分享图片';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        //console.log(document.querySelector('.path'))
        $scope.editParams.shareImgId=document.querySelector('.edit-share-path').value;
        var fd = new FormData();
        var url = 'http://121.43.32.168:8080/admin/img/upload';
        //var file = document.querySelector('input[type=file]').files[0];
        var file = document.querySelector('#file3').files[0];
        //console.log(file);
        if(Math.ceil(file.size/1024)>600){
            $scope.promptContent = '上传图片不能大于600K';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }

        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)){
            $scope.promptContent = '请确认上传的是图片格式文件';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        $scope.editParams.shareImgName=file.name;
        fd.append('file', file);

        $http({
            method: 'POST',
            url: url,
            data: fd,
            //data:$scope.imgParams,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(function (res) {
            $scope.editShareFileModel = res.data;
            //console.log($scope.uploadFileModel)
            $scope.editParams.shareImgId=$scope.editShareFileModel[0];
            $scope.promptContent = '上传分享图片成功';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
        });
    }

    //修改上传Web图片
    $scope.editUploadBottomImage = function () {
        if(document.querySelector('.edit-bottom-path').value==''){
            $scope.promptContent = '请选择上传APP图片';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        //console.log(document.querySelector('.path'))
        $scope.editParams.bottomImgId=document.querySelector('.edit-bottom-path').value;
        var fd = new FormData();
        var url = 'http://121.43.32.168:8080/admin/img/upload';
        //var file = document.querySelector('input[type=file]').files[0];
        var file = document.querySelector('#file4').files[0];
        //console.log(file);
        if(Math.ceil(file.size/1024)>600){
            $scope.promptContent = '上传图片不能大于600K';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }

        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)){
            $scope.promptContent = '请确认上传的是图片格式文件';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        $scope.editParams.bottomImgName=file.name;
        fd.append('file', file);

        $http({
            method: 'POST',
            url: url,
            data: fd,
            //data:$scope.imgParams,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(function (res) {
            $scope.editBottomFileModel = res.data;
            //console.log($scope.uploadFileModel)
            $scope.editParams.bottomImgId=$scope.editBottomFileModel[0];
            $scope.promptContent = '上传APP图片成功';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
        });
    }

    //确认修改分享
    $scope.editShareSave=function(){
        userManagess.share_edit($scope.editParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent = '修改分享成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.selectParams.startPage=$scope.startPage;
                $scope.pageSelect();
            }
        })
    }

    //删除分享操作
    $scope.shareDel = function (item) {
        userManagess.share_del({id: item.id}).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '删除分享成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.shareInfo.splice($scope.shareInfo.indexOf(item, 1))
            }
            $scope.selectParams.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }

    //将某条分享启动
    $scope.openShare=function(item){
        userManagess.share_isUseing({id:item.id}).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent = '启动分享成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            $scope.selectParams.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }
})
