var mysql = require('mysql');
var mkpath = require('mkpath');
var fs = require('fs');

function generateUniqueCode(){
    var text = "";
    var possible = "[&900qnw@ml;kNI./UBI~`189`aklm3076IAKU-PASTI-BISA';l";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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
    //var status = req.body.status;
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
                        var q1 ="-1";
                        if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
                          imgbase64 = '';
                          q1 = "insert into `product` (category_id,media,size,status,weight,price) values ("+idCategory+",'"+media+"','"+size+"',"+1+",'"+weight+"',"+price+")";
                          connection.query(q1,function(err,rows){
                            if(err){
                              res.json({"message":"err.. error on inserting new product","query":q1});
                            }else{
                              res.json({"message":"success inserting new product","error":"success"});
                            }
                          });
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
                              q1 = "insert into `product` (category_id,media,size,status,weight,price,imgbase64) values ("+idCategory+",'"+media+"','"+size+"',"+1+","+weight+","+price+",'"+imgbase64_database+"')";
                              connection.query(q1,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error on inserting new product","query":q1});
                                }else{
                                  res.json({"message":"success inserting new product","error":"success"});
                                }
                              });
                            }
                          });
                      }
                    }
                  }else{
                    res.json({"message":"err.. no rows session"});
                  }
                }
              });
            }
          }
        }
      }
    }
  }
});
}

module.exports = addNewProduct;
