var mysql = require('mysql');

function deadlineMonitor(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

deadlineMonitor.prototype.handleRoutes = function(router,connection){
  router.post('/deadlineMonitor',function(req,res){
    var query = "select no_bon,name,jumlah_bayar,customer_id,created_at,tanggal_pengambilan,jam_pengambilan,datediff(tanggal_pengambilan,curDate()) as selisih,keterangan,status_pengerjaan,worker,laci,curDate() as debug_curTime from `order`  where (datediff(tanggal_pengambilan,curDate())) >= -10 AND (datediff(tanggal_pengambilan,curDate())) <=14 order by selisih";
    connection.query(query,function(err,rows){
      if(err){
        res.json({"message":"err.. error on selecting name and jumByr","quer":query});
      }else{
        if(rows.length>0){
          res.json({"message":"success selecting","error":"success","content":rows});
        }else{
          res.json({"message":".. no deadline"});
        }
      }
    });
  });
}

module.exports = deadlineMonitor;
