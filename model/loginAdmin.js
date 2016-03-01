var mysql = require('mysql');

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPasdfghjklZXCVbnm,{:.]?}+_)(1234567890)}";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function loginAdmin(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

var self=this;

loginAdmin.prototype.handleRoutes = function(router,connection,md5){
  router.post('/loginAdmin',function(req,res){
    var username = req.body.usernameAdmin;
    var password = md5(req.body.passwordAdmin);
    connection.query("select id_user,id_role,password from `user` where username='"+username+"'",function(err,rows){
      if(err){
        res.json({"message":"err.. error on selecting user"});
      }else{
        if(rows.length>0){
          var idUser = rows[0].id_user;
          var idRole = rows[0].id_role;
          var passwordS = rows[0].password;
          connection.query("select role_name from `role` where id_role="+idRole,function(err,rows){
            if(err){
              res.json({"message":"err.. error on check role"});
            }else{
              if(rows.length>0){
                var roleName = rows[0].role_name;
                if(roleName == 'admin'){
                  if(password == passwordS){
                    //checking already session
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
                              res.json({"message":"success updating session","session":sessionCode});
                            }
                          });
                        }else{
                          connection.query("insert into `session` (session_code,id_user) values('"+sessionCode+"',"+idUser+")",function(err,rows){
                            if(err){
                              res.json({"message":"err.. error inserting new session"});
                            }else{
                              res.json({"message":"success inserting new session","session":sessionCode});
                            }
                          });
                        }
                      }
                    });
                  }else{
                    res.json({"message":"Err.. password not match"});
                  }
                }else{
                  res.json({"message":"err.. not authorized"});
                }
              }else{
                res.json({"message":"err.. no rows role"});
              }
            }
          });
        }else{
          res.json({"message":"err.. no rows on user"});
        }
      }
    });
  });
}

module.exports = loginAdmin;
