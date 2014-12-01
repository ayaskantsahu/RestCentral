module.exports = {
    saveApplication : function(app){
        app.save(function (err) {
        if (err)
            return handleError(err);
        });
    },
    
    getApplication : function(appModel, id, callback){
        appModel.findById(id, function (err, application) {
            callback(application);
        });
    }
};