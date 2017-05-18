
angular.module("FMsainuoyi").factory('electronicRegion',['$http','$q','DB',function($http,$q,DB){
    return {
        fence_getCitys:function(model){
            return DB.basePost(FM_RequestUrl.fence_getCitys,model)   //��ȡ����
        },
        fence_add:function(model){
            return DB.basePost(FM_RequestUrl.fence_add,model)   //�½�����Χ��
        },
        fence_find:function(model){
            return DB.basePost(FM_RequestUrl.fence_find,model)   //�鿴����Χ��
        },
        fence_del:function(model){
            return DB.basePost(FM_RequestUrl.fence_del,model)   //ɾ������Χ��
        },
        fence_edit:function(model){
            return DB.basePost(FM_RequestUrl.fence_edit,model)   //�޸ĵ���Χ��
        },
        fenceUser_add:function(model){
            return DB.basePost(FM_RequestUrl.fenceUser_add,model)   //��������Χ���е���Ա
        },
        fenceUser_list:function(model){
            return DB.basePost(FM_RequestUrl.fenceUser_list,model)   //�鿴����Χ���е���Ա
        },
        fenceUser_edit:function(model){
            return DB.basePost(FM_RequestUrl.fenceUser_edit,model)   //�༭����Χ���е���Ա
        },
        fenceUser_del:function(model){
            return DB.basePost(FM_RequestUrl.fenceUser_del,model)   //ɾ������Χ���е���Ա
        },
        fenceVehicle_add:function(model){
            return DB.basePost(FM_RequestUrl.fenceVehicle_add,model)   //��ӵ���Χ���еĳ���
        },
        fenceVehicle_list:function(model){
            return DB.basePost(FM_RequestUrl.fenceVehicle_list,model)   //�鿴����Χ���еĳ���
        },
        fenceVehicle_edit:function(model){
            return DB.basePost(FM_RequestUrl.fenceVehicle_edit,model)   //�༭����Χ���еĳ���
        },
        fenceVehicle_del:function(model){
            return DB.basePost(FM_RequestUrl.fenceVehicle_del,model)   //ɾ������Χ���еĳ���
        },
        fenceCity_list:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_list,model)   //�鿴����
        },
        fenceCity_add:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_add,model)   //��ӳ���
        },
        fenceCity_edit:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_edit,model)   //�޸ĳ���
        },
        fenceCity_del:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_del,model)   //ɾ������
        },
        fenceCity_districtsList:function(model){
            return DB.basePost(FM_RequestUrl.fenceCity_districtsList,model)   //�鿴���صؼ���
        },
        point_add:function(model){
            return DB.basePost(FM_RequestUrl.point_add,model)   //����������
        },
        point_del:function(model){
            return DB.basePost(FM_RequestUrl.point_del,model)   //ɾ��������
        },
        point_list:function(model){
            return DB.basePost(FM_RequestUrl.point_list,model)   //�鿴������
        },
    }
}])
