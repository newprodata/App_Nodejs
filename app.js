var mysql = require('mysql');
var express = require('express');
var app = express();
var multer  =   require('multer');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

//var http = require('http');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'bwInfo',
	database : 'citydrugs'
});

var storage =   multer.diskStorage({
	  destination: function (request, file, callback) {
			  	if(request.session.username=="gary"){
			  		if(request.params.selecteduser=="admin"){
				      callback(null, './uploads/admin/');
			  		}else{
			  			callback(null, './uploads/users/');
			  		}
			    }
			    else{
			    	callback(null, './uploads/users/'+"/"+request.session.username);	
			    }
		    },
	  filename: function (request, file, callback) {
			  	if(request.session.username=="gary"){
			  		if(request.params.selecteduser=="admin"){
		              callback(null, Date.now()+"_"+file.originalname);
		              console.log(file);
		          	}
		          	else
		          	{
		          		callback(null, request.params.selecteduser+"/"+Date.now()+"_"+file.originalname);
		              	console.log(file);	
		          	}
   	            }
   	            else{
   	            	callback(null, Date.now()+"_"+file.originalname);
		              console.log(file);
   	            }

		    }
});
var upload = multer({ storage : storage}).single('file');

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

app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
app.set('view engine', 'ejs');
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/css',express.static(__dirname +'/css'));
//app.use('/js',express.static(__dirname +'/js'));
app.use('/public',express.static(__dirname +'/public'));



app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	//response.sendFile(path.join(__dirname + '/index.html'));
	response.sendFile(path.join(__dirname + '/Login.html'));
	//response.render('/',{username:request.session.username});
});

app.get('/logout', function(request, response) {
	request.session.loggedin="";
	response.sendFile(path.join(__dirname + '/Login.html'));
	//response.sendFile(path.join(__dirname + '/index.html'));
	//response.render('/',{username:request.session.username});
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	//if (username=="admin" && password=="12345") {
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.role=results[0].role;
				//console.log(results);
				if(results[0].role=="admin"){
					response.render(__dirname + "/home/Layout.ejs", {uname:username,role:results[0].role});
				}else{
					response.render(__dirname + "/home/Layout_user.ejs", {uname:username,role:results[0].role});
				}

		  		
			} 	
	  		else {
				response.send('Please enter Username and Password!');
				
			}
		response.end();
	});
	}
	else{
		response.send('Please enter Username and Password!');
		response.end();
	}
	
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		if(request.session.role=="admin"){
			response.render(__dirname + "/home/Layout.ejs", {uname:request.session.username,role:request.session.role});
		}
		else{
			response.render(__dirname + "/home/Layout_user.ejs", {uname:request.session.username,role:request.session.role});
		}
	}
	else {

		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/dashboard', function(request, response) {
	if (request.session.loggedin) {
		response.render(__dirname + "/home/dashboard.ejs", {uname:request.session.username});
	}
	else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/charts', function(request, response) {
	if (request.session.loggedin) {
		response.render(__dirname + "/home/charts.ejs", {uname:request.session.username});
	}
	else {
		response.send('Please login to view this page!');
	}
	response.end();
});
app.get('/stretchrevenue', function(request, response) {
	if (request.session.loggedin) {
		response.render(__dirname + "/home/stretchrevenue.ejs", {uname:request.session.username});
	}
	else {
		response.send('Please login to view this page!');
	}
	response.end();
});

const uploadFolder = __dirname + '/uploads/';
const directoryPath = path.join(__dirname, '/uploads/users');
app.get('/files',function(request,response){
	   fs.readdir(directoryPath+"/"+request.session.username, (err, files) => {
		response.send(files);
	})
});


app.get('/filesuser/:fileuser',function(request,response){
		var fileuser = request.params.fileuser;	
		console.log(fileuser);
		if(request.session.username=="gary"){
			if(fileuser==undefined||fileuser=="admin"){
				var showadmin="";
				if(fileuser==undefined||fileuser=="admin"){
					showadmin='admin';
				}else{
					showadmin='admin';
				}
				fs.readdir(uploadFolder+"/"+showadmin+"/", (err, files) => {
					response.send(files);
				});
			}
			else{
				fs.readdir(directoryPath+"/"+fileuser+"/", (err, files) => {
					 response.send(files);
					 //console.log(directoryPath);
			    });
			}
			
		}else{
			fs.readdir(directoryPath+"/"+fileuser, (err, files) => {
				 response.send(files);
				 console.log(directoryPath);
				 console.log("did not go to file user ");
		    })	;
		}
});




app.get('/authfiles/:paya_name/:filename',function(request,response){
	  var filename = request.params.filename;
	  var paya_name = request.params.paya_name;
	  console.log(request.session.role);
	  if(request.session.role=="admin"){
	  	if(paya_name=="admin"){
	  		response.download(uploadFolder+"/admin/"+ filename); 	
	  	}
	  	else{
	  		response.download(directoryPath+"/"+paya_name+"/"+ filename); 		
	  	}
	  	
	  }
	  else if(request.session.role=="user"){
	  	response.download(directoryPath+"/"+paya_name+"/"+ filename); 
	  }
	  //response.download(uploadFolder+"/"+request.session.username+"/"+ filename); 
});


app.get('/authfiles/:filename',function(request,response){
	  var filename = request.params.filename;
	  console.log(request.session.role);
	  if(request.session.role=="admin"){
	  	response.download(uploadFolder+"/admin/"+ filename); 
	  }
	  else if(request.session.role=="user"){
	  	response.download(directoryPath+"/"+request.session.username+"/"+ filename); 
	  }
	  //response.download(uploadFolder+"/"+request.session.username+"/"+ filename); 
});

app.get('/homefiles/:paya_name/:filename',function(request,response){
	  var filename = request.params.filename;
	  var paya_name = request.params.paya_name;
	  console.log(request.session.role);
	  if(request.session.role=="admin"){
	  	if(paya_name=="admin"){
	  		response.download(uploadFolder+"/admin/"+ filename); 	
	  	}
	  	else{
	  		response.download(directoryPath+"/"+paya_name+"/"+ filename); 		
	  	}
	  	
	  }
	  else if(request.session.role=="user"){
	  	response.download(directoryPath+"/"+paya_name+"/"+ filename); 
	  }
	  //response.download(uploadFolder+"/"+request.session.username+"/"+ filename); 
});


app.get('/homefiles/:filename',function(request,response){
	  var filename = request.params.filename;
	  console.log(request.session.role);
	  if(request.session.role=="admin"){
	  	response.download(uploadFolder+"/admin/"+ filename); 
	  }
	  else if(request.session.role=="user"){
	  	response.download(directoryPath+"/"+request.session.username+"/"+ filename); 
	  }
	  //response.download(uploadFolder+"/"+request.session.username+"/"+ filename); 
});




app.post('/uploadsuser/:selecteduser',function(request,response,data){
	//console.log(request.params.selecteduser);
    upload(request,response,function(err) {
        if(err) {
		        	console.log(err);
		            return response.end("Error uploading file.");
	            }
        response.end("File is uploaded");
    });
});

app.post('/uploads/',function(request,response){
    upload(request,response,function(err) {
        if(err) {
        			console.log(err);
	                return response.end("Error uploading file.");
	            }
        response.end("File is uploaded");
        
    });
});

//httpServer.listen(3000);
//console.log("Use browser to get url 'http://localhost:3000/index.html'");

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

app.listen(3000,function(){
	    console.log("Working on port 3000");
});