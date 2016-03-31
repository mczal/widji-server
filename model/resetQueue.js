var mysql = require('mysql');

function resetQueue(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

resetQueue.prototype.handleRoutes = function(router,connection){
  router.post('/resetQueue',function(req,res){
    var sessionCode = req.body.sessionCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no babi received"});
    }else{
      var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting role sess"});
        }else{
          if(rows.length>0){
            if(rows.length == 1){
              if(rows[0].id_role == 1){
                /**
                * TODO : resetting all queue and saving order to history
                */

              }else{
                res.json({"message":"err.. you do not have access"});
              }
            }else{
              res.json({"message":"rows.length > 1 !","rows":rows,"error":"error"});
            }
          }else{
            res.json({"message":"err.. no rows on role sess"});
          }
        }
      });
    }

  });
}

module.exports = resetQueue;
