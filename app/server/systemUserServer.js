
angular.module("FMsainuoyi").factory('systemUser',['$http','$q','DB',function($http,$q,DB){
    return {
        sysuser_list:function(model){
            return DB.basePost(FM_RequestUrl.sysuser_list,model)   //查看系统用户
        },
        sysuser_add:function(model){
            return DB.basePost(FM_RequestUrl.sysuser_add,model)   //添加系统用户
        },
        sysuser_edit:function(model){
            return DB.basePost(FM_RequestUrl.sysuser_edit,model)   //编辑系统用户
        },
        sysuser_del:function(model){
            return DB.basePost(FM_RequestUrl.sysuser_del,model)   //删除系统用户
        }
    }
}])
