var mysql = require('mysql');

function testJson(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

testJson.prototype.handleRoutes = function(router,connection){
  router.post('/testJson',function(req,res){
    connection.query("select * from `counter`",function(err,rows){
      if(err){
        res.json({"message":"error cuy"});
      }else{
        res.json(rows);
      }
    });
  });
}

module.exports = testJson;
