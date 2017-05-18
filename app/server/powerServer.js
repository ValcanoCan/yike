
angular.module("FMsainuoyi").factory('powerManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        role_add:function(model){
            return DB.basePost(FM_RequestUrl.role_add,model)   //����Ȩ��
        },
        role_del:function(model){
            return DB.basePost(FM_RequestUrl.role_del,model)   //ɾ��Ȩ��
        },
        role_edit:function(model){
            return DB.basePost(FM_RequestUrl.role_edit,model)   //�޸�Ȩ��
        },
        role_listRole:function(model){
            return DB.basePost(FM_RequestUrl.role_listRole,model)   //�鿴Ȩ��
        },
        role_userUrl:function(model){
            return DB.basePost(FM_RequestUrl.role_userUrl,model)   //����USER_ID��ѯURL
        },
        url_add:function(model){
            return DB.basePost(FM_RequestUrl.url_add,model)  //����url
        },
        url_del:function(model){
            return DB.basePost(FM_RequestUrl.url_del,model)   //ɾ��url
        },
        url_edit:function(model){
            return DB.basePost(FM_RequestUrl.url_edit,model)  //�޸�url
        },
        url_list:function(model){
            return DB.basePost(FM_RequestUrl.url_list,model)  //����PARENT_ID��ѯURL
        },
        rUrlMap_add:function(model){
            return DB.basePost(FM_RequestUrl.rUrlMap_add,model)  //Ȩ�޺Ͳ˵���
        },
        rUrlMap_del:function(model){
            return DB.basePost(FM_RequestUrl.rUrlMap_del,model)  //Ȩ�޺Ͳ˵����
        },
        rUrlMap_edit:function(model){
            return DB.basePost(FM_RequestUrl.rUrlMap_edit,model)  //Ȩ�޺Ͳ˵��޸�
        },
        rUrlMap_list:function(model){
            return DB.basePost(FM_RequestUrl.rUrlMap_list,model)  //Ȩ�޺Ͳ˵����б�
        },
        rUserMap_add:function(model){
            return DB.basePost(FM_RequestUrl.rUserMap_add,model)  //Ȩ�޺���ά��Ա��
        },
        rUserMap_del:function(model){
            return DB.basePost(FM_RequestUrl.rUserMap_del,model)  //Ȩ�޺���ά��Ա���
        },
        rUserMap_edit:function(model){
            return DB.basePost(FM_RequestUrl.rUserMap_edit,model)  //Ȩ�޺���ά��Ա�޸�
        },
        rUserMap_list:function(model){
            return DB.basePost(FM_RequestUrl.rUserMap_list,model)  //Ȩ�޺���ά��Ա���б�
        },
    }
}])

