angular.module("FMsainuoyi").controller('customerManagementCtrl', function (userManagess, $scope, ngDialog, $http) {
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    //传参配置
    $scope.selectModel = {
        keyword: null,
        startTime: null,
        endTime: null,
        startPage: $scope.paginationConf.currentPage,
        offset: $scope.paginationConf.itemsPerPage,
    }

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        $scope.selectModel.startPage = $scope.paginationConf.page
        $scope.selectModel.offset = $scope.paginationConf.itemsPerPage
        $scope.pageSelect()
    });

    //根据身份证取生日，性别
    function GetBirthdayByIdCardNo(idCardNo) {
        var birthdayStr = '';
        $scope.birthday = '';
        idCardNo = $.trim(idCardNo);
        //第一代身份证
        if (idCardNo.length == 15) {
            birthdayStr = idCardNo.substring(6, 12);
            birthdayStr = "19" + birthdayStr;
            birthdayStr = birthdayStr.substring(0, 4) + "-" + birthdayStr.substring(4, 6) + "-" + birthdayStr.substring(6);
            sexStr = parseInt(idCardNo.substring(14, 1), 10) % 2 ? "男" : "女";
            $scope.birthday = sexStr + ' ' + birthdayStr;
            return $scope.birthday;
        } else {  //第二代身份证
            birthdayStr = idCardNo.substring(6, 14);
            birthdayStr = birthdayStr.substring(0, 4) + "-" + birthdayStr.substring(4, 6) + "-" + birthdayStr.substring(6);
            sexStr = parseInt(idCardNo.substring(17, 6), 10) % 2 ? "男" : "女";
            $scope.birthday = sexStr + ' ' + birthdayStr;
            return $scope.birthday;
        }
    }

    //分页加载用户充值管理页面
    $scope.pageSelect = function () {
        jzts()
        userManagess.user_list($scope.selectModel).then(function (res) {
            if (res.data.RESULT == 'SUCCESS') {
                $scope.usersInfo = res.data.data[0].list;
                $scope.confTotalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.totalItems = res.data.data[0].pagenation.totalCount;
                $scope.paginationConf.itemsPerPage = res.data.data[0].pagenation.offset;
                $scope.startPage = res.data.data[0].pagenation.startPage;
                angular.forEach($scope.usersInfo, function (data, index) {
                    data.createTime = transTime(data.createTime)
                    if ($scope.startPage > 1) {
                        data.orderNo = ($scope.startPage - 1) * 10 + index + 1;
                    } else {
                        data.orderNo = index + 1;
                    }
                    data.idCardNo = GetBirthdayByIdCardNo(data.idCardNo)
                })
                //console.log($scope.usersInfo)
            }
            hangge()
        })
    }

    var locat = (window.location + '').split('/');
    if ('main' == locat[3]) {
        locat = locat[0] + '//' + locat[2];
        console.log(locat)
    } else {
        locat = locat[0] + '//' + locat[2] + '/' + locat[3];
    }
    ;

    //点击查看骑行记录页面信息
    $scope.ridingRecord = function () {
        window.location.href = locat + '/app/index.html#/ridingRecord';
    }

    //点击查看押金充值缴费记录信息
    $scope.depositRechargeRecord = function (deposit) {
        localStorage.setItem('depositUserId', deposit.id)
        localStorage.setItem('depositRealName', deposit.realName)
        //location.reload()
        window.location.href = locat + '/app/index.html#/depositRechargeRecord';
    }

    //点击查看余额充值缴费记录信息
    $scope.balanceRechargeRecord = function (customer) {
        localStorage.setItem('customerUserId', customer.id)
        localStorage.setItem('customerRealName', customer.realName)
        window.location.href = locat + '/app/index.html#/balanceRechargeRecord';
    }

    //输入用户名变化监测
    $scope.customerChange = function (item,startPage) {
        if (item != '') {
            $scope.selectModel.keyword='';
            $scope.currentPage=startPage;
            //$scope.selectModel.startPage=$scope.currentPage;

            //$scope.pageSelect();
        }
    }

    //用户查询
    $scope.customerSearch = function () {
        $scope.selectModel.keyword = $scope.keyword;
        if ($scope.keyword == null || $scope.keyword == 'undefind' || $scope.keyword == '') {
            $scope.promptContent = '请输入用户名或手机号进行查询'
            ngDialog.openConfirm({
                templateUrl: "view/diag/promptDiag.html",
                className: 'ngdialog-theme-default',
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
            })
            //return;
        }
        $scope.selectModel.startPage=$scope.currentPage;
        $scope.paginationConf.page=$scope.currentPage;
        $scope.pageSelect();
    }
})