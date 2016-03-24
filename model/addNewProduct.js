var mysql = require('mysql');

function addNewProduct(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addNewProduct.prototype.handleRoutes = function(router,connection){
  router.post('/addNewProduct',function(req,res){
    var idCategory = req.body.idCategory;
    var media = req.body.media;
    var size = req.body.size;
    var status = req.body.status;
    var weight = req.body.weight;
    var imgbase64 = req.body.imgbase64;
    if(idCategory == null || idCategory == undefined || idCategory == ''){
      res.json({"message":"err.. error no param idCategory received!"});
    }else{
      if(media == null || media == undefined || media == ''){
        res.json({"message":"err.. error no param media received!"});
      }else{
        if(size == null || size == undefined || size == ''){
          res.json({"message":"err.. error no param size received!"});
        }else{
          if(weight == null || weight == undefined || weight == ''){
            res.json({"message":"err.. error no param weight received!"});
          }else{
            if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
              res.json({"message":"err.. error no param imgbase64 received!"});
            }else{
              //status auto 1 : available
              var query = "insert into `product` (category_id,media,size,status,weight,imgbase64) values ("+idCategory+",'"+media+"','"+size+"',"+1+","+weight+",'"+imgbase64+"')";
              connection.query(query,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on inserting new product","query":query});
                }else{
                  res.json({"message":"success inserting new product","error":"success"});
                }
              });
            }
          }
        }
      }
    }
  });
}

module.exports = addNewProduct;
