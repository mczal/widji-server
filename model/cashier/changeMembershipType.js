var mysql = require('mysql');

function changeMembershipType(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

changeMembershipType.prototype.handleRoutes = function(router,connection){
  router.post('/changeMembershipType',function(err,rows){
    var sessionCode = req.body.sessionCode;
    var phone = req.body.phone;
    var membershipId = req.body.membershipId;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"Err.. no params s_c rec"});
    }else{
      if(phone == null || phone == undefined || phone == ''){
        res.json({"message":"Err.. no params p rec"});
      }else{
        if(membershipId == null || membershipId == undefined || membershipId == ''){
          res.json({"message":"Err.. no params m_i rec"});
        }else{
          var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
          connection.query(query,function(err,rows){
            if(err){
              res.json({"message":"err.. error on session","query":query});
            }else{
              if(rows.length == 1){
                if(rows[0].id_role == 2){
                  //get membership info
                  var q01 = "select * from `membership` where id="+membershipId;
                  connection.query(q01,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting membership info"});
                    }else{
                      if(rows.length>0){
                        var membershipCode = rows[0].membership_code;
                        var membershipName = rows[0].name;
                        var membershipDiscount = rows[0].discount;
                        var q2 = "update `customer` set membership_id="+membershipId+",name='"+name+"',email='"+email+"',birthdate='"+birthdate+"' where phone='"+phone+"'";
                        connection.query(q02,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on updating customer","q2":q2});
                          }else{
                            res.json({"message":"success updating customer membership","membershipCode":membershipCode,"membershipName":membershipName,"membershipDiscount":membershipDiscount,"name":name,"email":email,"birthdate":birthdate});
                          }
                        });
                      }else{
                        res.json({"message":"err.. no rows on selecting membership info"});
                      }
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

module.exports = changeMembershipType;
