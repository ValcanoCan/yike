angular.module("FMsainuoyi").controller('messagePushCtrl',function(systemTools,$scope,ngDialog){
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
        systemTools.push_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.messagessInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.messagessInfo, function (data, index) {
                    data.createTime = transTime(data.createTime);
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                })
                //console.log($scope.messagessInfo)
            }
            hangge()
        })
    }

    //点击搜索操作
    $scope.messageSearch=function(){
        alert("you can't search any messages until you call interface!")
    }

    //发布消息操作
    $scope.publishMessage=function(){
        ngDialog.openConfirm({
            template:'messagePushDiag',
            calssName:'ngdialog-theme-default',
            preCloseCallback:'preCloseCallbackOnScope',
            scope:$scope
        }).then(function(res){

        })
    }

    //发送消息传参配置
    $scope.messageParams={
        content:null,
        title:null
    }

    //消息内容变化监测
    $scope.messageParamChange=function(title,content){
        $scope.messageParams.title=title;
        $scope.messageParams.content=content;
    }

    //确认推送消息
    $scope.messagePushSave=function(){
        if($scope.messageParams.title==''||$scope.messageParams.title==null||$scope.messageParams.title=='undefind'||
            $scope.messageParams.content==''||$scope.messageParams.content==null||$scope.messageParams.content=='undefind'){
            $scope.promptContent='请输入必要参数,再推送消息。';
            ngDialog.openConfirm({
                templateUrl:'view/diag/promptDiag.html',
                className:'ngdialog-theme-default',
                preCloseCallback:'preCloseCallbackOnScope',
                scope:$scope
            })
            return;
        }
        systemTools.push_send($scope.messageParams).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent='消息推送成功';
                ngDialog.openConfirm({
                    templateUrl:'view/diag/promptDiag.html',
                    className:'ngdialog-theme-default',
                    preCloseCallback:'preCloseCallbackOnScope',
                    scope:$scope
                })
                ngDialog.closeAll();
                $scope.pageSelect();
            }
        })
    }

    //删除消息操作
    $scope.deleteMessage=function(id){
        alert('are you sure to delete this message?')
    }

    //日期弹出框
    $("#datetimepicker1").datetimepicker({});
    $("#datetimepicker2").datetimepicker({});

    //开始日期变化监测
    $scope.startTimeChange=function(item){
        console.log(item);
    }

    //结束日期变化监测
    $scope.endTimeChange=function(item){
        console.log(item);
    }

})