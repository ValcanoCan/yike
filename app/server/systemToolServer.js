
angular.module("FMsainuoyi").factory('systemTools',['$http','$q','DB',function($http,$q,DB){
    return {
        writer_add:function(model){
            return DB.basePost(FM_RequestUrl.writer_add,model)   //添加文章内容
        },
        writer_list:function(model){
            return DB.basePost(FM_RequestUrl.writer_list,model)   //查看用户指南列表
        },
        writer_edit:function(model){
            return DB.basePost(FM_RequestUrl.writer_edit,model)   //编辑用户指南
        },
        writer_del:function(model){
            return DB.basePost(FM_RequestUrl.writer_del,model)   //删除用户指南
        },
        mobile_add:function(model){
            return DB.basePost(FM_RequestUrl.mobile_add,model)   //移动端参数添加
        },
        mobile_edit:function(model){
            return DB.basePost(FM_RequestUrl.mobile_edit,model)   //移动端参数修改
        },
        mobile_find:function(model){
            return DB.basePost(FM_RequestUrl.mobile_find,model)   //移动端参数查询
        },
        mobile_del:function(model){
            return DB.basePost(FM_RequestUrl.mobile_del,model)   //移动端参数删除
        },
        push_send:function(model){
            return DB.basePost(FM_RequestUrl.push_send,model)   //推送所有设备
        },
        push_list:function(model){
            return DB.basePost(FM_RequestUrl.push_list,model)   //推送消息列表
        },
        ad_add:function(model){
            return DB.basePost(FM_RequestUrl.ad_add,model)   //添加新广告
        },
        ad_list:function(model){
            return DB.basePost(FM_RequestUrl.ad_list,model)   //广告列表
        },
        ad_isUseing:function(model){
            return DB.basePost(FM_RequestUrl.ad_isUseing,model)   //将某条广告变成正在使用
        },
        ad_stop:function(model){
            return DB.basePost(FM_RequestUrl.ad_stop,model)   //停发所有广告
        },
        loadFault_warn:function(model){
            return DB.basePost(FM_RequestUrl.loadFault_warn,model)   //轮询，即时通知
        },
    }
}])
