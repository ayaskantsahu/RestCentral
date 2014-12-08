// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var AdminSchema = new Schema({
	firstName : {type : String, default: ''},
        lastName : {type : String, default: ''},
        employeeId : {type : String, default: ''}
});

var ApplicationSchema = new Schema({
	name : {type : String, default: ''},
        url : {type : String, default: ''},
        requestType : {type : String, default: ''},
	userId : { type: Schema.Types.ObjectId, ref: 'User' },
	pathParams : [ParameterSchema],
	queryParams : [ParameterSchema],
	responses : [ResponseSchema],
	renameKeys : [RenameKeySchema],
	extractKey : {type : String, default: ''},
	hideKeys : [HideKeySchema]
});

var UserSchema = new Schema({
	firstName : String,
        lastName : String,
	email : String,
        username : String,
        password : {type : String, default: ''}
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


var ParameterSchema = new Schema({
	key : String,
	value : String
});

var ResponseSchema = new Schema({
	response : String,
	date : { type: Date, default: Date.now }
});

var RenameKeySchema = new Schema({
	original : String,
	replacement : String
});

var HideKeySchema = new Schema({
	key : String
});

module.exports = {
    User : mongoose.model('User', UserSchema),
    Admin : mongoose.model('Admin', AdminSchema),
    Application : mongoose.model('Application', ApplicationSchema)
}
