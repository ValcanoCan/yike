angular.module("FMsainuoyi").controller('userGuideListCtrl', function (systemTools, $scope, ngDialog, $http) {
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
        systemTools.writer_list($scope.selectParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.userGuideInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.userGuideInfo, function (data, index) {
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
    $scope.userGuideAdd = function () {
        var href = window.location.href.split('index.html')
        window.location.href = href[0] + 'view/userGuideAddUeditor/_examples/userGuideAddUeditor.html';
    }

    //查看指南操纵
    $scope.viewGuide = function (title) {
        var href = window.location.href.split('index.html')
        window.location.href = href[0] + 'view/systemTools/userGuideEdit.html?title=' + title;
        //localStorage.setItem('userGuideTitle', title)
    }

    //新增传参配置
    $scope.addParams = {
        title: null,
        subhead: null,
        title: null,
        mainBody: null,
    }

    //新增参数变化监测
    $scope.addParamsChange = function (title, subhead, title, mainBody) {
        $scope.addParams.title = title;
        $scope.addParams.subhead = subhead;
        $scope.addParams.title = title;
        $scope.addParams.mainBody = mainBody;
        console.log($scope.addParams)
    }

    //保存新增设置
    $scope.saveAdd = function () {
        if ($scope.addParams.title == null || $scope.addParams.title == '' || $scope.addParams.title == 'undefind' ||
            $scope.addParams.mainBody == null || $scope.addParams.mainBody == '' || $scope.addParams.mainBody == 'undefind') {
            $scope.promptContent = '请输入必要参数:协议标题和协议文本内容';
            ngDialog.openConfirm({
                templateUrl: 'view/diag/promptDiag.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope
            })
            return;
        }
        systemTools.writer_add($scope.addParams).then(function (res) {
            if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 18) {
                $scope.promptContent = '标题已存在,请重新输入';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })

            }
            else if (res.data.RESULT == 'SUCCESS' && res.data.resultCode == 0) {
                $scope.promptContent = '新增协议成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
            }
        })
        $scope.addParams.title = null;
        $scope.addParams.subhead = null;
        $scope.addParams.title = null;
        $scope.addParams.mainBody = null;
    }

    //删除用户指南操作
    $scope.userGuideDel=function(item){
        systemTools.writer_del({id:item.id}).then(function(res){
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '删除用户指南成功';
                ngDialog.openConfirm({
                    templateUrl: 'view/diag/promptDiag.html',
                    calssName: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                })
                $scope.userGuideInfo.splice($scope.userGuideInfo.indexOf(item, 1))
            }
            $scope.pageSelect();
        })
    }

    //编辑用户指南操作
    $scope.userGuideEdit=function(item){
        var href=window.location.href.split('index.html');
        window.location.href = href[0] + 'view/userGuideAddUeditor/_examples/userGuideEditUeditor.html?title='+item.title+'&id='+item.id;
    }

    //时间插件
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();
})
