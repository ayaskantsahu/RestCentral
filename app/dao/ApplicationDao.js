var models = require('../models/Models.js');

module.exports = {
    saveApplication : function(app, callback){
        app.save(function (err) {
            if (err)
            {
                callback("fail");
                return handleError(err);
            }
            else
                callback("success");
        });
    },
    
    getApplication : function(id, callback){
        models.Application.findById(id, function (err, application) {
            callback(application);
        });
    },
    
    getAllApplications : function(callback){
        models.Application.find({}, function (err, applications) {
            if (err) {
                return handleError(err);
            }
            callback(applications);
        });
    },
    
    deleteApplication : function(appId, callback){
        console.log(appId);
        models.Application.findByIdAndRemove(appId, function(err, modelDeleted){
            
            if (err)
            {
                callback("fail");
            }
            else
                callback("success");    
        });
    }
};