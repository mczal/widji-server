var mysql = require('mysql');

function addStock(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addStock.prototype.handleRoutes = function(router,connection){
  router.post('/addStock',function(req,res){
    var idMaterial = req.body.idMaterial;
    var unitQuantity = req.body.unitQuantity;
    if(idMaterial==null || idMaterial==undefined || idMaterial==""){
      res.json({"message":"err.. no params idMaterial received"});
    }else{
      if(unitQuantity==null || unitQuantity==undefined || unitQuantity==""){
        res.json({"message":"err.. no params unitQuantity received"});
      }else{
        connection.query("select quantity,stock_per_unit from `material` where id_material="+idMaterial,function(err,rows){
          if(err){
            res.json({"message":"Errr.. error on selecting material"});
          }else{
            if(rows.length>0){
              var oldQty = rows[0].quantity;
              var stockPerUnit = rows[0].stock_per_unit*1.0;
              var updatedQty = (unitQuantity*(stockPerUnit*1.0))+(oldQty*1);
              connection.query("update `material` set quantity="+updatedQty+" where id_material="+idMaterial,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on updating material value"});
                }else{
                  res.json({"message":"success","quantity":updatedQty});
                }
              });
            }else{
              res.json({"message":"err.. error no rows"});
            }
          }
        });
      }
    }
  });
}

module.exports = addStock;
