angular.module("myApp")
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('Home', {
            url: '/home',
            templateUrl: 'App/Pages/Home/home.html',
            controller: 'homeController'
        })       
        .state("otherwise", {
            url: "*path",
            templateUrl: "App/Pages/NotFound/notFound.html"
        });
    }])

    // If you want to go to a default state on every startup
    // Define it here
    .run(["$location", function ($location) {
        // Go to state dashboard
        $location.url('/home');
    }]);
