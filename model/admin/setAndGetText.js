var mysql = require('mysql');

function setAndGetText(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

var self=this;

setAndGetText.prototype.handleRoutes = function(router,connection,md5){
  router.post('/setAndGetText',function(req,res){
    var text = req.body.text;
    var session = req.body.session;
    if(session==null || session==undefined || session==""){
      // res.json({"message":"err.. session not rec"});
      connection.query("select value from `display` where id_display=1",function(err,rows){
        if(err){
          res.json({"message":"err.. error on value"});
        }else{
          if(rows.length > 0){
            if(rows[0].value == null || rows[0].value == undefined){
              res.json({"message":"not success","text":" ","error":"not set (null or undefined)"});
            }else{
              res.json({"message":"success","text":rows[0].value});
            }
          }else{
            res.json({"message":"not success","error":"no rows","text":" "})
          }
        }
      });
    }else{
      connection.query("select id_user from `session` where session_code='"+session+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting sessiion"});
        }else{
          if(rows.length>0){
            //hereherehere
            var idUser = rows[0].id_user;
            connection.query("select password,id_role from `user` where id_user="+idUser,function(err,rows){
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
                  res.json({"message":"err.. no rows on usernmae"})
                }
              }
            });
          }else{
            connection.query("select value from `display` where id_display=1",function(err,rows){
              if(err){
                res.json({"message":"err.. error on value"});
              }else{
                if(rows.length > 0){
                  if(rows[0].value == null || rows[0].value == undefined){
                    res.json({"message":"not success","text":" ","error":"not set (null or undefined)"});
                  }else{
                    res.json({"message":"success","text":rows[0].value});
                  }
                }else{
                  res.json({"message":"not success","error":"no rows","text":" "})
                }
              }
            });
          }
        }
      });
    }
  });
}

module.exports = setAndGetText;
