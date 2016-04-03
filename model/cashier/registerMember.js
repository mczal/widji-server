var mysql = require('mysql');

function registerMember(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

registerMember.prototype.handleRoutes = function(router,connection){
  router.post('/registerMember',function(req,res){
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var membership = req.body.membership;
    var birthdate = req.body.birthdate;
    var sessionCode = req.body.sessionCode;
    if(name == null || name == undefined || name == ''){
      res.json({"message":"err.. no param name received"});
    }else{
      if(phone == null || phone == undefined || phone == ''){
        res.json({"message":"err.. no param phone received"});
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

              //---
              //check user's availability
              connection.query("select name,membership from `customer` where phone = '"+phone+"'",function(err,rows){
                if(err){
                  res.json({"message":"err.. error on query check customer availability"});
                }else{
                  if(rows.length>0){
                    //phone have already registered ->
                    var nameTable = rows[0].name;
                    var membershipTable = rows[0].membership;
                    if(membershipTable == null || membershipTable == undefined || membershipTable == ''){
                      //if customer do not have memership yet, but already registered
                      var query1 = "update `costumer` set name='"+name+"',membership="+membership+",birthdate='"+birthdate+"' where phone='"+phone+"'";
                      connection.query(query1,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating customer q1","query":query1});
                        }else{
                          res.json({"message":"success updating customer"});
                        }
                      });
                    }else{
                      //customer already registered and already be a member
                      res.json({"message":"err.. phone already a member"});
                    }
                  }else{
                    var query2 = "insert into `customer`(name,phone,membership,birthdate) values ('"+name+"','"+phone+"',"+membership+",'"+birthdate+"')";
                    connection.query(query2,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error in inserting customer","query":query2});
                      }else{
                        res.json({"message":"success inserting customer"});
                      }
                    });
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
