var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');



var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});


var storage =   multer.diskStorage({
	  destination: function (req, file, callback) {
		      callback(null, './uploads');
		    },
	  filename: function (req, file, callback) {
              callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
              console.log(file);

		    }
});
var upload = multer({ storage : storage});

var fs = require('fs')
		    path=require('path');
function crwl(dir){
    console.log('[+]'.dir);
    var files=fs.readdirSync(dir);
    for(var x in files){
        var next=path.join(dir,files[x]);
        if(fs.lstatSync(next).isDirectory()==true){
            crwl(next);
        }
        else{
            console.log('\t',next);
        }
    }
}

const uploadFolder = __dirname + '/uploads/';

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username=="Ashok" && password=="12345") {
		//if(){
			request.session.loggedin = true;
			request.session.username = username;
			response.redirect('/home');
		
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

var mainCtrl = require('./Controller/MainController');
app.get('/files/:filename',function(req,res){
	  var filename = req.params.filename;
	  res.download(uploadFolder + filename); 
});

app.post('/api/photo',function(req,res){
	    upload(req,res,function(err) {
		            if(err) {
				                return res.end("Error uploading file.");
				            }
		            res.end("File is uploaded");
		        });
});




app.listen(3000);