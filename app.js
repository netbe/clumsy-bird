var express = require('express');
var session = require('express-session');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var uuid = require('node-uuid');
var app = express();
var path = require('path');
var router = express.Router();
var url = require('url') ;

app.set('CLIENT_SECRET', (process.env.CLIENT_SECRET || '9d25ed5f3348d9c4f08c8a1aed136f76044e9cca'));
app.set('CLIENT_ID', (process.env.CLIENT_ID || '2cc346acee436ce27f57'));
app.set('PORT', (process.env.PORT || 3000));

router.use('/$', function (req, res, next) {
	if (req.session.accessToken == null || req.session.accessToken == undefined) {
		var hostname = req.headers.host; // hostname = 'localhost:8080'
		var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'
		var redirectUri = req.protocol + '://' + hostname + '/oauth';
		res.redirect("https://github.com/login/oauth/authorize?client_id=" + app.get('CLIENT_ID') + "&redirect_uri=" + redirectUri);
		res.end();
	} else {
		next();
	}
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
	genid: function () {
		return uuid.v4();
	},
	secret: 'This is huge secret',
	resave: true,
    saveUninitialized: true
}));
app.use(router);

app.get('/', function (req, res) {
	res.render('game', {githubAccessToken: req.session.accessToken});
	res.end();
});

app.get('/oauth', function (req, res) {
	var postData = querystring.stringify({
		'client_id' : app.get('CLIENT_ID'),
		'client_secret' : app.get('CLIENT_SECRET'),
		'code' : req.query.code,
	});

	var options = {
		host: 'github.com',
		port: 443,
		path: '/login/oauth/access_token',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length,
			'Accept': 'application/json'
		}
	};

	var githubResponse = "";
	var reqAccessToken = https.request(options, function (resAccessToken) {
		resAccessToken.setEncoding('utf8');
		resAccessToken.on('data', function (chunk) {
			githubResponse += chunk;
		});

		resAccessToken.on('end', function () {
			req.session.accessToken = JSON.parse(githubResponse).access_token;
			res.redirect('/');
		    res.end();
		});
	});

	reqAccessToken.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

    // write data to request body
    reqAccessToken.write(postData);
    reqAccessToken.end();
});

app.listen(app.get('PORT'), function () {
		console.log('J\'écoute sur le port '+ app.get('PORT'));
});
