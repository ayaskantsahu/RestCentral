var appDao = require('./dao/ApplicationDao.js');
var models = require('./models/Models.js');
var Client = require('node-rest-client').Client;
var client = new Client();
module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
	

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('/', function(req, res) {
		res.sendfile('./public/index.html');
	});
	
	app.get('/callApi',function(req,res){
		var appId = req.query.appId;
		console.log(appId);
		appDao.getApplication(appId, function(application){
			console.log(application);
			client.registerMethod(application.name, application.url, application.requestType);
			args = {
			    parameters : {},
			    path : {}
			};
			for(var i = 0; i < application.queryParams.length; i++)
			{
			    args.parameters[application.queryParams[i].key] = application.queryParams[i].value;
			}
			for(var i = 0; i < application.pathParams.length; i++)
			{
			    args.path[application.queryParams[i].key] = application.queryParams[i].value;
			}
			console.log(args);
			client.methods[application.name](args, function(data,response){
			    console.log(data);
			    res.json(data);
			});
		});
        });
	
	app.post('/saveApp', function(req, res){
		var app = req.body.app;
		
		var modelApp =  new models.Application(
			{
			    name : app.name,
			    url : app.url,
			    requestType : app.type,
			    pathParams : app.pathParams,
			    queryParams : app.queryParams,
			    responses : [],
			}
		);
		console.log(modelApp);
		appDao.saveApplication(modelApp, function(result){
			res.send(result);	
		});
	});
	
	app.get('/getAllApps', function(req, res){
		appDao.getAllApplications(function(applications){
			res.send(applications);
		})
		
	});
	
	app.get('/getApp', function(req, res){
		var appId = req.query.appId;
		appDao.getApplication(appId, function(application){
			res.send(application);
		})
		
	});
	
	app.delete('/deleteApp/:appId', function(req, res){
		var appId = req.params.appId;
		appDao.deleteApplication(appId, function(applications){
			res.send(applications);
		});
	});
	
	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};