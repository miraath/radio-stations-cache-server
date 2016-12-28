var cluster = require('cluster'),
os = require('os'),
app = require("express")(),
services = require("./services");
services.setCache();


if (cluster.isMaster) {

    for (var i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

}
else{

    app.get('/list-radios', function(req, res){
        res.json(services.getRadioStationsList());  
    });

    app.get('/miraath1', function(req, res){
        services.getStationInfos(0, function(err, data) {
            if(err)
                return res.send(err);
            res.json(data);    
        });
    });

    app.get('/miraath2', function(req, res){
        services.getStationInfos(1, function(err, data) {
            if(err)
                return res.send(err);
            res.json(data);    
        });
    });

    app.get('/miraath3', function(req, res){
        services.getStationInfos(2, function(err, data) {
            if(err)
                return res.send(err);
            res.json(data);    
        });
    });

    app.get('/quran', function(req, res){
        services.getStationInfos(3, function(err, data) {
            if(err)
                return res.send(err);
            res.json(data);    
        });
    });

    app.get('/majaliss', function(req, res){
        services.getStationInfos(4, function(err, data) {
            if(err)
                return res.send(err);
            res.json(data);    
        });
    });

    app.listen(3000);
}

