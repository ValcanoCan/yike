
angular.module("FMsainuoyi").factory('vehicleManagess',['$http','$q','DB',function($http,$q,DB){
    return {
        vehicle_add:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_add,model)   //ע���³���
        },
        vehicle_list:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_list,model)   //�鿴�����б�
        },
        vehicle_del:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_del,model)   //ɾ������
        },
        vehicle_edit:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_edit,model)   //������Ϣ�޸�
        },
        vehicle_reg:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_reg,model)   //ע�ᳵ����IOT
        },
        vehicle_find:function(model){
            return DB.basePost(FM_RequestUrl.vehicle_find,model)   //�鿴������ϸ��Ϣ
        },
        battery_list:function(model){
            return DB.basePost(FM_RequestUrl.battery_list,model)   //�����Ϣ�б�
        }
    }
}])
