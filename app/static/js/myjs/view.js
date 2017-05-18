//var locat = (window.location + '').split('/');
//if ('main' == locat[3]) {
//    locat = locat[0] + '//' + locat[2];
//    console.log(locat)
//} else {
//    locat = locat[0] + '//' + locat[2] + '/' + locat[3];
//    console.log(locat)
//}
//;

//window.setTimeout(function(){
//    myToast.update({
//        text : '<strong>Updated after a few seconds</strong>',
//        bgColor : '#23B65D'
//    });
//}, 12000);

function getLocat(){
    var locat = (window.location + '').split('/');
    if ('main' == locat[3]) {
        locat = locat[0] + '//' + locat[2];
        console.log(locat)
    } else {
        locat = locat[0] + '//' + locat[2] + '/' + locat[3];
        console.log(locat)
    };
    return locat;
}

//获取cookie信息
function getCookie() {
    var cookie = document.cookie;
    var cookieArr = cookie.split("; ");
    var userInfo = {};
    for (var i = 0; i < cookieArr.length; i++) {
        userInfo[cookieArr[i].split("=")[0]] = cookieArr[i].split("=")[1];
    }
    //console.log(userInfo)
    return userInfo;
}

//宽列表模式点击
function clickMenu(id) {
    console.log(id)
    $('#' + id).toggleClass('open')
    //$("#" + id).attr("class", "active open");
    $('#' + id).children('.submenu').toggleClass('ul-show');
}

//判断是否有展开的类
function ifHasangleright() {
    if ($('.icon-double-angle-left').hasClass('icon-double-angle-right') == false) {
        $('.icon-double-angle-left').text('close')
    } else {
        $('.icon-double-angle-left').text('open')
    }
}

//菜单状态切换
var fmid = "fhindex";
var mid = "fhindex";
//function siMenu(event, id) {
//    //console.log(event)
//    //console.log(event.path)
//    var $target = $(event.target);
//    console.log($target.text())
//    var e = event || window.event;
//    window.event ? e.returnValue = false : e.preventDefault();
//    window.event ? e.cancelBubble = true : e.stopPropagation();
//    if (id != mid) {
//        $("#" + mid).removeClass();
//        mid = id;
//    }
//    //if (fid != fmid) {
//    //    $("#" + fmid).removeClass();
//    //    fmid = fid;
//    //}
//    //$("#" + fid).attr("class", "active open");
//    $('#' + id).parent().toggleClass('active')
//    $("#" + id).attr("class", "active");
//    //top.mainFrame.tabAddHandler(id, MENU_NAME, MENU_URL);
//    //if (MENU_URL != "druid/index.html") {
//    //    jzts();
//    //}
//    switch ($target.text()) {
//        case '后台首页':
//            window.location.href = locat + '/app/index.html#/';
//            break;
//        case '权限列表':
//            window.location.href = locat + '/app/index.html#/navPowerList';
//            break;
//        case 'url列表':
//            window.location.href = locat + '/app/index.html#/urlPowerList';
//            break;
//        case '查看系统用户':
//            window.location.href = locat + '/app/index.html#/systemUser';
//            break;
//        case '查看用户信息':
//            window.location.href = locat + '/app/index.html#/customer';
//            break;
//        case '查看订单信息':
//            window.location.href = locat + '/app/index.html#/orderInfo';
//            break;
//        case '扣费管理':
//            window.location.href = locat + '/app/index.html#/chargeManagement';
//            break;
//        case '押金管理':
//            window.location.href = locat + '/app/index.html#/depositManagement';
//            break;
//        case '退押金管理':
//            window.location.href = locat + '/app/index.html#/returnDeposit';
//            break;
//        case '用户充值管理':
//            window.location.href = locat + '/app/index.html#/recharge';
//            break;
//        case '活动管理':
//            window.location.href = locat + '/app/index.html#/activities';
//            break;
//        case '消息推送':
//            window.location.href = locat + '/app/index.html#/messagePush';
//            break;
//        case '用户指南编辑管理':
//            window.location.href = locat + '/app/index.html#/userGuideList';
//            break;
//        case '用户指南(协议)查看':
//            //window.location.href = locat + '/app/view/systemTools/userGuideEdit.html#/';
//            window.location.href = locat + '/app/view/systemTools/userGuideEdit.html?title=""';
//            break;
//        case '移动端参数设置':
//            window.location.href = locat + '/app/index.html#/mobileParamSetting';
//            break;
//        case '订单计费参数设置':
//            window.location.href = locat + '/app/index.html#/orderChargingParam';
//            break;
//        case '服务费用设置':
//            window.location.href = locat + '/app/index.html#/serviceCharge';
//            break;
//        case '车辆查看':
//            window.location.href = locat + '/app/index.html#/vehicleView';
//            break;
//        case '电池电机信息管理':
//            window.location.href = locat + '/app/index.html#/electormotor';
//            break;
//        case '车辆监控':
//            window.location.href = locat + '/app/index.html#/vehicleMonitor';
//            break;
//        case '车辆报警':
//            window.location.href = locat + '/app/index.html#/vehicleAlarm';
//            break;
//        case '列表查看':
//            window.location.href = locat + '/app/index.html#/electronicRegionInfo';
//            break;
//        case '显示区域内车辆的信息以及状态':
//            window.location.href = locat + '/app/index.html#/vehicleShowInfo';
//            break;
//        case '查看运维任务列表':
//            window.location.href = locat + '/app/index.html#/operationTaskList';
//            break;
//        case '查看运维任务'://运维任务管理
//            window.location.href = locat + '/app/index.html#/operationTask';
//            break;
//        case '查看报修工单':
//            window.location.href = locat + '/app/index.html#/repairWorkOrders';
//            break;
//        case '显示客户信息反馈':
//            window.location.href = locat + '/app/index.html#/customerInfoFeedback';
//            break;
//    }
//}

