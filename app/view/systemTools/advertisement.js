angular.module("FMsainuoyi").controller('advertisementCtrl', function (systemTools, $scope, ngDialog,$http) {
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

    //加载广告列表传参配置
    $scope.selectModel = {
        keyword: null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage
    }

    //加载广告列表信息
    $scope.pageSelect = function () {
        jzts()
        systemTools.ad_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.advertsInfo = res.data.data[0];
                $scope.confTotalItems = res.data.data[1].totalCount;
                $scope.paginationConf.totalItems = res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[1].offset;
                $scope.startPage = res.data.data[1].startPage;
                angular.forEach($scope.advertsInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
                //console.log($scope.advertsInfo)
            }
            hangge()
        })
    }

    //添加新广告
    $scope.addAdvert = function () {
        ngDialog.openConfirm({
            template: "addAdvertDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        })
    }

    //图片名称、描述变化监测
    $scope.addAdvertParamChange=function(describe){
        $scope.imgParams.imgDescribe=describe;
    }

    //添加图片传参配置
    $scope.imgParams={
        imgName:null,
        imgId:null,
        imgDescribe:null
    }

    //上传图片
    $scope.uploadImage = function () {
        if(document.querySelector('.path').value==''){
            $scope.promptContent = '请选择上传图片';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        //console.log(document.querySelector('.path'))
        $scope.imgParams.imgId=document.querySelector('.path').value;
        var fd = new FormData();
        var url = 'http://121.43.32.168:8080/admin/img/upload';
        var file = document.querySelector('input[type=file]').files[0];
        console.log(file);
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
            $scope.imgParams.imgName=file.name;
            fd.append('file', file);

        $http({
            method: 'POST',
            url: url,
            data: fd,
            //data:$scope.imgParams,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(function (res) {
            $scope.uploadFileModel = res.data;
            //console.log($scope.uploadFileModel)
            $scope.imgParams.imgId=$scope.uploadFileModel[0];
            systemTools.ad_add($scope.imgParams).then(function(res){
                if(res.data.RESULT=='SUCCESS'){
                    $scope.promptContent = '添加图片成功';
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
        });
    }

    //显示图片弹出框
    $scope.showImage = function (item) {
        $scope.thisImagePath=item.imgPath;
        ngDialog.openConfirm({
            template: "showImageDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
        }).then(function(res){

        })
    }

    //将某条广告启动
    $scope.openAdvert=function(item){
        systemTools.ad_isUseing({id:item.id}).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent = '启动广告成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
            }
            $scope.selectModel.startPage=$scope.startPage;
            $scope.pageSelect();
        })
    }

    //停发所有广告
    $scope.stopAllAdvert=function(){
        systemTools.ad_stop().then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent='所有广告停发成功';
                ngDialog.openConfirm({
                    templateUrl:'view/diag/promptDiag.html',
                    className:'ngdialog-theme-default',
                    preCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope
                })
            }
            $scope.pageSelect();
        })
    }

})

