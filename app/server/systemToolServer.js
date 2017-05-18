
angular.module("FMsainuoyi").factory('systemTools',['$http','$q','DB',function($http,$q,DB){
    return {
        writer_add:function(model){
            return DB.basePost(FM_RequestUrl.writer_add,model)   //�����������
        },
        writer_list:function(model){
            return DB.basePost(FM_RequestUrl.writer_list,model)   //�鿴�û�ָ���б�
        },
        writer_edit:function(model){
            return DB.basePost(FM_RequestUrl.writer_edit,model)   //�༭�û�ָ��
        },
        writer_del:function(model){
            return DB.basePost(FM_RequestUrl.writer_del,model)   //ɾ���û�ָ��
        },
        mobile_add:function(model){
            return DB.basePost(FM_RequestUrl.mobile_add,model)   //�ƶ��˲������
        },
        mobile_edit:function(model){
            return DB.basePost(FM_RequestUrl.mobile_edit,model)   //�ƶ��˲����޸�
        },
        mobile_find:function(model){
            return DB.basePost(FM_RequestUrl.mobile_find,model)   //�ƶ��˲�����ѯ
        },
        mobile_del:function(model){
            return DB.basePost(FM_RequestUrl.mobile_del,model)   //�ƶ��˲���ɾ��
        },
        push_send:function(model){
            return DB.basePost(FM_RequestUrl.push_send,model)   //���������豸
        },
        push_list:function(model){
            return DB.basePost(FM_RequestUrl.push_list,model)   //������Ϣ�б�
        },
        ad_add:function(model){
            return DB.basePost(FM_RequestUrl.ad_add,model)   //����¹��
        },
        ad_list:function(model){
            return DB.basePost(FM_RequestUrl.ad_list,model)   //����б�
        },
        ad_isUseing:function(model){
            return DB.basePost(FM_RequestUrl.ad_isUseing,model)   //��ĳ�����������ʹ��
        },
        ad_stop:function(model){
            return DB.basePost(FM_RequestUrl.ad_stop,model)   //ͣ�����й��
        },
        loadFault_warn:function(model){
            return DB.basePost(FM_RequestUrl.loadFault_warn,model)   //��ѯ����ʱ֪ͨ
        },
    }
}])
