var mysql = require('mysql');

function addNewProduct(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;
//belum cek sessioncode admin !!!!
addNewProduct.prototype.handleRoutes = function(router,connection){
  router.post('/addNewProduct',function(req,res){
    var idCategory = req.body.idCategory;
    var media = req.body.media;
    var size = req.body.size;
    var status = req.body.status;
    var weight = req.body.weight;
    var imgbase64 = req.body.imgbase64;
    var sessionCode = req.body.sessionCode;
    var price = req.body.price;
    if(idCategory == null || idCategory == undefined || idCategory == ''){
      res.json({"message":"err.. error no param idCategory received!"});
    }else{
      if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
        res.json({"message":"err.. error no param rec ses"});
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
                if(price == null || price == undefined || price == ''){
                  res.json({"message":"err.. no params rec prc"});
                }else{
                  //check session
                  var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
                  connection.query(query,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting session","query":query});
                    }else{
                      if(rows.length>0){
                        if(rows.length != 1){
                          res.json({"message":"rows user sess .length > 1 !","rows":rows,"error":"error"});
                        }else{
                          //hereherehere up on the attic
                          //status auto 1 : available
                          var query = "insert into `product` (category_id,media,size,status,weight,imgbase64,price) values ("+idCategory+",'"+media+"','"+size+"',"+1+","+weight+",'"+imgbase64+"',"+price+")";
                          connection.query(query,function(err,rows){
                            if(err){
                              res.json({"message":"err.. error on inserting new product","query":query});
                            }else{
                              res.json({"message":"success inserting new product","error":"success"});
                            }
                          });
                        }
                      }else{
                        res.json({"message":"err.. no rows in sess role"});
                      }
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  });
}

module.exports = addNewProduct;
