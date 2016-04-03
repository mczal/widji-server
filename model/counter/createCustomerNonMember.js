var mysql = require('mysql');

function createCustomerNonMember(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

createCustomerNonMember.prototype.handleRoutes = function(router,connection){
  router.post('/createCustomerNonMember',function(req,res){
    var sessionCode = req.body.sessionCode;
    var phone = req.body.phone;
    var name = req.body.name;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params received.."});
    }else{
      if(phone == null || phone == undefined || phone == ''){
        res.json({"message":"err.. no params received,,"});
      }else{
        if(name == null || name == undefined || name == ''){
            res.json({"message":"err.. no params received::"});
        }else{
          connection.query("insert into `customer` (name,phone) values('"+name+"','"+phone+"')",function(err,rows){
            if(err){
              res.json({"m3ssage":"err.. error on inserting"});
            }else{
              connection.query("select id from `customer` where phone = '"+phone+"'",function(err,rows){
                if(err){
                  res.json({"message":"err.. error selecting id"});
                }else{
                  if(rows.length>0){
                    res.json({"message":"success","error":"success","id":rows[0].id});
                  }else{
                    res.json({"message":"err.. no rows, failure"});
                  }
                }
              });
            }
          });
        }
      }
    }
  });
}

module.exports = createCustomerNonMember;
