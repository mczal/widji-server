function resetCounter(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

resetCounter.prototype.handleRoutes = function(router,connection){
  router.post('/resetCounter',function(req,res){
    var sessionCode = req.body.sessionCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c"});
    }else{
      var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error on session","query":query});
        }else{
          if(rows.length == 1){
            if(rows[0].id_role == 1){
              var q1 = "update `counter` set ip_addrs=null,statusz=0,id_user=null,id_queue=null";
              connection.query(q1,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on updating query"});
                }else{
                  res.json({"message":"Success! Counter number on all computer has been reset."});
                }
              });
            }else{
              res.json({"message":"err.. you have no authorize to do this action"});
            }
          }else{
            res.json({"message":"err... rows length not equal to 1"});
          }
        }
      });
    }
  });
}

module.exports = resetCounter;
