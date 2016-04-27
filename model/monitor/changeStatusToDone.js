var mysql = require('mysql');

function changeStatusToDone(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

changeStatusToDone.prototype.handleRoutes = function(router,connection){
  router.post('/changeStatusToDone',function(req,res){
    var no_bon = req.body.no_bon;
    var laci = req.body.laci;
    if(no_bon == null || no_bon == undefined || no_bon == '' || laci == null || laci == undefined || laci == '' ){
      res.json({"message":"err.. no params received"});
    }else{
      var query = "update `order` set status_pengerjaan=2,laci='"+laci+"' where no_bon = '"+no_bon+"'";
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error on updating query"});
        }else{
          res.json({"message":"success updating status","laci":laci});
        }
      });
    }
  });
}

module.exports = changeStatusToDone;
