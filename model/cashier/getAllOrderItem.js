var mysql = require('mysql');

function getAllOrderItem(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getAllOrderItem.prototype.handleRoutes = function(router,connection){
  router.post('/getAllOrderItem',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params received."});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.. no params received,"});
      }else{
        var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on selecting role"});
          }else{
            if(rows.length>0){
              if(rows.length==1){
                // role kasir adalah role counter juga... = 2
                if(rows[0].id_role == 2 || rows[0].id_role == 1){
                  //must lookup jumlahbayar in order and name in order
                  connection.query("select name,jumlah_bayar,customer_id,created_at,tanggal_pengambilan,jam_pengambilan,keterangan,status from `order` where no_bon='"+no_bon+"'",function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting name and jumByr"});
                    }else{
                      if(rows.length>0){
                        var orderName = rows[0].name;
                        var jumlahBayar = rows[0].jumlah_bayar;
                        var customerId = rows[0].customer_id;
                        var createdAt = rows[0].created_at;
                        var tanggalPengambilan = rows[0].tanggal_pengambilan;
                        var jamPengambilan = rows[0].jam_pengambilan;
                        var keterangan = rows[0].keterangan;
                        var status = rows[0].status;

                        var q = "select order_item.id as id_order_item,product.id as id_product,product_category.name,product.media,product.size,product.weight,order_item.quantity,order_item.price from `order` join `order_item` on order.id=order_item.order_id join `product` on order_item.product_id=product.id join `product_category` on product.category_id=product_category.id where order.no_bon = '"+no_bon+"'";
                        connection.query(q,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on selecting","error":"error"});
                          }else{
                            connection.query("select phone from `customer` where id="+customerId,function(err,rowsz){
                              if(err){
                                res.json({"message":"err.. error on selecting phone"});
                              }else{
                                if(rows.length>0){
                                  var phone = rowsz[0].phone;
                                  //herehere
                                  res.json({"message":"success selecting","error":"success","order_name":orderName,"customer_id":customerId,"no_bon":no_bon,"phone":phone,"createdAt":createdAt,"tanggalPengambilan":tanggalPengambilan,"jamPengambilan":jamPengambilan,"keterangan":keterangan,"status":status,"jumlah_bayar":jumlahBayar,"count":rows.length,"content":rows});
                                }else{
                                  res.json({"message":"err.. no rows"});
                                }
                              }
                            });
                          }
                        });
                      }else{
                        res.json({"message":"err.. no rows"});
                      }
                    }
                  });
                }else{
                  res.json({"message":"err.. not authorized"});
                }
              }else{
                res.json({"message":"rows.length > 1 !","rows":rows,"error":"error"});
              }
            }else{
              res.json({"message":"err.. no rows"});
            }
          }
        });
      }
    }
  });
}

module.exports = getAllOrderItem;
