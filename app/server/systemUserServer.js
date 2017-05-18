
angular.module("FMsainuoyi").factory('systemUser',['$http','$q','DB',function($http,$q,DB){
    return {
        sysuser_list:function(model){
            return DB.basePost(FM_RequestUrl.sysuser_list,model)   //�鿴ϵͳ�û�
        },
        sysuser_add:function(model){
            return DB.basePost(FM_RequestUrl.sysuser_add,model)   //���ϵͳ�û�
        },
        sysuser_edit:function(model){
            return DB.basePost(FM_RequestUrl.sysuser_edit,model)   //�༭ϵͳ�û�
        },
        sysuser_del:function(model){
            return DB.basePost(FM_RequestUrl.sysuser_del,model)   //ɾ��ϵͳ�û�
        }
    }
}])
