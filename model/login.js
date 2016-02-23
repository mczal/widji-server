var mysql = require("mysql");

function login(router,connection,md5){
  var self = this;
  self.handleRoutes(router,connection,md5);
}

var self = this;
//tidak ada pengecekan untuk IP yang sama
login.prototype.handleRoutes=function(router,connection,md5){
  router.post("/login",function(req,res){
    var myIp = req.body.myIp;
    var myCounter = req.body.counter;
    var username = req.body.username;
    var password = md5(req.body.password);
    if(myIp==null || myIp==undefined || myIp==""){
      res.json({"message":"err.. error no ip req received"});
    }else{
      //here
      if(myCounter==null || myCounter==undefined || myCounter==""){
        res.json({"message":"err.. error noctr req received"});
      }else{
        if(username==null || username==undefined || username==""){
          res.json({"message":"err.. error username received"});
        }else{
          if(password==null || password==undefined || password==""){
            res.json({"message":"err.. error password received"});
          }else{
            connection.query("select id_user,password from `user` where username='"+username+"'",function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting user"});
              }else{
                if(rows.length>0){
                  if(password == rows[0].password){
                    var idUser = rows[0].id_user;
                    //copy here
                    connection.query("select id_counter,ip_addrs,statusz from `counter` where counter_name = '"+myCounter+"'",function(err,rows){
                      if(err){
                        res.json({"message":"err.. error in look up counter with given myCounter req"});
                      }else{
                        if(rows.length>0){
                          var idCtr = rows[0].id_counter;
                          //checking IF THERE IS IP REGISTERED IN COUNTER GIVEN
                          if(rows[0].ip_addrs==null || rows[0].ip_addrs==undefined || rows[0].ip_addrs==""){
                            if(rows[0].statusz==0){
                              connection.query("update `counter` set ip_addrs='"+myIp+"',statusz=1,id_user="+idUser+" user where id_counter="+idCtr,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error in updating counter"});
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
                  }else{
                    res.json({"message":"err.. password wrong!!"});
                  }
                }else{
                  res.json({"message":"err.. no rows on username given"});
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports=login;
