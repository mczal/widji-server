var mysql = require('mysql');

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPasdfghjklZXCVbnm,{:.]?}+_)(1234567890)}";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function loginCashier(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

loginCashier.prototype.handleRoutes = function(router,connection,md5){
  router.post('/loginCashier',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if(username == null || username == undefined || username == ''){
      res.json({"message":"err.. no param u rec"});
    }else{
      if(password == null || password == undefined || password == ''){
        res.json({"message":"err.. no param p rec"});
      }else{
        var q1 = "select id_user,password,id_role from `user` where username='"+username+"'";
        connection.query(q1,function(err,rows){
          if(err){
            res.json({"message":"err.. error on query.."});
          }else{
            if(rows.length>0){
              if(rows[0].id_role == 2 || rows[0].id_role == 1){
                if(md5(password) == rows[0].password){
                  var code = generateUniqueCode();
                  //check if user already have session
                  var idUser = rows[0].id_user;
                  var q2 = "select id_session,session_code from `session` where id_user="+idUser;
                  connection.query(q2,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on checking session"});
                    }else{
                      if(rows.length > 0){
                        // q3 = "update `session` set session_code='"+code+"' where id_session="+rows[0].id_session;
                        res.json({"message":"success, you're using dual login : cashier and counter","sessionCode":rows[0].session_code});
                      }else{
                        var q3 = "insert into `session`(session_code,id_user) values('"+code+"',"+idUser+")";
                        connection.query(q3,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on quer insert/update sess"});
                          }else{
                            res.json({"message":"success","sessionCode":code});
                          }
                        });
                      }
                    }
                  });
                }else{
                  res.json({"message":"err.. password not match"});
                }
              }else{
                res.json({"message":"err.. not authorize"});
              }
            }else{
              res.json({"message":"err.. no rows on user"});
            }
          }
        });
      }
    }
  });
}

module.exports = loginCashier;
