angular.module("userGuideAddUeditor", ['ngDialog']).controller('userGuideAddUeditorCtrl', ['$scope', '$rootScope', '$http', 'ngDialog', function ($scope, $rootScope, $http, ngDialog) {
    $(function () {
        UE.getEditor('myEditor',{
            //focus时自动清空初始化时的内容
            autoClearinitialContent:true,
            //关闭字数统计
            wordCount:false,
            //关闭elementPath
            elementPathEnabled:false,
            //默认的编辑区域高度
            initialFrameHeight:300
            //更多其他参数，请参考ueditor.config.js中的配置项
        });
        $scope.getLocalData=function () {
            $scope.addParams.mainBody = UE.getEditor('myEditor').execCommand( "getlocaldata" );
            console.log($scope.addParams.mainBody)
        }
        //console.log(ue.getContent())
    })

    UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
    UE.Editor.prototype.getActionUrl = function(action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
            return 'http://121.43.32.168:8080/admin/upfile';
        } else if (action == 'uploadvideo') {
            return 'http://a.b.com/video.php';
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
    }

    //重新实例化一个编辑器，防止在上面的editor编辑器中显示上传的图片或者文件
    //var _editor = UE.getEditor('upload_ue');
    //_editor.ready(function () {
    //    //设置编辑器不可用
    //    //_editor.setDisabled();
    //    //隐藏编辑器，因为不会用到这个编辑器实例，所以要隐藏
    //    _editor.hide();
    //    //侦听图片上传
    //    _editor.addListener('beforeInsertImage', function (t, arg) {
    //        //将地址赋值给相应的input
    //        $("#picture").attr("value", arg[0].src);
    //        //图片预览
    //        $("#preview").attr("src", arg[0].src);
    //    })
    //    //侦听文件上传
    //    _editor.addListener('afterUpfile', function (t, arg) {
    //        $("#file").attr("value", _editor.options.filePath + arg[0].url);
    //    })
    //});
    ////弹出图片上传的对话框
    //function upImage() {
    //    var myImage = _editor.getDialog("insertimage");
    //    myImage.open();
    //}
    ////弹出文件上传的对话框
    //function upFiles() {
    //    var myFiles = _editor.getDialog("attachment");
    //    myFiles.open();
    //}


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
