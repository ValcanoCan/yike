
angular.module("FMsainuoyi").factory('statisticManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        statistics_orders:function(model){
            return DB.basePost(FM_RequestUrl.statistics_orders,model)   //����ͳ��
        },
        statistics_pays:function(model){
            return DB.basePost(FM_RequestUrl.statistics_pays,model)   //���ͳ��
        },
        statistics_pledges:function(model){
            return DB.basePost(FM_RequestUrl.statistics_pledges,model)   //Ѻ��ͳ��
        },
    }
}])

