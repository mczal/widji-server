var mysql = require('mysql');

function createOrder(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

createOrder.prototype.handleRoutes = function(router,connection){
  router.post('/createOrder',function(req,res){
    var sessionCode = req.body.sessionCode;
    var name = req.body.name;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params received"});
    }else{
      if(name == null || name == undefined || name == ''){
        res.json({"message":"err.. no name params received"});
      }else{
        var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on session","query":query});
          }else{
            if(rows.length>0){
              if(rows.length == 1){
                //role id for user normal(counter) = 2
                if(rows[0].id_role == 2){
                  var date = new Date();
                  var nomorBon = date.getFullYear().toString().substr(2)+""+date.getMonth()+""+date.getDate()+""+date.getHours()+""+date.getMinutes()+""+date.getSeconds()+""+date.getMilliseconds();
                  //res.json({"month":date.getMonth(),"date":date.getDate(),"year":date.getFullYear().toString().substr(2),"milisecond":date.getMilliseconds(),"hour":date.getHours(),"minute":date.getMinutes(),"seconds":date.getSeconds(),"nomorbon":nomorBon});
                  //status = 0 belum dibayar , status = 1 udah dibayar
                  var q = "insert into `order` (no_bon,status,name) values('"+nomorBon+"',0,'"+name+"')";
                  connection.query(q,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on inserting into order","query":q});
                    }else{
                      connection.query("select id,status from `order` where no_bon ='"+nomorBon+"'",function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on selecting id order"});
                        }else{
                          if(rows.length>0){
                            var idBon = rows[0].id;
                            res.json({"message":"success","id_order":idBon,"no_bon":nomorBon,"status":rows[0].status});
                          }else{
                            res.json({"message":"err.. no rows on order with given no_order"});
                          }
                        }
                      });
                    }
                  });
                }else{
                  res.json({"message":"err.. you have no authorize to do this action"});
                }
              }else{
                res.json({"message":"rows.length > 1 !","rows":rows,"error":"error"});
              }
            }else{
              res.json({"message":"err.. no rows in session"});
            }
          }
        });
      }
    }
  });
}

module.exports = createOrder;
