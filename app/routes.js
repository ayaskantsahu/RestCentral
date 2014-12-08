var appDao = require('./dao/ApplicationDao.js');
var models = require('./models/Models.js');
var helper = require('./helper.js');
var Client = require('node-rest-client').Client;
var client = new Client();
module.exports = function(app, passport) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
	

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('/home', function(req, res) {
		res.sendfile('./public/index.html');
	});
	
	app.get('/callApi',function(req,res){
		var appId = req.query.appId;
		console.log(appId);
		appDao.getApplication(appId, function(application){
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
			client.methods[application.name](args, function(data,response){
			    var tempData = JSON.parse(data);
			    if (application.extractKey != null && application.extractKey !== '') {
				tempData = helper.extractNode(tempData, "delhi")
				if (tempData == null) {
					tempData = data;
				}
			    }
			    console.log(application.renameKeys);
			    for(var key = 0; key < application.renameKeys.length; key++)
			    {
				console.log("renaming keys");
				helper.renameNode(tempData, application.renameKeys[key].original, application.renameKeys[key].replacement);
			    }
			    console.log(application.hideKeys);
			    for(var index = 0; index < application.hideKeys.length; index++)
			    {
				console.log("hiding keys");
				helper.deleteNode(tempData, application.renameKeys[index].key);
			    }
			    res.json(tempData);
			});
		});
        });
	
	app.post('/saveApp', function(req, res){
		var app = req.body.app;
		
		var modelApp =  new models.Application(app);
		modelApp.userId = req.user._id;
		console.log(modelApp);
		appDao.saveApplication(modelApp, function(result){
			res.send(result);	
		});
	});
	
	app.post('/editApp', function(req, res){
		var app = req.body.app;
		
		var modelApp = {
			name : app.name,
			url : app.url,
			requestType : app.requestType,
			pathParams : app.pathParams,
			queryParams : app.queryParams,
			responses : [],
			renameKeys : app.renameKeys,
			extractKey : app.extractKey,
			hideKeys : app.hideKeys
			};

		
		models.Application.update({ _id: app._id }, { $set : modelApp}).exec();
		res.send("updated");
	});
	
	app.get('/getAllApps', function(req, res){
		appDao.getAllApplications(req.user._id, function(applications){
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
	
	/* Handle Login POST */
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/relogin',
		failureFlash : true 
	}));
	
	app.get('/relogin', function(req, res){
		res.sendfile('./public/views/relogin.html');
	});
       
	/* GET Registration Page */
	app.get('/signup', function(req, res){
		res.sendfile('./public/views/register.html');
	});
       
	/* Handle Registration POST */
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true 
	}));
	
	app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// frontend routes =========================================================
	// route to handle all angular requests
	
	/* GET login page. */
	app.get('/login', function(req, res) {
		// Display the Login page with any flash message, if any
		res.sendfile('./public/views/login.html');
	});
       
	

};