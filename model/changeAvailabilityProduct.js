var mysql = require('mysql');
//admin capabilities, must check session
function changeAvailabilityProduct(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

changeAvailabilityProduct.prototype.handleRoutes = function(router,connection){
  router.post('/changeAvailabilityProduct',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProduct = req.body.idProduct;
    var status = req.body.status; // 1 = available
                                  // 0 = unavailable
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no param sessioncode received"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. no param idProduct received"});
      }else{
        if(status == null || status == undefined || status == '' || status < 0 || status > 1 ){
          res.json({"message":"err.. incorrect param status"});
        }else{
          //checking sessionCode
          var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
          connection.query(query,function(err,rows){
            if(err){
              res.json({"message":"err.. error on checking sess_code","query":query});
            }else{
              if(rows.length>0){
                if(rows.length==1){
                  //if role = 1 = admin
                  if(rows[0].id_role == 1 ){
                    //sessionCode checked and true
                    var q = "update `product` set status="+status+" where id="+idProduct;
                    connection.query(q,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on updating product","query":q,"error":"error"});
                      }else{
                        res.json({"message":"success updating status product","error":"success"});
                      }
                    });
                  }else{
                      res.json({"message":"err.. you have no authorize","error":"error"});
                  }
                }else{
                  res.json({"message":"rows.length > 1 !","rows":rows,"error":"error"});
                }
              }else{
                res.json({"message":"err.. no rows","error":"error"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = changeAvailabilityProduct;
