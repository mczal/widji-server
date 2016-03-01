var express = require("express"),
	mysql = require("mysql"),
	bodyParser = require("body-parser"),
	md5 = require('MD5'),
  http = require('http');

var entryModel = require("./model/entry.js");
var nextCustomerModel = require("./model/nextCustomer.js");
var loginModel = require("./model/login.js");
var queueByCategoryLookupModel = require("./model/queueByCategoryLookup.js");
var displayModel = require("./model/display.js");
var recallModel = require("./model/recall.js");
var checkIpModel = require("./model/checkIp.js");
var setAndGetTextModel = require("./model/setAndGetText.js");
var createUserModel = require("./model/createUser.js");
var editAccountModel = require("./model/editAccount.js");
var testJsonModel = require("./model/testJson.js");
var deleteUserCounterModel = require("./model/deleteUserCounter.js");
var getUsersModel = require("./model/getUsers.js");
var logoutModel = require("./model/logout.js");
var loginAdminModel = require("./model/loginAdmin.js");

var app = express();
var jwt = require("jsonwebtoken");
app.set('superSecret', 'ilovenode8');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function connect(){
	var self = this;
	self.connectMysql(); //diisi dibawah ...
};

connect.prototype.connectMysql = function() {
	// body...
	var self = this;
    var pool      =    mysql.createPool({ //bisa pake create pool , bisa juga pake mySQL biasa, tapi lebih aman POOL..>>searching
        connectionLimit : 100,
        multipleStatements: true,

		//kalo mau coba local host
		host     : '127.0.0.1',
		user     : 'root',
		password : '',
		database : 'widji',
        datestring : true,
        debug    :  false//console
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);//configurasi otomatis dari express
        }
    });
}

connect.prototype.configureExpress = function(connection) {
	// body...
	var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());

        // get an instance of the router for api routes
      var router = express.Router();
      // set /api
        router.post('/auth', function(req, res) {

           // if user is found and password is right
                // create a token
                var token = jwt.sign("user", app.get('superSecret'), {
                  expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token
                });

        });

    // route middleware to verify a token
        router.use(function(req, res, next) {

          // check header or url parameters or post parameters for token
          var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;

          // decode token
          if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
              if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
              } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
              }
            });

          } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

          }
        });


      app.use('/radAPIeon', router);
			var entry = new entryModel (router,connection);
			var nextCustomer = new nextCustomerModel(router,connection);
			var login = new loginModel(router,connection,md5);
			var queueByCategoryLookup = new queueByCategoryLookupModel(router,connection);
			var display = new displayModel(router,connection);
			var recall = new recallModel(router,connection);
			var checkIp = new checkIpModel(router,connection);
			var setAndGetText = new setAndGetTextModel(router,connection,md5); //notdone
			var createUser = new createUserModel(router,connection,md5);
			var editAccount = new editAccountModel(router,connection,md5);
			var testJson = new testJsonModel(router,connection);
			var deleteUserCounter = new deleteUserCounterModel(router,connection,md5);
			var getUsers = new getUsersModel(router,connection,md5);
			var logout = new logoutModel(router,connection,md5);
			var loginAdmin = new loginAdminModel(router,connection,md5);
      self.startServer();
};

connect.prototype.startServer = function() {
	// body...
	app.listen(3030,function(){
          console.log("magic \"widji\" happend");
      });
};

connect.prototype.stop = function(err) {
	// body...
	console.log("ISSUE WITH MYSQL \n"+ err);
	process.exit(1);
};

new connect();
