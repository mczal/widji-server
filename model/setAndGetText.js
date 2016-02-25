var mysql = require('mysql');

function setAndGetText(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

var self=this;

setAndGetText.prototype.handleRoutes = function(router,connection,md5){
  router.post('/setAndGetText',function(req,res){
    var text = req.body.text;
    var username = req.body.password;
    var password = md5(req.body.password);
    connection.query("select id_user,password,id_role from `user` where username='"+username+"'",function(err,rows){
      if(err){
        res.json({"message":"err.. error in selecting user"});
      }else{
        if(rows.length>0){
          if(password == rows[0].password){
            var idUser = rows[0].id_user;
            var password = rows[0].password;
            var idRole = rows[0].id_role;
            connection.query("select role_name from `role` where id_role="+idRole,function(err,rows){
              if(err){
                res.json({"message":"err.. error on lookup role"});
              }else{
                if(rows.length>0){
                  if(rows[0].role_name=='admin'){
                    // TO DO
                    if(text == null || text == undefined || text == '' || text == 'get'){
                      connection.query("select value from `display` where id_display=1",function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on getting value"});
                        }else{
                          if(rows.length>0){
                            res.json({"message":"success","text":rows[0].value});
                          }else{
                            res.json({"message":"err.. no rows on text"});
                          }
                        }
                      });
                    }else{
                      connection.query("update `display` set value='"+text+"' where id_display=1",function(err,rows){
                        if(err){
                          res.json({"message":"error on updating display value"});
                        }else{
                          res.json({"message":"success","text":text});
                        }
                      });
                    }
                  }else{
                    res.json({"message":"err.. you didn't authorize to do this action"});
                  }
                }else{
                  res.json({"message":"err.. no rows on role"})
                }
              }
            });
          }else{
            res.json({"message":"err.. password didnt' match"});
          }
        }else{
          res.json({"message":"err.. no rows on usernmae"})
        }
      }
    });


  });
}

module.exports = setAndGetText;
