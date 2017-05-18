angular.module('FMsainuoyi').config(['$routeProvider', function ($routeProvider) {
    var publicPath = "../app/view"
    $routeProvider.
        //默认页面
        when('/', {
            templateUrl: publicPath + "/loginDefault/loginDefaultIndex.html",
            controller: "loginDefaultIndexCtrl"
        }).
        //权限管理
        //权限列表
        when('/roleList', {
            templateUrl: publicPath + "/powerManagess/navPowerList.html",
            controller: "navPowerListCtrl"
        }).
        //权限和菜单绑定列表
        when('/roleNavsList', {
            templateUrl: publicPath + "/powerManagess/roleNavsList.html",
            controller: "roleNavsListCtrl"
        }).
        //权限和运维人员绑定列表
        when('/roleUsersList', {
            templateUrl: publicPath + "/powerManagess/roleUsersList.html",
            controller: "roleUsersListCtrl"
        }).
        //url列表
        when('/urlPowerList', {
            templateUrl: publicPath + "/powerManagess/urlPowerList.html",
            controller: "urlPowerListCtrl"
        }).
        //系统用户管理
        //查看系统用户信息列表
        when('/systemUser', {
            templateUrl: publicPath + "/systemUser/systemUserList.html",
            controller: "systemUserCtrl"
        }).
        //--用户管理
        //查看用户信息页面
        when('/customer', {
            templateUrl: publicPath + "/customerManagess/customerManagement.html",
            controller: "customerManagementCtrl"
        }).
        //骑行记录页面
        when('/ridingRecord', {
            templateUrl: publicPath + '/customerManagess/ridingRecord.html',
            controller: 'ridingRecordCtrl'
        }).
        //查看单个用户押金充值页面
        when('/depositRechargeRecord', {
            templateUrl: publicPath + '/customerManagess/depositRechargeRecord.html',
            controller: "depositRechargeRecordCtrl"
        }).
        //查看单个用户充值记录页面
        when('/balanceRechargeRecord', {
            templateUrl: publicPath + '/customerManagess/balanceRechargeRecord.html',
            controller: 'balanceRechargeRecordCtrl'
        }).
        //查看分享设置列表页面
        when('/shareSection', {
            templateUrl: publicPath + '/customerManagess/shareSectionList.html',
            controller: 'shareSectionListCtrl'
        }).
        //--订单管理
        //查看订单信息页面
        when('/orderInfo', {
            templateUrl: publicPath + '/ordersManagess/checkOrderInfo.html',
            controller: "checkOrderInfoCtrl"
        }).
        //扣费管理页面
        when('/chargeManagement', {
            templateUrl: publicPath + '/ordersManagess/chargeManagement.html',
            controller: 'chargeManagementCtrl'
        }).
        //押金管理页面，可并入到退押金管理页面
        when('/depositManagement', {
            templateUrl: publicPath + '/ordersManagess/depositManagement.html',
            controller: 'depositManagementCtrl'
        }).
        //退押金管理页面
        when('/returnDeposit', {
            templateUrl: publicPath + '/ordersManagess/returnDepositManagement.html',
            controller: 'returnDepositManagementCtrl'
        }).
        //用户充值管理页面
        when('/recharge', {
            templateUrl: publicPath + '/ordersManagess/rechargeManagement.html',
            controller: 'rechargeManagementCtrl'
        }).
        when('/personalOrderInfo', {
            templateUrl: publicPath + '/ordersManagess/personalOrderInfo.html',
            controller: "personalOrderInfoCtrl"
        }).
        //活动管理页面
        when('/activities', {
            templateUrl: publicPath + '/ordersManagess/activitiesManagement.html',
            controller: 'activitiesManagementCtrl'
        }).
        //消息推送页面
        when('/messagePush', {
            templateUrl: publicPath + '/systemTools/messagePush.html',
            controller: 'messagePushCtrl'
        }).
        //用户指南编辑管理页面
        when('/userGuideList', {
            templateUrl: publicPath + '/systemTools/userGuideList.html',
            controller: 'userGuideListCtrl'
        }).
        ////新增用户指南编辑器
        //when('/userGuideAdd', {
        //    templateUrl: publicPath + '/userGuideAddUeditor/_examples/userGuideAddUeditor.html',
        //    controller: 'userGuideAddUeditorCtrl'
        //}).
        //移动端参数设置页面
        when('/mobileParamSetting', {
            templateUrl: publicPath + '/systemTools/mobileParamSetting.html',
            controller: 'mobileParamSettingCtrl'
        }).
        //订单计费参数设置页面
        when('/orderChargingParam', {
            templateUrl: publicPath + '/systemTools/orderChargingParamSetting.html',
            controller: 'orderChargingParamSettingCtrl'
        }).
        //服务费用设置页面
        when('/serviceCharge', {
            templateUrl: publicPath + '/systemTools/serviceChargeSetting.html',
            controller: 'serviceChargeSettingCtrl'
        }).
        //广告列表
        when('/advertisement', {
            templateUrl: publicPath + '/systemTools/advertisement.html',
            controller: 'advertisementCtrl'
        }).
        //车辆查看页面
        when('/vehicleView', {
            templateUrl: publicPath + '/vehicleManagess/vehicleView.html',
            controller: 'vehicleViewCtrl'
        }).
        //电池电机信息管理页面
        when('/electormotor', {
            templateUrl: publicPath + '/vehicleManagess/electromotorManagement.html',
            controller: 'electromotorManagementCtrl'
        }).
        //车辆监控页面
        when('/vehicleMonitor', {
            templateUrl: publicPath + '/vehicleManagess/vehicleMonitor.html',
            controller: 'vehicleMonitorCtrl'
        }).
        //车辆报警页面
        when('/vehicleAlarm', {
            templateUrl: publicPath + '/vehicleManagess/vehicleAlarm.html',
            controller: 'vehicleAlarmCtrl'
        }).
        //--电子区域管理
        //列表查看页面
        when('/electronicRegionInfo', {
            templateUrl: publicPath + '/electronicRegionManagess/electronicRegionInfo.html',
            controller: 'electronicRegionInfoCtrl'
        }).
        //列表查看电子围栏中人员页面
        when('/railStaffList', {
            templateUrl: publicPath + '/electronicRegionManagess/railStaffList.html',
            controller: 'railStaffListCtrl'
        }).
        //列表查看电子围栏中车辆页面
        when('/railVehicleList', {
            templateUrl: publicPath + '/electronicRegionManagess/railVehicleList.html',
            controller: 'railVehicleListCtrl'
        }).
        //--区域车辆投放分发管理
        //显示区域内车辆的信息以及状态
        when('/vehicleShowInfo', {
            templateUrl: publicPath + '/vehicleIssueManagess/vehicleShowInfo.html',
            controller: 'vehicleShowInfoCtrl'
        }).
        //查看运维任务列表
        when('/operationTaskList', {
            templateUrl: publicPath + '/vehicleIssueManagess/operationTaskList.html',
            controller: 'operationTaskListCtrl'
        }).
        //--运维任务管理
        //查看运维任务
        when('/operationTask', {
            templateUrl: publicPath + '/operationTaskManagess/operationTaskManagement.html',
            controller: 'operationTaskManagementCtrl'
        }).
        //--故障报修管理
        //查看报修工单
        when('/repairWorkOrders', {
            templateUrl: publicPath + '/faultRepairManagess/repairWorkOrders.html',
            controller: 'repairWorkOrdersCtrl'
        }).
        when('/tboxLoadFault', {
            templateUrl: publicPath + '/faultRepairManagess/tboxUploadFault.html',
            controller: 'tboxUploadFaultCtrl'
        }).
        //--客户信息反馈管理
        //显示客户信息反馈
        when('/customerInfoFeedback', {
            templateUrl: publicPath + '/customerInfoFeedback/customerInfoFeedback.html',
            controller: 'customerInfoFeedbackCtrl'
        }).
        //--统计管理
        //订单统计
        when('/orderStatistics', {
            templateUrl: publicPath + '/statisticManagess/orderStatisticList.html',
            controller: 'orderStatisticsCtrl'
        }).
        //押金统计
        when('/pledgeStatistics', {
            templateUrl: publicPath + '/statisticManagess/pledgeStatisticList.html',
            controller: 'pledgeStatisticsCtrl'
        }).
        //余额统计
        when('/payStatistics', {
            templateUrl: publicPath + '/statisticManagess/payStatisticList.html',
            controller: 'payStatisticsCtrl'
        })
}])