var mysql = require('mysql');

function editAccount(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

var self=this;

editAccount.prototype.handleRoutes = function(router,connection,md5){
  router.post('/editAccount',function(req,res){
    var session = req.body.session;
    var usernameType = req.body.usernameAdminType;
    var passwordType = md5(req.body.passwordAdminType);
    var newPassword = md5(req.body.newPassword);
    var confirmation = md5(req.body.confirmation);
    if(usernameType==null || usernameType==undefined || usernameType==""){
      res.json({"message":"err.. no params usernameType"});
    }else{
      if(req.body.passwordAdminType==null || req.body.passwordAdminType==undefined || req.body.passwordAdminType==""){
        res.json({"message":"err.. no params passwordType"});
      }else{
        if(session==null || session==undefined || session==""){
          res.json({"message":"err.. no params rec"});
        }else{
          connection.query("select id_user from `session` where session_code='"+session+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error on selecting session"});
            }else{
              if(rows.length>0){
                var idUser = rows[0].id_user;
                connection.query("select id_role,username,password from `user` where id_user="+idUser,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on selecting user"});
                  }else{
                    if(rows.length>0){
                      var idRole = rows[0].id_role;
                      var password = rows[0].password;
                      connection.query("select role_name from `role` where id_role="+idRole,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on selecting role"});
                        }else{
                          if(rows.length>0){
                            var roleName = rows[0].role_name;
                            if(roleName == 'admin'){
                              if(password == passwordType){
                                connection.query("update `user` set username='"+usernameType+"' where id_user="+idUser,function(err,rows){
                                  if(err){
                                    res.json({"message":"err.. error on updating username"});
                                  }else{
                                    //success updating username
                                    if(req.body.newPassword==null || req.body.newPassword==undefined || req.body.newPassword=="" || req.body.newPassword=='' || req.body.newPassword==" "){
                                      res.json({"message":"Success updating your username","error":"success"});
                                    }else{
                                      if(req.body.confirmation==null || req.body.confirmation==undefined || req.body.confirmation==""){
                                        res.json({"message":"err.. error updating password, confirmation blank","error":"error"});
                                      }else{
                                        if(newPassword == confirmation){
                                          connection.query("update `user` set password='"+newPassword+"' where id_user="+idUser,function(err,rows){
                                            if(err){
                                              res.json({"message":"err.. error on updating  user password, success updating username","error":"equal"});
                                            }else{
                                              res.json({"message":"success updating your username and password","error":"success","newPassword":newPassword});
                                            }
                                          });
                                          //res.json({"asdasd":"critical section","newPass":newPassword});
                                        }else{
                                          res.json({"message":"err.. error updating password, password confirmation wrong","error":"error"});
                                        }
                                      }
                                    }
                                  }
                                });
                              }else{
                                res.json({"message":"err... error password mismatch","password":password,"passwordType":passwordType});
                              }
                            }else{
                              res.json({"message":"err.. do not authorize"});
                            }
                          }else{
                            res.json({"message":"err.. error no role registered"});
                          }
                        }
                      });
                    }else{
                      res.json({"message":"err.. error no user registered"});
                    }
                  }
                });
              }else{
                res.json({"message":"err.. error no session registered"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = editAccount;
