
angular.module("FMsainuoyi").factory('statisticManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        statistics_orders:function(model){
            return DB.basePost(FM_RequestUrl.statistics_orders,model)   //订单统计
        },
        statistics_pays:function(model){
            return DB.basePost(FM_RequestUrl.statistics_pays,model)   //余额统计
        },
        statistics_pledges:function(model){
            return DB.basePost(FM_RequestUrl.statistics_pledges,model)   //押金统计
        },
    }
}])

