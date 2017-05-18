
angular.module("FMsainuoyi").factory('ordersManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        order_list:function(model){
            return DB.basePost(FM_RequestUrl.order_list,model)   //查看订单信息
        },
        order_finish:function(model){
            return DB.basePost(FM_RequestUrl.order_finish,model)   //查看订单信息
        },
        order_share:function(model){
            return DB.basePost(FM_RequestUrl.order_share,model)   //订单分享
        },
        charging_sub:function(model){
            return DB.basePost(FM_RequestUrl.charging_sub,model)   //扣费管理
        },
        deposit_list:function(model){
            return DB.basePost(FM_RequestUrl.deposit_list,model)   //押金管理
        },
        return_deposit_refList:function(model){
            return DB.basePost(FM_RequestUrl.return_deposit_refList,model)  //退押金列表
        },
        return_deposit_apply:function(model){
            return DB.basePost(FM_RequestUrl.return_deposit_apply,model)  //审核退押金
        },
        return_deposit_refund:function(model){
            return DB.basePost(FM_RequestUrl.return_deposit_refund,model)   //退押金
        },
        order_currList:function(model){
            return DB.basePost(FM_RequestUrl.order_currList,model)  //用户充值记录
        },
        activity_add:function(model){
            return DB.basePost(FM_RequestUrl.activity_add,model)  //添加活动
        },
        activity_list:function(model){
            return DB.basePost(FM_RequestUrl.activity_list,model)  //活动列表
        },
        activity_close:function(model){
            return DB.basePost(FM_RequestUrl.activity_close,model)  //关闭活动
        }
    }
}])

