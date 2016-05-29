var mysql = require('mysql');

function getAllOrders(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

getAllOrders.prototype.handleRoutes = function(router,connection){
  router.post('/getAllOrders',function(req,res){
    var sessionCode = req.body.sessionCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no prm rec"});
    }else{
      var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
      connection.query(query,function(err,rows){
        if(err){

        }else{
          if(rows.length>0){
            if(rows.length == 1){
              //cashier = user counter idrole -> 2
              //ambil order yang masih belum dibaayar aja : status = 0
              if(rows[0].id_role == 2 || rows[0].id_role == 1){
                var q = "select order.name,order.no_bon,order.created_at,order.status,order.jumlah_bayar from `order` where order.status = 0 order by created_at desc";
                connection.query(q,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on selecting"});
                  }else{
                    res.json({"message":"success selecting","error":"success","count":rows.length,"content":rows});
                  }
                });
              }else{
                res.json({"message":"do not have access.."});
              }
            }else{
              res.json({"message":"rows.length > 1 !","rows":rows,"error":"error"});
            }
          }else{
            res.json({"message":"err.. no rows on ses"});
          }
        }
      });
    }
  });
}

module.exports = getAllOrders;
