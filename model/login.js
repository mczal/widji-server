var mysql = require("mysql");

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPasdfghjklZXCVbnm,{:.]?}+_)(1234567890)}";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

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
      if(myCounter==null || myCounter==undefined || myCounter==""){
        res.json({"message":"err.. error noctr req received"});
      }else{
        if(username==null || username==undefined || username==""){
          res.json({"message":"err.. error username received"});
        }else{
          if(password==null || password==undefined || password==""){
            res.json({"message":"err.. error password received"});
          }else{
            connection.query("select id_user,password,id_role from `user` where username='"+username+"'",function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting user"});
              }else{
                if(rows.length>0){
                  if(password == rows[0].password){
                    var idUser = rows[0].id_user;
                    var idRole = rows[0].id_role;
                    connection.query("select role_name from `role` where id_role="+idRole,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error ons selecting role"});
                      }else{
                        if(rows.length>0){
                          if(rows[0].role_name == 'user'){
                            //herehere
                            connection.query("select id_counter,ip_addrs,statusz,id_user from `counter` where counter_name = '"+myCounter+"'",function(err,rows){
                              if(err){
                                res.json({"message":"err.. error in look up counter with given myCounter req"});
                              }else{
                                if(rows.length>0){
                                  var idCtr = rows[0].id_counter;
                                  //checking IF THERE IS IP REGISTERED IN COUNTER GIVEN
                                  if(rows[0].ip_addrs==null || rows[0].ip_addrs==undefined || rows[0].ip_addrs==""){
                                    if(rows[0].user_id==null || rows[0].user_id==undefined || rows[0].user_id==""){
                                      if(rows[0].statusz==0){
                                        var query = "update `counter` set ip_addrs='"+myIp+"',statusz=1,id_user="+idUser+" where id_counter="+idCtr;
                                        connection.query(query,function(err,rows){
                                          if(err){
                                            res.json({"message":"err.. error in updating counter "+query,"query":query});
                                          }else{
                                            //success #1 herehere
                                            connection.query("select id_session from `session` where id_user="+idUser,function(err,rows){
                                              if(err){
                                                res.json({"message":"error lookup session"});
                                              }else{
                                                var sessionCode = generateUniqueCode();
                                                if(rows.length>0){
                                                  connection.query("update `session` set session_code='"+sessionCode+"' where id_user="+idUser,function(err,rows){
                                                    if(err){
                                                      res.json({"message":"Err.. error on updating sesion"});
                                                    }else{
                                                      res.json({"message":"success registering ip with counter bro congrats","session":sessionCode});
                                                    }
                                                  });
                                                }else{
                                                  connection.query("insert into `session` (session_code,id_user) values('"+sessionCode+"',"+idUser+")",function(err,rows){
                                                    if(err){
                                                      res.json({"message":"err.. error inserting new session"});
                                                    }else{
                                                      res.json({"message":"success registering ip with counter bro congrats","session":sessionCode});
                                                    }
                                                  });
                                                }
                                              }
                                            });
                                            //endherehere
                                          }
                                        });
                                      }else{
                                        res.json({"message":"err.. this given counter has set it stat to active [ststz->1]"});
                                      }
                                    }else{
                                      res.json({"message":"err.. this given counter has set it user"});
                                    }
                                  }else{
                                    if(rows[0].ip_addrs == myIp ){
                                      if(rows[0].user_id==null || rows[0].user_id==undefined || rows[0].user_id==""){
                                        if(rows[0].statusz==0){
                                          var query = "update `counter` set statusz=1,id_user="+idUser+" where id_counter="+idCtr;
                                          connection.query(query,function(err,rows){
                                            if(err){
                                              res.json({"message":"err.. error in updating counter","query":query});
                                            }else{
                                              //success #2 herehere
                                              connection.query("select id_session from `session` where id_user="+idUser,function(err,rows){
                                                if(err){
                                                  res.json({"message":"error lookup session"});
                                                }else{
                                                  var sessionCode = generateUniqueCode();
                                                  if(rows.length>0){
                                                    connection.query("update `session` set session_code='"+sessionCode+"' where id_user="+idUser,function(err,rows){
                                                      if(err){
                                                        res.json({"message":"Err.. error on updating sesion"});
                                                      }else{
                                                        res.json({"message":"success registering ip with counter bro congrats","session":sessionCode,"add":"2nd condition"});
                                                      }
                                                    });
                                                  }else{
                                                    connection.query("insert into `session` (session_code,id_user) values('"+sessionCode+"',"+idUser+")",function(err,rows){
                                                      if(err){
                                                        res.json({"message":"err.. error inserting new session"});
                                                      }else{
                                                        res.json({"message":"success registering ip with counter bro congrats","session":sessionCode,"add":"2nd condition"});
                                                      }
                                                    });
                                                  }
                                                }
                                              });
                                              //endherehere
                                            }
                                          });
                                        }else{
                                          res.json({"message":"err.. this given counter has set it stat to active [ststz->1]"});
                                        }
                                      }else{
                                        res.json({"message":"err.. this given counter has set it user"});
                                      }
                                    }else{
                                      res.json({"message":"err.. there's already registered IP in counter given [ip_addrs]"});
                                    }
                                  }
                                }else{
                                  res.json({"message":"err.. no rows in counter with match given ctr name !"});
                                }
                              }
                            });
                          }else{
                            res.json({"message":"err.. improper role"});
                          }
                        }else{
                          res.json({"message":"err.. no role registered"});
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
