angular.module("FMsainuoyi").controller('vehicleShowInfoCtrl',function($scope){
    $scope.paginationConf = {
        page: 1,
        //totalItems:$scope.paginationConf.totalItems,
        itemsPerPage: 20,
        pagesLength: 20,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
        }
    };

    $scope.$watch('paginationConf.page+paginationConf.itemsPerPage', function () {
        //$scope.tboxModel.currentPage = $scope.paginationConf.page
        //$scope.tboxModel.pageSize = $scope.paginationConf.itemsPerPage
        //$scope.initData()
        //$scope.pageSelect()
    });
})