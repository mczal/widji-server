var mysql = require('mysql');

function registerMember(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;
//GANTI PARAMETER
registerMember.prototype.handleRoutes = function(router,connection){
  router.post('/registerMember',function(req,res){
    var name = req.body.name;
    var idCustomer = req.body.idCustomer;
    var email = req.body.email;
    var membership = req.body.membership;
    var birthdate = req.body.birthdate;
    var sessionCode = req.body.sessionCode;
    if(name == null || name == undefined || name == ''){
      res.json({"message":"err.. no param name received"});
    }else{
      if(idCustomer == null || idCustomer == undefined || idCustomer == ''){
        res.json({"message":"err.. no param idCustomer received"});
      }else{
        if(email == null || email == undefined || email == ''){
          res.json({"message":"err.. no params emil rec"});
        }else{
          if(membership == null || membership == undefined || membership == ''){
            res.json({"message":"err.. no param membership received"});
          }else{
            if(birthdate == null || birthdate == undefined || birthdate == ''){
              res.json({"message":"err.. no param birthdate received"});
            }else{
              //---if there's sessionCode check it should be placed here
              var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
              connection.query(query,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on session","query":query});
                }else{
                  if(rows.length == 1){
                    if(rows[0].id_role == 2){
                      //---
                      //check user's availability
                      connection.query("select name,membership_id from `customer` where id="+idCustomer,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on query check customer availability"});
                        }else{
                          if(rows.length>0){
                            //phone have already registered ->
                            var nameTable = rows[0].name;
                            var membershipTable = rows[0].membership;
                            if(membershipTable == null || membershipTable == undefined || membershipTable == ''){
                              //if customer do not have memership yet, but already registered
                              var query1 = "update `costumer` set email='"+email+"', name='"+name+"',membership_id="+membership+",birthdate='"+birthdate+"' where id="+idCustomer;
                              connection.query(query1,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error on updating customer q1","query":query1});
                                }else{
                                  //selecting membership information
                                  var q01 = "select * from `membership` where id="+membership;
                                  connection.query(q01,function(err,rows){
                                    if(err){
                                      res.json({"message":"err.. error on selecting membership"});
                                    }else{
                                      if(rows.length>0){
                                        var membershipCode = rows[0].membership_code;
                                        var membershipName = rows[0].name;
                                        var membershipDiscount = rows[0].discount;
                                        res.json({"message":"success updating customer","membershipCode":membershipCode,"membershipName":membershipName,"membershipDiscount":membershipDiscount,"name":name,"email":email,"birthdate":birthdate});
                                      }else{
                                        res.json({"message":"err.. error on selecting membership"});
                                      }
                                    }
                                  });
                                }
                              });
                            }else{
                              //customer already registered and already be a member
                              res.json({"message":"err.. phone already a member"});
                            }
                          }else{
                            res.json({"message":"err.. customer not registered"});
                            // var query2 = "insert into `customer`(name,phone,membership,birthdate) values ('"+name+"','"+phone+"',"+membership+",'"+birthdate+"')";
                            // connection.query(query2,function(err,rows){
                            //   if(err){
                            //     res.json({"message":"err.. error in inserting customer","query":query2});
                            //   }else{
                            //     res.json({"message":"success inserting customer"});
                            //   }
                            // });
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
  });
}

module.exports = registerMember;
