var mysql=require('mysql');

function createUser(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

var self=this;

createUser.prototype.handleRoutes = function(router,connection,md5){
  router.post('/createUser',function(req,res){
    var session = req.body.session;
    var newUsername = req.body.newUsername;
    var newPassword = md5(req.body.newPassword);
    var role = req.body.role;
    if(session==null || session==undefined || session==''){
      res.json({"message":"err.. no param session rec"});
    }else{
        if(newUsername==null || newUsername==undefined || newUsername==''){
          res.json({"message":"err.. no param newUsername rec"});
        }else{
          if(newPassword==null || newPassword==undefined || newPassword==''){
            res.json({"message":"err.. no param newPassword rec"});
          }else{
            if(role==null || role==undefined || role==''){
              res.json({"message":"err.. no param role rec"});
            }else{
              connection.query("select id_user from `session` where session_code='"+session+"'",function(err,rows){
                if(err){
                  res.json({"message":"err.. error on selecting session"});
                }else{
                  if(rows.length>0){
                    var idUser = rows[0].id_user;
                    //heereherehere
                    connection.query("select id_role from `user` where id_user="+idUser,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error in selecting user"});
                      }else{
                        if(rows.length>0){
                            var idRole = rows[0].id_role;
                            connection.query("select role_name from `role` where id_role="+idRole,function(err,rows){
                              if(err){
                                res.json({"message":"err.. error on lookup role"});
                              }else{
                                if(rows.length>0){
                                  if(rows[0].role_name=='admin'){
                                    connection.query("select id_role from `role` where role_name='"+role+"'",function(err,rows){
                                      if(err){
                                        res.json({"message":"err.. error on selecting role from field"});
                                      }else{
                                        if(rows.length>0){
                                          var newRoleId = rows[0].id_role;
                                          connection.query("insert into `user` (username,password,id_role) values('"+newUsername+"','"+newPassword+"',"+newRoleId+")",function(err,rows){
                                            if(err){
                                              res.json({"message":"err.. error on inserting new user"});
                                            }else{
                                              res.json({"message":"success in creating new "+role+" account","username":newUsername});
                                            }
                                          });
                                        }else{
                                          res.json({"message":"err.. no rows in given role field"});
                                        }
                                      }
                                    });
                                  }else{
                                    res.json({"message":"err... you didn't authorized to do this action"});
                                  }
                                }else{
                                  res.json({"message":"err.. no rows on given role"});
                                }
                              }
                            });
                        }else{
                          res.json({"message":"err.. no rows on given username"});
                        }
                      }
                    });
                  }else{
                    res.json({"message":"err.. no session registered"});
                  }
                }
              });
            }
          }
        }
    }
  });
}

module.exports = createUser;
