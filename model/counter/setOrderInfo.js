var mysql = require('mysql');

function setOrderInfo(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

setOrderInfo.prototype.handleRoutes = function(router,connection){
  router.post('/setOrderInfo',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    var tanggalPengambilan = req.body.tanggalPengambilan;
    var jamPengambilan = req.body.jamPengambilan;
    var keterangan = req.body.keterangan;
    if(sessionCode == null || sessionCode == undefined || sessionCode ==''){
      res.json({"message":"err.. no params received.."});
    }else{
      if(tanggalPengambilan == null || tanggalPengambilan == undefined || tanggalPengambilan ==''){
        res.json({"message":"err.. no params received,,,"});
      }else{
        if(jamPengambilan == null || jamPengambilan == undefined || jamPengambilan ==''){
          res.json({"message":"err.. no params received--"});
        }else{
          if(keterangan == null || keterangan == undefined){
            keterangan = '';
          }
          connection.query("update `order` set tanggal_pengambilan = '"+tanggalPengambilan+"',jam_pengambilan = '"+jamPengambilan+"',keterangan ='"+keterangan+"' where no_bon='"+no_bon+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error on updating","error":"error"});
            }else{
              res.json({"message":"success updating","error":"success"});
            }
          });
        }
      }
    }
  });
}

module.exports = setOrderInfo;
