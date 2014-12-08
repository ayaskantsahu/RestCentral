angular.module('RestCentralApp').service(
            "RestCentralService",
            function( $http, $q ) {

                // Return public API.
                return({
                    addApplication: addApplication,
                    getApplications: getApplications,
                    removeApplication: removeApplication,
                    getApplication: getApplication,
                    callApi: callApi,
                    updateApplication : updateApplication,
                    logOut : logOut
                });

                // ---
                // PUBLIC METHODS.
                // ---
                
                function logOut() {
                    var request = $http({
                        method: "get",
                        url: "/logout"
                    });
                    return( request.then( handleSuccess, handleError ) );
                };
                
                function callApi( appId ) {
                    var request = $http({
                        method: "get",
                        url: "/callApi",
                        params: {
                            appId: appId
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                };
                
                function getApplication( appId ) {
                    var request = $http({
                        method: "get",
                        url: "/getApp",
                        params: {
                            appId: appId
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                };

                // add a application with the given name to the remote collection.
                function addApplication( app ) {
                    var request = $http({
                        method: "post",
                        url: "/saveApp",
                        data: {
                            app: app
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                };

                // get all of the applications in the remote collection.
                function getApplications() {
                    var request = $http({
                        method: "get",
                        url: "/getAllApps"
                    });
                    return( request.then( handleSuccess, handleError ) );
                }

                // I remove the friend with the given ID from the remote collection.
                function removeApplication( appId ) {
                    var request = $http({
                        method: "delete",
                        url: "/deleteApp/"+appId
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                
                function updateApplication(app){
                    var request = $http({
                        method: "post",
                        url: "/editApp",
                        data: {
                            app: app
                        }
                    });
                }


                // ---
                // PRIVATE METHODS.
                // ---

                // I transform the error response, unwrapping the application dta from
                // the API response payload.
                function handleError( response ) {

                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
                }

                // I transform the successful response, unwrapping the application data
                // from the API response payload.
                function handleSuccess( response ) {
                    return( response.data );
                }
            }
        );