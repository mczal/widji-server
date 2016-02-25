var mysql = require('mysql');

function logout(router,connection,md5){
  var self=this;
  this.handleRoutes(router,connection,md5);
}

var self=this;

logout.prototype.handleRoutes = function(router,connection,md5){
  router.post('/logout',function(req,res){
    //THIS IS A TEMPLATE MODEL FOR CHECKING ADMIN
    var username = req.body.username;
    var password = md5(req.body.password);
    if(username==null || username==undefined || username==''){
      res.json({"message":"err.. no params usrname rec"});
    }else{
      if(password==null || password==undefined || password==''){
        res.json({"message":"err.. no params password rec"});
      }else{
        connection.query("select id_user,password,id_role from `user` where username='"+username+"'",function(err,rows){
          if(err){
            res.json({"message":"err.. error in selecting user"});
          }else{
            if(rows.length>0){
              if(password == rows[0].password){
                var idUser = rows[0].id_user;
                var idRole = rows[0].id_role;
                connection.query("update `counter` set statusz=0,id_user=null,id_queue=null where id_user="+idUser,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error logout"});
                  }else{
                    res.json({"message":"success logout"});
                  }
                });
              }else{
                res.json({"message":"err.. password didnt' match"});
              }
            }else{
              res.json({"message":"err.. no rows on usernmae"});
            }
          }
        });
      }
    }
  });
}

module.exports = logout;
