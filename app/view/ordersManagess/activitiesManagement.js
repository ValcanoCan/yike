angular.module("FMsainuoyi").controller('activitiesManagementCtrl', function (ordersManagess, $scope, ngDialog) {
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //页面变化监测
    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModel.startPage = $scope.paginationConf.page
        $scope.selectModel.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    //传参配置
    $scope.selectModel={
        startPage:$scope.paginationConf.currentPage,
        offset:$scope.paginationConf.itemsPerPage
    }

    //分页加载活动列表页面
    $scope.pageSelect=function(){
        jzts()
        ordersManagess.activity_list($scope.selectModel).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.activityInfo=res.data.data[0];
                $scope.confTotalItems=res.data.data[1].totalCount;
                $scope.paginationConf.totalItems=res.data.data[1].totalCount;
                $scope.paginationConf.itemsPerPage=res.data.data[1].offset;
                console.log($scope.activityInfo);
                $scope.startPage=res.data.data[1].startPage;
                angular.forEach($scope.activityInfo,function(data,index){
                    switch(data.target){
                        case 1:data.target='普通会员';
                            break;
                        case 2:data.target='消费多少(元)';
                            break;
                        case 3:data.target='信用多少';
                            break;
                        case 4:data.target='注册时间(天)';
                            break;
                        default:'普通会员';
                            break;
                    }
                    if($scope.startPage>1){
                        data.orderNo=($scope.startPage-1)*10+index+1;
                    }else{
                        data.orderNo=index+1;
                    }
                })
            }
            hangge()
        })

    }

    //添加活动操作
    $scope.activityAdd = function () {
        ngDialog.openConfirm({
            template: "activityAddDiag",
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope,
            closeByDocument:false
        }).then(function () {

        })
    }

    //传参设置
    $scope.activityParam = {
        startTime:null,
        endTime:null,
        target:null,
        rule1:null,
        rule2:null
    }

    //新增活动参数变化监测
    $scope.activityParamChange=function(cusType,startTime,endTime,rechargeAmount,donationAmount){
        $scope.activityParam.target=cusType;
        $scope.activityParam.startTime=startTime;
        $scope.activityParam.endTime=endTime;
        $scope.activityParam.rule1=rechargeAmount;
        $scope.activityParam.rule2=donationAmount;
    }

    //保存添加
    $scope.addSave = function () {
        console.log($scope.activityParam)
        if ($scope.activityParam.startTime == null||$scope.activityParam.startTime==''||$scope.activityParam.startTime=='undefined' ||
            $scope.activityParam.endTime == null||$scope.activityParam.endTime==''||$scope.activityParam.endTime=='undefined') {
            $scope.promptContent = '请输入必要参数值'
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: "ngdialog-theme-default",
                preCloseCallback: "preCloseCallbackOnScope",
                scope: $scope,
            })
            return;
        }
        ordersManagess.activity_add($scope.activityParam).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.promptContent = '活动添加成功'
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
                ngDialog.closeAll();
                $scope.pageSelect();
            }
        })
        $scope.activityParam.startTime=null;
        $scope.activityParam.endTime=null;
        $scope.activityParam.target=null;
    }

    //关闭活动操作
    $scope.activityDel=function(item,event){
        ordersManagess.activity_close({id:item.id}).then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $scope.promptContent = '关闭活动成功'
                ngDialog.openConfirm({
                    templateUrl: "view/diag/promptDiag.html",
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope,
                })
                $scope.pageSelect();
            }
        })
    }

    //时间日历
    $scope.$on('ngDialog.opened', function () {
        $('#datetimepicker1').datetimepicker();
        $('#datetimepicker2').datetimepicker();
    })
})