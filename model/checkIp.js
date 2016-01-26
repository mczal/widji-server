var mysql = require("mysql");

function checkIp(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

checkIp.prototype.handleRoutes=function(router,connection){
  router.post("/checkIp",function(req,res){
    var myIp = req.body.myIp;
    if(myIp==null || myIp==undefined || myIp==""){
      res.json({"message":"err.. no params"});
    }else{
      connection.query("select counter_name from `counter` where ip_addrs='"+myIp+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error in query select from counter"});
        }else{
          if(rows.length>0){
            var counterName = rows[0].counter_name;
            res.json({"message":"success bro congrats!","counter":counterName});
          }else{
            res.json({"message":"err.. no rows in counter","counter":"-1"});
          }
        }
      });
    }
  });
}
module.exports=checkIp;
