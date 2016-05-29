var mkpath = require('mkpath');
var fs = require('fs');

function editProduct(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

editProduct.prototype.handleRoutes = function(router,connection){
  router.post('/editProduct',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProduct = req.body.idProduct;
    var idCategory = req.body.idCategory;
    var media = req.body.media;
    var size = req.body.size;
    var status = req.body.status;
    var weight = req.body.weight;
    var price = req.body.price;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no param s_c received"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. no param i_p received"});
      }else{
        if(idCategory == null || idCategory == undefined || idCategory == ''){
          res.json({"message":"err.. no param i_c received"});
        }else{
          if(media == null || media == undefined || media == ''){
            res.json({"message":"err.. no param m received"});
          }else{
            if(size == null || size == undefined || size == ''){
              res.json({"message":"err.. no param sz received"});
            }else{
              if(status == null || status == undefined || status == ''){
                res.json({"message":"err.. no param s received"});
              }else{
                if(weight == null || weight == undefined || weight == ''){
                  res.json({"message":"err.. no param w received"});
                }else{
                  if(price == null || price == undefined || price == ''){
                    res.json({"message":"err.. no param m received"});
                  }else{
                    var q1 = "update `product` set category_id="+idCategory+",media='"+media+"',size='"+size+"',status="+status+",weight="+weight+",price="+price+" where id="+idProduct;
                    connection.query(q1,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on updating product query"});
                      }else{
                        var imgbase64 = req.body.imgbase64;
                        if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
                          res.json({"message":"success updating product","code":"!w/img"});
                        }else{
                          //gambarnya aadaa!!
                          //IMGBASE64 Affair
                          var path = "assets/img/products";
                          var split1 = imgbase64.split(";");
                          var split2 = split1[0].split("/");
                          var ext = split2[1];
                          var imgbase64Only = split1[1].split(",")[1];
                          mkpath.sync(path,function(err){
                            if(err){
                              console.log("message err.. error on sync");
                              res.json({"message":"err.. error on sync"});
                            }else{
                              mkpath(path, function (err) {
                                if (err) {
                                  console.log("message err.. error on mkpath");
                                  res.json({"message":"err.. error on mkpath"});
                                }else{
                                  console.log("Directory structure "+path+" created");//debug
                                }
                              });
                            }
                          });
                          var decodedImage = new Buffer(imgbase64Only, 'base64');
                          var filename = "product_"+idCategory+"_"+media+"_"+size+"_"+weight+"_"+price+"."+ext;
                          fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                            if(err){
                              console.log("message err.. error in fs.write err:"+err);
                              res.json({"message":"err.. error in fs.write","err":err});
                            }else{
                              console.log("message success upload img");
                              var imgbase64_database = "http://localhost/widji-server/"+path+"/"+filename;
                              q10 = "update `product` set imgbase64='"+imgbase64_database+"' where id="+idProduct;
                              connection.query(q10,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error on inserting new product","query":q10});
                                }else{
                                  res.json({"message":"success update product #"+idProduct,"code":"w/img"});
                                }
                              });
                            }
                          });
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
    }
  });
}

module.exports = editProduct;
