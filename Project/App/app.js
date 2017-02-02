
/// This is your main module
/// Angular's main module
/// Use a proper name for your module

angular.module("myApp", [
    // User defined modules
    'myApp.HeaderFooter', // Header and Footer
    'myApp.Pages', // Pages

    // Angular modules
    'ui.router', // state routing
    'ngRoute', // angular routing
])
