var mysql = require('mysql');

function logout(router,connection,md5){
  var self=this;
  this.handleRoutes(router,connection,md5);
}

var self=this;

logout.prototype.handleRoutes = function(router,connection,md5){
  router.post('/logout',function(req,res){
    //THIS IS A TEMPLATE MODEL FOR CHECKING ADMIN
    var session = req.body.session;
    if(session==null || session==undefined || session==''){
      res.json({"message":"err.. no params session rec"});
    }else{
      connection.query("select id_user from `session` where session_code='"+session+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. no session"});
        }else{
          if(rows.length>0){
            var idUser = rows[0].id_user;
            var query = "delete from `session` where session_code='"+session+"' and id_user="+idUser;
            connection.query(query,function(err,rows){
              if(err){
                res.json({"message":"Err.. error on delete session","query":query});
              }else{
                var query = "select role.role_name as role_name from `role` join `user` on role.id_role=user.id_role where user.id_user="+idUser;
                connection.query(query,function(err,rows){
                  if(err){
                    res.json({"message":"Err.. error in selecting role join user"});
                  }else{
                    if(rows.length>0){
                      var roleName = rows[0].role_name;
                      if(roleName == "user" || roleName == "admin"){
                        connection.query("update `counter` set statusz=0,id_user=null where id_user="+idUser,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on updating counter"});
                          }else{
                            res.json({"message":"success cuuuy"});
                          }
                        });
                      }else{
                        res.json({"message":"success deleting session","ket":"admin","query":query});
                      }
                    }else{
                      res.json({"message":"err.. no rows"});
                    }
                  }
                });
              }
            });
          }else{
            res.json({"message":"err.. no rows with given session"});
          }
        }
      });
    }
  });
}

module.exports = logout;
