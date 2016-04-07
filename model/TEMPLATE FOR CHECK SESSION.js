var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
connection.query(query,function(err,rows){
  if(err){
    res.json({"message":"err.. error on session","query":query});
  }else{
    if(rows.length == 1){
      if(rows[0].id_role == 2){

      }else{
        res.json({"message":"err.. you have no authorize to do this action"});
      }
    }else{
      res.json({"message":"err... rows length not equal to 1"});
    }
  }
});
