var mysql = require('mysql');

function getUsers(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

var self=this;

getUsers.prototype.handleRoutes = function(router,connection,md5){
  router.post('/getUsers',function(req,res){
    var sessionCode = req.body.sessionCode;
    if(sessionCode==null || sessionCode==undefined || sessionCode==''){
        res.json({"message":"err.. error no params session rec"});
    }else{
      connection.query("select id_user from `session` where session_code='"+sessionCode+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting session"});
        }else{
          if(rows.length>0){
            var idUser = rows[0].id_user;
            //hereherehere
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
                          // TO DO
                          connection.query("select * from `user` join `role` on user.id_role=role.id_role order by user.id_role,user.id_user",function(err,rows){
                            if(err){
                              res.json({"message":"err.. error on selecting username join with role"});
                            }else{
                              if(rows.length>0){
                                res.json(rows);
                              }else{
                                res.json({"message":"err.. no rows"});
                              }
                            }
                          });
                        }else{
                          res.json({"message":"err.. no rows on role"});
                        }
                      }
                    });
                }else{
                  res.json({"message":"err.. no rows on usernmae"});
                }
              }
            });
          }else{
            res.json({"message":"err.. no session registered"});
          }
        }
      });
    }
  });
}

module.exports = getUsers;
