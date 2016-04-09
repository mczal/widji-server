var mysql = require('mysql');

function editDiscountMembership(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

editDiscountMembership.prototype.handleRoutes = function(router,connection){
  router.post('/editDiscountMembership',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idMembership = req.body.idMembership;
    var newDiscount = req.body.newDiscount;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c rec"});
    }else{
      if(idMembership == null || idMembership == undefined || idMembership == ''){
        res.json({"message":"err.. no params i_m rec"});
      }else{
        if(newDiscount == null || newDiscount == undefined || newDiscount == ''){
          res.json({"message":"err.. no params n_d rec"});
        }else{
          var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
          connection.query(query,function(err,rows){
            if(err){
              res.json({"message":"err.. error on session","query":query});
            }else{
              if(rows.length == 1){
                if(rows[0].id_role == 1){
                  var q1 = "update `membership` set discount="+newDiscount+" where id="+idMembership;
                  connection.query(q1,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on updating"});
                    }else{
                      res.json({"message":"success updating new membership discount"});
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
    }
  });
}

module.exports = editDiscountMembership;
