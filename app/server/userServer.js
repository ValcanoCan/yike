angular.module("FMsainuoyi").factory('userManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        user_list:function(model){
            return DB.basePost(FM_RequestUrl.user_list,model)//查看用户基本信息
        },
        user_deposit_currList:function(model){
            return DB.basePost(FM_RequestUrl.user_deposit_currList,model)//查看单个用户押金变化记录
        },
        user_recharge_currList:function(model){
            return DB.basePost(FM_RequestUrl.user_recharge_currList,model)//查看单个用户充值记录
        },
        share_add:function(model){
            return DB.basePost(FM_RequestUrl.share_add,model)//添加分享
        },
        share_list:function(model){
            return DB.basePost(FM_RequestUrl.share_list,model)//分享列表
        },
        share_edit:function(model){
            return DB.basePost(FM_RequestUrl.share_edit,model)//修改分享
        },
        share_del:function(model){
            return DB.basePost(FM_RequestUrl.share_del,model)//删除分享
        },
        share_isUseing:function(model){
            return DB.basePost(FM_RequestUrl.share_isUseing,model)//启动分享
        },
    }
}])