//菜单
function menu() {
    //jzts();
    var diag = new top.Dialog();
    diag.Drag = true;
    diag.Title = "菜单编辑";
    //diag.URL = locat + '/menu.do';
    diag.URL = locat + '/app/view/diag/menuDiag.html';
    diag.Width = 720;
    diag.Height = 390;
    diag.CancelEvent = function () { //关闭事件
        diag.close();
    };
    diag.show();
}

//时间转化,一位数加0
function zeroize(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}

//时间转化,转化成标准时间
function transTime(transTime) {
    var transingTime = new Date(transTime);
    Date.prototype.toLocaleString = function () {
        return this.getFullYear() + "-" + zeroize((this.getMonth() + 1)) + "-" + zeroize(this.getDate()) + "    " + zeroize(this.getHours()) + ":" + zeroize(this.getMinutes()) + ":" + zeroize(this.getSeconds());
    };
    var transedTime = transingTime.toLocaleString();
    transTime = transedTime;
    return transTime;
}

//清除加载进度
function hangge() {
    $("#jzts").hide();
}

//显示加载进度
function jzts() {
    $("#jzts").show();
}

angular.module("FMsainuoyi").controller('navsCtrl',function(powerManagess,systemTools,$scope,$http){
    var userInfo=getCookie();
    powerManagess.role_userUrl({userId:userInfo.userId}).then(function(res){
        if(res.data.RESULT=='SUCCESS'||res.data.resultCode==0){
            $scope.navsInfo=res.data.data[0];
        }
    })

    //显示车辆报警弹框
    $scope.tboxLoadFaultShow=function(event){
        //轮询，即时通知
        systemTools.loadFault_warn().then(function(res){
            if(res.data.RESULT=='SUCCESS'){
                $.toast({
                    heading: 'Warning',
                    text: '<a style="color: #fff;font-size: 16px;text-decoration: none;cursor: pointer;">有 <span style="color: #ff0000;font-weight: 700;">'+res.data.data[0]+'</span> 条车辆告警信息</strong>',
                    showHideTransition: 'plain',
                    icon: 'warning',
                    hideAfter : 4000,
                    position : 'top-right'
                })

                var xBtn=document.getElementsByClassName('close-jq-toast-single')[0];
                xBtn.onclick=function(event){
                    var e = event || window.event;
                    if (e.stopPropagation) {
//W3C
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    else {
//IE
                        e.cancelBubble = true;
                        e.returnValue  = false;
                    }
                }
                var warnBtn = document.getElementsByClassName('jq-toast-wrap top-right')[0];
                warnBtn.onclick=function(event){
                    var href = window.location.href.split('#/')
                    window.location.href = href[0] + '#/tboxLoadFault';
                }
            }else{
                $.toast({
                    heading: 'Success',
                    text: '<strong style="color: #fff;font-size: 16px;">车辆正常</strong>',
                    showHideTransition: 'slide',
                    icon: 'success',
                    hideAfter : 15000,
                    position : 'top-right'

                })
            }
        })
    }

    //定时通知
    window.setInterval(function(){
        $scope.tboxLoadFaultShow(window.event);
    },120000)

    //宽列表模式点击
    $scope.clickMenu=function(id){
        angular.forEach(angular.element('#' + id).siblings(),function(data,index){
            angular.element('#'+data.id).removeClass('open');
            angular.element('#' + data.id).children('.submenu').removeClass('ul-show');
        })
        //$("#" + id).attr("class", "active open");
        angular.element('#' + id).toggleClass('open ace-settings-box');
        angular.element('#' + id).children('.submenu').toggleClass('ul-show');
        //powerManagess.url_list({parentId:id}).then(function(res){
        //    if(res.data.RESULT=='SUCCESS'){
        //        $scope.childNavsInfo=res.data.data[0];
        //    }
        //})
    }

    //菜单状态切换
    var fmid = "fhindex";
    var mid = "fhindex";
    $scope.childMenu=function (event,child, id,uId) {
        console.log(id)
        //console.log(event)
        //this.toggleClass('active');
        //console.log(child.name)
        var $target = $(event.target);
        //console.log($target[0].parentNode.id)
        //angular.element('#'+$target[0].parentNode.id).attr("class", "active")
        console.log($target.text())
        //console.log($(event.target.outerHTML)[0])
        //event.stopPropagation();
        var e = event || window.event;
        if (e.stopPropagation) {
//W3C
            e.stopPropagation();
        }
        else {
//IE
            e.cancelBubble = true;
        }

        angular.forEach(angular.element('.add-active'),function(data,index){
            angular.element('#'+data.id).removeClass('active');
        })
        angular.element('#'+id).addClass('active');

        var locat=getLocat();
        window.location.href = locat + '/app/index.html#/'+child.value;
        switch ($target.text()) {
            case '后台首页':
                window.location.href = '';
                window.location.href = locat + '/app/index.html#/';
                break;
            //case '权限列表':
            //    window.location.href = locat + '/app/index.html#/navPowerList';
            //    break;
            //case 'url列表':
            //    window.location.href = locat + '/app/index.html#/urlPowerList';
            //    break;
            //case '查看系统用户':
            //    window.location.href = locat + '/app/index.html#/systemUser';
            //    break;
            //case '查看用户信息':
            //    window.location.href = locat + '/app/index.html#/customer';
            //    break;
            //case '查看订单信息':
            //    window.location.href = locat + '/app/index.html#/orderInfo';
            //    break;
            //case '扣费管理':
            //    window.location.href = locat + '/app/index.html#/chargeManagement';
            //    break;
            //case '押金管理':
            //    window.location.href = locat + '/app/index.html#/depositManagement';
            //    break;
            //case '退押金管理':
            //    window.location.href = locat + '/app/index.html#/returnDeposit';
            //    break;
            //case '用户充值管理':
            //    window.location.href = locat + '/app/index.html#/recharge';
            //    break;
            //case '活动管理':
            //    window.location.href = locat + '/app/index.html#/activities';
            //    break;
            //case '消息推送':
            //    window.location.href = locat + '/app/index.html#/messagePush';
            //    break;
            //case '用户指南编辑管理':
            //    window.location.href = locat + '/app/index.html#/userGuideList';
            //    break;
            //case '用户指南(协议)查看':
            //    //window.location.href = locat + '/app/view/systemTools/userGuideEdit.html#/';
            //    window.location.href = locat + '/app/view/systemTools/userGuideEdit.html?title=""';
            //    break;
            //case '移动端参数设置':
            //    window.location.href = locat + '/app/index.html#/mobileParamSetting';
            //    break;
            //case '订单计费参数设置':
            //    window.location.href = locat + '/app/index.html#/orderChargingParam';
            //    break;
            //case '服务费用设置':
            //    window.location.href = locat + '/app/index.html#/serviceCharge';
            //    break;
            //case '车辆查看':
            //    window.location.href = locat + '/app/index.html#/vehicleView';
            //    break;
            //case '电池电机信息管理':
            //    window.location.href = locat + '/app/index.html#/electormotor';
            //    break;
            //case '车辆监控':
            //    window.location.href = locat + '/app/index.html#/vehicleMonitor';
            //    break;
            //case '车辆报警':
            //    window.location.href = locat + '/app/index.html#/vehicleAlarm';
            //    break;
            //case '列表查看':
            //    window.location.href = locat + '/app/index.html#/electronicRegionInfo';
            //    break;
            //case '显示区域内车辆的信息以及状态':
            //    window.location.href = locat + '/app/index.html#/vehicleShowInfo';
            //    break;
            //case '查看运维任务列表':
            //    window.location.href = locat + '/app/index.html#/operationTaskList';
            //    break;
            //case '查看运维任务'://运维任务管理
            //    window.location.href = locat + '/app/index.html#/operationTask';
            //    break;
            //case '查看报修工单':
            //    window.location.href = locat + '/app/index.html#/repairWorkOrders';
            //    break;
            //case '显示客户信息反馈':
            //    window.location.href = locat + '/app/index.html#/customerInfoFeedback';
            //    break;
        }
    }
})