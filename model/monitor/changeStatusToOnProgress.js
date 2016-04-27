var mysql = require('mysql');

function changeStatusToOnProgress(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

changeStatusToOnProgress.prototype.handleRoutes = function(router,connection){
  router.post('/changeStatusToOnProgress',function(req,res){
    var no_bon = req.body.no_bon;
    var worker = req.body.worker;
    if(no_bon == null || no_bon == undefined || no_bon == ''){
      res.json({"message":"err.. no params n_b rec"});
    }else{
      if(worker == null || worker == undefined || worker == ''){
        res.json({"message":"err.. no params w rec"});
      }else{
        var query = "update `order` SET status_pengerjaan=1,worker='"+worker+"' where no_bon='"+no_bon+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on query update","error":"error"});
          }else{
            res.json({"message":"success updating","error":"success","worker":worker});
          }
        });
      }
    }
  });
}

module.exports = changeStatusToOnProgress;
