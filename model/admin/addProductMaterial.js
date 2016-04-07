var msyql = require('mysql');

function addProductMaterial(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addProductMaterial.prototype.handleRoutes = function(router,connection){
  router.post('/addProductMaterial',function(err,rows){
    var idProduct = req.body.idProduct;
    var idMaterial = req.body.idMaterial;
    var materialQuantity = req.body.materialQuantity;
    var sessionCode = req.body.sessionCode;
    if(idProduct == null || idProduct == undefined || idProduct == ''){
      res.json({"message":"err.. error ni oaramps rec..,.","error":"success"});
    }else{
      if(idMaterial == null || idMaterial == undefined || idMaterial == ''){
        res.json({"message":"err.. error ni oaramps rec.,.,","error":"success"});
      }else{
        if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
          res.json({"message":"err.. error ni oaramps rec///","error":"success"});
        }else{
          if(materialQuantity == null || materialQuantity == undefined || materialQuantity == ''){
            res.json({"message":"err.. no aparams cer","error":"success"});
          }else{
            var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
            connection.query(query,function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting session","error":"success"});
              }else{
                if(rows.length == 1){
                  if(rows[0].id_role == 1){
                    connection.query("insert into `product_material` (product_id,material_id,material_quantity_used) values("+idProduct+","+idMaterial+","+materialQuantity+")",function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on inserting","error":"success"});
                      }else{
                        res.json({"message":"success inserting new product material","error":"success"});
                      }
                    });
                  }else{
                    res.json({"message":"err.. you didn't authorized to do this action"});
                  }
                }else{
                  res.json({"message":"err.. rows length not equal to one"});
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports = addProductMaterial;
