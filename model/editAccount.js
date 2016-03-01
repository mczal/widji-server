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
    if(session==null || session==undefined || session==""){
      res.json({"message":"err.. no params session rec"});
    }else{
        if(usernameType==null || usernameType==undefined || usernameType==""){
          res.json({"message":"err.. no params usernameType rec"});
        }else{
          if(passwordType==null || passwordType==undefined || passwordType==""){
            res.json({"message":"err.. no params passwordType rec"});
          }else{
            connection.query("select username,password from `session` where session_code='"+session+"'",function(err,rows){
              if(err){
                res.json({"message":"err.. error in selectiong session"});
              }else{
                if(rows.length>0){
                  var usernameLocal = rows[0].username;
                  var passwordLocal = rows[0].password;
                  //hereherehere
                  if(passwordType == passwordLocal){
                    //checking local username with local password to database
                    connection.query("select id_user,password from `user` where username='"+usernameLocal+"'",function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on checking user lcl"});
                      }else{
                        if(rows.length>0){
                          if(rows[0].password == passwordLocal){
                            if(passwordLocal == passwordType){
                              var idUser = rows[0].id_user;
                              if(newPassword == null || newPassword==undefined || newPassword==""){
                                connection.query("update `user` set username='"+usernameType+"' where id_user="+idUser,function(err,rows){
                                  if(err){
                                    res.json({"message":"err.. error on updating username"});
                                  }else{
                                    res.json({"message":"success on updating username"});
                                  }
                                });
                              }else{
                                if(confirmation==null || confirmation==undefined || confirmation==""){
                                  res.json({"message":"err.. error, you fill your newPassword but didn't fill the confirmation password"});
                                }else{
                                  if(newPassword == confirmation){
                                    connection.query("update `user` set username='"+usernameType+"',password='"+newPassword+"' where id_user="+idUser,function(err,rows){
                                      if(err){
                                        res.json({"message":"err.. error on updating username & password"});
                                      }else{
                                        res.json({"message":"success on updating username & password"});
                                      }
                                    });
                                  }else{
                                    res.json({"message":"err.. error, your new password and confirmation didn't match"});
                                  }
                                }
                              }
                            }else{
                              res.json({"message":"err.. your password didn't match with your data saved"});
                            }
                          }else{
                            res.json({"message":"err.. passwordLocal didn't match your username"});
                          }
                        }else{
                          res.json({"message":"err.. no rows on user with given lcl"});
                        }
                      }
                    });
                  }else{
                    res.json({"message":"err.. wrong typing your old password"});
                  }
                }else{
                  res.json({"message":"err.. no session registeered"});
                }
              }
            });
          }
        }
    }
  });
}

module.exports = editAccount;
