angular.module('RestCentralApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/addApp', {
			templateUrl: 'views/AddApp.html',
			controller: 'AddAppController'
		})
		.when('/viewApps', {
			templateUrl: 'views/ViewAllApps.html',
			controller: 'ViewAppController'	
		})
		.when('/editApp/:appId', {
			templateUrl: 'views/AddApp.html',
			controller: 'EditAppController'	
		})
		.when('/viewResult/:appId', {
			templateUrl: 'views/ViewResult.html',
			controller: 'ViewResultController'	
		})
		.otherwise({
			redirectTo: '/viewApps'
		});

	$locationProvider.html5Mode(true);

}]);