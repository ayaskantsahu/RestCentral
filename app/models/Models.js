// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName : {type : String, default: ''},
        lastName : {type : String, default: ''}
});

var AdminSchema = new Schema({
	firstName : {type : String, default: ''},
        lastName : {type : String, default: ''},
        employeeId : {type : String, default: ''}
});

var ApplicationSchema = new Schema({
	name : {type : String, default: ''},
        url : {type : String, default: ''},
        requestType : {type : String, default: ''},
	pathParams : [ParameterSchema],
	queryParams : [ParameterSchema],
	responses : [ResponseSchema],
});

var UserRegistrationSchema = new Schema({
	user : { type: Schema.Types.ObjectId, ref: 'User' },
	applications : [{ type: Schema.Types.ObjectId, ref: 'Application' }],
        userName : String,
        password : {type : String, default: ''}
});

var ParameterSchema = new Schema({
	key : String,
	value : String
});

var ResponseSchema = new Schema({
	response : String,
	date : { type: Date, default: Date.now }
});

module.exports = {
    User : mongoose.model('User', UserSchema),
    Admin : mongoose.model('Admin', AdminSchema),
    UserRegistration : mongoose.model('UserRegistration', UserRegistrationSchema),
    Application : mongoose.model('Application', ApplicationSchema)
}
