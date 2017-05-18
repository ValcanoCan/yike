angular.module("userGuideEditUeditor", ['ngDialog']).controller('userGuideEditUeditorCtrl', ['$scope', '$rootScope', '$http', 'ngDialog', function ($scope, $rootScope, $http, ngDialog) {
    $(function () {
        var ue = UE.getEditor('myEditor');
        $scope.getLocalData=function () {
            $scope.editParams.mainBody = UE.getEditor('myEditor').execCommand( "getlocaldata" );
            console.log($scope.editParams.mainBody)
        }
    })

    $scope.title=decodeURI (window.location.href.split('title=')[1].split('&id=')[0]);
    $scope.editId=decodeURI (window.location.href.split('title=')[1].split('&id=')[1]);
    $http(
        {
            url: 'http://121.43.32.168:8080/admin/writer/title',
            method: 'post',
            data: {title: $scope.title},
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
        }).success(function (res) {
            if (res.RESULT == 'SUCCESS') {
                $scope.content = res.data[0].mainBody;
                $scope.subhead=res.data[0].subhead;
                $scope.keyword=res.data[0].keyword;
            }
        })
    setTimeout(function(){
        $(function () {
            var ue = UE.getEditor('myEditor');
            ue.setContent($scope.content)
        })
    },1000)

    //新增传参配置
    $scope.editParams = {
        id:$scope.editId,
        title: null,
        subhead: null,
        keyword: null,
        mainBody: null,
    }

    //新增参数变化监测
    $scope.editParamsChange = function (title, subhead, keyword) {
        $scope.editParams.title = title;
        $scope.editParams.subhead = subhead;
        $scope.editParams.keyword = keyword;
        $scope.getLocalData()
        console.log($scope.editParams)
    }

    //保存修改设置
    $scope.saveEdit = function () {
        $scope.getLocalData()
        console.log($scope.editParams)
        if ($scope.editParams.title == null || $scope.editParams.title == '' || $scope.editParams.title == 'undefind' ||
            $scope.editParams.mainBody == null || $scope.editParams.mainBody == '' || $scope.editParams.mainBody == 'undefind') {
            $scope.editParams.title=$scope.title;
            $scope.editParams.subhead=$scope.subhead;
        }
        $http(
            {
                url: 'http://121.43.32.168:8080/admin/writer/edit',
                method: 'post',
                data: $scope.editParams,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
            }).success(function (res) {
                console.log(res)
                if (res.RESULT == 'SUCCESS' && res.resultCode == 18) {
                    $scope.promptContent = '标题重复,请重新输入';
                    ngDialog.openConfirm({
                        templateUrl: '../../diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope
                    })

                }
                if (res.RESULT == 'SUCCESS' && res.resultCode == 0) {
                    $scope.promptContent = '修改用户指南成功';
                    ngDialog.openConfirm({
                        templateUrl: '../../diag/promptDiag.html',
                        className: 'ngdialog-theme-default',
                        preCloseCallback: 'preCloseCallbackOnScope',
                        scope: $scope,
                    })
                }
            })
        //$scope.editParams.title = null;
        //$scope.editParams.subhead = null;
        //$scope.editParams.keyword = null;
        //$scope.editParams.mainBody = null;
    }

    //返回用户指南列表页面
    $scope.returnGuideList=function(){
        var href=window.location.href.split('view/');
        window.location.href=href[0]+'index.html#/userGuideList';
    }
}])
