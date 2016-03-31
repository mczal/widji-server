var mysql = require('mysql');

function getAvailableProducts(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getAvailableProducts.prototype.handleRoutes = function(router,connection){
  router.post('/getAvailableProducts',function(req,res){
    var idCategory = req.body.idCategory;
    if(idCategory == null || idCategory == undefined || idCategory == ''){
      res.json({"message":"err.. no params received"});
    }else{
      connection.query("select id,media,size,status,weight,imgbase64 from `product` where status=1 and category_id="+idCategory,function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting from product"});
        }else{
          if(rows.length>0){
            res.json(rows);
          }else{
            res.json({"message":"err.. no rows"});
          }
        }
      });
    }
  });
}

module.exports = getAvailableProducts;
