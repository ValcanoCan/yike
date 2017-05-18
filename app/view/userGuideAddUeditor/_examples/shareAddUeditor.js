angular.module("shareAddUeditor", ['ngDialog']).controller('shareAddUeditorCtrl', ['$scope', '$rootScope', '$http', 'ngDialog', function ($scope, $rootScope, $http, ngDialog) {
    $(function () {
        var ue = UE.getEditor('myEditor',{
            imageUrl:'http://localhost:63342/admin-web/app/static/images/'
        });
        $scope.getLocalData=function () {
            $scope.addParams.shareDescribe = UE.getEditor('myEditor').execCommand( "getlocaldata" );
            console.log($scope.addParams.shareDescribe)
        }
        //console.log(ue.getContent())
    })
    //新增传参配置
    $scope.addParams = {
        shareTitle: null,
        shareImgId: null,
        shareDescribe: null,
        shareType: null,
    }

    //新增参数变化监测
    $scope.addParamsChange = function (title,type) {
        $scope.addParams.shareTitle = title;
        $scope.addParams.shareType = type;
        console.log($scope.addParams)
    }

    //保存新增设置
    $scope.saveAdd = function () {
        $scope.getLocalData()
        console.log($scope.addParams)
        if ($scope.addParams.shareTitle == null || $scope.addParams.shareTitle == '' || $scope.addParams.shareTitle == 'undefind' ||
            $scope.addParams.shareDescribe == null || $scope.addParams.shareDescribe == '' || $scope.addParams.shareDescribe == 'undefind'||
            $scope.addParams.shareType ==null||$scope.addParams.shareType ==''||$scope.addParams.shareType =='undefind') {
            $scope.promptContent = '请输入必要参数:分享标题、分享文本内容、图片和分享渠道';
            ngDialog.openConfirm({
                templateUrl: '../../diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        $http(
            {
                url: 'http://121.43.32.168:8080/admin/share/add',
                method: 'post',
                data: $scope.addParams,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
            }).success(function (res) {
                console.log(res)
                if (res.RESULT == 'SUCCESS' && res.resultCode == 18) {
                    $scope.promptContent = '标题已存在,请重新输入';
                    ngDialog.openConfirm({
                        templateUrl: '../../diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })

                }
                else if (res.RESULT == 'SUCCESS' && res.resultCode == 0) {
                    $scope.promptContent = '新增分享成功';
                    ngDialog.openConfirm({
                        templateUrl: '../../diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope,
                    })
                }
            })
        //$scope.addParams.title = null;
        //$scope.addParams.subhead = null;
        //$scope.addParams.keyword = null;
        //$scope.addParams.mainBody = null;
    }

    //上传图片
    $scope.uploadImage = function () {
        if(document.querySelector('.path').value==''){
            $scope.promptContent = '请选择上传图片';
            ngDialog.openConfirm({
                templateUrl: '../../diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        //console.log(document.querySelector('.path'))
        $scope.addParams.shareImgId=document.querySelector('.path').value;
        var fd = new FormData();
        var url = 'http://121.43.32.168:8080/admin/img/upload';
        var file = document.querySelector('input[type=file]').files[0];
        console.log(file);
        if(Math.ceil(file.size/1024)>600){
            $scope.promptContent = '上传图片不能大于600K';
            ngDialog.openConfirm({
                templateUrl: '../../diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }

        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)){
            $scope.promptContent = '请确认上传的是图片格式文件';
            ngDialog.openConfirm({
                templateUrl: '../../diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return
        }
        //$scope.imgParams.imgName=file.name;
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
            $scope.addParams.shareImgId=$scope.uploadFileModel[0];
             $scope.promptContent='上传图片成功'
            ngDialog.openConfirm({
                templateUrl: '../../diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })

        });
    }

    //返回分享设置参数列表页面
    $scope.returnShareSectionList=function(){
        var href=window.location.href.split('view/');
        window.location.href=href[0]+'index.html#/shareSection';
    }
}])
