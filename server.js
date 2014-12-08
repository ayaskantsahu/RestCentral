// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var flash = require('connect-flash');

// configuration ===========================================
	
// config files
var db = require('./config/db');
var models = require('./app/models/Models.js');
var appDao = require('./app/dao/ApplicationDao.js');
var userDao = require('./app/dao/UserDao.js');
var helper = require('./app/helper.js');
var port = process.env.PORT || 8080; // set our port
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(session({ secret: 'ayaskantsahu' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(morgan('dev')); // log every request to the console
app.use(flash());

// routes ==================================================
require('./config/passport')(passport);
require('./app/routes')(app, passport); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app

var sampleUser = new models.User(
    {
	firstName : "Ayaskant",
	lastName : "Sahu",
	username : "user",
	password : "password",
	email : "ayaskant@ccs.neu.edu"
    }
);

userDao.findByUsername("user", function(result){
    if(result == null)
    {
	sampleUser.password = sampleUser.generateHash(sampleUser.password);
	userDao.saveUser(sampleUser, function(dummy){
	    console.log("");    
	});
    }
    else
    {
	sampleUser = result;
    }
});

console.log(sampleUser);

var sampleApp = new models.Application(
    {
        name : "WeatherApp",
        url : "http://api.openweathermap.org/data/2.5/weather",
	userId : sampleUser._id,
        requestType : "GET",
	pathParams : [],
        queryParams : [{key : "q", value : "London,uk"}],
	responses : [],
	renameKeys : [],
	extractKey : "",
	hideKeys : []
    }
)

appDao.getAllApplications(sampleUser._id, function(apps){
   if(apps.length == 0)
   {
	appDao.saveApplication(sampleApp, function(dummy){});
   }
});

var json = {
    delhi : {
	location : "ab",
	girls : "hot"
    },
    mumbai : {
	location : "mm",
	girls : "ok"
    },
    chennai : {
	location : "nn",
	girls : "bad"
    }
}

helper.deleteNode(json, "location");
console.log(json);

console.log(helper.extractNode(json, "delhi"));

helper.renameNode(json, "girls", "chicks");
console.log(json);


