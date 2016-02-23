var mysql = require('mysql');

function setAndGetText(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

setAndGetText.prototype.handleRoutes = function(router,connection){
  router.post('/setAndGetText',function(req,res){
    var text = req.body.text;
    if(text == null || text == undefined || text == '' || text == 'get'){
      connection.query("select value from `display` where id_display=1",function(err,rows){
        if(err){
          res.json({"message":"err.. error on getting value"});
        }else{
          if(rows.length>0){
            res.json({"message":"success","text":rows[0].value});
          }else{
            res.json({"message":"err.. no rows on text"});
          }
        }
      });
    }else{
      connection.query("update `display` set value='"+text+"' where id_display=1",function(err,rows){
        if(err){
          res.json({"message":"error on updating display value"});
        }else{
          res.json({"message":"success","text":text});
        }
      });
    }
  });
}

module.exports = setAndGetText;
