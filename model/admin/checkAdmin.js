//THIS IS A TEMPLATE MODEL FOR CHECKING ADMIN
var username = req.body.usernameAdmin;
var password = md5(req.body.passwordAdmin);
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
            connection.query("select role_name from `role` where id_role="+idRole,function(err,rows){
              if(err){
                res.json({"message":"err.. error on lookup role"});
              }else{
                if(rows.length>0){
                  if(rows[0].role_name=='admin'){
                    // TO DO
                    res.json({"message":"you're an admin"});
                  }else{
                    res.json({"message":"err.. you didn't authorize to do this action"});
                  }
                }else{
                  res.json({"message":"err.. no rows on role"});
                }
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
