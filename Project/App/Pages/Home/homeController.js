
angular.module("myApp.Pages").controller("homeController", ['$scope', '$http', '$timeout', '$sce', function ($scope, $http, $timeout, $sce) {

    $scope.hashId = '';
    $scope.progress = 0;
    $scope.status = 'Idle';
    $scope.isWaiting = false;
    $scope.url = '';
    $scope.wistiaPassword = '4a630cd421fdf47b7f3902a2654b3ec08f3a13e66608ffcd2689a8e398860bc7';
    
    $scope.resetValues = function () {
        $scope.hashId = '';
        $scope.progress = 0;
        $scope.status = 'Idle';
        $scope.url = '';
    };

    $scope.tryLoadingVideo = function () {
        $http({
            method: 'GET',
            url: 'https://api.wistia.com/v1/medias/' + $scope.hashId + '.json?api_password=' + $scope.wistiaPassword
        }).then(function (response) {
            $scope.status = response.data.status || '';

            if ($scope.status == 'ready') {
                $scope.url = $sce.trustAsResourceUrl('http://fast.wistia.net/embed/iframe/' + $scope.hashId);
                $scope.isWaiting = false;
            }
            else if ($scope.status != 'failed') {
                $timeout(function () {
                    $scope.tryLoadingVideo();
                }, 500);
            }
        }).catch(function (error) {
            window.alert("Error downloading video (Preview).");
            $scope.isWaiting = false;
            $scope.resetValues();
        });
    };

    $timeout(function () {

        $('#fileupload').fileupload({
            formData: { api_password: $scope.wistiaPassword },
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(webm|mkv|flv|flv|vob|ogv|ogg|drc|gif|gifv|mng|avi|mov|qt|wmv|yuv|rm|rmvb|asf|amv|mp4|m4p|m4v|mpg|mp2|mpeg|mpe|mpv|mpg|mpeg|m2v|m4v|svi|3gp|3g2|mxf|roq|nsv|flv|f4v|f4p|f4a|f4b)$/i,
            add: function (e, data) {
                var uploadErrors = [];
                var acceptFileTypes = /^video\/.*$/;
                if (data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                    uploadErrors.push('Error uploading video: Not an accepted file type, file is not a video.');
                }
                if (uploadErrors.length > 0) {
                    alert(uploadErrors.join("\n"));
                } else {
                    $scope.resetValues();
                    data.submit();
                }
            },
            done: function (e, data) {
                if (data.result.hashed_id != '') {
                    $scope.progress = 0;
                    $scope.hashId = data.result.hashed_id;
                    $scope.status = 'Loading';
                    $scope.isWaiting = true;
                    document.getElementById("progressBar").className = "ng-hide";
                    $('.ppc-percents span').html('');
                    $scope.tryLoadingVideo();
                }
            },
            progressall: function (e, data) {
                if ($scope.progress == 0)
                {
                    document.getElementById("progressBar").className = "progress-circle progress-0";
                }
                var progress = parseInt(data.loaded / data.total * 100, 10);

                var percent = progress,
                  deg = 360 * percent / 100;

                $scope.progress = percent;

                if (percent > 0)
                  $scope.isWaiting = true;
                if (percent == 100)
                    $scope.isWaiting = false;

                document.getElementById("progressBar").className = "progress-circle progress-" + percent;
                $('.ppc-percents span').html(percent);
            },
            fail: function (e, data) {             
                alert("Error uploading video: Daily limit exceeded.");
                $scope.isWaiting = false;
                document.getElementById("progressBar").className = "ng-hide";
                $scope.resetValues();
            }
        });
    });

    $scope.upload = function () {
        $scope.resetValues();
        $('#fileupload').click();
    };

}]);
