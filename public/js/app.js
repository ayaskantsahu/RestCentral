var app = angular.module('RestCentralApp', ['ngRoute']);
var possibleTypes = ["GET", "POST"];


app.controller('parentController', function($scope, RestCentralService, $window) {
    $scope.logOut = function(){
        RestCentralService.logOut();
        $window.location.href = "/login";
    }
});

app.controller('AddAppController', function($scope, RestCentralService, $location) {
	
    var application = {};
    application.name = "";
    application.url = "";
    application.type = "";
    application.pathParams = [];
    application.queryParams = [];
    application.renameKeys = [];
    application.extractKey = "";
    application.hideKeys = [];
    $scope.possibleTypes = possibleTypes;
    $scope.application = application;
    $scope.message = 'This is Add new application screen';
    $scope.saveApplication = function(application){
        RestCentralService.addApplication(application);
        $location.path( "/viewApps" );
    };
    $scope.addPathParam = function(){
        $scope.application.pathParams.push({key : "", value : ""});
    };
    $scope.removePathParam = function(index){
        $scope.application.pathParams.splice(index, 1);
    };
    $scope.addQueryParams = function(){
        $scope.application.queryParams.push({key : "", value : ""});
    };
    $scope.removeQueryParams = function(index){
        $scope.application.queryParams.splice(index, 1);
    };
    $scope.addRenameKeys = function(){
        $scope.application.renameKeys.push({original : "", replacement : ""});
    };
    $scope.removeRenameKeys= function(index){
        $scope.application.renameKeys.splice(index, 1);
    };
    $scope.addHideKeys = function(){
        $scope.application.hideKeys.push({key : ""});
    };
    $scope.removeHideKeys= function(index){
        $scope.application.hideKeys.splice(index, 1);
    };
	
});


app.controller('ViewAppController', function($scope, RestCentralService, $location) {
    $scope.applications = [];
    
    var getData = function(){
        RestCentralService.getApplications().then(function(applications){
            $scope.applications = applications; 
        });
    };
    getData();
    $scope.removeApplication = function(appId){
        RestCentralService.removeApplication(appId).then(function(result) {
            getData();
        }); 
    };
    
    $scope.edit = function(appId){
        $location.path("editApp/"+appId);
    }
});

app.controller('EditAppController', function($scope, RestCentralService, $routeParams) {
    $scope.application = [];
    var appId = $routeParams.appId;
    $scope.possibleTypes = possibleTypes;
    RestCentralService.getApplication(appId).then(function(application){
       $scope.application = application; 
    });
    $scope.addPathParam = function(){
        $scope.application.pathParams.push({key : "", value : ""});
    };
    $scope.removePathParam = function(index){
        $scope.application.pathParams.splice(index, 1);
    };
    $scope.addQueryParams = function(){
        $scope.application.queryParams.push({key : "", value : ""});
    };
    $scope.removeQueryParams = function(index){
        $scope.application.queryParams.splice(index, 1);
    };
    $scope.addRenameKeys = function(){
        $scope.application.renameKeys.push({original : "", replacement : ""});
    };
    $scope.removeRenameKeys= function(index){
        $scope.application.renameKeys.splice(index, 1);
    };
    $scope.addHideKeys = function(){
        $scope.application.hideKeys.push({key : ""});
    };
    $scope.removeHideKeys= function(index){
        $scope.application.hideKeys.splice(index, 1);
    };
    $scope.saveApplication = function(application){
        RestCentralService.updateApplication(application);
        $location.path( "/viewApps" );
    };
});

app.controller('ViewResultController', function($scope, RestCentralService, $routeParams){
    var appId = $routeParams.appId;
    var root = null;
    var sequence = [];
    var currentParent = null;
    RestCentralService.callApi(appId).then(function(result){
        if (typeof result === "string") {
            result = JSON.parse(result);
        }
        root = result;
        $scope.result = result;
        $scope.parent = false;
        console.log(typeof $scope.result);
        $scope.isObject = typeof $scope.result === "object";
        //var tbl = prettyPrint( result );
        //var container = document.getElementById('result');
        //container.appendChild(tbl);
    });
    
    $scope.traverseChild = function(child){
        $scope.parent = true;
        sequence.push(child);
        $scope.result = $scope.result[child];
        $scope.isObject = typeof $scope.result === "object";
    }
    
    $scope.backToParent = function(){
        sequence.pop();
        if (sequence.length == 0) {
            $scope.parent = false;
        }
        var destination = root
        for(index in sequence)
        {
            destination = destination[sequence[index]];
        }
        $scope.result = destination;
        $scope.isObject = typeof $scope.result === "object";
    }
});