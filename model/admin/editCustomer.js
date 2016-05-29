function editCustomer(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

editCustomer.prototype.handleRoutes = function(router,connection){
  router.post('/editCustomer',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idCustomer = req.body.idCustomer;
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var birthdate = req.body.birthdate;
    var membershipId = req.body.membershipId;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no param s_c received"});
    }else{
      if(idCustomer == null || idCustomer == undefined || idCustomer == ''){
        res.json({"message":"err.. no param s_c received"});
      }else{
        if(name == null || name == undefined || name == ''){
          res.json({"message":"err.. no param name received"});
        }else{
          if(phone == null || phone == undefined || phone == ''){
            res.json({"message":"err.. no param name received"});
          }else{
            var q0 = "update `customer` set name='"+name+"',phone='"+phone+"'where id="+idCustomer;
            connection.query(q0,function(err,rows){
              if(err){
                res.json({"message":"err.. error on updating cust 1st query"});
              }else{
                if(membershipId == null || membershipId == undefined || membershipId == '' ){
                  if(birthdate == null || birthdate == undefined || birthdate == ''){
                    if(email == null || email == undefined || email == ''){
                      res.json({"message":"success update customer non-member"});
                    }else{
                      var q1 = "update `customer` set email='"+email+"' where id="+idCustomer;
                      connection.query(q1,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating customer","q1":q1});
                        }else{
                          res.json({"message":"success updating customer"});
                        }
                      });
                    }
                  }else{
                    if(email == null || email == undefined || email == ''){
                      var q2 = "update `customer` set birthdate='"+birthdate+"' where id="+idCustomer;
                      connection.query(q2,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating customer","q2":q2});
                        }else{
                          res.json({"message":"success updating customer"});
                        }
                      });
                    }else{
                      var q3 = "update `customer` set email='"+email+"',birthdate='"+birthdate+"' where id="+idCustomer;
                      connection.query(q3,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating customer","q3":q3});
                        }else{
                          res.json({"message":"success updating customer"});
                        }
                      });
                    }
                  }
                }else{
                  if(birthdate == null || birthdate == undefined || birthdate == ''){
                    if(email == null || email == undefined || email == ''){
                      var q4 = "update `customer` set membershipId="+membershipId+" where id="+idCustomer;
                      connection.query(q4,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating customer","q4":q4});
                        }else{
                          res.json({"message":"success updating customer"});
                        }
                      });
                    }else{
                      var q5 = "update `customer` set membershipId="+membershipId+",email='"+email+"' where id="+idCustomer;
                      connection.query(q5,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating customer","q5":q5});
                        }else{
                          res.json({"message":"success updating customer"});
                        }
                      });
                    }
                  }else{
                    if(email == null || email == undefined || email == ''){
                      var q6 = "update `customer` set membershipId="+membershipId+",birthdate='"+birthdate+"' where id="+idCustomer;
                      connection.query(q6,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating customer","q6":q6});
                        }else{
                          res.json({"message":"success updating customer"});
                        }
                      });
                    }else{
                      var q7 = "update `customer` set membershipId="+membershipId+",birthdate='"+birthdate+"',email='"+email+"' where id="+idCustomer;
                      connection.query(q7,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating customer","q7":q7});
                        }else{
                          res.json({"message":"success updating customer"});
                        }
                      });
                    }
                  }
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports = editCustomer;
