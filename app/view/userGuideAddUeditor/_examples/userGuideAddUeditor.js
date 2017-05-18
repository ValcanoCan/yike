angular.module("userGuideAddUeditor", ['ngDialog']).controller('userGuideAddUeditorCtrl', ['$scope', '$rootScope', '$http', 'ngDialog', function ($scope, $rootScope, $http, ngDialog) {
    $(function () {
        var ue = UE.getEditor('myEditor');
        $scope.getLocalData=function () {
            $scope.addParams.mainBody = UE.getEditor('myEditor').execCommand( "getlocaldata" );
            console.log($scope.addParams.mainBody)
        }
        //console.log(ue.getContent())
    })
    //新增传参配置
    $scope.addParams = {
        title: null,
        subhead: null,
        keyword: null,
        mainBody: null,
    }

    //新增参数变化监测
    $scope.addParamsChange = function (title, subhead, keyword) {
        $scope.addParams.title = title;
        $scope.addParams.subhead = subhead;
        $scope.addParams.keyword = keyword;
        console.log($scope.addParams)
    }

    //保存新增设置
    $scope.saveAdd = function () {
        $scope.getLocalData()
        console.log($scope.addParams)
        if ($scope.addParams.title == null || $scope.addParams.title == '' || $scope.addParams.title == 'undefind' ||
            $scope.addParams.mainBody == null || $scope.addParams.mainBody == '' || $scope.addParams.mainBody == 'undefind') {
            $scope.promptContent = '请输入必要参数:用户指南标题和用户指南文本内容';
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
                url: 'http://121.43.32.168:8080/admin/writer/add',
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
                    $scope.promptContent = '新增指南成功';
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

    //返回用户指南列表页面
    $scope.returnGuideList=function(){
        var href=window.location.href.split('view/');
        window.location.href=href[0]+'index.html#/userGuideList';
    }
}])
