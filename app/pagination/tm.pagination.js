angular.module('tm.pagination', []).directive('tmPagination',[function(){
    return {
        restrict: 'EA',
        templateUrl:'./pagination/tm.pagination.html',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs) {

            var conf = scope.conf;

            // Ĭ�Ϸ�ҳ����
            var defaultPagesLength = 9;

            // Ĭ�Ϸ�ҳѡ��ɵ���ÿҳ��ʾ������
            //scope.defaultPerPageOptions = [10, 20, 30,40, 50,60];

            // Ĭ��ÿҳ�ĸ���
            var defaultPerPage = 15;

            // ��ȡ��ҳ����
            if(conf.pagesLength) {
                // �ж�һ�·�ҳ����
                conf.pagesLength = parseInt(conf.pagesLength, 10);

                if(!conf.pagesLength) {
                    conf.pagesLength = defaultPagesLength;
                }

                // ��ҳ���ȱ���Ϊ�����������ż��ʱ���Զ�����
                if(conf.pagesLength % 2 === 0) {
                    conf.pagesLength += 1;
                }

            } else {
                conf.pagesLength = defaultPagesLength
            }

            // ��ҳѡ��ɵ���ÿҳ��ʾ������
            if(!conf.perPageOptions){
                conf.perPageOptions = defaultPagesLength;
            }

            // pageList����
            function getPagination(newValue, oldValue) {

                // conf.page
                if(conf.page) {
                    conf.page = parseInt(scope.conf.page, 10);
                }

                if(!conf.page) {
                    conf.page = 1;
                }

                // conf.totalItems
                if(conf.totalItems) {
                    conf.totalItems = parseInt(conf.totalItems, 10);
                }

                // conf.totalItems
                if(!conf.totalItems) {
                    conf.totalItems = 0;
                    return;
                }

                // conf.itemsPerPage
                if(conf.itemsPerPage) {
                    conf.itemsPerPage = parseInt(conf.itemsPerPage, 10);
                }
                if(!conf.itemsPerPage) {
                    conf.itemsPerPage = defaultPerPage;
                }

                // numberOfPages
                conf.numberOfPages = Math.ceil(conf.totalItems/conf.itemsPerPage);

                // �����ҳ����>0�����ҵ�ǰҳ���ڷ�ҳ����
                if(scope.conf.numberOfPages > 0 && scope.conf.page > scope.conf.numberOfPages){
                    scope.conf.page = scope.conf.numberOfPages;
                }

                // ���itemsPerPage�ڲ���perPageOptions�����У��Ͱ�itemsPerPage�������������
                var perPageOptionsLength = scope.conf.perPageOptions.length;

                // ����״̬
                var perPageOptionsStatus;
                for(var i = 0; i < perPageOptionsLength; i++){
                    if(conf.perPageOptions[i] == conf.itemsPerPage){
                        perPageOptionsStatus = true;
                    }
                }
                // ���itemsPerPage�ڲ���perPageOptions�����У��Ͱ�itemsPerPage�������������
                if(!perPageOptionsStatus){
                    conf.perPageOptions.push(conf.itemsPerPage);
                }

                // ��ѡ�����sort
                conf.perPageOptions.sort(function(a, b) {return a - b});


                // ҳ�����
                scope.pageList = [];
                if(conf.numberOfPages <= conf.pagesLength){
                    // �ж���ҳ�����С�ڵ��ڷ�ҳ�ĳ��ȣ���С����ֱ����ʾ
                    for(i =1; i <= conf.numberOfPages; i++){
                        scope.pageList.push(i);
                    }
                }else{
                    // ��ҳ�����ڷ�ҳ���ȣ���ʱ��Ϊ���������1.���û��...2.�ұ�û��...3.���Ҷ���...��
                    // ��������ƫ����
                    var offset = (conf.pagesLength - 1) / 2;
                    if(conf.page <= offset){
                        // ���û��...
                        for(i = 1; i <= offset + 1; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(conf.numberOfPages);
                    }else if(conf.page > conf.numberOfPages - offset){
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(i = offset + 1; i >= 1; i--){
                            scope.pageList.push(conf.numberOfPages - i);
                        }
                        scope.pageList.push(conf.numberOfPages);
                    }else{
                        // ���һ����������߶���...
                        scope.pageList.push(1);
                        scope.pageList.push('...');

                        for(i = Math.ceil(offset / 2) ; i >= 1; i--){
                            scope.pageList.push(conf.page - i);
                        }
                        scope.pageList.push(conf.page);
                        for(i = 1; i <= offset / 2; i++){
                            scope.pageList.push(conf.page + i);
                        }

                        scope.pageList.push('...');
                        scope.pageList.push(conf.numberOfPages);
                    }
                }

                scope.$parent.conf = conf;
            }

            // prevPage
            scope.prevPage = function() {
                if(scope.conf.page > 1){
                    scope.conf.page -= 1;
                }
            };

            // nextPage
            scope.nextPage = function() {
                if(scope.conf.page < scope.conf.numberOfPages){
                    scope.conf.page += 1;
                }
            };

            //firstPage
            scope.firstPage=function(){
                scope.conf.page=1;
            }

            //lastPage
            scope.lastPage=function(){
                scope.conf.page=Math.ceil(conf.totalItems/conf.itemsPerPage);
            }

            //��ת������ҳ
            scope.jumpPage=function(num){
                if(num<=Math.ceil(conf.totalItems/conf.itemsPerPage)){
                    scope.conf.page=num;
                }else if(num>Math.ceil(conf.totalItems/conf.itemsPerPage)){
                    scope.conf.page=Math.ceil(conf.totalItems/conf.itemsPerPage);
                }

            }

            // �����ǰҳ
            scope.changeCurrentPage = function(item) {
                console.log(item)
                if(item == '...'){
                    return;
                }else{
                    scope.conf.page = item;
                }
            };

            // �޸�ÿҳչʾ������
            scope.changeItemsPerPage = function() {


                // һ��չʾ�����������ǰҳ������Ϊ1
                conf.currentPage = 1;

                getPagination();
                // conf.onChange()����
                if(conf.onChange) {
                    conf.onChange();
                }

            };

            // ��תҳ
            scope.jumpToPage = function() {
                num = scope.jumpPageNum;
                if(num.match(/\d+/)) {
                    num = parseInt(num, 10);

                    if(num && num != conf.page) {
                        if(num > conf.numberOfPages) {
                            num = conf.numberOfPages;
                        }

                        // ��ת
                        conf.page = num;
                        getPagination();
                        // conf.onChange()����
                        if(conf.onChange) {
                            conf.onChange();
                        }
                        scope.jumpPageNum = num;
                    }
                }

            };

            scope.jumpPageKeyUp = function(e) {
                var keycode = window.event ? e.keyCode :e.which;

                if(keycode == 13) {
                    scope.jumpToPage();
                }
            }

            scope.$watch('conf.totalItems', function(value, oldValue) {

                // ����ֵ��ֵ��ȵ�ʱ��ȥִ��onChange�¼�
                if(!value || value == oldValue) {

                    if(conf.onChange) {
                        conf.onChange();
                    }
                }
                getPagination();
            })
        }
    };
}]);