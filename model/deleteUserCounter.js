var mysql = require('mysql');

function deleteUserCounter(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

var self=this;

deleteUserCounter.prototype.handleRoutes = function(router,connection,md5){
  router.post('/deleteUserCounter',function(req,res){
    var username = req.body.usernameAdmin;
    var password = md5(req.body.passwordAdmin);
    var usernameDelete = req.body.usernameDelete;
    if(username==null || username==undefined || username==''){
      res.json({"message":"err.. no params usrnm rec"});
    }else{
      if(password==null || password==undefined || password==''){
        res.json({"message":"err.. no params password rec"});
      }else{
        if(usernameDelete==null || usernameDelete==undefined || usernameDelete==''){
          res.json({"message":"err.. no params usernameDelete rec"});
        }else{
          connection.query("select id_user,password from `user` where username='"+username+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error on check user"});
            }else{
              if(rows.length>0){
                if(password == rows[0].password){
                  var idUser = rows[0].id_user;
                  connection.query("select id_role from `user` where id_user="+idUser,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting role from user"});
                    }else{
                      if(rows.length>0){
                        var idRole = rows[0].id_role;
                        connection.query("select role_name from `role` where id_role="+idRole,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on selecting role from given idrole"});
                          }else{
                            if(rows.length>0){
                              if(rows[0].role_name == 'admin'){
                                //check username delete
                                connection.query("select id_role from `user` where username='"+usernameDelete+"'",function(err,rows){
                                  if(err){
                                    res.json({"message":"err.. error on selecting usernameDelete"});
                                  }else{
                                    if(rows.length>0){
                                      var deleteIdRole = rows[0].id_role;
                                      connection.query("select role_name from `role` where id_role="+deleteIdRole,function(err,rows){
                                        if(err){
                                          res.json({"message":"err.. error on selcting role wih given idrole from delete"});
                                        }else{
                                          if(rows.length>0){
                                            if(rows[0].role_name == 'user'){
                                              //TO DO
                                              connection.query("delete from `user` where username='"+username+"' and password='"+password+"'",function(err,rows){
                                                if(err){
                                                  res.json({"message":"err.. error in deleting user"});
                                                }else{
                                                  res.json({"message":"success deleting user"});
                                                }
                                              });
                                            }else{
                                              res.json({"message":"err.. you can't delete an admin account"});
                                            }
                                          }else{
                                            res.json({"message":"err.. no rows on given idrole"});
                                          }
                                        }
                                      });
                                    }else{
                                      res.json({"message":"err.. no rows on usernamdelete"});
                                    }
                                  }
                                });
                              }else{
                                res.json({"message":"err.. error , you didn't authorize to do this action"});
                              }
                            }else{
                              res.json({"message":"err.. no rows on role with given idRole"});
                            }
                          }
                        });
                      }else{
                        res.json({"message":"err.. no rows on user with given user"});
                      }
                    }
                  });
                }else{
                  res.json({"message":"err.. password wrong"});
                }
              }else{
                res.json({"message":"err.. no rows on username"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = deleteUserCounter;
