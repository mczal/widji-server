var mysql = require('mysql');

function getOrderItem(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getOrderItem.prototype.handleRoutes = function(router,connection){
  router.post('/getOrderItem',function(req,res){
    var no_bon = req.body.no_bon;
    if(no_bon == null || no_bon == undefined || no_bon == ''){
      res.json({"message":"err.. no params received."});
    }else{
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

            var q = "select order_item.id as id_order_item,product.id as id_product,product_category.id as id_product_category,product_category.name,product.media,product.size,product.weight,order_item.quantity,order_item.price from `order` join `order_item` on order.id=order_item.order_id join `product` on order_item.product_id=product.id join `product_category` on product.category_id=product_category.id where order.no_bon = '"+no_bon+"' order by product_category.id";
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
    }
  });
}

module.exports = getOrderItem;
