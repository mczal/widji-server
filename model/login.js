var mysql = require("mysql");

function login(router,connection){
  var self = this;
  self.handleRoutes(router,connection);
}

var self = this;

login.prototype.handleRoutes=function(router,connection){
  router.post("/login",function(req,res){
    var myIp = req.body.myIp;
    var myCounter = req.body.counter;
    if(myIp==null || myIp==undefined || myIp==""){
      res.json({"message":"err.. error no ip req received"});
    }else{
      //here
      if(myCounter==null || myCounter==undefined || myCounter==""){
        res.json({"message":"err.. error noctr req received"});
      }else{
        //here
        connection.query("select id_counter,ip_addrs,statusz from `counter` where counter_name = '"+myCounter+"'",function(err,rows){
          if(err){
            res.json({"message":"err.. error in look up counter with given myCounter req"});
          }else{
            if(rows.length>0){
              var idCtr = rows[0].id_counter;
              if(rows[0].ip_addrs==null || rows[0].ip_addrs==undefined || rows[0].ip_addrs==""){
                if(rows[0].statusz==0){
                  connection.query("update `counter` set ip_addrs='"+myIp+"',statusz=1 where id_counter="+idCtr,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error in updateing counter"});
                    }else{
                      res.json({"message":"success registering ip with counter bro congrats"});
                    }
                  });
                }else{
                  res.json({"message":"err.. this given counter has set it stat to active [ststz->1]"});
                }
              }else{
                res.json({"message":"err.. there's already registered IP in counter given [ip_addrs]"});
              }
            }else{
              res.json({"message":"err.. no rows in counter with match given ctr name !"});
            }
          }
        });
      }
    }
  });
}

module.exports=login;
