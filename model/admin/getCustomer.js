function getCustomer(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

getCustomer.prototype.handleRoutes = function(router,connection){
  router.post('/getCustomer',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idCustomer = req.body.idCustomer;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no param s_c received"});
    }else{
      if(idCustomer == null || idCustomer == undefined || idCustomer == ''){
        res.json({"message":"err.. no param i_c received"});
      }else{
        // var q = "select id,name,phone,email,membership_id,membership.name as membership_name,birthdate from `customer` join `membership` on membership.id=customer.membership_id where customer.id="+idCustomer;
        var q1 = "select id,name,phone,email,membership_id,birthdate from `customer` where customer.id="+idCustomer;
        connection.query(q1,function(err,rows){
          if(err){
            res.json({"message":"err.. error on selecting cust query","q":q1});
          }else{
            if(rows.length>0){
              res.json(rows);
            }else{
              var q1 = "select id,name,phone,email,membership_id,birthdate from `customer` where customer.id="+idCustomer;
              connection.query(q1,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on selecting cust q1","q1":q1});
                }else{
                  if(rows.length>0){
                    res.json(rows);
                  }else{
                    res.json({"message":"err.. no rows on cust"});
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}

module.exports = getCustomer;
