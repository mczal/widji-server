var mysql = require('mysql');

function registerMemberOnly(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

registerMemberOnly.prototype.handleRoutes = function(router,connection){
  router.post('/registerMemberOnly',function(req,res){
    var sessionCode = req.body.sessionCode;
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var membershipId = req.body.membershipId;
    var birthdate = req.body.birthdate;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c rec"});
    }else{
      if(name == null || name == undefined || name == ''){
        res.json({"message":"err.. no params n rec"});
      }else{
        if(phone == null || phone == undefined || phone == ''){
          res.json({"message":"err.. no params p rec"});
        }else{
          if(email == null || email == undefined || email == ''){
            res.json({"message":"err.. no params em rec"});
          }else{
            if(membershipId == null || membershipId == undefined || membershipId == ''){
              res.json({"message":"err.. no params m_i rec"});
            }else{
              if(birthdate == null || birthdate == undefined || birthdate == ''){
                res.json({"message":"err.. no params b_d rec"});
              }else{
                var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
                connection.query(query,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on session","query":query});
                  }else{
                    if(rows.length == 1){
                      if(rows[0].id_role == 2 || rows[0].id_role == 1){
                        //STEP 0. Get Membership information
                        var q00 = "select * from `membership` where id="+membershipId;
                        connection.query(q00,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on select memberhsip info"});
                          }else{
                            if(rows.length>0){
                              var membershipCode = rows[0].membership_code;
                              var membershipName = rows[0].name;
                              var membershipDiscount = rows[0].discount;
                              //
                              //STEP 1. Check customer availability..
                              var q0 = "select name,membership_id from `customer` where phone='"+phone+"'";
                              connection.query(q0,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error on query check customer availability"});
                                }else{
                                  if(rows.length>0){
                                    if(rows[0].membership_id == null || rows[0].membership_id == undefined || rows[0].membership_id == ''){
                                      //update..
                                      var q01 = "update `customer` set membership_id="+membershipId+",name='"+name+"',email='"+email+"',birthdate='"+birthdate+"' where phone='"+phone+"'";
                                      connection.query(q01,function(err,rows){
                                        if(err){
                                          res.json({"message":"err.. error on updating","q01":q01});
                                        }else{
                                          res.json({"message":"success registering(updating) membership","memberhsipCode":membershipCode,"membershipName":membershipName,"membershipDiscount":membershipDiscount,"name":name,"email":email,"birthdate":birthdate});
                                        }
                                      });
                                    }else{
                                      res.json({"message":"err.. already registered as member"});
                                    }
                                  }else{
                                    //dafarin insert
                                    var q02 = "insert into `customer` (name,phone,email,membership_id,birthdate) values('"+name+"','"+phone+"','"+email+"',"+membershipId+",'"+birthdate+"')";
                                    connection.query(q02,function(err,rows){
                                      if(err){
                                        res.json({"message":"err.. error on inserting new cust","q02":q02});
                                      }else{
                                        res.json({"message":"success inserting new customer","memberhsipCode":membershipCode,"membershipName":membershipName,"membershipDiscount":membershipDiscount,"name":name,"email":email,"birthdate":birthdate});
                                      }
                                    });
                                  }
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
        }
      }
    }
  });
}

module.exports = registerMemberOnly;
