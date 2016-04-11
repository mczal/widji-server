var mysql = require('mysql');

function deleteCustomer(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

deleteCustomer.prototype.handleRoutes = function(router,connection){
  router.post('/deleteCustomer',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idCustomer = req.body.idCustomer;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c received"});
    }else{
      if(idCustomer == null || idCustomer == undefined || idCustomer == ''){
        res.json({"message":"err.. no params i_c received"});
      }else{
        var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on session","query":query});
          }else{
            if(rows.length == 1){
              if(rows[0].id_role == 1){
                var q1 = "delete from `customer` where id="+idCustomer;
                connection.query(q1,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on deleting query","q":q1});
                  }else{
                    res.json({"message":"success on deleting customer","error":"success"});
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
    }
  });
}

module.exports = deleteCustomer;
