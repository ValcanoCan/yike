
 var ip="121.43.32.168"
 var point="8080"

var projectName="admin";
var RequestUrl="http://"+ip+":"+point+"/"+projectName;

var FM_RequestUrl={
    login:RequestUrl+"/login/info",//登录

    //--权限管理start
    role_add:RequestUrl+"/role/add",//创建权限
    role_del:RequestUrl+"/role/del",//删除权限
    role_edit:RequestUrl+"/role/edit",//修改权限
    role_listRole:RequestUrl+"/role/listRole",//查看权限
    role_userUrl:RequestUrl+"/role/userUrl",//根据USER_ID查询左侧主菜单
    url_add:RequestUrl+"/url/add",//创建url
    url_del:RequestUrl+"/url/del",//删除url
    url_edit:RequestUrl+"/url/edit",//修改url
    url_list:RequestUrl+"/url/list",//根据PARENT_ID查询子菜单
    rUrlMap_add:RequestUrl+"/rUrlMap/add",//权限和url绑定
    rUrlMap_del:RequestUrl+"/rUrlMap/del",//权限和url解绑
    rUrlMap_edit:RequestUrl+"/rUrlMap/edit",//权限和url修改
    rUrlMap_list:RequestUrl+"/rUrlMap/list",//权限和url绑定列表
    rUserMap_add:RequestUrl+"/rUserMap/add",//权限和运维人员绑定
    rUserMap_del:RequestUrl+"/rUserMap/del",//权限和运维人员解绑
    rUserMap_edit:RequestUrl+"/rUserMap/edit",//权限和运维人员修改
    rUserMap_list:RequestUrl+"/rUserMap/list",//权限和运维人员绑定列表

    //--权限管理end

    //--系统用户管理start
    sysuser_list:RequestUrl+"/sysuser/list",//查看系统用户列表
    sysuser_add:RequestUrl+"/sysuser/add",//新增系统用户
    sysuser_edit:RequestUrl+"/sysuser/edit",//编辑系统用户
    sysuser_del:RequestUrl+"/sysuser/del",//删除系统用户
    //--系统用户管理end

    //--用户管理start
    user_list:RequestUrl+"/user/list",//查看所有用户基本信息
    user_deposit_currList:RequestUrl+"/pledag/currList",//查看单个用户押金变化记录
    user_recharge_currList:RequestUrl+"/payment/currList",//查看单个用户充值记录
    share_add:RequestUrl+"/share/add",//添加分享
    share_list:RequestUrl+"/share/list",//分享列表
    share_edit:RequestUrl+"/share/edit",//修改分享
    share_del:RequestUrl+"/share/del",//删除分享
    share_isUseing:RequestUrl+"/share/isUseing",//启动分享
    //--用户管理end

    //--订单管理start
    //查看订单
    order_list:RequestUrl+"/order/list", //查看订单信息
    order_finish:RequestUrl+"/order/finish", //关闭订单
    order_share:RequestUrl+"/order/share",//订单分享


    //扣费管理
    charging_sub:RequestUrl+"/pledag/sub",//扣费管理

    //押金管理
    deposit_list:RequestUrl+"/pledag/list",//押金管理

    //退押金管理
    return_deposit_refList:RequestUrl+"/pledag/refList",//退押金列表
    return_deposit_apply:RequestUrl+"/pledag/apply",//审核退押金
    return_deposit_refund:RequestUrl+"/pledag/refund",//退押金

    //用户充值管理
    order_currList:RequestUrl+"/payment/currList",//用户充值记录

    //活动管理
    activity_add:RequestUrl+"/activity/add",//添加活动
    activity_list:RequestUrl+"/activity/list",//活动列表
    activity_close:RequestUrl+"/activity/close",//关闭活动
    //--订单管理end

    //--系统工具start
    //用户指南编辑管理
    //writer_title:RequestUrl+"/writer/title",//获取文章内容
    writer_add:RequestUrl+"/writer/add",//添加文章内容
    writer_list:RequestUrl+"/writer/find",//查看用户指南列表
    writer_del:RequestUrl+"/writer/del",//删除用户指南
    writer_edit:RequestUrl+"/writer/edit",//编辑用户指南

    //移动端参数设置
    mobile_add:RequestUrl+"/config/add",//移动端参数添加
    mobile_edit:RequestUrl+"/config/edit",//移动端参数修改
    mobile_find:RequestUrl+"/config/find",//移动端参数查询
    mobile_del:RequestUrl+"/config/del",//移动端参数删除

    //广告管理
    ad_add:RequestUrl+"/ad/add",//添加广告
    ad_list:RequestUrl+"/ad/list",//广告列表
    ad_isUseing:RequestUrl+"/ad/isUseing",//将某条广告变成正在使用
    ad_stop:RequestUrl+"/ad/stop",//停发所有广告

    //消息推送
    push_send:RequestUrl+"/push/send",//推送所有设备
    push_list:RequestUrl+"/push/list",//推送消息列表

    //轮询
    loadFault_warn:RequestUrl+"/loadFault/warn",//轮询，即时通知
    //--系统工具end

    //--车辆管理start
    vehicle_add:RequestUrl+"/vehicle/add",//注册新车辆
    vehicle_list:RequestUrl+"/vehicle/list",//车辆查看列表
    vehicle_del:RequestUrl+"/vehicle/del",//删除车辆
    vehicle_edit:RequestUrl+"/vehicle/edit",//车辆信息修改
    vehicle_reg:RequestUrl+"/vehicle/reg",//注册车辆到IOT
    vehicle_find:RequestUrl+"/vehicle/find",//查看车辆详细信息
    battery_list:RequestUrl+"/battery/list",//电池信息列表
    //--车辆管理end

    //--电子区域管理start
    fence_getCitys:RequestUrl+"/fence/getCitys",//获取车辆
    fence_add:RequestUrl+"/fence/add",//创建电子围栏
    fence_find:RequestUrl+"/fence/find",//查看电子围栏
    fence_del:RequestUrl+"/fence/del",//删除电子围栏
    fence_edit:RequestUrl+"/fence/edit",//修改电子围栏
    fenceUser_add:RequestUrl+"/fenceUser/add",//创建电子围栏中的人员
    fenceUser_list:RequestUrl+"/fenceUser/list",//查看电子围栏中的人员
    fenceUser_edit:RequestUrl+"/fenceUser/edit",//修改电子围栏中的人员
    fenceUser_del:RequestUrl+"/fenceUser/del",//删除电子围栏中的人员
    fenceVehicle_add:RequestUrl+"/fenceVechile/add",//添加电子围栏中的车辆
    fenceVehicle_list:RequestUrl+"/fenceVechile/list",//查看电子围栏中的车辆
    fenceVehicle_edit:RequestUrl+"/fenceVechile/edit",//编辑电子围栏中的车辆
    fenceVehicle_del:RequestUrl+"/fenceVechile/del",//删除电子围栏中的车辆
    fenceCity_list:RequestUrl+"/fenceCity/list",//查看城市
    fenceCity_add:RequestUrl+"/fenceCity/add",//添加城市
    fenceCity_edit:RequestUrl+"/fenceCity/edit",//修改城市
    fenceCity_del:RequestUrl+"/fenceCity/del",//删除城市
    fenceCity_districtsList:RequestUrl+"/fenceCity/districtsList",//查看区县地级市
    point_add:RequestUrl+"/point/add",//创建还车点
    point_del:RequestUrl+"/point/del",//删除还车点
    point_list:RequestUrl+"/point/list",//查看还车点
    //--电子区域管理end

    //--运维任务管理start
    task_add:RequestUrl+"/task/add",//创建运维任务
    task_edit:RequestUrl+"/task/edit",//修改运维任务
    task_del:RequestUrl+"/task/del",//删除运维任务
    task_list:RequestUrl+"/task/list",//查看运维任务列表
    taskUser_add:RequestUrl+"/taskUser/add",//分配执行任务的人员
    //--运维任务管理end

    //--故障报修管理start
    maintain_list:RequestUrl+"/maintain/list",//故障报修列表、查询
    maintain_approve:RequestUrl+"/maintain/approve",//故障审核
    maintain_assign:RequestUrl+"/maintain/assign",//下发工单
    loadFault_list:RequestUrl+"/loadFault/list",//查看t-box报上来的故障
    //--故障报修管理end

    //--统计管理start
    statistics_orders:RequestUrl+"/statistics/orders",//订单统计
    statistics_pays:RequestUrl+"/statistics/pays",//余额统计
    statistics_pledges:RequestUrl+"/statistics/pledges",//押金统计
    //--统计管理end

    //--客户信息反馈start
    feedback_list:RequestUrl+"/feedback/list",//查看用户信息反馈(在故障报修服务中)
    //--客户信息反馈end

}