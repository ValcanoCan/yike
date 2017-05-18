
angular.module('FMsainuoyi').config(function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
        //target: 'upload.php',
        //permanentErrors: [404, 500, 501],
        maxChunkRetries: 2,
        chunkRetryInterval: 5000,
        simultaneousUploads: 4,
        singleFile: true
    };
    flowFactoryProvider.on('catchAll', function (event) {
        console.log('catchAll', arguments);
    });
})