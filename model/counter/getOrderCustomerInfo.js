var mysql = require('mysql');

function getOrderCustomerInfo(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getOrderCustomerInfo.prototype.handleRoutes = function(router,connection){
  router.post('/getOrderCustomerInfo',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. error no params received"});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.. error no params received.,"});
      }else{
        var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on session","query":query});
          }else{
            if(rows.length == 1){
              if(rows[0].id_role == 2 || rows[0].id_role == 1){
                connection.query("select order.name,customer.phone from `order` join `customer` on order.customer_id=customer.id where order.no_bon='"+no_bon+"'",function(err,rows){
                  if(err){
                    res.json({"messsage":"err.. error on selecting"});
                  }else{
                    res.json(rows);
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

module.exports = getOrderCustomerInfo;
