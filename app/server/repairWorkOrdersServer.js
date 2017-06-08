
angular.module("FMsainuoyi").factory('repairWorkOrders',['$http','$q','DB',function($http,$q,DB){
    return {
        maintain_list:function(model){
            return DB.basePost(FM_RequestUrl.maintain_list,model)   //获取故障报修列表、查询
        },
        maintain_approve:function(model){
            return DB.basePost(FM_RequestUrl.maintain_approve,model)   //审核工单
        },
        maintain_assign:function(model){
            return DB.basePost(FM_RequestUrl.maintain_assign,model)   //下发工单
        },
        feedback_list:function(model){
            return DB.basePost(FM_RequestUrl.feedback_list,model)   //查看用户信息反馈列表
        },
        loadFault_list:function(model){
            return DB.basePost(FM_RequestUrl.loadFault_list,model)   //查询t-box报上来的故障
        },
        loadFault_dispatch:function(model){
            return DB.basePost(FM_RequestUrl.loadFault_dispatch,model)   //将TBOX上报的故障数据生成任务
        },
    }
}])
